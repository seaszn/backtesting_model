"use client";

import Link from "next/link";
import {
    ArrowLeft,
    BarChart3,
    Edit3,
    Globe,
    Layout,
    LayoutDashboard,
    Megaphone,
    Menu,
    Newspaper,
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

    const [siteId, setSiteId] = useState<string | null>();

    const tabs = useMemo(() => {
        return [
            {
                name: "Overview",
                href: "/",
                isActive: segments.length === 0,
                icon: <LayoutDashboard width={18} />,
            },
            {
                name: "Chart",
                href: "/chart",
                isActive: segments[0] === "chart",
                icon: <Globe width={18} />,
            },
            {
                name: "Settings",
                href: "/settings",
                isActive: segments[0] === "settings",
                icon: <Settings width={18} />,
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
            <button
                className={`fixed z-50 text-black dark:text-white dark ${
                    // left align for Editor, right align for other pages
                    segments[0] === "post" && segments.length === 2 && !showSidebar
                        ? "left-5 top-5"
                        : "right-5 top-5"
                    } sm:hidden`}
                onClick={() => setShowSidebar(!showSidebar)}
            >
                <Menu width={20} />
            </button>
            <div
                className={`transform ${showSidebar ? "w-full translate-x-0" : "-translate-x-full"
                    } fixed z-40 flex h-full flex-col justify-between border-r border-stone-200 bg-stone-100 p-4 transition-all dark:border-stone-700 dark:bg-stone-900 sm:w-60 sm:translate-x-0`}
            >
                <div className="grid gap-2">
                    <div className="flex items-center space-x-2 rounded-lg px-2 py-1.5">
                        <h1 className="font-semibold dark:text-white">Backtesting Model</h1>
                    </div>
                    <div className="my-2 border-t border-stone-200 dark:border-stone-700" />



                    <div className="grid gap-1">
                        {tabs.map(({ name, href, isActive, icon }) => (
                            <Link
                                key={name}
                                href={href}
                                className={`flex items-center space-x-3 ${isActive ? "bg-stone-200 text-black dark:bg-stone-700" : ""
                                    } rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800`}
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
                                className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800"
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