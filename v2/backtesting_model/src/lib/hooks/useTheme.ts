'client side'

import { useState, useEffect } from "react"
import { singletonHook } from "react-singleton-hook"

export interface Theme {
    backgroundColor: string,
    gridColor: string,
    textColor: string,
    htmlClass: string,
}

export const LIGHT_THEME: Theme = {
    backgroundColor: "#f5f5f4",
    gridColor: "#e7e5e4",
    textColor: "#000000",
    htmlClass: ""
}

export const DARK_THEME: Theme = {
    backgroundColor: '#1c1917',
    gridColor: "#44403c",
    textColor: "#ffffff",
    htmlClass: "dark"
}

function select(theme: Theme) {
    localStorage.setItem("theme", JSON.stringify(theme))
}

function current(): Theme {
    const result = localStorage.getItem("theme")

    if (result == null) {
        select(DARK_THEME)
        return DARK_THEME;
    }
    else {
        return JSON.parse(result)!;
    }
}

const initState = {
    all: [LIGHT_THEME, DARK_THEME],
    current,
    select,
}

const useUserTheme = () => {
    const [state, setState] = useState(initState);

    useEffect(() => {
        setState({
            all: initState.all,
            current,
            select,
        });
    }, []);

    return state;
};

export const useTheme = singletonHook(initState, useUserTheme);