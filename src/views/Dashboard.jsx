import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ROUTES } from '../routes/api'

export default function Dashboard() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')

        if (!token) {
            navigate('/')
            return
        }

        if (userData) {
            setUser(JSON.parse(userData))
        }
    }, [navigate])

    const handleLogout = async () => {
        const token = localStorage.getItem('token')
        try {
            await fetch(ROUTES.LOGOUT, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            })
        } catch (error) {
            console.error('Logout error', error)
        } finally {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            navigate('/')
        }
    }

    const menuItems = [
        {
            title: 'Escanear Código',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75zM16.5 19.5h.75v.75h-.75v-.75z" />
                </svg>
            ),
            action: () => navigate('/scan'),
            color: 'from-cyan-500 to-blue-500',
        },
        {
            title: 'Ver Historial',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            action: () => navigate('/history'),
            color: 'from-purple-500 to-pink-500',
        },
        {
            title: 'Modificar Usuario',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
            ),
            action: () => console.log('Edit User clicked'),
            color: 'from-orange-500 to-yellow-500',
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
            <div className="max-w-md mx-auto">
                <header className="flex justify-between items-center mb-10 pt-4">
                    <div>
                        <h1 className="text-2xl font-bold">Dashboard</h1>
                        <p className="text-slate-400 text-sm">
                            Hola, <span className="text-cyan-400 font-medium">{user?.name || 'Usuario'}</span>
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                    </button>
                </header>

                <div className="grid gap-4">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={item.action}
                            className="group relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex items-center gap-5 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02]"
                        >
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300`}>
                                {item.icon}
                            </div>
                            <div className="text-left">
                                <h3 className="text-lg font-bold">{item.title}</h3>
                                <p className="text-xs text-slate-400 font-medium tracking-wide opacity-80">
                                    Acceder a la función
                                </p>
                            </div>
                            <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-white/50">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
