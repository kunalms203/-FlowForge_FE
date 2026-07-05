import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { workspacesApi } from '../../api/workspaces'
import { Card, CardBody } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { Modal } from '../../components/common/Modal'
import { Input } from '../../components/common/Input'
import { Loading } from '../../components/common/Loading'

export const WorkspaceList: React.FC = () => {
  const navigate = useNavigate()
  const [workspaces, setWorkspaces] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState('')
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchWorkspaces = async () => {
    try {
      const response = await workspacesApi.getAll()
      setWorkspaces(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch workspaces:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkspaces()
  }, [])

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newWorkspaceName.trim()) return

    setSubmitting(true)
    try {
      const response = await workspacesApi.create({
        name: newWorkspaceName.trim(),
        description: newWorkspaceDesc.trim() || undefined,
      })
      setIsModalOpen(false)
      setNewWorkspaceName('')
      setNewWorkspaceDesc('')
      await fetchWorkspaces()
      navigate(`/workspaces/${response.data.data.id}`)
    } catch (error) {
      console.error('Failed to create workspace:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loading size="lg" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Workspaces</h1>
        <Button onClick={() => setIsModalOpen(true)}>New Workspace</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No workspaces yet.</p>
          </div>
        ) : (
          workspaces.map((workspace) => (
            <Link key={workspace.id} to={`/workspaces/${workspace.id}`}>
              <Card hover>
                <CardBody>
                  <h3 className="text-lg font-semibold text-gray-900">{workspace.name}</h3>
                  {workspace.description && (
                    <p className="mt-1 text-sm text-gray-500">{workspace.description}</p>
                  )}
                  <p className="mt-2 text-xs text-gray-400">
                    Members: {workspace.members?.length || 0} · Created {new Date(workspace.createdAt).toLocaleDateString()}
                  </p>
                </CardBody>
              </Card>
            </Link>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Workspace">
        <form onSubmit={handleCreateWorkspace} className="space-y-4">
          <Input
            label="Workspace Name"
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
            placeholder="My Workspace"
            required
          />
          <Input
            label="Description (optional)"
            value={newWorkspaceDesc}
            onChange={(e) => setNewWorkspaceDesc(e.target.value)}
            placeholder="What's this workspace for?"
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
