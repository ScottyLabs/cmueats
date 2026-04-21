import { createContext, useContext, useState, useEffect } from 'react';

const isMobileContext = createContext<boolean | undefined>(undefined);

export function IsMobileContextProvider({ children }: { children: React.ReactNode }) {
    const isTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const [isMobile, setIsMobile] = useState(isTouchScreen && window.innerWidth <= 900);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(isTouchScreen && window.innerWidth <= 900);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isTouchScreen]);

    return <isMobileContext.Provider value={isMobile}>{children}</isMobileContext.Provider>;
}

export const useIsMobileContext = () => {
    const context = useContext(isMobileContext);
    if (context === undefined) throw new Error('Cannot use drawer tabs context outside of provider!');
    return context;
};
