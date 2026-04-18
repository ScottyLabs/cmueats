import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

export type UserCoordinates = { latitude: number; longitude: number };

type UserLocationContextValue = {
    userCoordinates: UserCoordinates | null;
    requestUserCoordinates: () => void;
};

const UserLocationContext = createContext<UserLocationContextValue | undefined>(undefined);

export function UserLocationContextProvider({ children }: { children: React.ReactNode }) {
    const [userCoordinates, setUserCoordinates] = useState<UserCoordinates | null>(null);
    const isFetchingCoordinates = useRef(false);

    const requestUserCoordinates = useCallback(() => {
        if (!navigator.geolocation || isFetchingCoordinates.current || userCoordinates !== null) return;
        isFetchingCoordinates.current = true;
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                setUserCoordinates({ latitude: coords.latitude, longitude: coords.longitude });
                isFetchingCoordinates.current = false;
            },
            () => {
                isFetchingCoordinates.current = false;
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
            },
        );
    }, [userCoordinates]);

    const value = useMemo(
        () => ({ userCoordinates, requestUserCoordinates }),
        [userCoordinates, requestUserCoordinates],
    );

    return <UserLocationContext.Provider value={value}>{children}</UserLocationContext.Provider>;
}

export function useUserLocation() {
    const context = useContext(UserLocationContext);
    if (context === undefined) throw new Error('useUserLocation must be used within UserLocationContextProvider');
    return context;
}
