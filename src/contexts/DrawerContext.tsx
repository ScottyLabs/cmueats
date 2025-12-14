import { createContext, useContext, useMemo, useState } from 'react';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';

export type DrawerTabType = 'overview' | 'menu' | 'reviews' | 'specials';

export type DrawerContextValue = {
    drawerLocation: IReadOnlyLocation_Combined | null;
    setDrawerConceptId: (conceptId: number | null) => void;
    activeTab: DrawerTabType;
    setActiveTab: (tab: DrawerTabType) => void;
    closeDrawer: () => void;
};

const DrawerContext = createContext<DrawerContextValue | undefined>(undefined);

export function DrawerContextProvider({
    children,
    locations,
}: {
    children: React.ReactNode;
    locations: IReadOnlyLocation_Combined[] | undefined;
}) {
    const [drawerConceptId, setDrawerConceptId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<DrawerTabType>('overview');

    const drawerContextValue = useMemo(
        () => ({
            drawerLocation: locations?.find((loc) => loc.conceptId === drawerConceptId) ?? null,
            closeDrawer: () => setDrawerConceptId(null),
            setDrawerConceptId,
            activeTab,
            setActiveTab,
        }),
        [locations, drawerConceptId, activeTab],
    );
    return <DrawerContext.Provider value={drawerContextValue}>{children}</DrawerContext.Provider>;
}

export const useDrawerContext = () => {
    const context = useContext(DrawerContext);
    if (context === undefined) throw new Error('Cannot use drawer context outside of provider!');
    return context;
};
