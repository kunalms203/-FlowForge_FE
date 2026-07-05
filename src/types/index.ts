export interface User {
  id: string
  email: string
  fullName: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface Workspace {
  id: string
  name: string
  description?: string
  ownerId: string
  members: User[]
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  name: string
  description?: string
  workspaceId: string
  createdAt: string
  updatedAt: string
}

export interface Board {
  id: string
  name: string
  position: number
  projectId: string
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'BACKLOG'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  storyPoints?: number
  assigneeId?: string
  assignee?: User
  boardId: string
  position: number
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  content: string
  taskId: string
  userId: string
  user: User
  createdAt: string
  updatedAt: string
}

export interface Attachment {
  id: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  taskId: string
  userId: string
  user: User
  createdAt: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
  read: boolean
  userId: string
  relatedId?: string
  createdAt: string
}

export interface ActivityLog {
  id: string
  action: string
  details: Record<string, any>
  userId: string
  user: User
  workspaceId?: string
  projectId?: string
  taskId?: string
  createdAt: string
}

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data: T
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
  workspaceName: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface CreateWorkspaceRequest {
  name: string
  description?: string
}

export interface UpdateWorkspaceRequest {
  name?: string
  description?: string
}

export interface CreateProjectRequest {
  name: string
  description?: string
}

export interface UpdateProjectRequest {
  name?: string
  description?: string
}

export interface CreateBoardRequest {
  name: string
  position?: number
}

export interface UpdateBoardRequest {
  name?: string
  position?: number
}

export interface CreateTaskRequest {
  title: string
  description?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  storyPoints?: number
  assigneeId?: string
  dueDate?: string
}

export interface UpdateTaskRequest {
  title?: string
  description?: string
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'BACKLOG'
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  storyPoints?: number
  assigneeId?: string
  dueDate?: string
  position?: number
}

export interface MoveTaskRequest {
  newBoardId: string
  newPosition?: number
}

export interface CreateCommentRequest {
  content: string
}

export interface UpdateCommentRequest {
  content: string
}
