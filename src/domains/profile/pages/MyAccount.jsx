import { useState, useEffect } from 'react'
import authService from '../../auth/services/authService'
import { useAuth } from '../../../core/hooks/useAuth'
import {
    User,
    Mail,
    Lock,
    Shield,
    Camera,
    Save,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Calendar,
    BadgeCheck,
    KeyRound,
    Eye,
    EyeOff
} from 'lucide-react'
import MyAccountLoader from '../components/MyAccountLoader'

export default function MyAccount() {
    const { user: authUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [showPassword, setShowPassword] = useState(false)
    const [profileImage, setProfileImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [uploadingPhoto, setUploadingPhoto] = useState(false)

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const data = await authService.getProfile()
            setFormData({
                name: data.name || '',
                email: data.email || '',
                password: '',
                confirmPassword: ''
            })
            if (data.profile_image) {
                setProfileImage(data.profile_image)
            }
        } catch (err) {
            console.error(err)
            setError('Could not load profile information')
        } finally {
            setFetching(false)
        }
    }

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)

        // Upload
        setUploadingPhoto(true)
        setError('')
        try {
            const result = await authService.updateProfilePhoto(file)
            setProfileImage(result.profile_image)
            setSuccess('Profile photo updated successfully')
            // Don't reload immediately here to allow preview to stay
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.mensaje || 'Error uploading photo')
            setImagePreview(null)
        } finally {
            setUploadingPhoto(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (formData.password && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const updateData = {
                name: formData.name,
                email: formData.email
            }
            if (formData.password) {
                updateData.password = formData.password
            }

            await authService.updateProfile(updateData)
            setSuccess('Profile updated successfully')
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }))

            // Refresh page data or sync with context if needed
            // Window reload is a simple way to ensure all header/sidebar components update
            setTimeout(() => window.location.reload(), 1500)
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.mensaje || 'An error occurred while updating profile')
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <>
                <MyAccountLoader />
            </>
        )
    }

    return (
        <>
            <div className="max-w-5xl mx-auto pb-12">
                {/* Header Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-violet-100 text-violet-600 rounded-lg">
                            <Shield className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-violet-600">Privacy & Security</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Account</h1>
                    <p className="text-slate-500 font-medium">Manage your personal information and security settings</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Profile Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-xl shadow-slate-200/40 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-violet-600 to-indigo-700" />

                            <div className="relative mt-4">
                                <div className="w-32 h-32 bg-white rounded-[2rem] p-1 shadow-2xl mx-auto">
                                    <div className="w-full h-full bg-slate-100 rounded-[1.75rem] flex items-center justify-center text-4xl font-black text-violet-600 relative group overflow-hidden">
                                        {imagePreview || profileImage ? (
                                            <img
                                                src={imagePreview || `${import.meta.env.VITE_API_URL?.replace('/api', '')}/storage/${profileImage}`}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            formData.name.charAt(0).toUpperCase()
                                        )}

                                        {uploadingPhoto && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                                            </div>
                                        )}

                                        <label className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-1 backdrop-blur-sm cursor-pointer">
                                            <Camera className="w-6 h-6" />
                                            <span className="text-[10px] font-black uppercase">Change</span>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                                disabled={uploadingPhoto}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 right-1/2 translate-x-12 p-2 bg-emerald-500 text-white rounded-xl shadow-lg border-4 border-white">
                                    <BadgeCheck className="w-4 h-4" />
                                </div>
                            </div>

                            <div className="mt-6 space-y-1">
                                <h2 className="text-2xl font-black text-slate-900">{formData.name}</h2>
                                <p className="text-slate-500 font-medium flex items-center justify-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    {formData.email}
                                </p>
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Role</p>
                                    <span className="px-3 py-1 bg-violet-50 text-violet-600 rounded-lg text-xs font-black uppercase tracking-tight">
                                        {authUser?.role}
                                    </span>
                                </div>
                                <div className="text-center border-l border-slate-100">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Status</p>
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-black uppercase tracking-tight">
                                        Verified
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <Calendar className="w-8 h-8 mb-4 text-violet-400" />
                            <h3 className="text-lg font-bold mb-1">Member Since</h3>
                            <p className="text-slate-400 text-sm font-medium mb-4">
                                {new Date(authUser?.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            <div className="flex items-center gap-2 text-xs font-black text-violet-300 bg-violet-500/10 px-3 py-2 rounded-xl w-fit">
                                <CheckCircle2 className="w-4 h-4" />
                                ACCOUNT ACTIVE
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Forms */}
                    <div className="lg:col-span-2 space-y-8">
                        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
                            <div className="p-10">
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">Personal Information</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Display Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-5 py-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-300"
                                                placeholder="Your full name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-5 py-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-300"
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                    </div>
                                </section>

                                <div className="h-px bg-slate-100 my-10" />

                                <section className="space-y-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">Security / Change Password</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
                                            <div className="relative group">
                                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={formData.password}
                                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                    className="w-full pl-12 pr-12 py-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium text-slate-900"
                                                    placeholder="Minimum 6 characters"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-colors p-1"
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Confirm New Password</label>
                                            <div className="relative group">
                                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={formData.confirmPassword}
                                                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                    className="w-full pl-12 pr-12 py-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium text-slate-900"
                                                    placeholder="Repeat new password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-colors p-1"
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium italic">
                                        Leave password fields empty if you don't want to change it.
                                    </p>
                                </section>

                                {error && (
                                    <div className="mt-8 p-5 bg-red-50 border border-red-100 text-red-600 rounded-3xl flex items-center gap-4 animate-shake">
                                        <AlertCircle className="w-6 h-6 shrink-0" />
                                        <p className="font-bold text-sm tracking-tight">{error}</p>
                                    </div>
                                )}

                                {success && (
                                    <div className="mt-8 p-5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-3xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <CheckCircle2 className="w-6 h-6 shrink-0" />
                                        <p className="font-bold text-sm tracking-tight">{success}</p>
                                    </div>
                                )}
                            </div>

                            <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                <p className="text-sm text-slate-500 font-medium">
                                    Your data is encrypted and secure.
                                </p>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-10 py-4 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-2xl font-black shadow-xl shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Update Profile
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.2s ease-in-out 0s 2;
                }
            `}</style>
        </>
    )
}