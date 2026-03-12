import { useAuth } from './useAuth'
import { UserPermission } from '../types/auth.types'
import { can } from '../utils/permissions'

export const usePermissions = () => {
    const { user } = useAuth()

    const hasPermission = (permission: UserPermission): boolean => {
        if (!user) return false
        return can(permission)
    }

    const hasAnyPermission = (permissions: UserPermission[]): boolean => {
        return permissions.some(hasPermission)
    }

    const hasAllPermissions = (permissions: UserPermission[]): boolean => {
        return permissions.every(hasPermission)
    }

    return {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions
    }
}
