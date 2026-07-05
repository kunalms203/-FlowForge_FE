import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Layout } from '../components/Layout/Layout'
import { Login } from '../pages/Login'
import { Register } from '../pages/Register'
import { Dashboard } from '../pages/Dashboard'
import { WorkspaceList } from '../pages/Workspace/WorkspaceList'
import { WorkspaceDetail } from '../pages/Workspace/WorkspaceDetail'
import { ProjectDetail } from '../pages/Project/ProjectDetail'
import { Notifications } from '../pages/Notifications'
import { ActivityLogs } from '../pages/ActivityLogs'
import { ProtectedRoute } from './ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'workspaces',
        element: <WorkspaceList />,
      },
      {
        path: 'workspaces/new',
        element: <WorkspaceList />,
      },
      {
        path: 'workspaces/:workspaceId',
        element: <WorkspaceDetail />,
      },
      {
        path: 'workspaces/:workspaceId/projects/:projectId',
        element: <ProjectDetail />,
      },
      {
        path: 'notifications',
        element: <Notifications />,
      },
      {
        path: 'activities',
        element: <ActivityLogs />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
