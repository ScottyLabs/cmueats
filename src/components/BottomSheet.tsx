import { ReactNode, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import styles from './BottomSheet.module.css';

type BottomSheetProps = {
    children: ReactNode;
    active: boolean;
    onHide?: () => void;
};

export default function BottomSheet({ children, active, onHide }: BottomSheetProps) {
    const hideSheetDelay = 100;
    const windowHeight = window.innerHeight;
    const FULL = windowHeight * 0.15;
    const HIDDEN = windowHeight;

    const contentRef = useRef<HTMLDivElement | null>(null);
    const sheetRef = useRef<HTMLDivElement | null>(null);
    const dragStartTime = useRef(0);
    const dragStartY = useRef(0);
    const startY = useRef(0);
    const startTranslate = useRef(0);
    const handleRef = useRef<HTMLButtonElement | null>(null);
    const hideTimeoutRef = useRef<number | null>(null);
    const activeRef = useRef(active);

    const [y, setY] = useState(HIDDEN);
    const [dragging, setDragging] = useState(false);

    //stores position of user touch/cursor
    const [sheetDrag, setSheetDrag] = useState<React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement> | null>(
        null,
    );

    const snapPoints = useMemo(() => [FULL, HIDDEN], [FULL, HIDDEN]);

    const hide = useCallback(() => {
        if (y !== HIDDEN) {
            setY(HIDDEN);
        }

        if (onHide) {
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
            }
            hideTimeoutRef.current = window.setTimeout(() => {
                onHide();
            }, hideSheetDelay);
        }
    }, [y, HIDDEN, onHide]);

    const preventScroll = useCallback((e: Event) => {
        const target = e.target as HTMLElement;

        if (target.closest('[data-scrollable]') || !activeRef.current) {
            return;
        }

        e.preventDefault();
    }, []);

    const lockScroll = useCallback(() => {
        document.body.style.overflow = 'hidden';

        document.addEventListener('touchmove', preventScroll, { passive: false });
        document.addEventListener('wheel', preventScroll, { passive: false });
    }, [preventScroll]);

    const unlockScroll = useCallback(() => {
        document.body.style.overflow = 'visible';

        document.removeEventListener('touchmove', preventScroll);
        document.removeEventListener('wheel', preventScroll);
    }, [preventScroll]);

    const startDrag = useCallback(
        (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
            setDragging(true);

            const clientY =
                'touches' in e && e.touches.length > 0 ? e.touches[0]!.clientY : 'clientY' in e ? e.clientY : 0;

            startY.current = clientY;
            startTranslate.current = y;

            dragStartTime.current = performance.now();
            dragStartY.current = clientY;
        },
        [y],
    );

    const onSheetScroll = useCallback(() => {
        if ((contentRef?.current?.scrollTop === 0) && sheetDrag && !dragging) {
            startDrag(sheetDrag);
        }
    }, [sheetDrag, startDrag, dragging]);

    const startSheetDrag = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        if (dragging) {
            return;
        }
        
        //user mouse/touch stored to allow smooth transition between scrolling and dragging
        setSheetDrag(e);

        //starts sheet dragging if user is scrolling past the top of the sheet contents
        contentRef?.current?.addEventListener('scroll', onSheetScroll); 

        if (contentRef?.current?.scrollTop === 0) {
            startDrag(e);
        }
    };

    const endSheetDrag = () => {
        contentRef?.current?.removeEventListener('scroll', onSheetScroll);
    };

    const startHandleDrag = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        if (contentRef?.current?.scrollTop) {
            startDrag(e);
        }
    };

    const onDrag = useCallback((e: MouseEvent | TouchEvent) => {
        if (!dragging) return;

        const clientY =
            'touches' in e && e.touches.length > 0 ? e.touches[0]!.clientY : 'clientY' in e ? e.clientY : 0;

        const next = Math.max(FULL, Math.min(startTranslate.current + (clientY - startY.current), HIDDEN));

        setY(next);
    }, [dragging, setY, FULL, HIDDEN]);

    const onDragEnd = useCallback((e: MouseEvent | TouchEvent) => {
        if (!dragging) return;

        setDragging(false);

        const clientY =
            'changedTouches' in e && e.changedTouches.length > 0
                ? e.changedTouches[0]!.clientY
                : 'clientY' in e
                    ? e.clientY
                    : startY.current;

        const endTime = performance.now();
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
    }, [dragging, setDragging, snapPoints, HIDDEN, FULL, y, hide]);

    useEffect(() => {
        activeRef.current = active;
        if (active) {
            lockScroll();
            setY(FULL);
        } else {
            unlockScroll();
        }
    }, [active, FULL, HIDDEN, lockScroll, unlockScroll]);

    //if dragging, starts calculating sheet position (moves sheet)
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.style.overflow = y <= FULL ? 'auto' : 'hidden';
        }

        window.addEventListener('mousemove', onDrag);
        window.addEventListener('mouseup', onDragEnd);
        window.addEventListener('touchmove', onDrag);
        window.addEventListener('touchend', onDragEnd);

        return () => {
            window.removeEventListener('mousemove', onDrag);
            window.removeEventListener('mouseup', onDragEnd);
            window.removeEventListener('touchmove', onDrag);
            window.removeEventListener('touchend', onDragEnd);
        };
    }, [dragging, y, snapPoints, FULL, HIDDEN, hide, onDragEnd, onDrag]);

    //cleanup
    useEffect(() => {
        activeRef.current = active;
        return () => {
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
            }
            unlockScroll();
        };
    }, [active, unlockScroll]);

    return (
        <>
            {active && y !== HIDDEN && (
                <button className={`${styles.dim}`} onClick={hide} aria-label="Close bottom sheet" type="button" />
            )}

            {active && (
                // oxlint-disable-next-line no-static-element-interactions
                <div
                    onMouseMove={startSheetDrag}
                    onMouseUp={endSheetDrag}
                    onTouchMove={startSheetDrag}
                    onTouchEnd={endSheetDrag}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') hide();
                    }}
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
