import { createContext, RefObject, useContext, useEffect, useLayoutEffect, useState } from 'react';

const DrawerWidthContext = createContext<number | undefined>(undefined);
export function WidthProvider({
    elementToCheckRef,
    children,
}: {
    elementToCheckRef: RefObject<HTMLElement | null>;
    children: React.ReactNode;
}) {
    // What width media queries test is window.innerWidth, which is what you're in essence using now.
    // https://stackoverflow.com/a/18548239/13171687
    const [width, setWidth] = useState(0);

    useLayoutEffect(() => {
        const controller = new AbortController();
        if (elementToCheckRef.current) {
            setWidth(elementToCheckRef.current?.getBoundingClientRect().width);
        }

        window.addEventListener(
            'resize',
            () => {
                if (!elementToCheckRef.current) return;
                setWidth(elementToCheckRef.current.getBoundingClientRect().width);
            },
            { signal: controller.signal },
        );
        return () => controller.abort();
    }, []);
    return <DrawerWidthContext value={width}>{children}</DrawerWidthContext>;
}
export function useContainerWidth() {
    const width = useContext(DrawerWidthContext);
    if (width === undefined) throw new Error('Should use inside WidthContext!');
    return width;
}
