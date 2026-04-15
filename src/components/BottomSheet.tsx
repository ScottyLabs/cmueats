import React, { ReactNode, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import styles from './BottomSheet.module.css';
import { motion } from 'framer-motion';

type BottomSheetProps = {
    children: ReactNode;
    onHide?: () => void;
    hideSheetDelayMs?: number;
};

export default function BottomSheet({ children, onHide, hideSheetDelayMs = 450 }: BottomSheetProps) {
    useGlobalScrollLock();
    const windowHeight = useWindowHeight();
    const snapPoints = useMemo(() => [50, windowHeight], [windowHeight]);

    const contentRef = useRef<HTMLDivElement | null>(null);
    const dragMetrics = useRef({
        dragStartY: 0,
        cardStartY: 0,
        historicalClientYPos: [] as { pos: number; time: number }[], // for flick detection
    });

    const [cardY, setCardY] = useState(Math.min(...snapPoints));
    const [dragging, setDragging] = useState(false);

    const hideTimeoutRef = useRef<number | null>(null);
    const queueHideCallback = useCallback(() => {
        if (onHide) {
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
            }
            hideTimeoutRef.current = window.setTimeout(() => {
                onHide();
            }, hideSheetDelayMs);
        }
    }, [onHide, hideSheetDelayMs]);

    const startDrag = (ev: React.MouseEvent | React.TouchEvent) => {
        if (dragging) return;
        setDragging(true);
        const cursorY = getYPos(ev);
        dragMetrics.current = {
            dragStartY: cursorY,
            cardStartY: cardY,
            historicalClientYPos: [{ pos: cursorY, time: performance.now() }],
        };
    };
    const onDrag = useCallback(
        (e: MouseEvent | TouchEvent) => {
            const clientY = getYPos(e);
            const minSnapPoint = Math.min(...snapPoints);
            const maxSnapPoint = Math.max(...snapPoints);
            const newYPos = Math.max(
                minSnapPoint,
                Math.min(dragMetrics.current.cardStartY + (clientY - dragMetrics.current.dragStartY), maxSnapPoint),
            );
            dragMetrics.current.historicalClientYPos.push({ pos: clientY, time: performance.now() });

            setCardY(newYPos);
        },
        [snapPoints],
    );

    const onDragEnd = useCallback(
        (e: MouseEvent | TouchEvent) => {
            if (!dragging) return;

            setDragging(false);
            const minSnapPoint = Math.min(...snapPoints);
            const maxSnapPoint = Math.max(...snapPoints);
            const endClientY =
                'changedTouches' in e && e.changedTouches.length > 0
                    ? e.changedTouches[0]!.clientY
                    : 'clientY' in e
                      ? e.clientY
                      : 0; // cannot call getPosY because finger is no longer on the screen
            const endSheetY = Math.max(
                minSnapPoint,
                Math.min(dragMetrics.current.cardStartY + (endClientY - dragMetrics.current.dragStartY), maxSnapPoint),
            );
            dragMetrics.current.historicalClientYPos.push({
                pos: endClientY,
                time: performance.now(),
            });

            let target: number;
            const flickVelocity = getVelocity(dragMetrics.current.historicalClientYPos);
            if (Math.abs(flickVelocity) > 0.3) {
                if (flickVelocity > 0) {
                    target = snapPoints.find((p) => p >= endSheetY)!;
                } else {
                    target = [...snapPoints].reverse().find((p) => p <= endSheetY)!;
                }
            } else {
                target = snapPoints.reduce((a, b) => (Math.abs(b - endSheetY) < Math.abs(a - endSheetY) ? b : a));
            }

            setCardY(target);

            if (target === maxSnapPoint) {
                queueHideCallback();
            }
        },
        [dragging, snapPoints, queueHideCallback],
    );

    // if dragging, starts calculating sheet position (moves sheet)
    useEffect(() => {
        if (!dragging) return; // dragging is initiated by `startDrag`
        const controller = new AbortController();

        window.addEventListener('mousemove', onDrag, { signal: controller.signal });
        window.addEventListener('mouseup', onDragEnd, { signal: controller.signal });
        window.addEventListener('touchmove', onDrag, { signal: controller.signal });
        window.addEventListener('touchend', onDragEnd, { signal: controller.signal });

        return () => controller.abort(); // clean up event listeners
    }, [dragging, onDragEnd, onDrag]);

    return (
        <>
            {cardY !== Math.max(...snapPoints) && (
                <button
                    className={`${styles.dim}`}
                    onClick={() => {
                        setCardY(Math.max(...snapPoints));
                        queueHideCallback();
                    }}
                    aria-label="Close bottom sheet"
                    type="button"
                />
            )}

            <motion.div
                aria-label="Draggable bottom sheet"
                role="dialog"
                aria-modal="true"
                className={styles.bottomSheet}
                initial={{ height: 0 }}
                animate={{ height: `${windowHeight - cardY}px` }}
                transition={{ duration: dragging ? 0 : hideSheetDelayMs / 1000, ease: [0.22, 1, 0.36, 1] }}
                onTouchMove={(ev) => {
                    // starts all drag interaction
                    if (contentRef?.current?.scrollTop === 0) {
                        startDrag(ev);
                    }
                }}
            >
                <button
                    type="button"
                    aria-label="Bottom sheet handle"
                    className={styles.handleContainer}
                    onMouseMove={(ev) => {
                        if (ev.buttons & 1) startDrag(ev); // left-click drag
                    }}
                >
                    <div className={styles.handle} />
                </button>

                <div
                    data-scrollable
                    id="bottom-sheet-content"
                    className={styles.content}
                    ref={contentRef}
                    style={{ overflow: cardY > Math.min(...snapPoints) ? 'hidden' : 'auto' }}
                >
                    {children}
                </div>
            </motion.div>
        </>
    );
}
function getYPos(ev: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) {
    // event listeners use the first two, while element callbacks use the latter two...
    return 'touches' in ev && ev.touches.length > 0 ? ev.touches[0]!.clientY : 'clientY' in ev ? ev.clientY : 0;
}

/**
 *
 * @param dragEvents Timestamped positions accumulated during drag
 * @returns approximate final velocity, for flick detection purposes
 */
function getVelocity(dragEvents: { pos: number; time: number }[]) {
    if (dragEvents.length < 2) return 0;
    const latestPos = dragEvents[dragEvents.length - 1]!;
    const earlierPos = dragEvents.find((ev) => ev.time >= latestPos.time - 300)!;
    if (earlierPos.time === latestPos.time) return 0;
    const velocity = (latestPos.pos - earlierPos.pos) / (latestPos.time - earlierPos.time);
    return velocity;
}
function useGlobalScrollLock() {
    useEffect(() => {
        const abortController = new AbortController();
        document.body.style.overflow = 'hidden';

        const preventScroll = (e: Event) => {
            const target = e.target as HTMLElement;

            if (target.closest('[data-scrollable]')) {
                return;
            }

            e.preventDefault();
        };
        document.addEventListener('touchmove', preventScroll, { passive: false, signal: abortController.signal });
        document.addEventListener('wheel', preventScroll, { passive: false, signal: abortController.signal });
        return () => {
            document.body.style.overflow = 'visible';
            abortController.abort();
        };
    }, []);
}
function useWindowHeight() {
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    useEffect(() => {
        const onWindowResize = () => {
            setWindowHeight(window.innerHeight);
        };
        window.addEventListener('resize', onWindowResize);
        return () => window.removeEventListener('resize', onWindowResize);
    }, []);
    return windowHeight;
}
