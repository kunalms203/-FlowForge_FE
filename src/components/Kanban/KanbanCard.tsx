import React from 'react'
import { Task } from '../../types'
import { getPriorityColor, getStatusColor, truncateText, formatDate } from '../../utils/helpers'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface KanbanCardProps {
  task: Task
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-md border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium text-gray-900 flex-1">
          {truncateText(task.title, 50)}
        </h4>
        <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
      </div>
      {task.description && (
        <p className="mt-1 text-xs text-gray-500 line-clamp-2">
          {truncateText(task.description, 80)}
        </p>
      )}
      <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
        <span>
          {task.storyPoints && `${task.storyPoints} pts`}
        </span>
        {task.dueDate && (
          <span>Due: {formatDate(task.dueDate)}</span>
        )}
        {task.assignee && (
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-primary-100 text-primary-600 text-[8px] flex items-center justify-center font-semibold">
              {task.assignee.fullName?.charAt(0) || 'U'}
            </span>
          </span>
        )}
      </div>
    </div>
  )
}
