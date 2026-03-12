import { useState } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { Camera, CameraOff, Search, Package } from 'lucide-react'

export default function PackageScanner({ onScan, loading }) {
    const [scanning, setScanning] = useState(true)
    const [manualRef, setManualRef] = useState('')

    const handleManualSubmit = (e) => {
        e.preventDefault()
        if (manualRef.trim()) {
            onScan(manualRef.trim())
        }
    }

    return (
        <div className="space-y-6">
            <div className="relative group overflow-hidden rounded-3xl bg-slate-900 aspect-square md:aspect-video border-4 border-slate-200 shadow-2xl">
                {scanning ? (
                    <>
                        <Scanner
                            onScan={(result) => result[0] && onScan(result[0].rawValue)}
                            components={{
                                audio: false,
                                torch: false,
                            }}
                            styles={{
                                container: { width: '100%', height: '100%' },
                                video: { objectFit: 'cover' }
                            }}
                        />
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                            <div className="w-64 h-64 border-2 border-white/30 rounded-3xl relative">
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-violet-500 rounded-tl-2xl -mt-1 -ml-1"></div>
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-violet-500 rounded-tr-2xl -mt-1 -mr-1"></div>
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-violet-500 rounded-bl-2xl -mb-1 -ml-1"></div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-violet-500 rounded-br-2xl -mb-1 -mr-1"></div>
                                <div className="absolute top-0 left-0 right-0 h-0.5 bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)] animate-scan"></div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                        <CameraOff className="w-16 h-16 mb-4 opacity-20" />
                        <p className="font-medium">Camera is off</p>
                    </div>
                )}

                <button
                    onClick={() => setScanning(!scanning)}
                    className="absolute top-4 right-4 p-3 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-2xl text-white transition-all active:scale-95"
                >
                    {scanning ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                </button>
            </div>

            {/* Manual Entry */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-violet-100 rounded-lg">
                        <Package className="w-5 h-5 text-violet-600" />
                    </div>
                    <h3 className="font-bold text-slate-800">Or enter reference manually</h3>
                </div>

                <form onSubmit={handleManualSubmit} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            value={manualRef}
                            onChange={(e) => setManualRef(e.target.value)}
                            placeholder="Example: PKG-12345"
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all font-mono"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !manualRef.trim()}
                        className="px-6 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold rounded-2xl transition-all active:scale-95"
                    >
                        Check
                    </button>
                </form>
            </div>

            <style>{`
                @keyframes scan {
                    0%, 100% { top: 0; }
                    50% { top: 100%; }
                }
                .animate-scan {
                    animation: scan 2s linear infinite;
                }
            `}</style>
        </div>
    )
}
