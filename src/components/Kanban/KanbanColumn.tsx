import React, { useState } from 'react'
import { Board, Task } from '../../types'
import { KanbanCard } from './KanbanCard'
import { Button } from '../common/Button'
import { Modal } from '../common/Modal'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

interface KanbanColumnProps {
  board: Board
  tasks: Task[]
  workspaceId: string
  projectId: string
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  board,
  tasks,
  workspaceId,
  projectId,
}) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const { setNodeRef } = useDroppable({
    id: board.id,
  })

  const sortedTasks = [...tasks].sort((a, b) => (a.position || 0) - (b.position || 0))

  return (
    <div className="flex-shrink-0 w-80 bg-gray-50 rounded-lg border border-gray-200 flex flex-col max-h-[calc(100vh-200px)]">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white rounded-t-lg">
        <h3 className="font-medium text-gray-900">{board.name}</h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 p-2 overflow-y-auto space-y-2 min-h-[200px]"
      >
        <SortableContext
          items={sortedTasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {sortedTasks.map((task) => (
            <KanbanCard key={task.id} task={task} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="text-center py-8 text-sm text-gray-400">No tasks yet</div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-gray-200 bg-white rounded-b-lg">
        <Button
          variant="secondary"
          size="sm"
          className="w-full text-gray-500"
          onClick={() => setIsTaskModalOpen(true)}
        >
          + Add Task
        </Button>
      </div>

      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Create Task"
      >
        <TaskForm
          workspaceId={workspaceId}
          projectId={projectId}
          boardId={board.id}
          onSuccess={() => {
            setIsTaskModalOpen(false)
            // Refresh tasks
          }}
        />
      </Modal>
    </div>
  )
}

// Simple TaskForm for the modal
const TaskForm: React.FC<{
  workspaceId: string
  projectId: string
  boardId: string
  onSuccess: () => void
}> = ({ workspaceId, projectId, boardId, onSuccess }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    try {
      await tasksApi.create(workspaceId, projectId, boardId, {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
      })
      onSuccess()
      setTitle('')
      setDescription('')
    } catch (error) {
      console.error('Failed to create task:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          placeholder="Task title"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          placeholder="Task description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          Create Task
        </Button>
      </div>
    </form>
  )
}
