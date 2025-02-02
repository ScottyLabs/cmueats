import 'react';

declare module 'react' {
	interface CSSProperties {
		// allow css variable manipulation in style prop
		[key: `--${string}`]: string | number;
	}
}
