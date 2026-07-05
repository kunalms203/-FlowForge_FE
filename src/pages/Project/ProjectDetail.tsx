import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { projectsApi } from '../../api/projects'
import { boardsApi } from '../../api/boards'
import { KanbanBoard } from '../../components/Kanban/KanbanBoard'
import { Button } from '../../components/common/Button'
import { Modal } from '../../components/common/Modal'
import { Input } from '../../components/common/Input'
import { Loading } from '../../components/common/Loading'
import { Card, CardBody } from '../../components/common/Card'

export const ProjectDetail: React.FC = () => {
  const { workspaceId, projectId } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState<any>(null)
  const [boards, setBoards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newBoardName, setNewBoardName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchData = async () => {
    if (!workspaceId || !projectId) return
    setLoading(true)
    try {
      const [projectRes, boardsRes] = await Promise.all([
        projectsApi.getById(workspaceId, projectId),
        boardsApi.getAll(workspaceId, projectId),
      ])
      setProject(projectRes.data.data)
      setBoards(boardsRes.data.data || [])
    } catch (error) {
      console.error('Failed to fetch project data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [workspaceId, projectId, refreshKey])

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBoardName.trim() || !workspaceId || !projectId) return

    setSubmitting(true)
    try {
      await boardsApi.create(workspaceId, projectId, {
        name: newBoardName.trim(),
      })
      setIsModalOpen(false)
      setNewBoardName('')
      setRefreshKey(prev => prev + 1)
    } catch (error) {
      console.error('Failed to create board:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteProject = async () => {
    if (!workspaceId || !projectId || !confirm('Are you sure you want to delete this project?')) return
    try {
      await projectsApi.delete(workspaceId, projectId)
      navigate(`/workspaces/${workspaceId}`)
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loading size="lg" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Project not found</p>
        <Link to={`/workspaces/${workspaceId}`} className="mt-4 inline-block">
          <Button variant="secondary">Back to Workspace</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to={`/workspaces/${workspaceId}`} className="text-sm text-primary-600 hover:underline">
            ← Back to Workspace
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">{project.name}</h1>
          {project.description && (
            <p className="text-sm text-gray-500">{project.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="danger" size="sm" onClick={handleDeleteProject}>
            Delete Project
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Boards</h2>
        <Button size="sm" onClick={() => setIsModalOpen(true)}>
          + New Board
        </Button>
      </div>

      {boards.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">No boards yet. Create your first board!</p>
        </div>
      ) : (
        <KanbanBoard
          workspaceId={workspaceId!}
          projectId={projectId!}
          boards={boards}
          onTaskMove={() => setRefreshKey(prev => prev + 1)}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Board">
        <form onSubmit={handleCreateBoard} className="space-y-4">
          <Input
            label="Board Name"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            placeholder="To Do"
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
