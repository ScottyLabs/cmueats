import { useContext, createContext, useLayoutEffect, useMemo } from 'react';
import { useCurrentTime } from './contexts/NowContext';

type Theme = 'none' | 'miku' | 'april-fools' | 'collegecart';
interface ThemeContextType {
    theme: Theme;
}
const ThemeContext = createContext<ThemeContextType>({ theme: 'none' });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const now = useCurrentTime();
    const IS_MIKU_DAY = (now.month === 3 && now.day === 9) || window.location.href.includes('force-miku-day');
    const IS_APRIL_FOOLS_DAY =
        (now.month === 4 && now.day === 1) || window.location.href.includes('force-april-fools-day');
    const IS_COLLEGECART_DAY =
        (now.month === 4 && now.day >= 11 && now.day <= 13) ||
        window.location.href.includes('force-collegecart');

    const ctx: ThemeContextType = useMemo(
        () => ({
            theme: IS_APRIL_FOOLS_DAY
                ? 'april-fools'
                : IS_COLLEGECART_DAY
                  ? 'collegecart'
                  : IS_MIKU_DAY
                    ? 'miku'
                    : 'none',
        }),
        [IS_MIKU_DAY, IS_APRIL_FOOLS_DAY, IS_COLLEGECART_DAY],
    );

    useLayoutEffect(() => {
        document.body.classList.remove('collegecart', 'miku', 'april-fools');
        if (ctx.theme !== 'none') {
            document.body.classList.add(ctx.theme);
        }
    }, [ctx.theme]);

    return <ThemeContext.Provider value={ctx}>{children}</ThemeContext.Provider>;
}
export function useThemeContext() {
    const theme = useContext(ThemeContext);
    return theme;
}
