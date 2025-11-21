import { cn } from '@/lib/utils'
import React from 'react'

export default function LoadingComponent({ label = "Loading...", className }) {
    return (
        <div className={cn("bg-white p-6 min-h-[400px] flex items-center justify-center", className)}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            <p className="ml-3 text-gray-500">{label}</p>
        </div>
    )
}
