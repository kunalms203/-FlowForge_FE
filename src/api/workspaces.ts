import api from './client'
import { Workspace, CreateWorkspaceRequest, UpdateWorkspaceRequest, ApiResponse } from '../types'

export const workspacesApi = {
  getAll: () =>
    api.get<ApiResponse<Workspace[]>>('/workspaces'),

  getById: (id: string) =>
    api.get<ApiResponse<Workspace>>(`/workspaces/${id}`),

  create: (data: CreateWorkspaceRequest) =>
    api.post<ApiResponse<Workspace>>('/workspaces', data),

  update: (id: string, data: UpdateWorkspaceRequest) =>
    api.put<ApiResponse<Workspace>>(`/workspaces/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/workspaces/${id}`),
}
