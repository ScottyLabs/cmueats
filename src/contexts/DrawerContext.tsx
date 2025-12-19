import { createContext, useContext, useMemo, useState } from 'react';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';

export type DrawerTabType = 'overview' | 'menu' | 'reviews' | 'specials';

export type DrawerAPIContextValue = {
    activeTab: DrawerTabType;
    setActiveTab: (tab: DrawerTabType) => void;
    location: IReadOnlyLocation_Combined;
};

const DrawerContext = createContext<DrawerAPIContextValue | undefined>(undefined);

export function DrawerContextProvider({
    children,
    location,
}: {
    children: React.ReactNode;
    location: IReadOnlyLocation_Combined;
}) {
    const [activeTab, setActiveTab] = useState<DrawerTabType>('overview');
    const drawerContextValue = useMemo(
        () => ({
            activeTab,
            setActiveTab,
            location,
        }),
        [activeTab, location],
    );
    return <DrawerContext.Provider value={drawerContextValue}>{children}</DrawerContext.Provider>;
}

export const useDrawerContext = () => {
    const context = useContext(DrawerContext);
    if (context === undefined) throw new Error('Cannot use drawer context outside of provider!');
    return context;
};
