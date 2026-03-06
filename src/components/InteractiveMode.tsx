"use client";

import { PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";

type InteractiveModeProps = {
  rootId: string;
};

type DragState = {
  element: HTMLElement;
  pointerId: number;
  startX: number;
  startY: number;
  baseX: number;
  baseY: number;
  moved: boolean;
  gravityMode?: boolean;
  gravityBodyIndex?: number;
};

type ControlsDragState = {
  pointerId: number;
  startX: number;
  startY: number;
  baseX: number;
  baseY: number;
  moved: boolean;
};

type GravityBody = {
  element: HTMLElement;
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  settled: boolean;
};

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
] as const;

const MOVABLE_SELECTOR = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "a",
  "button",
  "img",
  "li",
  "blockquote",
  "code",
  "pre",
  "section",
  "article",
  ".card",
  ".btn",
  ".badge",
  ".divider",
  "[data-interactive-movable]",
].join(",");

const GRAVITY_SELECTOR = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "a",
  "button",
  "img",
  "li",
  "blockquote",
  "code",
  "pre",
  ".btn",
  ".badge",
  "[data-interactive-movable]",
].join(",");

const EDITABLE_SELECTOR = "input, textarea, select, [contenteditable='true']";

export default function InteractiveMode({ rootId }: InteractiveModeProps) {
  const [enabled, setEnabled] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [gravityEnabled, setGravityEnabled] = useState(false);
  const sequenceIndexRef = useRef(0);
  const suppressClickUntilRef = useRef(0);
  const dragRef = useRef<DragState | null>(null);
  const touchedRef = useRef<Set<HTMLElement>>(new Set());
  const gravityEnabledRef = useRef(false);
  const gravityBodiesRef = useRef<GravityBody[]>([]);
  const gravityRafRef = useRef<number | null>(null);
  const gravityLastTsRef = useRef<number | null>(null);
  const controlsRef = useRef<HTMLDivElement | null>(null);
  const controlsDragRef = useRef<ControlsDragState | null>(null);
  const [controlsPosition, setControlsPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const stopGravity = () => {
    gravityEnabledRef.current = false;
    setGravityEnabled(false);

    if (gravityRafRef.current !== null) {
      window.cancelAnimationFrame(gravityRafRef.current);
      gravityRafRef.current = null;
    }

    gravityBodiesRef.current = [];
    gravityLastTsRef.current = null;
  };

  const resetMovedElements = () => {
    stopGravity();
    dragRef.current = null;

    touchedRef.current.forEach((element) => {
      const originalTransform = element.dataset.interactiveOriginalTransform;
      const originalPosition = element.dataset.interactiveOriginalPosition;
      const originalZIndex = element.dataset.interactiveOriginalZIndex;
      const originalCursor = element.dataset.interactiveOriginalCursor;
      const originalLeft = element.dataset.interactiveOriginalLeft;
      const originalTop = element.dataset.interactiveOriginalTop;
      const originalWidth = element.dataset.interactiveOriginalWidth;

      if (originalTransform !== undefined) {
        element.style.transform = originalTransform;
      } else {
        element.style.removeProperty("transform");
      }

      if (originalPosition !== undefined) {
        element.style.position = originalPosition;
      } else {
        element.style.removeProperty("position");
      }

      if (originalZIndex !== undefined) {
        element.style.zIndex = originalZIndex;
      } else {
        element.style.removeProperty("z-index");
      }

      if (originalCursor !== undefined) {
        element.style.cursor = originalCursor;
      } else {
        element.style.removeProperty("cursor");
      }

      if (originalLeft !== undefined) {
        element.style.left = originalLeft;
      } else {
        element.style.removeProperty("left");
      }

      if (originalTop !== undefined) {
        element.style.top = originalTop;
      } else {
        element.style.removeProperty("top");
      }

      if (originalWidth !== undefined) {
        element.style.width = originalWidth;
      } else {
        element.style.removeProperty("width");
      }

      delete element.dataset.interactiveX;
      delete element.dataset.interactiveY;
      delete element.dataset.interactiveOriginalTransform;
      delete element.dataset.interactiveOriginalPosition;
      delete element.dataset.interactiveOriginalZIndex;
      delete element.dataset.interactiveOriginalCursor;
      delete element.dataset.interactiveOriginalLeft;
      delete element.dataset.interactiveOriginalTop;
      delete element.dataset.interactiveOriginalWidth;
      delete element.dataset.interactiveMoved;
    });

    touchedRef.current.clear();
  };

  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;

    const isEditableTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      return Boolean(target.closest(EDITABLE_SELECTOR));
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;

      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      const expected = KONAMI[sequenceIndexRef.current];

      if (key === expected) {
        sequenceIndexRef.current += 1;
      } else {
        sequenceIndexRef.current = key === KONAMI[0] ? 1 : 0;
      }

      if (sequenceIndexRef.current === KONAMI.length) {
        setEnabled(true);
        setShowHint(true);
        sequenceIndexRef.current = 0;
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [rootId]);

  useEffect(() => {
    if (!showHint) return;

    const timeout = window.setTimeout(() => {
      setShowHint(false);
    }, 2200);

    return () => window.clearTimeout(timeout);
  }, [showHint]);

  useEffect(() => {
    document.body.classList.toggle("interactive-mode", enabled);

    if (!enabled) {
      dragRef.current = null;
      return () => {
        document.body.classList.remove("interactive-mode");
      };
    }

    const root = document.getElementById(rootId);
    if (!root) {
      return () => {
        document.body.classList.remove("interactive-mode");
      };
    }

    const findMovableElement = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return null;
      if (target.closest("[data-interactive-controls='true']")) return null;
      if (target.closest(EDITABLE_SELECTOR)) return null;

      const movable = target.closest(MOVABLE_SELECTOR);
      if (!movable) return null;
      if (!(movable instanceof HTMLElement)) return null;
      if (!root.contains(movable)) return null;
      return movable;
    };

    const prepareElement = (element: HTMLElement) => {
      if (element.dataset.interactiveOriginalTransform === undefined) {
        element.dataset.interactiveOriginalTransform = element.style.transform;
        element.dataset.interactiveOriginalPosition = element.style.position;
        element.dataset.interactiveOriginalZIndex = element.style.zIndex;
        element.dataset.interactiveOriginalCursor = element.style.cursor;
        element.dataset.interactiveOriginalLeft = element.style.left;
        element.dataset.interactiveOriginalTop = element.style.top;
        element.dataset.interactiveOriginalWidth = element.style.width;
      }

      element.style.position = element.style.position || "relative";
      element.style.zIndex = "40";
      element.style.cursor = "grab";
      touchedRef.current.add(element);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;

      const element = findMovableElement(event.target);
      if (!element) return;

      event.preventDefault();
      prepareElement(element);

      if (gravityEnabledRef.current) {
        let bodyIndex = gravityBodiesRef.current.findIndex(
          (body) => body.element === element
        );

        if (bodyIndex < 0) {
          const rect = element.getBoundingClientRect();
          element.style.transform = "none";
          element.style.position = "fixed";
          element.style.left = `${rect.left}px`;
          element.style.top = `${rect.top}px`;
          element.style.width = `${rect.width}px`;
          element.style.zIndex = "60";

          gravityBodiesRef.current.push({
            element,
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
            velocityY: 0,
            settled: false,
          });

          bodyIndex = gravityBodiesRef.current.length - 1;
        }

        const body = gravityBodiesRef.current[bodyIndex];
        body.velocityY = 0;
        body.settled = false;
        element.style.cursor = "grabbing";

        dragRef.current = {
          element,
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          baseX: body.x,
          baseY: body.y,
          moved: false,
          gravityMode: true,
          gravityBodyIndex: bodyIndex,
        };
        return;
      }

      dragRef.current = {
        element,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        baseX: Number(element.dataset.interactiveX ?? "0"),
        baseY: Number(element.dataset.interactiveY ?? "0"),
        moved: false,
      };
    };

    const onPointerMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;

      const deltaX = event.clientX - drag.startX;
      const deltaY = event.clientY - drag.startY;

      if (!drag.moved && Math.hypot(deltaX, deltaY) > 3) {
        drag.moved = true;
      }

      const x = drag.baseX + deltaX;
      const y = drag.baseY + deltaY;

      if (drag.gravityMode && typeof drag.gravityBodyIndex === "number") {
        const body = gravityBodiesRef.current[drag.gravityBodyIndex];
        if (!body) return;

        const maxX = Math.max(0, window.innerWidth - body.width);
        body.x = Math.min(Math.max(0, x), maxX);
        body.y = Math.max(0, y);
        body.velocityY = 0;
        body.settled = false;
        body.element.style.transform = "none";
        body.element.style.left = `${body.x}px`;
        body.element.style.top = `${body.y}px`;
        body.element.style.cursor = "grabbing";
        body.element.dataset.interactiveX = "0";
        body.element.dataset.interactiveY = "0";
        body.element.dataset.interactiveMoved = "true";
        event.preventDefault();
        return;
      }

      drag.element.dataset.interactiveX = String(x);
      drag.element.dataset.interactiveY = String(y);
      drag.element.dataset.interactiveMoved = "true";
      drag.element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      drag.element.style.cursor = "grabbing";

      event.preventDefault();
    };

    const onPointerUp = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;

      drag.element.style.cursor = "grab";

      if (drag.gravityMode && typeof drag.gravityBodyIndex === "number") {
        const body = gravityBodiesRef.current[drag.gravityBodyIndex];
        if (body) {
          body.settled = false;
        }
      }

      if (drag.moved) {
        suppressClickUntilRef.current = Date.now() + 180;
      }

      dragRef.current = null;
    };

    const onClickCapture = (event: MouseEvent) => {
      if (Date.now() <= suppressClickUntilRef.current) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener("pointerdown", onPointerDown, { capture: true });
    window.addEventListener("pointermove", onPointerMove, { capture: true });
    window.addEventListener("pointerup", onPointerUp, { capture: true });
    window.addEventListener("pointercancel", onPointerUp, { capture: true });
    window.addEventListener("click", onClickCapture, { capture: true });

    return () => {
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("pointermove", onPointerMove, true);
      window.removeEventListener("pointerup", onPointerUp, true);
      window.removeEventListener("pointercancel", onPointerUp, true);
      window.removeEventListener("click", onClickCapture, true);
      document.body.classList.remove("interactive-mode");
    };
  }, [enabled, rootId]);

  const handleReset = () => {
    resetMovedElements();
  };

  const handleExit = () => {
    stopGravity();
    resetMovedElements();
    setEnabled(false);
    setShowHint(false);
  };

  const handleEnable = () => {
    setEnabled(true);
    setShowHint(true);
  };

  const handleControlsPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    if (!controlsRef.current) return;

    const rect = controlsRef.current.getBoundingClientRect();
    const baseX = controlsPosition?.x ?? rect.left;
    const baseY = controlsPosition?.y ?? rect.top;

    controlsDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      baseX,
      baseY,
      moved: false,
    };

    controlsRef.current.setPointerCapture(event.pointerId);
  };

  const handleControlsPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = controlsDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !controlsRef.current) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;

    if (!drag.moved && Math.hypot(deltaX, deltaY) > 3) {
      drag.moved = true;
    }

    const nextX = drag.baseX + deltaX;
    const nextY = drag.baseY + deltaY;
    const maxX = Math.max(0, window.innerWidth - controlsRef.current.offsetWidth);
    const maxY = Math.max(0, window.innerHeight - controlsRef.current.offsetHeight);

    setControlsPosition({
      x: Math.min(Math.max(0, nextX), maxX),
      y: Math.min(Math.max(0, nextY), maxY),
    });
  };

  const handleControlsPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = controlsDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !controlsRef.current) return;

    if (drag.moved) {
      suppressClickUntilRef.current = Date.now() + 180;
    }

    controlsRef.current.releasePointerCapture(event.pointerId);
    controlsDragRef.current = null;
  };

  const startGravity = () => {
    const root = document.getElementById(rootId);
    if (!root) return;

    const viewportHeight = window.innerHeight;
    const floorMargin = 8;
    const stackGap = 2;

    const selectable = Array.from(
      root.querySelectorAll<HTMLElement>(GRAVITY_SELECTOR)
    ).filter((element) => {
      if (element.closest(EDITABLE_SELECTOR)) return false;
      if (element.closest("[data-interactive-controls='true']")) return false;
      if (element.closest(".swap")) return false;
      if (element.classList.contains("theme-controller")) return false;
      const rect = element.getBoundingClientRect();
      if (rect.width < 4 || rect.height < 4) return false;
      if (rect.bottom < 0 || rect.top > viewportHeight) return false;
      return true;
    }).slice(0, 140);

    if (selectable.length === 0) return;

    const bodies: GravityBody[] = [];

    selectable.forEach((element) => {
      if (element.dataset.interactiveOriginalTransform === undefined) {
        element.dataset.interactiveOriginalTransform = element.style.transform;
        element.dataset.interactiveOriginalPosition = element.style.position;
        element.dataset.interactiveOriginalZIndex = element.style.zIndex;
        element.dataset.interactiveOriginalCursor = element.style.cursor;
        element.dataset.interactiveOriginalLeft = element.style.left;
        element.dataset.interactiveOriginalTop = element.style.top;
        element.dataset.interactiveOriginalWidth = element.style.width;
      }

      const rect = element.getBoundingClientRect();
      const x = rect.left;
      const y = rect.top;

      element.style.transform = "none";
      element.style.position = "fixed";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
      element.style.width = `${rect.width}px`;
      element.style.zIndex = "60";
      element.style.cursor = "grab";
      touchedRef.current.add(element);

      bodies.push({
        element,
        x,
        y,
        width: rect.width,
        height: rect.height,
        velocityY: 0,
        settled: false,
      });
    });

    gravityBodiesRef.current = bodies;
    gravityEnabledRef.current = true;
    setGravityEnabled(true);
    gravityLastTsRef.current = null;

    const gravityAcceleration = 2400;
    const horizontalOverlap = (a: GravityBody, b: GravityBody) =>
      Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x) > 10;

    const step = (timestamp: number) => {
      if (!gravityEnabledRef.current) return;

      if (gravityLastTsRef.current === null) {
        gravityLastTsRef.current = timestamp;
      }

      const delta = Math.min((timestamp - gravityLastTsRef.current) / 1000, 0.05);
      gravityLastTsRef.current = timestamp;

      const bodiesNow = gravityBodiesRef.current;
      const sortedIndices = bodiesNow
        .map((body, index) => ({ body, index }))
        .sort((a, b) => b.body.y - a.body.y)
        .map((entry) => entry.index);

      let activeBodies = 0;
      sortedIndices.forEach((index) => {
        const body = bodiesNow[index];
        if (body.settled) return;

        body.velocityY += gravityAcceleration * delta;
        const proposedY = body.y + body.velocityY * delta;
        const floorY = Math.max(0, viewportHeight - floorMargin - body.height);
        let targetY = floorY;
        let supportIndex: number | null = null;

        bodiesNow.forEach((other, otherIndex) => {
          if (otherIndex === index) return;
          if (!horizontalOverlap(body, other)) return;

          const candidateY = other.y - body.height - stackGap;
          const isBelow = other.y >= body.y - 0.5;
          if (!isBelow) return;
          if (candidateY < targetY && proposedY >= candidateY - 0.1) {
            targetY = candidateY;
            supportIndex = otherIndex;
          }
        });

        if (proposedY >= targetY) {
          body.y = targetY;
          body.velocityY = 0;
          const supportedByFloor = supportIndex === null && targetY === floorY;
          const supportedBySettledBody =
            supportIndex !== null && bodiesNow[supportIndex]?.settled === true;

          // If support is still moving, keep this body active so it can continue to drop.
          body.settled = supportedByFloor || supportedBySettledBody;
          if (!body.settled) {
            activeBodies += 1;
          }
        } else {
          body.y = proposedY;
          body.settled = false;
          activeBodies += 1;
        }

        body.element.dataset.interactiveX = "0";
        body.element.dataset.interactiveY = "0";
        body.element.dataset.interactiveMoved = "true";
        body.element.style.transform = "none";
        body.element.style.left = `${body.x}px`;
        body.element.style.top = `${body.y}px`;
      });

      if (activeBodies === 0) {
        // Keep gravity mode active so manually moved elements continue to fall.
      }

      gravityRafRef.current = window.requestAnimationFrame(step);
    };

    gravityRafRef.current = window.requestAnimationFrame(step);
  };

  const handleGravityToggle = () => {
    if (gravityEnabledRef.current) {
      stopGravity();
      return;
    }

    startGravity();
  };

  useEffect(() => {
    if (!enabled) {
      stopGravity();
    }

    return () => {
      stopGravity();
    };
  }, [enabled]);

  return (
    <>
      {showHint ? (
        <div
          data-interactive-controls="true"
          className="fixed left-1/2 top-4 z-[100] -translate-x-1/2 rounded-full border border-success/30 bg-success/15 px-4 py-2 text-sm font-medium text-success shadow-md backdrop-blur"
        >
          Interactive mode unlocked
        </div>
      ) : null}

      {!enabled ? (
        <div
          data-interactive-controls="true"
          className="fixed bottom-4 right-4 z-[100] rounded-2xl border border-base-300 bg-base-100/95 p-2 shadow-lg backdrop-blur"
        >
          <button
            type="button"
            onClick={handleEnable}
            className="btn btn-xs btn-error"
            aria-label="Enable interactive mode"
          >
            Click Me :)
          </button>
        </div>
      ) : null}

      {enabled ? (
        <div
          ref={controlsRef}
          data-interactive-controls="true"
          className="fixed z-[100] flex cursor-grab items-center gap-2 rounded-2xl border border-base-300 bg-base-100/95 p-2 shadow-lg backdrop-blur active:cursor-grabbing"
          style={
            controlsPosition
              ? { left: controlsPosition.x, top: controlsPosition.y }
              : { right: 16, bottom: 16 }
          }
          onPointerDown={handleControlsPointerDown}
          onPointerMove={handleControlsPointerMove}
          onPointerUp={handleControlsPointerUp}
          onPointerCancel={handleControlsPointerUp}
        >
          <span className="px-2 text-xs font-semibold uppercase tracking-wide text-warning">
            Interactive
          </span>
          <button type="button" onClick={handleReset} className="btn btn-xs btn-outline">
            Reset
          </button>
          <button
            type="button"
            onClick={handleGravityToggle}
            className="btn btn-xs btn-outline"
          >
            {gravityEnabled ? "Stop Gravity" : "Gravity"}
          </button>
          <button type="button" onClick={handleExit} className="btn btn-xs btn-outline">
            Exit
          </button>
        </div>
      ) : null}
    </>
  );
}
