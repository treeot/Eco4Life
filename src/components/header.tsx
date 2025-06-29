"use client"

import { Leaf } from 'lucide-react'
import Link from "next/link";

export function Header() {
    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#2b362f] dark:border-b-gray-700 px-10 py-3 bg-[#1a2e1f] dark:bg-gray-800 transition-colors">
            <Link href="/">
            <div className="flex items-center gap-4 text-white dark:text-gray-100">
                <div className="size-4">
                    <Leaf className="h-6 w-6 text-white dark:text-gray-100" />
                </div>
                <h2 className="text-white dark:text-gray-100 text-lg font-bold leading-tight tracking-[-0.015em]">
                    EcoTherapy Wellness Retreats
                </h2>
            </div>
            </Link>
            <div className="flex flex-1 justify-end gap-8">
                <div className="flex items-center gap-9">
                    <a className="text-white dark:text-gray-100 text-sm font-medium leading-normal hover:text-[#94e0b2] transition-colors" href="/locations">
                        Locations
                    </a>
                </div>
            </div>
        </header>
    )
}