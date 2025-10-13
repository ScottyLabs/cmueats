import { createContext } from 'react';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';

export type TabType = 'description' | 'menu' | 'reviews' | 'specials';

export type DrawerContextValue = {
    isDrawerActive: boolean;
    setIsDrawerActive: (active: boolean) => void;
    drawerLocation: IReadOnlyLocation_Combined | null;
    setDrawerLocation: (location: IReadOnlyLocation_Combined | null) => void;
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
};

export const DrawerContext = createContext<DrawerContextValue>({
    isDrawerActive: false,
    setIsDrawerActive: () => {},
    drawerLocation: null,
    setDrawerLocation: () => {},
    activeTab: 'description',
    setActiveTab: () => {},
});
