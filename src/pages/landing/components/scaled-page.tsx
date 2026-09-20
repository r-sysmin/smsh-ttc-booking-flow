import { useEffect, useRef, useState, type ReactNode } from "react";

interface ScaledPageProps {
  children: ReactNode;
  /** Logical viewport width the child is rendered at (px). */
  width?: number;
  /** Logical viewport height the child is rendered at (px). */
  height?: number;
}

/**
 * Renders children at a fixed logical viewport (default 1440x900) inside the
 * parent container, using CSS transform: scale to fit the container width.
 * Children are non-interactive — mockups only.
 */
export function ScaledPage({ children, width = 1440, height = 900 }: ScaledPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        if (w > 0) setScale(w / width);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div
      ref={containerRef}
      className="mockup-scope relative h-full w-full overflow-hidden bg-background"
      aria-hidden="true"
      // @ts-expect-error inert is a valid HTML attribute
      inert=""
    >
      {/* Force fixed-viewport utility classes to fill the scaled container. */}
      <style>{`
        .mockup-scope .h-screen { height: ${height}px !important; }
        .mockup-scope .min-h-screen { min-height: ${height}px !important; }
      `}</style>
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}
