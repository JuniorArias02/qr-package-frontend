import { usePermissions } from '../../hooks/usePermissions'

const PermissionGate = ({ permission, children, fallback = null }) => {
    const { hasPermission } = usePermissions()

    if (hasPermission(permission)) {
        return <>{children}</>
    }

    return <>{fallback}</>
}

export default PermissionGate
