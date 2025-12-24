import { createContext, useContext, useMemo, useState } from 'react';

type DrawerOpennessContextValue = {
    selectedConceptId: number | null;
    setDrawerConceptId: (conceptId: number) => void;
    closeDrawer: () => void;
};

const DrawerOpennessContext = createContext<DrawerOpennessContextValue | undefined>(undefined);

export function DrawerOpennessContextProvider({ children }: { children: React.ReactNode }) {
    const [drawerConceptId, setDrawerConceptId] = useState<number | null>(null);

    const drawerContextValue = useMemo(
        () => ({
            closeDrawer: () => setDrawerConceptId(null),
            selectedConceptId: drawerConceptId,
            setDrawerConceptId,
        }),
        [drawerConceptId],
    );
    return <DrawerOpennessContext.Provider value={drawerContextValue}>{children}</DrawerOpennessContext.Provider>;
}

export const useDrawerOpennessContext = () => {
    const context = useContext(DrawerOpennessContext);
    if (context === undefined) throw new Error('Cannot use drawer openness context outside of provider!');
    return context;
};
