import api from './client'
import { Task, CreateTaskRequest, UpdateTaskRequest, MoveTaskRequest, ApiResponse } from '../types'

export const tasksApi = {
  getAll: (workspaceId: string, projectId: string, boardId: string) =>
    api.get<ApiResponse<Task[]>>(`/workspaces/${workspaceId}/projects/${projectId}/boards/${boardId}/tasks`),

  getById: (workspaceId: string, projectId: string, boardId: string, taskId: string) =>
    api.get<ApiResponse<Task>>(`/workspaces/${workspaceId}/projects/${projectId}/boards/${boardId}/tasks/${taskId}`),

  create: (workspaceId: string, projectId: string, boardId: string, data: CreateTaskRequest) =>
    api.post<ApiResponse<Task>>(`/workspaces/${workspaceId}/projects/${projectId}/boards/${boardId}/tasks`, data),

  update: (workspaceId: string, projectId: string, boardId: string, taskId: string, data: UpdateTaskRequest) =>
    api.put<ApiResponse<Task>>(`/workspaces/${workspaceId}/projects/${projectId}/boards/${boardId}/tasks/${taskId}`, data),

  move: (workspaceId: string, projectId: string, boardId: string, taskId: string, data: MoveTaskRequest) =>
    api.post<ApiResponse<Task>>(`/workspaces/${workspaceId}/projects/${projectId}/boards/${boardId}/tasks/${taskId}/move`, data),

  delete: (workspaceId: string, projectId: string, boardId: string, taskId: string) =>
    api.delete<ApiResponse<null>>(`/workspaces/${workspaceId}/projects/${projectId}/boards/${boardId}/tasks/${taskId}`),
}
