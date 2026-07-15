export default function GlobalDeliveriesLoader() {
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
            </div>

            {/* Filters Bar Skeleton */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm mb-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-14 w-full bg-slate-50 rounded-2xl border-2 border-transparent"></div>
                    ))}
                    <div className="h-14 w-full bg-slate-100 rounded-2xl flex items-center justify-center"></div>
                </div>
            </div>

            {/* Grid View Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-8">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-slate-100 rounded-xl"></div>
                                    <div className="h-3 w-24 bg-slate-100 rounded-full"></div>
                                </div>
                                <div className="w-20 h-6 bg-slate-50 rounded-full border border-slate-100"></div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="w-9 h-9 bg-white rounded-lg shadow-sm"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-2 w-16 bg-slate-200 rounded-full"></div>
                                        <div className="h-4 w-32 bg-slate-300 rounded-full"></div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-2 w-12 bg-slate-200 rounded-full"></div>
                                        <div className="h-4 w-24 bg-slate-300 rounded-full"></div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <div className="h-3 w-full bg-slate-100 rounded-full"></div>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center justify-between">
                                <div className="h-3 w-16 bg-slate-50 rounded-full"></div>
                                <div className="h-4 w-20 bg-slate-100 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
