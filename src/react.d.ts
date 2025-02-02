import 'react'; // eslint-ignore-line react/no-typos (we need this import to properly extend the type)
declare module 'react' {
	interface CSSProperties {
		// allow css variable manipulation in style prop
		[key: `--${string}`]: string | number;
	}
}
