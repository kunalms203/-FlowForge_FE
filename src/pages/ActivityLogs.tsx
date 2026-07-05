import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { activitiesApi } from '../api/activities'
import { Loading } from '../components/common/Loading'
import { formatDateTime } from '../utils/helpers'

export const ActivityLogs: React.FC = () => {
  const { workspaceId, projectId, taskId } = useParams()
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchActivities = async () => {
    setLoading(true)
    try {
      let response
      if (taskId) {
        response = await activitiesApi.getTask(taskId, page, 30)
      } else if (projectId) {
        response = await activitiesApi.getProject(projectId, page, 30)
      } else if (workspaceId) {
        response = await activitiesApi.getWorkspace(workspaceId, page, 30)
      } else {
        setActivities([])
        setLoading(false)
        return
      }
      setActivities(response.data.data.items || [])
      setTotalPages(response.data.data.totalPages || 1)
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [workspaceId, projectId, taskId, page])

  if (loading && page === 1) {
    return (
      <div className="flex justify-center py-12">
        <Loading size="lg" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">No activities found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-sm">
                  {activity.user?.fullName?.charAt(0) || 'U'}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user?.fullName || 'Unknown'}</span>
                    {' '}
                    <span className="text-gray-600">{activity.action}</span>
                  </p>
                  {activity.details && Object.keys(activity.details).length > 0 && (
                    <pre className="mt-1 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                      {JSON.stringify(activity.details, null, 2)}
                    </pre>
                  )}
                  <p className="text-xs text-gray-400 mt-1">{formatDateTime(activity.createdAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
