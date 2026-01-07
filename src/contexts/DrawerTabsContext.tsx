// Differences between DrawerAPIContext:
// Per-drawer view interaction: holds tab selection and location data for currently open drawer

import { createContext, useContext, useMemo, useState } from 'react';
import { ILocation_Full } from '../types/locationTypes';

export type DrawerTabType = 'overview' | 'menu' | 'reviews' | 'specials';

export type DrawerTabsContextValue = {
    activeTab: DrawerTabType;
    setActiveTab: (tab: DrawerTabType) => void;
    location: ILocation_Full;
};

const DrawerTabsContext = createContext<DrawerTabsContextValue | undefined>(undefined);

export function DrawerTabsContextProvider({
    children,
    location,
}: {
    children: React.ReactNode;
    location: ILocation_Full;
}) {
    const [activeTab, setActiveTab] = useState<DrawerTabType>('overview');
    const drawerTabsContextValue = useMemo(
        () => ({
            activeTab,
            setActiveTab,
            location,
        }),
        [activeTab, location],
    );
    return <DrawerTabsContext.Provider value={drawerTabsContextValue}>{children}</DrawerTabsContext.Provider>;
}

export const useDrawerTabsContext = () => {
    const context = useContext(DrawerTabsContext);
    if (context === undefined) throw new Error('Cannot use drawer tabs context outside of provider!');
    return context;
};
