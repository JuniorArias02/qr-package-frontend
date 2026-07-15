import { User } from './auth.types'
import { Package } from './package.types'

export interface Route {
    id: number
    name: string
    driver_id: number
    driver?: User
    packages?: Package[]
    created_at: string
    updated_at: string
}
