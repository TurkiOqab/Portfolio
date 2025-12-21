'use client'

interface SkeletonProps {
    className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse bg-zinc-800/50 rounded ${className}`}
        />
    )
}

export function SkeletonText({ className = '', lines = 1 }: SkeletonProps & { lines?: number }) {
    return (
        <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={`h-4 ${i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}`}
                />
            ))}
        </div>
    )
}

export function SkeletonCard({ className = '' }: SkeletonProps) {
    return (
        <div className={`bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 ${className}`}>
            <Skeleton className="h-6 w-1/3 mb-4" />
            <SkeletonText lines={3} className="mb-4" />
            <div className="flex gap-2">
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
            </div>
        </div>
    )
}

export function SkeletonAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = {
        sm: 'w-9 h-9',
        md: 'w-12 h-12',
        lg: 'w-20 h-20',
    }

    return <Skeleton className={`${sizeClasses[size]} rounded-full`} />
}

export function SkeletonStats() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-4 w-24" />
                </div>
            ))}
        </div>
    )
}

export function SkeletonProject() {
    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
            <Skeleton className="h-48 w-full rounded-none" />
            <div className="p-6">
                <Skeleton className="h-6 w-2/3 mb-3" />
                <SkeletonText lines={2} className="mb-4" />
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>
            </div>
        </div>
    )
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-10 w-32 rounded-xl" />
            </div>

            {/* Stats skeleton */}
            <SkeletonStats />

            {/* Content skeleton */}
            <div className="grid md:grid-cols-2 gap-6">
                <SkeletonCard />
                <SkeletonCard />
            </div>
        </div>
    )
}
