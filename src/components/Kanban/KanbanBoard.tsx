import React, { useState, useEffect } from 'react'
import { Task, Board } from '../../types'
import { KanbanColumn } from './KanbanColumn'
import { tasksApi } from '../../api/tasks'
import { Button } from '../common/Button'
import { Loading } from '../common/Loading'
import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

interface KanbanBoardProps {
  workspaceId: string
  projectId: string
  boards: Board[]
  onTaskMove?: () => void
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  workspaceId,
  projectId,
  boards,
  onTaskMove,
}) => {
  const [tasks, setTasks] = useState<Record<string, Task[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAllTasks = async () => {
      setLoading(true)
      try {
        const taskMap: Record<string, Task[]> = {}
        for (const board of boards) {
          const response = await tasksApi.getAll(workspaceId, projectId, board.id)
          taskMap[board.id] = response.data.data || []
        }
        setTasks(taskMap)
      } catch (error) {
        console.error('Failed to fetch tasks:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAllTasks()
  }, [workspaceId, projectId, boards])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find which board the active task belongs to
    let sourceBoardId: string | null = null
    let destBoardId: string | null = null

    for (const [boardId, boardTasks] of Object.entries(tasks)) {
      if (boardTasks.some((t) => t.id === activeId)) {
        sourceBoardId = boardId
      }
      if (boardId === overId) {
        destBoardId = boardId
      }
    }

    // If over is a task, find its board
    if (!destBoardId) {
      for (const [boardId, boardTasks] of Object.entries(tasks)) {
        if (boardTasks.some((t) => t.id === overId)) {
          destBoardId = boardId
        }
      }
    }

    if (!sourceBoardId || !destBoardId) return

    const sourceTasks = [...tasks[sourceBoardId]]
    const destTasks = sourceBoardId === destBoardId ? sourceTasks : [...tasks[destBoardId]]

    const activeIndex = sourceTasks.findIndex((t) => t.id === activeId)
    let overIndex: number

    if (destBoardId === overId) {
      // Dropped on a board
      overIndex = destTasks.length
    } else {
      overIndex = destTasks.findIndex((t) => t.id === overId)
      if (overIndex === -1) overIndex = destTasks.length
    }

    // Remove from source
    const [movedTask] = sourceTasks.splice(activeIndex, 1)

    // If moving to a different board, update the boardId
    if (sourceBoardId !== destBoardId) {
      movedTask.boardId = destBoardId
    }

    // Insert at destination
    destTasks.splice(overIndex, 0, movedTask)

    // Update state optimistically
    setTasks((prev) => {
      const newTasks = { ...prev }
      newTasks[sourceBoardId] = sourceTasks
      if (sourceBoardId !== destBoardId) {
        newTasks[destBoardId] = destTasks
      }
      return newTasks
    })

    // API call to move task
    try {
      await tasksApi.move(workspaceId, projectId, sourceBoardId, activeId, {
        newBoardId: destBoardId,
        newPosition: overIndex,
      })
      if (onTaskMove) onTaskMove()
    } catch (error) {
      console.error('Failed to move task:', error)
      // Revert state on error
      const fetchAllTasks = async () => {
        const taskMap: Record<string, Task[]> = {}
        for (const board of boards) {
          const response = await tasksApi.getAll(workspaceId, projectId, board.id)
          taskMap[board.id] = response.data.data || []
        }
        setTasks(taskMap)
      }
      fetchAllTasks()
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loading size="lg" />
      </div>
    )
  }

  const sortedBoards = [...boards].sort((a, b) => a.position - b.position)

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {sortedBoards.map((board) => (
          <KanbanColumn
            key={board.id}
            board={board}
            tasks={tasks[board.id] || []}
            workspaceId={workspaceId}
            projectId={projectId}
          />
        ))}
      </div>
    </DndContext>
  )
}
