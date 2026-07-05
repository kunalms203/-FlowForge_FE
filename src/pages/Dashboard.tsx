import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { workspacesApi } from '../api/workspaces'
import { Card, CardBody, CardHeader } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Loading } from '../components/common/Loading'

export const Dashboard: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
    fetchWorkspaces()
  }, [])

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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/workspaces/new">
          <Button>New Workspace</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No workspaces yet. Create your first workspace!</p>
            <Link to="/workspaces/new" className="mt-4 inline-block">
              <Button>Create Workspace</Button>
            </Link>
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
                    Created {new Date(workspace.createdAt).toLocaleDateString()}
                  </p>
                </CardBody>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
