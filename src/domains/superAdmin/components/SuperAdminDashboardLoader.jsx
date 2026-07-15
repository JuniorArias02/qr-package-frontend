export default function SuperAdminDashboardLoader() {
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

            {/* Primary Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 w-12 h-12 bg-slate-100 rounded-2xl"></div>
                            <div className="h-3 w-24 bg-slate-100 rounded-full"></div>
                        </div>
                        <div className="flex items-end justify-between">
                            <div className="h-10 w-16 bg-slate-200 rounded-xl"></div>
                            <div className="h-5 w-12 bg-slate-100 rounded-lg"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Secondary Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Chart Skeleton */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                    <div className="h-7 w-64 bg-slate-200 rounded-xl mb-8"></div>
                    <div className="h-64 flex items-end gap-3 px-4">
                        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <div key={i} className="flex-1 h-full flex flex-col justify-end gap-4">
                                <div 
                                    className="w-full bg-slate-100 rounded-2xl" 
                                    style={{ height: `${Math.floor(Math.random() * 60) + 20}%` }}
                                ></div>
                                <div className="h-3 w-full bg-slate-50 rounded-full"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Skeleton */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm overflow-hidden">
                    <div className="h-7 w-48 bg-slate-200 rounded-xl mb-6"></div>
                    
                    <div className="space-y-6">
                        {[1, 2].map((i) => (
                            <div key={i}>
                                <div className="flex justify-between items-end mb-2">
                                    <div className="h-3 w-20 bg-slate-100 rounded-full"></div>
                                    <div className="h-4 w-8 bg-slate-200 rounded-full"></div>
                                </div>
                                <div className="w-full h-3 bg-slate-100 rounded-full"></div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-slate-200 rounded-xl shrink-0"></div>
                            <div className="space-y-2 w-full">
                                <div className="h-4 w-32 bg-slate-200 rounded-full"></div>
                                <div className="h-3 w-full bg-slate-100 rounded-full"></div>
                                <div className="h-3 w-2/3 bg-slate-100 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
