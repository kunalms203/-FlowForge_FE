import api from './client'
import { Notification, ApiResponse, PaginatedResponse } from '../types'

export const notificationsApi = {
  getAll: (page: number = 1, limit: number = 20) =>
    api.get<ApiResponse<PaginatedResponse<Notification>>>(`/notifications?page=${page}&limit=${limit}`),

  markAsRead: (id: string) =>
    api.put<ApiResponse<Notification>>(`/notifications/${id}/read`),

  markAllAsRead: () =>
    api.put<ApiResponse<null>>('/notifications/read-all'),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/notifications/${id}`),
}
