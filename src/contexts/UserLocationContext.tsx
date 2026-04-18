import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type UserCoordinates = { latitude: number; longitude: number };

type UserLocationContextValue = {
    userCoordinates: UserCoordinates | null;
    requestUserCoordinates: () => void;
};

const UserLocationContext = createContext<UserLocationContextValue | undefined>(undefined);

export function UserLocationContextProvider({ children }: { children: React.ReactNode }) {
    const [userCoordinates, setUserCoordinates] = useState<UserCoordinates | null>(null);
    const [isFetchingCoordinates, setIsFetchingCoordinates] = useState(false);

    const requestUserCoordinates = useCallback(() => {
        if (!navigator.geolocation || isFetchingCoordinates || userCoordinates !== null) return;
        setIsFetchingCoordinates(true);
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                setUserCoordinates({ latitude: coords.latitude, longitude: coords.longitude });
                setIsFetchingCoordinates(false);
            },
            () => {
                setIsFetchingCoordinates(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
            },
        );
    }, [isFetchingCoordinates, userCoordinates]);

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
