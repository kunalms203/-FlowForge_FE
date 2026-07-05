import api from './client'
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiResponse,
} from '../types'

export const authApi = {
  register: (data: RegisterRequest) =>
    api.post<ApiResponse<AuthResponse>>('/auth/register', data),

  login: (data: LoginRequest) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', data),

  refresh: (refreshToken: string) =>
    api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/auth/refresh', { refreshToken }),

  logout: (refreshToken: string) =>
    api.post<ApiResponse<null>>('/auth/logout', { refreshToken }),
}
