// Differences between DrawerTabsContext:
// Global drawer interaction: tracks which concept id is selected and exposes helpers to open/close it across the list page

import { createContext, useContext, useEffect, useMemo, useState, useLayoutEffect } from 'react';

type DrawerAPIContextValue = {
    selectedId: string | null;
    setDrawerActiveId: (id: string) => void;
    closeDrawer: () => void;
    activeTab: DrawerTabType;
    setActiveTab: (tab: DrawerTabType) => void;
};
export type DrawerTabType = 'overview' | 'menu' | 'reviews' | 'specials';

const DrawerAPIContext = createContext<DrawerAPIContextValue | undefined>(undefined);

export function DrawerAPIContextProvider({ children }: { children: React.ReactNode }) {
    const [drawerConceptId, setDrawerConceptId] = useState<string | null>(() => {
        const activeId = new URL(window.location.href).searchParams.get('active_id');
        return activeId;
    });
    const [activeTab, setActiveTab] = useState<DrawerTabType>('overview');


    useLayoutEffect(() => {
        // prevent the card list from being scrolled on mobile, kind of works...
        document.body.style.overflow = drawerConceptId === null ? 'visible' : 'hidden';
    }, [drawerConceptId]);
    
    const drawerContextValue = useMemo(
        () => ({
            closeDrawer: () => {
                const newURL = new URL(window.location.href);
                newURL.searchParams.delete('active_id');
                window.history.pushState({}, '', newURL.href);
                setDrawerConceptId(null);
            },
            selectedId: drawerConceptId,
            setDrawerActiveId: (id: string) => {
                const newURL = new URL(window.location.href);
                newURL.searchParams.set('active_id', id);
                window.history.pushState({}, '', newURL.href);
                setDrawerConceptId(id);
            },
            activeTab,
            setActiveTab,
        }),
        [drawerConceptId, activeTab],
    );
    useEffect(() => {
        const popStateEventListener = () => {
            const activeId = new URL(window.location.href).searchParams.get('active_id');
            setDrawerConceptId(activeId);
        };
        window.addEventListener('popstate', popStateEventListener);
        return () => window.removeEventListener('popstate', popStateEventListener);
    }, []);
    return <DrawerAPIContext.Provider value={drawerContextValue}>{children}</DrawerAPIContext.Provider>;
}

export const useDrawerAPIContext = () => {
    const context = useContext(DrawerAPIContext);
    if (context === undefined) throw new Error('Cannot use drawer api context outside of provider!');
    return context;
};
