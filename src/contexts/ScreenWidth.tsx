import { createContext, RefObject, useContext, useLayoutEffect, useState } from 'react';

export const WidthContext = createContext<number | undefined>(undefined);
export function useWidth(elementToCheckRef: RefObject<HTMLElement | null>, isOpen: boolean) {
    const [width, setWidth] = useState(0);

    useLayoutEffect(() => {
        const controller = new AbortController();
        if (elementToCheckRef.current) {
            setWidth(elementToCheckRef.current.getBoundingClientRect().width);
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
    }, [isOpen, elementToCheckRef]);
    return width;
}

export function useContainerWidth() {
    const width = useContext(WidthContext);
    if (width === undefined) throw new Error('Should use inside WidthContext!');
    return width;
}
