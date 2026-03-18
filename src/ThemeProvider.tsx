import { useContext, createContext, useMemo } from 'react';
import { useCurrentTime } from './contexts/NowContext';
import { DateTime } from 'luxon';

type Theme = 'none' | 'miku' | 'easter';
interface ThemeContextType {
    theme: Theme;
}
const ThemeContext = createContext<ThemeContextType>({ theme: 'none' });

// Easter dates for upcoming years (Easter is a movable feast)
const EASTER_DATES: { [year: number]: { month: number; day: number } } = {
    2025: { month: 4, day: 20 },
    2026: { month: 4, day: 5 },
    2027: { month: 3, day: 28 },
    2028: { month: 4, day: 16 },
    2029: { month: 4, day: 1 },
    2030: { month: 4, day: 21 },
};

function isEaster(dateTime: DateTime): boolean {
    const year = dateTime.year;
    const easter = EASTER_DATES[year];
    if (!easter) return false;
    return dateTime.month === easter.month && dateTime.day === easter.day;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const now = useCurrentTime();
    const IS_MIKU_DAY = (now.month === 3 && now.day === 9) || window.location.href.includes('force-miku-day');
    const IS_EASTER = isEaster(now) || window.location.href.includes('force-easter');

    const ctx: ThemeContextType = useMemo(() => {
        if (IS_MIKU_DAY) return { theme: 'miku' };
        if (IS_EASTER) return { theme: 'easter' };
        return { theme: 'none' };
    }, [IS_MIKU_DAY, IS_EASTER]);

    return <ThemeContext.Provider value={ctx}>{children}</ThemeContext.Provider>;
}
export function useThemeContext() {
    const theme = useContext(ThemeContext);
    return theme;
}
