import { ReactNode, useEffect, useRef, useState } from "react";
import styles from "./BottomSheet.module.css"; 

type BottomSheetProps = {
  children: ReactNode;
  onHide?: () => void;
};

export default function BottomSheet({ children, onHide }: BottomSheetProps) {
  const windowHeight = window.innerHeight;

const [FULL, QUARTER, THIRD, HALF, TWO_THIRD, HIDDEN] = [
  0,                        
  windowHeight * 0.25, 
  windowHeight * 0.33,    
  windowHeight * 0.5,    
  windowHeight * 0.66,         
  windowHeight               
];

const snapPoints = [FULL, QUARTER, THIRD, HALF, TWO_THIRD, HIDDEN];


  const [y, setY] = useState<number>(HALF);
  const [dragging, setDragging] = useState<boolean>(false);
  const startY = useRef<number>(0);
  const startTranslate = useRef<number>(0);
  const handleRef = useRef<HTMLDivElement | null>(null);

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

    function onEnd() {
      if (!dragging) return;
      setDragging(false);

      const nearest = snapPoints.reduce((a, b) =>
        Math.abs(b - y) < Math.abs(a - y) ? b : a
      );

      setY(nearest);
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
        if (y === HIDDEN && onHide) {
        onHide();
        }
    }, [y, onHide, HIDDEN]);

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
  }

  return (
    <div
      onMouseDown={startDrag}
      onTouchStart={startDrag}
      className={`${styles.bottomSheet} ${y === HIDDEN ? styles.hidden : ""}`}
      style={{ transform: `translateY(${y}px)`, transition: dragging ? "none" : undefined }}
    >
      <div ref={handleRef} className={styles.handleContainer}>
        <div className={styles.handle} />
      </div>

      <div style={{
    height: `calc(100vh - ${y}px - 50px)`, // 50px = handle + buttons
    overflowY: "auto"
  }}>{children}</div>
    </div>
  );
}
