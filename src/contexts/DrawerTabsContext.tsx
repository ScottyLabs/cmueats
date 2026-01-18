// Differences between DrawerAPIContext:
// Per-drawer view interaction: holds location data for currently open drawer (tab selection has been changed to a global drawer API attr.)

import { createContext, useContext, useMemo } from 'react';
import { ILocation_Full } from '../types/locationTypes';

export type DrawerTabsContextValue = {
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
    const drawerTabsContextValue = useMemo(
        () => ({
            location,
        }),
        [location],
    );
    return <DrawerTabsContext.Provider value={drawerTabsContextValue}>{children}</DrawerTabsContext.Provider>;
}

export const useDrawerTabsContext = () => {
    const context = useContext(DrawerTabsContext);
    if (context === undefined) throw new Error('Cannot use drawer tabs context outside of provider!');
    return context;
};
