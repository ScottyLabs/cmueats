// Differences between DrawerTabsContext:
// Global drawer interaction: tracks which concept id is selected and exposes helpers to open/close it across the list page

import { createContext, useContext, useMemo, useState } from 'react';

type DrawerAPIContextValue = {
    selectedId: string | null;
    setDrawerActiveId: (id: string) => void;
    closeDrawer: () => void;
};

const DrawerAPIContext = createContext<DrawerAPIContextValue | undefined>(undefined);

export function DrawerAPIContextProvider({ children }: { children: React.ReactNode }) {
    const [drawerConceptId, setDrawerConceptId] = useState<string | null>(null);
    const drawerContextValue = useMemo(
        () => ({
            closeDrawer: () => setDrawerConceptId(null),
            selectedId: drawerConceptId,
            setDrawerActiveId: setDrawerConceptId,
        }),
        [drawerConceptId],
    );
    return <DrawerAPIContext.Provider value={drawerContextValue}>{children}</DrawerAPIContext.Provider>;
}

export const useDrawerAPIContext = () => {
    const context = useContext(DrawerAPIContext);
    if (context === undefined) throw new Error('Cannot use drawer api context outside of provider!');
    return context;
};
