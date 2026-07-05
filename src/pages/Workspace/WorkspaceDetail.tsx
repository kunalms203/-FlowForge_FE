import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { workspacesApi } from '../../api/workspaces'
import { projectsApi } from '../../api/projects'
import { Card, CardBody, CardHeader } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { Modal } from '../../components/common/Modal'
import { Input } from '../../components/common/Input'
import { Loading } from '../../components/common/Loading'

export const WorkspaceDetail: React.FC = () => {
  const { workspaceId } = useParams()
  const navigate = useNavigate()
  const [workspace, setWorkspace] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDesc, setNewProjectDesc] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchData = async () => {
    if (!workspaceId) return
    setLoading(true)
    try {
      const [workspaceRes, projectsRes] = await Promise.all([
        workspacesApi.getById(workspaceId),
        projectsApi.getAll(workspaceId),
      ])
      setWorkspace(workspaceRes.data.data)
      setProjects(projectsRes.data.data || [])
    } catch (error) {
      console.error('Failed to fetch workspace data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [workspaceId])

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProjectName.trim() || !workspaceId) return

    setSubmitting(true)
    try {
      await projectsApi.create(workspaceId, {
        name: newProjectName.trim(),
        description: newProjectDesc.trim() || undefined,
      })
      setIsModalOpen(false)
      setNewProjectName('')
      setNewProjectDesc('')
      await fetchData()
    } catch (error) {
      console.error('Failed to create project:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteWorkspace = async () => {
    if (!workspaceId || !confirm('Are you sure you want to delete this workspace? This action cannot be undone.')) return
    try {
      await workspacesApi.delete(workspaceId)
      navigate('/workspaces')
    } catch (error) {
      console.error('Failed to delete workspace:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loading size="lg" />
      </div>
    )
  }

  if (!workspace) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Workspace not found</p>
        <Link to="/workspaces" className="mt-4 inline-block">
          <Button variant="secondary">Back to Workspaces</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{workspace.name}</h1>
          {workspace.description && (
            <p className="text-sm text-gray-500 mt-1">{workspace.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="danger" size="sm" onClick={handleDeleteWorkspace}>
            Delete Workspace
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
        <Button size="sm" onClick={() => setIsModalOpen(true)}>
          + New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No projects yet. Create your first project!
          </div>
        ) : (
          projects.map((project) => (
            <Link key={project.id} to={`/workspaces/${workspaceId}/projects/${project.id}`}>
              <Card hover>
                <CardBody>
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  {project.description && (
                    <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </CardBody>
              </Card>
            </Link>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Project">
        <form onSubmit={handleCreateProject} className="space-y-4">
          <Input
            label="Project Name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="My Project"
            required
          />
          <Input
            label="Description (optional)"
            value={newProjectDesc}
            onChange={(e) => setNewProjectDesc(e.target.value)}
            placeholder="What's this project about?"
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
