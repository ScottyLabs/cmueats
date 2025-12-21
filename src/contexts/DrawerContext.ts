import { createContext } from 'react';
import { ILocation_Full } from '../types/locationTypes';

export type TabType = 'overview' | 'menu' | 'reviews' | 'specials';

export type DrawerContextValue = {
    isDrawerActive: boolean;
    setIsDrawerActive: (active: boolean) => void;
    drawerLocation: ILocation_Full | null;
    setDrawerLocation: (location: ILocation_Full | null) => void;
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
};

export const DrawerContext = createContext<DrawerContextValue>({
    isDrawerActive: false,
    setIsDrawerActive: () => {},
    drawerLocation: null,
    setDrawerLocation: () => {},
    activeTab: 'overview',
    setActiveTab: () => {},
});
