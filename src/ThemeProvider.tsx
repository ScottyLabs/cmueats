import { useContext, createContext, useMemo } from 'react';
import { useCurrentTime } from './contexts/NowContext';

type Theme = 'none' | 'miku';
interface ThemeContextType {
    theme: Theme;
}
const ThemeContext = createContext<ThemeContextType>({ theme: 'none' });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const now = useCurrentTime();
    const IS_MIKU_DAY = (now.month === 3 && now.day === 9) || window.location.href.includes('force-miku-day');
    const ctx: ThemeContextType = useMemo(() => ({ theme: IS_MIKU_DAY ? 'miku' : 'none' }), [IS_MIKU_DAY]);

    return <ThemeContext.Provider value={ctx}>{children}</ThemeContext.Provider>;
}
export function useThemeContext() {
    const theme = useContext(ThemeContext);
    return theme;
}
