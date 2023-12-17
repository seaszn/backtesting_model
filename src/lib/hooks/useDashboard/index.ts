import { useSession } from "../useSession";

export interface Dashboard {
    id: string,
    type?: string,
}

export function useDashboard(id: string) {
    const session = useSession();

    function updateDashboard(dashboard: Dashboard) {
        const currentDashboards = session.current().dashboards.filter(x => x.id != id);
        session.update({
            ...session.current(),
            dashboards: [...currentDashboards, dashboard]
        })
    }

    function currentDashboard(): Dashboard {
        const current = session.current().dashboards.find(x => x.id == id);

        if(current != undefined){
            return current;
        }
        else {
            return{
                id: id,
                type: undefined
            }
        }
    }

    return {
        update: (dasboard: Dashboard) => updateDashboard(dasboard),
        current: () => currentDashboard()
    }
}