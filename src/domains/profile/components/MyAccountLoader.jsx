export default function MyAccountLoader() {
    return (
        <div className="max-w-5xl mx-auto pb-12 animate-pulse">
            
            {/* Header Skeleton */}
            <div className="mb-10">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-slate-200 rounded-lg"></div>
                    <div className="h-3 w-40 bg-slate-200 rounded-full"></div>
                </div>
                <div className="h-10 w-64 bg-slate-200 rounded-2xl mb-2"></div>
                <div className="h-4 w-96 bg-slate-100 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Profile Card Skeleton */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-slate-100" />
                        <div className="relative mt-4">
                            <div className="w-32 h-32 bg-white rounded-[2rem] p-1 mx-auto">
                                <div className="w-full h-full bg-slate-100 rounded-[1.75rem]"></div>
                            </div>
                        </div>
                        <div className="mt-6 space-y-3">
                            <div className="h-7 w-40 bg-slate-200 rounded-lg mx-auto"></div>
                            <div className="h-3 w-48 bg-slate-100 rounded-full mx-auto"></div>
                        </div>
                        <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="h-2 w-12 bg-slate-100 rounded-full mx-auto"></div>
                                <div className="h-6 w-20 bg-slate-100 rounded-lg mx-auto"></div>
                            </div>
                            <div className="border-l border-slate-100 space-y-2">
                                <div className="h-2 w-12 bg-slate-100 rounded-full mx-auto"></div>
                                <div className="h-6 w-20 bg-slate-100 rounded-lg mx-auto"></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[2rem] p-8 h-40">
                        <div className="w-8 h-8 bg-slate-800 rounded-lg mb-4"></div>
                        <div className="h-4 w-32 bg-slate-800 rounded-full mb-2"></div>
                        <div className="h-3 w-40 bg-slate-800 rounded-full"></div>
                    </div>
                </div>

                {/* Right Column: Forms Skeleton */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-10 space-y-10">
                            {/* Section 1 */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl"></div>
                                    <div className="h-6 w-48 bg-slate-200 rounded-lg"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <div className="h-3 w-24 bg-slate-100 rounded-full"></div>
                                        <div className="h-14 bg-slate-50 rounded-2xl border-2 border-slate-100"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-3 w-32 bg-slate-100 rounded-full"></div>
                                        <div className="h-14 bg-slate-50 rounded-2xl border-2 border-slate-100"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-slate-100" />

                            {/* Section 2 */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl"></div>
                                    <div className="h-6 w-56 bg-slate-200 rounded-lg"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="h-14 bg-slate-50 rounded-2xl border-2 border-slate-100"></div>
                                    <div className="h-14 bg-slate-50 rounded-2xl border-2 border-slate-100"></div>
                                </div>
                            </div>
                        </div>
                        <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                            <div className="h-3 w-48 bg-slate-200 rounded-full"></div>
                            <div className="h-14 w-40 bg-slate-200 rounded-2xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
