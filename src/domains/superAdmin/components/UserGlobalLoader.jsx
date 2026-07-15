export default function UserGlobalLoader() {
    return (
        <div className="max-w-7xl mx-auto pb-12 animate-pulse">
            
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-slate-200 rounded-lg"></div>
                        <div className="h-3 w-48 bg-slate-200 rounded-full"></div>
                    </div>
                    <div className="h-10 w-64 bg-slate-200 rounded-2xl mb-2"></div>
                    <div className="h-4 w-80 bg-slate-100 rounded-full"></div>
                </div>
                <div className="w-56 h-14 bg-slate-200 rounded-[1.25rem]"></div>
            </div>

            {/* Search & Filters Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                <div className="md:col-span-2 h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl"></div>
                <div className="h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl"></div>
                <div className="h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl"></div>
            </div>

            {/* Table Skeleton */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden text-left">
                <div className="bg-slate-50 h-14 w-full border-b border-slate-200"></div>
                <div className="divide-y divide-slate-100">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="px-8 py-5 flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="w-10 h-10 bg-slate-100 rounded-xl"></div>
                                <div className="space-y-2">
                                    <div className="h-3 w-32 bg-slate-200 rounded-full"></div>
                                    <div className="h-2 w-48 bg-slate-100 rounded-full"></div>
                                </div>
                            </div>
                            <div className="flex-1 px-8">
                                <div className="h-3 w-24 bg-slate-100 rounded-full"></div>
                            </div>
                            <div className="flex-1 px-8">
                                <div className="h-5 w-20 bg-slate-100 rounded-full"></div>
                            </div>
                            <div className="flex-1 px-8">
                                <div className="h-3 w-16 bg-slate-100 rounded-full"></div>
                            </div>
                            <div className="w-10 h-10 bg-slate-50 rounded-xl"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
