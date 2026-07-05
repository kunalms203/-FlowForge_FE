import React from 'react'
import { cn } from '../../utils/helpers'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export const Card: React.FC<CardProps> = ({ children, className, hover = false }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden',
        hover && 'transition-shadow duration-200 hover:shadow-md',
        className
      )}
    >
      {children}
    </div>
  )
}

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <div className={cn('px-6 py-4 border-b border-gray-200 bg-gray-50', className)}>{children}</div>
}

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <div className={cn('px-6 py-4', className)}>{children}</div>
}

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <div className={cn('px-6 py-4 border-t border-gray-200 bg-gray-50', className)}>{children}</div>
}
