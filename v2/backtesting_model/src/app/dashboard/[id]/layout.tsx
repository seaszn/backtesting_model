import { ParentComponentProperties } from "@/app/types";

export default function DashboardLayout(properties: ParentComponentProperties) {
    return (
        <div className="w-full min-h-screen grid gap-1 dark:bg-zinc-700 bg-zinc-300 grid-rows-2 grid-cols-2" style={{ gridTemplateRows: "2rem 1fr", gridTemplateColumns: "3rem 1fr 3rem" }}>
            <div className="h-8 col-span-3 dark:bg-zinc-900 bg-zinc-100">

            </div>
            <div className="dark:bg-zinc-900 bg-zinc-100 rounded-tr-md">

            </div>
            <div className="dark:bg-zinc-900 bg-zinc-100 rounded-t-md">

            </div>

            <div className="dark:bg-zinc-900 bg-zinc-100 rounded-tl-md">

            </div>

            {/* <div className="min-h-screen w-12 bg-blue-400 border-r-4 "></div> */}
            {/* {properties.children} */}
        </div>
    )
}