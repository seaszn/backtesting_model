import { invoke } from "@tauri-apps/api/tauri";
import { stat } from "fs";
import { useEffect, useState } from "react";
import { singletonHook } from "react-singleton-hook";
import { Session, SessionHandler } from "./types";

const STORAGE_HANDLES = {
    storage: {
        session: "session"
    }
}

const INIT_SESSION: Session = {
    dashboards: []
}

function getSession(): Session {
    const storageResponse = localStorage.getItem(STORAGE_HANDLES.storage.session);

    if (storageResponse == null) {
        updateSession(INIT_SESSION)
        return INIT_SESSION
    }
    else {
        return JSON.parse(storageResponse);
    }
}

function updateSession(state: Session) {
    localStorage.setItem(STORAGE_HANDLES.storage.session, JSON.stringify(state));
}

export function useSession() {
    return {
        current: () => getSession(),
        update: (state: Session) => updateSession(state)
    }
}

export type { Session }