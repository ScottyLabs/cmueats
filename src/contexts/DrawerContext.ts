import { createContext } from 'react';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';

export type DrawerContextValue = {
    isDrawerActive: boolean;
    setIsDrawerActive: (active: boolean) => void;
    drawerLocation: IReadOnlyLocation_Combined | null;
    setDrawerLocation: (location: IReadOnlyLocation_Combined | null) => void;
};

export const DrawerContext = createContext<DrawerContextValue>({
    isDrawerActive: false,
    setIsDrawerActive: () => {},
    drawerLocation: null,
    setDrawerLocation: () => {},
});
