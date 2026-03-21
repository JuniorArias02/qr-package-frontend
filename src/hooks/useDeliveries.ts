import { useState, useCallback } from 'react'
import deliveryService from '../services/delivery.service'
import { Package } from '../types/package.types'
import { UpdateDeliveryDTO, DeliveryStats } from '../types/delivery.types'

export const useDeliveries = () => {
    const [deliveries, setDeliveries] = useState<Package[]>([])
    const [stats, setStats] = useState<DeliveryStats>({
        total: 0,
        entregados: 0,
        no_entregados: 0,
        pendientes: 0
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchMyDeliveries = useCallback(async (showLoading = true) => {
        if (showLoading) setLoading(true)
        setError(null)
        try {
            const data = await deliveryService.getMyDeliveries()
            setDeliveries(data.deliveries)
            setStats(data.stats)
        } catch (err: any) {
            setError(err.message || 'Error loading deliveries')
        } finally {
            if (showLoading) setLoading(false)
        }
    }, [])

    const updateStatus = async (data: UpdateDeliveryDTO) => {
        // No global loading here to avoid full page flash
        try {
            await deliveryService.updateStatus(data)
            await fetchMyDeliveries(false) // Silent refresh
        } catch (err: any) {
            setError(err.message)
            throw err
        }
    }

    return {
        deliveries,
        stats,
        loading,
        error,
        fetchMyDeliveries,
        updateStatus
    }
}
