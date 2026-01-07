import { DateTime } from 'luxon';
import { createContext, useContext, useEffect, useState } from 'react';

const NowContext = createContext<DateTime | undefined>(undefined);

/**
 * One clock for the entire app, for consistency (do we need to memoize `now`?)
 */
export function NowContextProvider({ children }: { children: React.ReactNode }) {
    const [now, setNow] = useState(DateTime.now().setZone('America/New_York'));
    useEffect(() => {
        const intervalId = setInterval(() => setNow(DateTime.now().setZone('America/New_York')), 1000);
        return () => clearInterval(intervalId);
    }, []);
    return <NowContext.Provider value={now}>{children}</NowContext.Provider>;
}

export const useCurrentTime = () => {
    const now = useContext(NowContext);
    if (now === undefined) throw new Error('please use this hook inside the NowContextProvider');
    return now;
};
