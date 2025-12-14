import { createContext, useContext, useMemo, useState } from 'react';

type DrawerAPIContextValue = {
    selectedConceptId: number | null;
    setDrawerConceptId: (conceptId: number) => void;
    closeDrawer: () => void;
};

const DrawerContext = createContext<DrawerAPIContextValue | undefined>(undefined);

export function DrawerAPIContextProvider({ children }: { children: React.ReactNode }) {
    const [drawerConceptId, setDrawerConceptId] = useState<number | null>(null);

    const drawerContextValue = useMemo(
        () => ({
            closeDrawer: () => setDrawerConceptId(null),
            selectedConceptId: drawerConceptId,
            setDrawerConceptId,
        }),
        [drawerConceptId],
    );
    return <DrawerContext.Provider value={drawerContextValue}>{children}</DrawerContext.Provider>;
}

export const useDrawerAPIContext = () => {
    const context = useContext(DrawerContext);
    if (context === undefined) throw new Error('Cannot use drawer context outside of provider!');
    return context;
};
