import api from '../../../core/api/axios'
import { AuthResponse } from '../../../core/types/auth.types'

class AuthService {
    async login(data: any): Promise<AuthResponse> {
        const response = await api.post('/v1/auth/login', data)
        const result = response.data.objeto

        if (result.access_token) {
            localStorage.setItem('token', result.access_token)
            localStorage.setItem('user', JSON.stringify(result.user))
        }

        return result
    }

    async register(data: any): Promise<any> {
        const response = await api.post('/v1/auth/register', data)
        const result = response.data.objeto

        if (result?.access_token) {
            localStorage.setItem('token', result.access_token)
            localStorage.setItem('user', JSON.stringify(result.user))
        }

        return result
    }

    logout(): void {
        const token = localStorage.getItem('token')
        
        if (token) {
            api.post('/v1/auth/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).catch(console.error)
        }

        localStorage.clear()
    }

    async getProfile(): Promise<any> {
        const response = await api.get('/v1/auth/me')
        return response.data.objeto
    }

    async updateProfile(data: any): Promise<any> {
        const response = await api.post('/v1/auth/profile', data)
        const result = response.data.objeto

        // Update local storage with new user data
        if (result) {
            localStorage.setItem('user', JSON.stringify(result))
        }

        return result
    }

    async updateProfilePhoto(file: File): Promise<any> {
        const formData = new FormData()
        formData.append('photo', file)

        const response = await api.post('/v1/auth/profile-photo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        const result = response.data.objeto
        if (result) {
            const user = JSON.parse(localStorage.getItem('user') || '{}')
            user.profile_image = result.profile_image
            localStorage.setItem('user', JSON.stringify(user))
        }

        return result
    }

    // Placeholders for password recovery (not yet implemented in backend V1)
    async requestPasswordReset(email: string) {
        const response = await api.post('/v1/auth/forgot-password', { email })
        return response.data
    }

    async verifyCode(email: string, code: string) {
        const response = await api.post('/v1/auth/verify-code', { email, code })
        return response.data
    }

    async resetPassword(email: string, code: string, password: string, password_confirmation: string) {
        const response = await api.post('/v1/auth/reset-password', { email, code, password, password_confirmation })
        return response.data
    }
}

export default new AuthService()
