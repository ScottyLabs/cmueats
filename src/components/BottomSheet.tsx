import { ReactNode, useEffect, useRef, useState } from "react";
import styles from "./BottomSheet.module.css"; 

type BottomSheetProps = {
  children: ReactNode;
  active: boolean;
  onHide?: () => void;
};

export default function BottomSheet({ children, active, onHide }: BottomSheetProps) {
  const DELAY = 200;
  const windowHeight = window.innerHeight;
  const [FULL, QUARTER, THIRD, HALF, TWO_THIRD, HIDDEN] = [ 
    windowHeight*0.15,                 
    windowHeight * 0.25, 
    windowHeight * 0.33,    
    windowHeight * 0.5,  
    windowHeight * 0.66,         
    windowHeight * 1.25               
  ];
  const snapPoints = [FULL, QUARTER, THIRD, HALF, TWO_THIRD, HIDDEN];

  const sheetRef = useRef<HTMLDivElement | null>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const moved = useRef(false);
  const dragStartTime = useRef<number>(0);
  const dragStartY = useRef<number>(0);
  const startY = useRef<number>(0);
  const startTranslate = useRef<number>(0);
  const handleRef = useRef<HTMLDivElement | null>(null);

  const [y, setY] = useState<number>(HIDDEN); 
  const [show, setShow] = useState<boolean>(false); 
  const [dragging, setDragging] = useState<boolean>(false);

  useEffect(() => {
    function onMove(e: MouseEvent | TouchEvent) {
      if (!dragging) return;

      const clientY =
        "touches" in e && e.touches.length > 0
          ? e.touches[0]!.clientY
          : "clientY" in e
          ? e.clientY
          : 0;

      let next = startTranslate.current + (clientY - startY.current);
      next = Math.max(FULL, Math.min(next, HIDDEN));

      setY(next);
    }

    function onEnd(e: MouseEvent | TouchEvent) {
      if (!dragging) return;
      setDragging(false);

      const clientY =
        "changedTouches" in e && e.changedTouches.length > 0
          ? e.changedTouches[0]!.clientY
          : "clientY" in e
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
          target = snapPoints.find(p => p > y) ?? HIDDEN;
        } else {
          target =
            [...snapPoints].reverse().find(p => p < y) ?? QUARTER;
        }
      } else {
        target = snapPoints.reduce((a, b) =>
          Math.abs(b - y) < Math.abs(a - y) ? b : a
        );
      }

      setY(target);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onEnd);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [dragging, y, snapPoints, FULL, HIDDEN]);

  useEffect(() => {
    if (active) {
        setShow(true);
        const timeout = setTimeout(() => {
          requestAnimationFrame(() => {
            setY(windowHeight*0.625); 
          });
        }, DELAY); 
        return () => clearTimeout(timeout);
    }
    else {
        const timeout = setTimeout(() => {
           setShow(false);
        }, DELAY); 
        requestAnimationFrame(() => {
          setY(HIDDEN); 
        });
       
        return () => clearTimeout(timeout);
    }
  }, [active, HIDDEN]);

  useEffect(() => {
    function onDown(e: MouseEvent | TouchEvent) {
      if (!sheetRef.current) return;

      const point =
        "touches" in e && e.touches.length > 0
          ? e.touches[0]
          : "clientX" in e
          ? e
          : null;

      if (!point) return;

      pointerStart.current = {
        x: point.clientX,
        y: point.clientY
      };
      moved.current = false;
    }

    function onMove(e: MouseEvent | TouchEvent) {
      if (!pointerStart.current) return;

      const point =
        "touches" in e && e.touches.length > 0
          ? e.touches[0]
          : "clientX" in e
          ? e
          : null;

      if (!point) return;

      const dx = Math.abs(point.clientX - pointerStart.current.x);
      const dy = Math.abs(point.clientY - pointerStart.current.y);

      if (dx > 5 || dy > 5) {
        moved.current = true;
      }
    }

    function onUp(e: MouseEvent | TouchEvent) {
      if (!sheetRef.current) return;
      if (!pointerStart.current) return;

      if (moved.current) {
        pointerStart.current = null;
        return;
      }

      const target = e.target as Node;

      if (!sheetRef.current.contains(target)) {
        if (onHide) {
          onHide();
        }
        
          requestAnimationFrame(() => {
            setY(HIDDEN); 
          });
      }

      pointerStart.current = null;
    }

    document.addEventListener("mousedown", onDown);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);

    document.addEventListener("touchstart", onDown);
    document.addEventListener("touchmove", onMove);
    document.addEventListener("touchend", onUp);

    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);

      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onUp);
      
    };
  }, [HIDDEN]);
  
  function startDrag(
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) {
    if (handleRef.current && e.target !== handleRef.current) return;

    setDragging(true);

    const clientY =
      "touches" in e && e.touches.length > 0
        ? e.touches[0]!.clientY
        : "clientY" in e
        ? e.clientY
        : 0;

    startY.current = clientY;
    startTranslate.current = y;

    dragStartTime.current = Date.now();
    dragStartY.current = clientY;
  }

  return (
    <>
        <div
          className={`${styles.dim} ${
            show && y !== HIDDEN ? styles.dimVisible : ""
          }`}
          aria-hidden
        />

        {show && <div
          ref={sheetRef}
          onMouseDown={startDrag}
          onTouchStart={startDrag}
          className={`${styles.bottomSheet} `}
          style={{ transform: `translateY(${y}px)`, transition: dragging ? "none" : "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)" }}
          >
          <div ref={handleRef} className={styles.handleContainer}>
              <div ref={handleRef} className={styles.handle} />
          </div>

          <div style={{
            height: `calc(100vh - ${y}px - 41px)`, // 41px = handle 
            overflowY: "auto"
          }}>
            {children}
          </div>
        </div>}
    </>
  );
}
