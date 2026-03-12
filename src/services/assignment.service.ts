import api from './api/axios'
import { AssignPackageDTO } from '../types/package.types'
import { Package } from '../types/package.types'

const assignmentService = {
    assignPackage: async (data: AssignPackageDTO): Promise<Package> => {
        const response = await api.post<Package>('/assignments', data)
        return response.data
    },

    unassignPackage: async (packageId: number): Promise<Package> => {
        const response = await api.post<Package>(`/assignments/unassign/${packageId}`)
        return response.data
    }
}

export default assignmentService
