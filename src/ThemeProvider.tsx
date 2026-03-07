import { useContext, createContext, useLayoutEffect } from 'react';
import { useCurrentTime } from './contexts/NowContext';

type Theme = 'none' | 'miku';

const ThemeContext = createContext<{
    theme: Theme;
}>({ theme: 'none' });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const now = useCurrentTime();
    const IS_MIKU_DAY = (now.month === 3 && now.day === 9) || window.location.href.includes('force-miku-day');
    const theme: Theme = IS_MIKU_DAY ? 'miku' : 'none';
    useLayoutEffect(() => {
        document.body.className = theme;
    }, [theme]);

    // eslint-disable-next-line react/jsx-no-constructed-context-values
    return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>;
}
export function useThemeContext() {
    const theme = useContext(ThemeContext);
    return theme;
}
