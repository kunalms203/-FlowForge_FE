import React, { createContext, useState, useEffect, ReactNode } from 'react'
import { User, LoginRequest, RegisterRequest } from '../types'
import { authApi } from '../api/auth'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadUser = async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      // Fetch user profile - you might need to add a /auth/me endpoint
      // For now, we'll try to parse user from stored data or fetch it
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error('Failed to load user:', error)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  const login = async (data: LoginRequest) => {
    const response = await authApi.login(data)
    const { accessToken, refreshToken, user } = response.data.data

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('user', JSON.stringify(user))

    setUser(user)
  }

  const register = async (data: RegisterRequest) => {
    const response = await authApi.register(data)
    const { accessToken, refreshToken, user } = response.data.data

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('user', JSON.stringify(user))

    setUser(user)
  }

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken)
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      setUser(null)
    }
  }

  const refreshToken = async () => {
    const refreshTokenStr = localStorage.getItem('refreshToken')
    if (!refreshTokenStr) {
      throw new Error('No refresh token available')
    }

    const response = await authApi.refresh(refreshTokenStr)
    const { accessToken, refreshToken: newRefreshToken } = response.data.data

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', newRefreshToken)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
