import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import gsap from "gsap";

export interface BlockTransitionHandle {
  animate: () => Promise<void>;
}

interface BlockTransitionProps {
  color?: string;
}

const BlockTransition = forwardRef<BlockTransitionHandle, BlockTransitionProps>(
  ({ color = "#000000" }, ref) => {
    const transitionRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      animate: () => {
        return new Promise<void>((resolve) => {
          if (!transitionRef.current) { resolve(); return; }
          const blocks = transitionRef.current.querySelectorAll(".block-cell");
          gsap.set(blocks, { scaleY: 0, visibility: "visible" });
          gsap.to(blocks, {
            scaleY: 1,
            duration: 0.9,
            stagger: {
              each: 0.08,
              from: "start",
              grid: [2, 5],
              axis: "x",
            },
            ease: "power4.inOut",
            onComplete: resolve,
          });
        });
      },
    }));

    useEffect(() => {
      if (!transitionRef.current) return;
      const blocks = transitionRef.current.querySelectorAll(".block-cell");
      gsap.set(blocks, { scaleY: 0, visibility: "hidden" });
    }, []);

    return (
      <div
        ref={transitionRef}
        className="fixed inset-0 z-[9999] pointer-events-none flex flex-col"
        aria-hidden="true"
      >
        <div className="flex flex-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={"row1-" + i}
              className="block-cell flex-1"
              style={{ backgroundColor: color, transformOrigin: "top", transform: "scaleY(0)", visibility: "hidden" }}
            />
          ))}
        </div>
        <div className="flex flex-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={"row2-" + i}
              className="block-cell flex-1"
              style={{ backgroundColor: color, transformOrigin: "bottom", transform: "scaleY(0)", visibility: "hidden" }}
            />
          ))}
        </div>
      </div>
    );
  }
);

BlockTransition.displayName = "BlockTransition";
export default BlockTransition;