import api from '../api/axios'

const AuthService = {
    login: async (email, password) => {
        const response = await api.post('/login', { email, password })
        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
        }
        return response.data
    },

    register: async (name, email, password, password_confirmation, rol = 'usuario', codigo_personal = '') => {
        const response = await api.post('/register', {
            name,
            email,
            password,
            password_confirmation,
            rol,
            codigo_personal
        })
        return response.data
    },

    createUser: async (name, email, password, password_confirmation, rol = 'usuario', codigo_personal = '') => {
        const response = await api.post('/users', {
            name,
            email,
            password,
            password_confirmation,
            rol,
            codigo_personal
        })
        return response.data
    },

    logout: async () => {
        try {
            await api.post('/logout')
        } finally {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }
    },

    getProfile: async () => {
        const response = await api.get('/user')
        return response.data
    },

    updateProfile: async (name, email) => {
        const response = await api.post('/update-profile', { name, email })
        // Update local user data if successful
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user))
        }
        return response.data
    },

    changePassword: async (current_password, new_password, new_password_confirmation) => {
        const response = await api.post('/change-password', {
            current_password,
            new_password,
            new_password_confirmation
        })
        return response.data
    },

    requestPasswordReset: async (email) => {
        const response = await api.post('/forgot-password', { email })
        return response.data
    },

    verifyCode: async (email, code) => {
        const response = await api.post('/verify-code', { email, code })
        return response.data
    },

    resetPassword: async (email, code, password, password_confirmation) => {
        const response = await api.post('/reset-password', {
            email,
            code,
            password,
            password_confirmation
        })
        return response.data
    }
}

export default AuthService
