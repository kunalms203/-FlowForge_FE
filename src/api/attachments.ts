import api from './client'
import { Attachment, ApiResponse } from '../types'

export const attachmentsApi = {
  upload: (taskId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post<ApiResponse<Attachment>>(`/tasks/${taskId}/attachments/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  delete: (taskId: string, attachmentId: string) =>
    api.delete<ApiResponse<null>>(`/tasks/${taskId}/attachments/${attachmentId}`),
}
