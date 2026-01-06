import { createContext, useContext, useState, useEffect } from 'react';

const isMobileContext = createContext<boolean | undefined>(undefined);

export function IsMobileContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 600);

    window.addEventListener("resize", function () {
        setIsMobile(window.innerWidth <= 600);
    });

    return <isMobileContext.Provider value={isMobile}>{children}</isMobileContext.Provider>;
}

export const useIsMobileContext = () => {
    const context = useContext(isMobileContext);
    if (context === undefined) throw new Error('Cannot use drawer tabs context outside of provider!');
    return context;
};
