import { User } from './auth.types'

export enum PackageType {
    SINGLE = 'unico',
    DOUBLE = 'doble'
}

export enum PackageStatus {
    PENDING = 'en_espera',
    DELIVERED = 'entregado',
    NOT_DELIVERED = 'no_entregado',
    IN_TRANSIT = 'en_transito',
    RECEIVED = 'recibido'
}

export interface Package {
    id: number
    referencia_qr: string
    direccion: string
    nombre_receptor: string
    telefono_receptor: string
    tipo?: PackageType | string
    estado: PackageStatus | string
    observacion?: string
    codigo_postal?: string
    user_id_asignado?: number
    route_id?: number
    assigned_user?: User
    route?: any // Define Route if needed
    created_at: string
    updated_at: string
}

export interface CreatePackageDTO {
    referencia_qr: string
    direccion: string
    nombre_receptor: string
    telefono_receptor: string
    codigo_postal?: string
}

export interface CheckQRResponse {
    exists: boolean
    package?: Package
}

export interface AssignPackageDTO {
    package_id: number
    route_id: number
    driver_id: number
    tipo: PackageType
}

export interface UpdateDeliveryDTO {
    package_id: number
    estado: PackageStatus
    observacion?: string
}
