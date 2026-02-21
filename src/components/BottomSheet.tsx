import { ReactNode, useEffect, useRef, useState, useCallback } from 'react';
import styles from './BottomSheet.module.css';

type BottomSheetProps = {
    children: ReactNode;
    active: boolean;
    onHide?: () => void;
};

export default function BottomSheet({ children, active, onHide }: BottomSheetProps) {
    const contentRef = useRef<HTMLDivElement | null>(null);
    const DELAY = 100;
    const windowHeight = window.innerHeight;
    const [FULL, HIDDEN] = [
        windowHeight * 0.15,
        windowHeight
    ];
    const snapPoints = [FULL, HIDDEN];

    const sheetRef = useRef<HTMLDivElement | null>(null);
    const pointerStart = useRef<{ x: number; y: number } | null>(null);
    const moved = useRef(false);
    const dragStartTime = useRef<number>(0);
    const dragStartY = useRef<number>(0);
    const startY = useRef<number>(0);
    const startTranslate = useRef<number>(0);
    const handleRef = useRef<HTMLButtonElement | null>(null);

    const [y, setY] = useState<number>(HIDDEN);
    const [dragging, setDragging] = useState<boolean>(false);
    const [dragging2, setDragging2] = useState<React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement> | null>(null);

    useEffect(() => {
        const onMove = (e: MouseEvent | TouchEvent) => {
            if (!dragging) return;

            const clientY =
                'touches' in e && e.touches.length > 0 ? e.touches[0]!.clientY : 'clientY' in e ? e.clientY : 0;

            let next = startTranslate.current + (clientY - startY.current);
            next = Math.max(FULL, Math.min(next, HIDDEN));

            setY(next);
        }

        const onEnd = (e: MouseEvent | TouchEvent) => {
            if (!dragging) return;
            setDragging(false);

            const clientY =
                'changedTouches' in e && e.changedTouches.length > 0
                    ? e.changedTouches[0]!.clientY
                    : 'clientY' in e
                      ? e.clientY
                      : startY.current;

            const endTime = Date.now();
            const dt = endTime - dragStartTime.current;
            const dy = clientY - dragStartY.current;

            const velocity = dy / dt;
            const FLICK_THRESHOLD = 0.6;

            let target: number;

            if (Math.abs(velocity) > FLICK_THRESHOLD) {
                if (velocity > 0) {
                    target = snapPoints.find((p) => p > y) ?? HIDDEN;
                } else {
                    target = [...snapPoints].reverse().find((p) => p < y) ?? FULL;
                }
            } else {
                target = snapPoints.reduce((a, b) => (Math.abs(b - y) < Math.abs(a - y) ? b : a));
            }

            setY(target);
            if (target === HIDDEN) {
                hide();
            }
        }

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);
        window.addEventListener('touchmove', onMove);
        window.addEventListener('touchend', onEnd);

        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onEnd);
            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('touchend', onEnd);
        };
    }, [dragging, y, snapPoints, FULL, HIDDEN]);

    const preventScroll = useCallback((e: Event) => {
        const target = e.target as HTMLElement;

        if (target.closest('[data-scrollable]')) {
            return;
        }

        e.preventDefault();
    }, []);

    const lockScroll = () => {
        document.body.style.overflow = 'hidden';
        
        document.addEventListener('touchmove', preventScroll, {passive: false});
        document.addEventListener('wheel', preventScroll, {passive: false});
        document.documentElement.classList.add('scroll-lock');
    }

    const unlockScroll = () => {
        document.body.style.overflow = 'visible';

        document.removeEventListener('touchmove', preventScroll);
        document.removeEventListener('wheel', preventScroll);
        document.documentElement.classList.remove('scroll-lock');
    }

    useEffect(() => {
        if (active) {
            lockScroll();
            setY(FULL);
        }
        else {
            unlockScroll();
        }
    }, [active, HIDDEN]);

    const startDrag = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        setDragging(true);

        const clientY = 'touches' in e && e.touches.length > 0 ? e.touches[0]!.clientY : 'clientY' in e ? e.clientY : 0;

        startY.current = clientY;
        startTranslate.current = y;

        dragStartTime.current = Date.now();
        dragStartY.current = clientY;
    }

    const hide = () => {
        if (y != HIDDEN) {
            setY(HIDDEN);
        }
            
        if (onHide) {
            setTimeout(() => {
                onHide();
            }, DELAY);
        }
    }

    const onSheetScroll = (e: Event) => {
        if (!(contentRef?.current?.scrollTop) && dragging2) {
            startDrag(dragging2);
        }
    }

    const startSheetDrag = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        contentRef?.current?.addEventListener("scroll", onSheetScroll);
        setDragging2(e);
        if (!(contentRef?.current?.scrollTop)) {
            startDrag(e);
        }
    }

    const endSheetDrag = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        document.removeEventListener('scroll', onSheetScroll);
    }

    const startHandleDrag = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        if ((contentRef?.current?.scrollTop)) {
            startDrag(e);
        }
    }

    return (
        <>
            {active && y !== HIDDEN && 
            <button 
                className={`${styles.dim}`} 
                onClick={hide}
            />}

            {active && (
                <div
                    onMouseDown = {startSheetDrag}
                    onMouseUp = {endSheetDrag}
                    onTouchStart = {startSheetDrag}
                    onTouchEnd = {endSheetDrag}
                    role="dialog"
                    ref={sheetRef}
                    className={`${styles.bottomSheet} `}
                    style={{
                        transform: `translateY(${y}px)`,
                        transition: dragging ? 'none' : 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                >
                    <button
                        type="button"
                        ref={handleRef}
                        className={styles.handleContainer}
                        onMouseDown = {startHandleDrag}
                        onTouchStart = {startHandleDrag}
                    >
                        <div className={styles.handle} />
                    </button>

                    <div
                        data-scrollable
                        id="bottom-sheet-content"
                        className={styles.content}
                        ref={contentRef}
                        style={{
                            height: `calc(100vh - ${y}px - 41px)`, // 41px = handle
                            overflowY: 'auto',
                        }}
                    >
                        {children}
                        <div className={styles.navbarPadding}></div>
                    </div>
                </div>
            )}
        </>
    );
}
