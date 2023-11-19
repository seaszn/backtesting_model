"use client";

import Link from "next/link";
import {
    AreaChartIcon,
    CandlestickChart,
    Cog,
    Globe,
    Globe2,
    LayoutDashboard,
    LayoutDashboardIcon,
    LucideLayout,
    Settings,
} from "lucide-react";
import {
    useParams,
    usePathname,
    useSelectedLayoutSegments,
} from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { FileCode, Github } from "lucide-react";

const externalLinks = [
    {
        name: "Star on GitHub",
        href: "https://github.com/vercel/platforms",
        icon: <Github width={18} />,
    },
    {
        name: "Read the guide",
        href: "https://vercel.com/guides/nextjs-multi-tenant-application",
        icon: <FileCode width={18} />,
    }
];

export default function Nav({ children }: { children: ReactNode }) {
    const segments = useSelectedLayoutSegments();
    const { id } = useParams() as { id?: string };

    const [siteId] = useState<string | null>();

    const tabs = useMemo(() => {
        return [
            {
                name: "Overview",
                href: "/",
                isActive: segments.length === 0,
                icon: <LucideLayout width={18} />,
            },
            {
                name: "Chart",
                href: "/chart",
                isActive: segments[0] === "chart",
                icon: <CandlestickChart width={18} />,
            },
            {
                name: "Settings",
                href: "/settings",
                isActive: segments[0] === "settings",
                icon: <Cog width={18} />,
            },
        ];
    }, [segments, id, siteId]);

    const [showSidebar, setShowSidebar] = useState(false);

    const pathname = usePathname();

    useEffect(() => {
        setShowSidebar(false);
    }, [pathname]);

    return (
        <>
            <div
                className={`transform ${showSidebar ? "w-full translate-x-0" : "-translate-x-full"
                    } fixed z-40 flex h-full flex-col justify-between border-r-4 border-zinc-200 bg-zinc-100 p-4 transition-all dark:border-zinc-700 dark:bg-zinc-900 w-60 translate-x-0`}
            >
                <div className="grid gap-2">
                    <div className="flex items-center space-x-2 rounded-lg px-2 py-1.5">
                        <h1 className="font-semibold dark:text-white">Backtesting Model</h1>
                    </div>
                    <div className="my-2 border-t border-zinc-200 dark:border-zinc-700" />



                    <div className="grid gap-1">
                        {tabs.map(({ name, href, isActive, icon }) => (
                            <Link
                                key={name}
                                href={href}
                                className={`flex items-center space-x-3 ${isActive ? "bg-zinc-200 text-black dark:bg-zinc-700" : ""
                                    } rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-zinc-200 active:bg-zinc-300 dark:text-white dark:hover:bg-zinc-700 dark:active:bg-zinc-800`}
                            >
                                {icon}
                                <span className="text-sm font-medium">{name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="grid gap-1">
                        {externalLinks.map(({ name, href, icon }) => (
                            <a
                                key={name}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-zinc-200 active:bg-zinc-300 dark:text-white dark:hover:bg-zinc-700 dark:active:bg-zinc-800"
                            >
                                <div className="flex items-center space-x-3">
                                    {icon}
                                    <span className="text-sm font-medium">{name}</span>
                                </div>
                                <p>↗</p>
                            </a>
                        ))}
                    </div>
                    {children}
                </div>
            </div>
        </>
    );
}