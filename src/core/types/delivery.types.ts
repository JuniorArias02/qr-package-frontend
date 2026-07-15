import { PackageStatus } from './package.types'

export interface UpdateDeliveryDTO {
    package_id: number
    estado: PackageStatus
    observacion?: string
}

export interface DeliveryStats {
    total: number
    entregados: number
    no_entregados: number
    pendientes: number
}
