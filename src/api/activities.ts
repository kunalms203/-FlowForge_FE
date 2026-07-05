import api from './client'
import { ActivityLog, ApiResponse, PaginatedResponse } from '../types'

export const activitiesApi = {
  getWorkspace: (workspaceId: string, page: number = 1, limit: number = 30) =>
    api.get<ApiResponse<PaginatedResponse<ActivityLog>>>(`/activities/workspace/${workspaceId}?page=${page}&limit=${limit}`),

  getProject: (projectId: string, page: number = 1, limit: number = 30) =>
    api.get<ApiResponse<PaginatedResponse<ActivityLog>>>(`/activities/project/${projectId}?page=${page}&limit=${limit}`),

  getTask: (taskId: string, page: number = 1, limit: number = 30) =>
    api.get<ApiResponse<PaginatedResponse<ActivityLog>>>(`/activities/task/${taskId}?page=${page}&limit=${limit}`),
}
