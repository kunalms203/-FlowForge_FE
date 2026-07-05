import React, { useState, useEffect } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { workspacesApi } from '../../api/workspaces'
import { projectsApi } from '../../api/projects'

export const Sidebar: React.FC = () => {
  const { workspaceId, projectId } = useParams()
  const [workspaces, setWorkspaces] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
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

  useEffect(() => {
    if (workspaceId) {
      const fetchProjects = async () => {
        try {
          const response = await projectsApi.getAll(workspaceId)
          setProjects(response.data.data || [])
        } catch (error) {
          console.error('Failed to fetch projects:', error)
        }
      }
      fetchProjects()
    } else {
      setProjects([])
    }
  }, [workspaceId])

  if (loading) {
    return (
      <aside className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Workspaces</h2>
      </div>
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {workspaces.map((workspace) => (
          <div key={workspace.id}>
            <NavLink
              to={`/workspaces/${workspace.id}`}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              {workspace.name}
            </NavLink>
            {workspaceId === workspace.id && projects.length > 0 && (
              <div className="ml-4 mt-1 space-y-1">
                {projects.map((project) => (
                  <NavLink
                    key={project.id}
                    to={`/workspaces/${workspaceId}/projects/${project.id}`}
                    className={({ isActive }) =>
                      `block px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-500 hover:bg-gray-100'
                      }`
                    }
                  >
                    {project.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
        <NavLink
          to="/workspaces/new"
          className="block px-3 py-2 rounded-md text-sm font-medium text-primary-600 hover:bg-primary-50"
        >
          + New Workspace
        </NavLink>
      </nav>
    </aside>
  )
}
