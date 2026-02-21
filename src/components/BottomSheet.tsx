import { ReactNode, useEffect, useRef, useState, useCallback, useMemo } from 'react';
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
    const [FULL, HIDDEN] = [windowHeight * 0.15, windowHeight];

    const sheetRef = useRef<HTMLDivElement | null>(null);
    const dragStartTime = useRef<number>(0);
    const dragStartY = useRef<number>(0);
    const startY = useRef<number>(0);
    const startTranslate = useRef<number>(0);
    const handleRef = useRef<HTMLButtonElement | null>(null);

    const [y, setY] = useState<number>(HIDDEN);
    const [dragging, setDragging] = useState<boolean>(false);
    const [sheetDrag, setSheetDrag] = useState<React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement> | null>(
        null,
    );

    const snapPoints = useMemo(() => [FULL, HIDDEN], [FULL, HIDDEN]);

    const hide = useCallback(() => {
        if (y !== HIDDEN) {
            setY(HIDDEN);
        }

        if (onHide) {
            setTimeout(() => {
                onHide();
            }, DELAY);
        }
    }, [y, HIDDEN, onHide]);

    const preventScroll = useCallback((e: Event) => {
        const target = e.target as HTMLElement;

        if (target.closest('[data-scrollable]')) {
            return;
        }

        e.preventDefault();
    }, []);

    const lockScroll = useCallback(() => {
        document.body.style.overflow = 'hidden';

        document.addEventListener('touchmove', preventScroll, { passive: false });
        document.addEventListener('wheel', preventScroll, { passive: false });
        document.documentElement.classList.add('scroll-lock');
    }, [preventScroll]);

    const unlockScroll = useCallback(() => {
        document.body.style.overflow = 'visible';

        document.removeEventListener('touchmove', preventScroll);
        document.removeEventListener('wheel', preventScroll);
        document.documentElement.classList.remove('scroll-lock');
    }, [preventScroll]);

    const startDrag = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        setDragging(true);

        const clientY = 'touches' in e && e.touches.length > 0 ? e.touches[0]!.clientY : 'clientY' in e ? e.clientY : 0;

        startY.current = clientY;
        startTranslate.current = y;

        dragStartTime.current = Date.now();
        dragStartY.current = clientY;
    };

    const onSheetScroll = () => {
        if (!contentRef?.current?.scrollTop && sheetDrag) {
            startDrag(sheetDrag);
        }
    };

    const startSheetDrag = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        contentRef?.current?.addEventListener('scroll', onSheetScroll);
        setSheetDrag(e);
        if (!contentRef?.current?.scrollTop) {
            startDrag(e);
        }
    };

    const endSheetDrag = () => {
        document.removeEventListener('scroll', onSheetScroll);
    };

    const startHandleDrag = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        if (contentRef?.current?.scrollTop) {
            startDrag(e);
        }
    };

    useEffect(() => {
        if (active) {
            lockScroll();
            setY(FULL);
        } else {
            unlockScroll();
        }
    }, [active, FULL, HIDDEN, lockScroll, unlockScroll]);

    useEffect(() => {
        const onMove = (e: MouseEvent | TouchEvent) => {
            if (!dragging) return;

            const clientY =
                'touches' in e && e.touches.length > 0 ? e.touches[0]!.clientY : 'clientY' in e ? e.clientY : 0;

            let next = startTranslate.current + (clientY - startY.current);
            next = Math.max(FULL, Math.min(next, HIDDEN));

            setY(next);
        };

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
        };

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
    }, [dragging, y, snapPoints, FULL, HIDDEN, hide]);

    return (
        <>
            {active && y !== HIDDEN && (
                <button className={`${styles.dim}`} onClick={hide} aria-label="Close bottom sheet" type="button" />
            )}

            {active && (
                <div
                    onMouseDown={startSheetDrag}
                    onMouseUp={endSheetDrag}
                    onTouchStart={startSheetDrag}
                    onTouchEnd={endSheetDrag}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') hide();
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label="Draggable bottom sheet"
                    style={{ outline: 'none' }}
                >
                    <div
                        ref={sheetRef}
                        role="dialog"
                        aria-modal="true"
                        className={styles.bottomSheet}
                        style={{
                            transform: `translateY(${y}px)`,
                            transition: dragging ? 'none' : 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1)',
                        }}
                    >
                        <button
                            type="button"
                            aria-label="Bottom sheet handle"
                            ref={handleRef}
                            className={styles.handleContainer}
                            onMouseDown={startHandleDrag}
                            onTouchStart={startHandleDrag}
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
                            <div className={styles.navbarPadding} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
