import api from './client'
import { Comment, CreateCommentRequest, UpdateCommentRequest, ApiResponse } from '../types'

export const commentsApi = {
  getAll: (taskId: string) =>
    api.get<ApiResponse<Comment[]>>(`/tasks/${taskId}/comments`),

  create: (taskId: string, data: CreateCommentRequest) =>
    api.post<ApiResponse<Comment>>(`/tasks/${taskId}/comments`, data),

  update: (taskId: string, commentId: string, data: UpdateCommentRequest) =>
    api.put<ApiResponse<Comment>>(`/tasks/${taskId}/comments/${commentId}`, data),

  delete: (taskId: string, commentId: string) =>
    api.delete<ApiResponse<null>>(`/tasks/${taskId}/comments/${commentId}`),
}
