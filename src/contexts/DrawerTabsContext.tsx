import { createContext, useContext, useMemo, useState } from 'react';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';

export type DrawerTabType = 'overview' | 'menu' | 'reviews' | 'specials';

export type DrawerTabsContextValue = {
    activeTab: DrawerTabType;
    setActiveTab: (tab: DrawerTabType) => void;
    location: IReadOnlyLocation_Combined;
};

const DrawerTabsContext = createContext<DrawerTabsContextValue | undefined>(undefined);

export function DrawerTabsContextProvider({
    children,
    location,
}: {
    children: React.ReactNode;
    location: IReadOnlyLocation_Combined;
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
