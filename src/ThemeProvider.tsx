import {
	useState,
	useContext,
	createContext,
	useLayoutEffect,
	useMemo,
} from 'react';
import IS_MIKU_DAY, { IS_APRIL_FOOLS } from './util/constants';

type Theme = 'none' | 'miku' | 'april-fools';

const ThemeContext = createContext<{
	theme: Theme;
	updateTheme: (theme: Theme) => void;
}>({ theme: 'none', updateTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>(() => {
		if (IS_APRIL_FOOLS) return 'april-fools';
		if (IS_MIKU_DAY && localStorage.getItem('theme') === 'miku')
			return 'miku';
		return 'none';
	});

	useLayoutEffect(() => {
		document.body.className = theme;
	}, [theme]);

	const updateTheme = (_theme: Theme) => {
		try {
			localStorage.setItem('theme', _theme);
		} catch (e) {
			console.error(e);
		}
		setTheme(_theme);
	};
	const exportedContext = useMemo(
		() => ({ theme, updateTheme }),
		[theme, updateTheme],
	);
	// listen for localstorage changes
	return (
		<ThemeContext.Provider value={exportedContext}>
			{children}
		</ThemeContext.Provider>
	);
}
export function useTheme() {
	const theme = useContext(ThemeContext);
	return theme;
}
