import { X } from 'lucide-react'
import SidebarContent from './SidebarContent'

export default function MobileSidebar({ isOpen, onClose, user, logout }) {
    if (!isOpen) return null

    return (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={onClose}>
            <aside
                className="w-72 h-full bg-white flex flex-col relative animate-in slide-in-from-left duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button Mobile */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-4 p-2 hover:bg-slate-100 rounded-lg transition-colors z-10"
                >
                    <X className="w-5 h-5 text-slate-600" />
                </button>

                <SidebarContent user={user} logout={logout} onClose={onClose} />
            </aside>
        </div>
    )
}
