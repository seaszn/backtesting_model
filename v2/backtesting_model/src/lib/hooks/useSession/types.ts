import { Dashboard } from "../useDashboard"

export interface SessionHandler {
    current: () => Session
    update: (state: Session) => void
}

export interface Session {
    dashboards: Dashboard[]
}