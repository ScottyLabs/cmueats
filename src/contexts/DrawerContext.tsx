import { createContext } from 'react';
import { IReadOnlyLocation_Combined } from '../types/locationTypes';

type DrawerContextValue = {
    isDrawerActive: boolean;
    setIsDrawerActive: (active: boolean) => void;
    drawerLocation: IReadOnlyLocation_Combined | null;
    setDrawerLocation: (location: IReadOnlyLocation_Combined | null) => void;
};

const DrawerContext = createContext<DrawerContextValue>({
    isDrawerActive: false,
    setIsDrawerActive: () => {},
    drawerLocation: null,
    setDrawerLocation: () => {},
});

export default DrawerContext;
