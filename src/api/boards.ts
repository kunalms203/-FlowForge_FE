import api from './client'
import { Board, CreateBoardRequest, UpdateBoardRequest, ApiResponse } from '../types'

export const boardsApi = {
  getAll: (workspaceId: string, projectId: string) =>
    api.get<ApiResponse<Board[]>>(`/workspaces/${workspaceId}/projects/${projectId}/boards`),

  getById: (workspaceId: string, projectId: string, boardId: string) =>
    api.get<ApiResponse<Board>>(`/workspaces/${workspaceId}/projects/${projectId}/boards/${boardId}`),

  create: (workspaceId: string, projectId: string, data: CreateBoardRequest) =>
    api.post<ApiResponse<Board>>(`/workspaces/${workspaceId}/projects/${projectId}/boards`, data),

  update: (workspaceId: string, projectId: string, boardId: string, data: UpdateBoardRequest) =>
    api.put<ApiResponse<Board>>(`/workspaces/${workspaceId}/projects/${projectId}/boards/${boardId}`, data),

  delete: (workspaceId: string, projectId: string, boardId: string) =>
    api.delete<ApiResponse<null>>(`/workspaces/${workspaceId}/projects/${projectId}/boards/${boardId}`),
}
