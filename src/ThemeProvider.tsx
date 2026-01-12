import { useState, useContext, createContext, useLayoutEffect, useMemo } from 'react';
import IS_MIKU_DAY from './util/constants';
import { safeGetItem, safeSetItem } from './util/safeStorage';

type Theme = 'none' | 'miku';

const ThemeContext = createContext<{
    theme: Theme;
    updateTheme: (theme: Theme) => void;
}>({ theme: 'none', updateTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => (IS_MIKU_DAY && safeGetItem('theme') === 'miku' ? 'miku' : 'none'));
    useLayoutEffect(() => {
        document.body.className = theme;
    }, [theme]);

    const exportedContext = useMemo(
        () => ({
            theme,
            updateTheme: (_theme: Theme) => {
                safeSetItem('theme', _theme);
                setTheme(_theme);
            },
        }),
        [theme],
    );
    // listen for localstorage changes
    return <ThemeContext.Provider value={exportedContext}>{children}</ThemeContext.Provider>;
}
export function useThemeContext() {
    const theme = useContext(ThemeContext);
    return theme;
}
