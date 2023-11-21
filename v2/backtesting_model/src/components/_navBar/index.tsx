"use client";

import Link from "next/link";
import {
    CandlestickChart,
    Cog,
    LineChart,
    LucideLayout,
} from "lucide-react";
import {
    useParams,
    usePathname,
    useSelectedLayoutSegments,
} from "next/navigation";
import { useMemo, useState } from "react";
import { FileCode, Github } from "lucide-react";

const externalLinks = [
    {
        name: "Star on GitHub",
        href: "https://github.com/vercel/platforms",
        icon: <Github strokeWidth={"1px"} />,
    },
    {
        name: "Read the guide",
        href: "https://vercel.com/guides/nextjs-multi-tenant-application",
        icon: <FileCode strokeWidth={"1px"} />,
    }
];

export default function Nav() {
    const segments = useSelectedLayoutSegments();
    const [siteId] = useState<string | null>();
    const { id } = useParams() as { id?: string };
    const [collapsed, setCollapsed] = useState(true);

    const tabs = useMemo(() => {
        return [
            {
                name: "Overview",
                href: "/",
                isActive: segments.length === 0,
                icon: <LucideLayout strokeWidth={"1px"} />,
            },
            {
                name: "Chart",
                href: "/chart",
                isActive: segments[0] === "chart",
                icon: <CandlestickChart strokeWidth={"1px"} />,
            },
            {
                name: "Settings",
                href: "/settings",
                isActive: segments[0] === "settings",
                icon: <Cog strokeWidth={"1px"} />,
            },
        ];
    }, [segments, id, siteId]);

    return (
        <div onMouseLeave={() => setCollapsed(true)} onMouseEnter={() => setCollapsed(false)} className={`transform z-40 min-h-screen border-r-4 border-zinc-200 bg-zinc-100 transition-all overflow-hidden dark:border-zinc-700 dark:bg-zinc-900  translate-x-0`} style={{minWidth : collapsed ? "3rem" : "18rem"}}>
            <div className={` h-full w-full justify-between flex flex-col py-2 px-1`}>
                <div className={`${collapsed ? " mx-auto p-0 py-2" : "p-2 "} ml-0.5 transition-all gap-1`}>

                    <div
                        className={`transition-all ease-in-out  dark:text-white`}>
                        <div className={`w-full m-1  flex`}>
                            <div>
                                <LineChart strokeWidth={"1px"} className=" text-black  dark:text-white" />
                            </div>
                            <div className={`${collapsed ? "w-0" : "w-full"} h-8 overflow-hidden whitespace-nowrap transition-all`}>
                                <span className=" ml-1 my-auto h-8 font-medium overflow-hidden text-ellipsis text-md">Backtesting Model</span>
                            </div>
                        </div>
                    </div>
                    <div className="my-2 border-t transition-all border-zinc-200 dark:border-zinc-700" />
                    <div className={`grid gap-1 transition-all`}>
                        {tabs.map(({ name, href, isActive, icon }) => (
                            <Link
                                key={name}
                                href={href}
                                className={`${isActive ? "bg-zinc-200 text-black dark:bg-zinc-700" : ""} rounded-md transition-all ease-in-out hover:bg-zinc-200 active:bg-zinc-300 dark:text-white dark:hover:bg-zinc-800`}>
                                <div className={`w-full m-1  flex`}>
                                    <div>
                                        {icon}
                                    </div>
                                    <div className={`${collapsed ? "w-0" : "w-full"} whitespace-nowrap overflow-hidden transition-all`}>
                                        <span className=" ml-1 my-auto  text-xs font-medium">{name}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className={`${collapsed ? " mx-auto p-0 py-2" : "p-2 "} ml-0.5 transition-all gap-1`}>
                    <div className="my-2 border-t transition-all border-zinc-200 dark:border-zinc-700" />
                    <div className={`grid gap-1 transition-all`}>
                        {externalLinks.map(({ name, href, icon }) => (
                            <a
                                key={name}
                                href={href}
                                className={`rounded-md transition-all ease-in-out hover:bg-zinc-200 active:bg-zinc-300 dark:text-white dark:hover:bg-zinc-800`}>
                                <div className={`w-full m-1  flex`}>
                                    <div>
                                        {icon}
                                    </div>
                                    <div className={`${collapsed ? "w-0" : "w-full"} whitespace-nowrap overflow-hidden transition-all`}>
                                        <span className=" ml-1 my-auto text-xs font-medium">{name}</span>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
                {/* <div className={`${collapsed ? " mx-auto p-0" : "grid p-2"} gap-1`}>
                    <div className="my-2 border-t border-zinc-200 dark:border-zinc-700" />
                    <div className={`grid gap-1`}>
                        {externalLinks.map(({ name, href, icon }) => (
                            <Link
                                key={name}
                                href={href}
                                className={`flex ${collapsed ? "w-8 h-8 items-center " : "items-start w-full"} rounded-md transition-all duration-150 ease-in-out hover:bg-zinc-200 active:bg-zinc-300 dark:text-white dark:hover:bg-zinc-800`}>
                                <div className={`w-6 my-1 ${collapsed ? "mx-auto" : "mx-1"}`}>
                                    {icon}
                                </div>
                                {
                                    collapsed ? (
                                        <></>
                                    ) : (
                                        <div className="flex w-full ml-1 mr-2 my-auto justify-between">
                                            <span className=" text-xs my-auto font-medium">{name}</span>
                                            <p>↗</p>
                                        </div>
                                    )
                                }
                            </Link>
                        ))}
                    </div>
                </div> */}
            </div>
        </div>
    );
}