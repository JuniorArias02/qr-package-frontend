import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import branchService from '../services/branch.service'
import { Building2, ArrowLeft, Save, MapPin, AlertCircle, Navigation } from 'lucide-react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'

// Component to handle map clicks for updating the marker position
function MapClickHandler({ onLocationSelect }) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng)
        }
    })
    return null
}

// Component to auto-center map when coordinates change
function MapCenterUpdater({ center }) {
    const map = useMap()
    useEffect(() => {
        if (center) {
            map.flyTo(center, map.getZoom(), { animate: true, duration: 1.5 })
        }
    }, [center, map])
    return null
}

export default function BranchesForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEditing = Boolean(id)

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        latitude: '',
        longitude: ''
    })
    
    // Default center to Bogota
    const defaultCenter = [4.6097, -74.0817]
    const mapCenter = formData.latitude && formData.longitude 
        ? [parseFloat(formData.latitude), parseFloat(formData.longitude)]
        : defaultCenter

    const [loading, setLoading] = useState(isEditing)
    const [saving, setSaving] = useState(false)
    const [geocoding, setGeocoding] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // Flag to prevent geocoding when address is populated from the API
    const isEditingInitialLoad = useRef(isEditing)

    useEffect(() => {
        if (isEditing) {
            fetchBranch()
        }
    }, [id])

    // Debounce effect for geocoding
    useEffect(() => {
        // Skip geocoding on the very first mount or when the address is set by the API fetch
        if (isEditingInitialLoad.current && formData.address) {
            isEditingInitialLoad.current = false
            return
        }

        const timeoutId = setTimeout(() => {
            if (formData.address.trim().length > 3) {
                performGeocode(formData.address)
            }
        }, 2000)

        return () => clearTimeout(timeoutId)
    }, [formData.address])

    const fetchBranch = async () => {
        try {
            const data = await branchService.getBranch(id)
            const branch = data.objeto || data.data || data
            
            let addressStr = ''
            if (branch.address) {
                if (typeof branch.address === 'string') {
                    addressStr = branch.address
                } else if (typeof branch.address === 'object') {
                    addressStr = branch.address.full_address || branch.address.normalized_address || 'Address'
                }
            }

            setFormData({
                name: branch.name || '',
                address: addressStr,
                latitude: branch.latitude || '',
                longitude: branch.longitude || ''
            })
        } catch (err) {
            console.error(err)
            setError('Failed to load branch details')
        } finally {
            setLoading(false)
        }
    }

    const handleLocationSelect = (lat, lng) => {
        setFormData(prev => ({
            ...prev,
            latitude: lat.toFixed(6),
            longitude: lng.toFixed(6)
        }))
    }

    const performGeocode = async (addressToSearch) => {
        setGeocoding(true)
        setError('')
        
        try {
            const data = await branchService.geocodeAddress(addressToSearch)
            const result = data.objeto
            if (result && result.latitude && result.longitude) {
                setFormData(prev => ({
                    ...prev,
                    latitude: result.latitude.toFixed(6),
                    longitude: result.longitude.toFixed(6),
                }))
                setSuccess('Address located successfully!')
                setTimeout(() => setSuccess(''), 3000)
            } else {
                setError('Could not find coordinates for this address.')
                setTimeout(() => setError(''), 3000)
            }
        } catch (err) {
            console.error(err)
            setError('Error locating address. Please place the pin manually.')
            setTimeout(() => setError(''), 3000)
        } finally {
            setGeocoding(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError('')

        // Parse lat/long back to numbers if provided
        const payload = {
            ...formData,
            latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
            longitude: formData.longitude ? parseFloat(formData.longitude) : undefined
        }

        try {
            if (isEditing) {
                await branchService.updateBranch(id, payload)
            } else {
                await branchService.createBranch(payload)
            }
            navigate('/coordinator/branches')
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.mensaje || 'Error saving branch')
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <div className="w-10 h-10 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin mb-4"></div>
                <p className="font-bold uppercase tracking-widest text-sm">Loading...</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto p-6 pb-24">
            <Link 
                to="/coordinator/branches"
                className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-violet-600 transition-colors mb-8"
            >
                <ArrowLeft className="w-5 h-5" />
                Back to Branches
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <Building2 className="w-8 h-8 text-violet-600" />
                    {isEditing ? 'Edit Branch' : 'New Branch'}
                </h1>
                <p className="text-slate-500 font-medium mt-1">
                    {isEditing ? 'Update the details for this delivery branch' : 'Create a new branch for package dispatch'}
                </p>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100 flex items-center gap-3 animate-in fade-in">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span className="font-bold text-sm">{error}</span>
                </div>
            )}
            
            {success && (
                <div className="mb-8 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 flex items-center gap-3 animate-in fade-in">
                    <MapPin className="w-5 h-5 shrink-0" />
                    <span className="font-bold text-sm">{success}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col lg:flex-row">
                
                {/* Form Fields Section */}
                <div className="flex-1 p-8 space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                            Branch Name
                        </label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                required
                                placeholder="e.g., North Station"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all font-bold text-slate-900"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                            Full Address
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                            <textarea
                                required
                                placeholder="Full physical address of the branch"
                                rows="3"
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all font-bold text-slate-900 resize-none"
                            />
                        </div>
                        {geocoding && (
                            <div className="mt-3 flex items-center gap-2 text-sm text-blue-600 font-bold animate-pulse">
                                <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                                Locating address on map...
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                Latitude (Optional)
                            </label>
                            <input
                                type="number"
                                step="any"
                                placeholder="4.60971"
                                value={formData.latitude}
                                onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all font-mono text-sm text-slate-900"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                Longitude (Optional)
                            </label>
                            <input
                                type="number"
                                step="any"
                                placeholder="-74.08175"
                                value={formData.longitude}
                                onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all font-mono text-sm text-slate-900"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:active:scale-100"
                        >
                            {saving ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            {isEditing ? 'Save Changes' : 'Create Branch'}
                        </button>
                    </div>
                </div>

                {/* Map Section */}
                <div className="flex-1 bg-slate-100 min-h-[400px] relative z-0 border-l border-slate-200">
                    <div className="absolute top-4 left-4 right-4 z-[1000] bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-slate-200 text-xs font-bold text-slate-600 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-violet-600" />
                        Click on the map to set branch coordinates
                    </div>
                    
                    <MapContainer 
                        center={defaultCenter} // Starting center, updater will handle changes
                        zoom={13} 
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={true}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapClickHandler onLocationSelect={handleLocationSelect} />
                        <MapCenterUpdater center={mapCenter} />
                        
                        {(formData.latitude && formData.longitude) && (
                            <Marker position={[parseFloat(formData.latitude), parseFloat(formData.longitude)]} />
                        )}
                    </MapContainer>
                </div>
            </form>
        </div>
    )
}
