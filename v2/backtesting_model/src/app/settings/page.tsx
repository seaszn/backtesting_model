'use client'


import { LIGHT_THEME, useTheme } from "@/lib/hooks/useTheme";
import { Button } from "@nextui-org/react";

export default function Chart() {
    const theme = useTheme();

    function test() {
        theme.select(LIGHT_THEME)

        console.log(theme.current())
    }
    return (
        <div className="page" style={{background: theme.current()!.backgroundColor}}>
            <h1>SETTINGS done here</h1>
            {/* <Button onClick={(E) => test()}>tEST</Button> */}
        </div>
    )
}
