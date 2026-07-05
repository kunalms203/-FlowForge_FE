export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    LOW: 'bg-gray-100 text-gray-800',
    MEDIUM: 'bg-blue-100 text-blue-800',
    HIGH: 'bg-orange-100 text-orange-800',
    URGENT: 'bg-red-100 text-red-800',
  }
  return colors[priority] || colors.LOW
}

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    BACKLOG: 'bg-gray-100 text-gray-800',
    TODO: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    DONE: 'bg-green-100 text-green-800',
  }
  return colors[status] || colors.TODO
}

export const getStatusBadge = (status: string): string => {
  const labels: Record<string, string> = {
    BACKLOG: 'Backlog',
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done',
  }
  return labels[status] || status
}

export const getPriorityLabel = (priority: string): string => {
  const labels: Record<string, string> = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    URGENT: 'Urgent',
  }
  return labels[priority] || priority
}

export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const cn = (...classes: (string | undefined | null | boolean)[]): string => {
  return classes.filter(Boolean).join(' ')
}
