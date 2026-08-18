import { useState, useCallback } from 'react'
import packageService from '../services/package.service'
import { Package, CreatePackageDTO } from '../../../core/types/package.types'

export const usePackages = () => {
    const [packages, setPackages] = useState<Package[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchPackages = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await packageService.getAll()
            setPackages(data)
        } catch (err: any) {
            setError(err.message || 'Error loading packages')
        } finally {
            setLoading(false)
        }
    }, [])

    const searchPackage = async (qr: string) => {
        setLoading(true)
        try {
            return await packageService.checkQR(qr)
        } catch (err: any) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const createPackage = async (data: CreatePackageDTO) => {
        setLoading(true)
        try {
            const newPackage = await packageService.create(data)
            setPackages(prev => [newPackage, ...prev])
            return newPackage
        } catch (err: any) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    return {
        packages,
        loading,
        error,
        fetchPackages,
        searchPackage,
        createPackage
    }
}
