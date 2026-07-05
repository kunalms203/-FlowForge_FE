import api from './client'
import { Project, CreateProjectRequest, UpdateProjectRequest, ApiResponse } from '../types'

export const projectsApi = {
  getAll: (workspaceId: string) =>
    api.get<ApiResponse<Project[]>>(`/workspaces/${workspaceId}/projects`),

  getById: (workspaceId: string, projectId: string) =>
    api.get<ApiResponse<Project>>(`/workspaces/${workspaceId}/projects/${projectId}`),

  create: (workspaceId: string, data: CreateProjectRequest) =>
    api.post<ApiResponse<Project>>(`/workspaces/${workspaceId}/projects`, data),

  update: (workspaceId: string, projectId: string, data: UpdateProjectRequest) =>
    api.put<ApiResponse<Project>>(`/workspaces/${workspaceId}/projects/${projectId}`, data),

  delete: (workspaceId: string, projectId: string) =>
    api.delete<ApiResponse<null>>(`/workspaces/${workspaceId}/projects/${projectId}`),
}
