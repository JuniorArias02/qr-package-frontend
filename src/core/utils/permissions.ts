import { UserPermission, User, UserRole } from '../types/auth.types'

/**
 * Helper to check if current user has permission
 * ⚠️ This is for UI only - NEVER trust this for security
 * Backend ALWAYS validates permissions
 */
export const can = (permission: UserPermission): boolean => {
    const userStr = localStorage.getItem('user')
    if (!userStr) return false

    try {
        const user: User = JSON.parse(userStr)
        return user.permissions.includes(permission)
    } catch {
        return false
    }
}

export const canAny = (permissions: UserPermission[]): boolean => {
    return permissions.some(permission => can(permission))
}

export const canAll = (permissions: UserPermission[]): boolean => {
    return permissions.every(permission => can(permission))
}

export const hasRole = (role: UserRole): boolean => {
    const userStr = localStorage.getItem('user')
    if (!userStr) return false

    try {
        const user: User = JSON.parse(userStr)
        return user.rol === role
    } catch {
        return false
    }
}
