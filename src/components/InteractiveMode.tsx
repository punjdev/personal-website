"use client";

import { useEffect, useRef, useState } from "react";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
] as const;

const GRAVITY = 1500;
const RESTITUTION = 0.4;
const SELECTOR = "h1, h2, h3, h4, p, a, button, img, li, .card, .btn, .badge";

type Body = {
  el: HTMLElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  orig: {
    position: string;
    left: string;
    top: string;
    transform: string;
    zIndex: string;
    width: string;
    cursor: string;
  };
};

export default function InteractiveMode() {
  const [enabled, setEnabled] = useState(false);
  const seqRef = useRef(0);
  const suppressClickRef = useRef(0);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expected = KONAMI[seqRef.current];
      if (key === expected) {
        seqRef.current += 1;
      } else {
        seqRef.current = key === KONAMI[0] ? 1 : 0;
      }
      if (seqRef.current === KONAMI.length) {
        setEnabled(true);
        seqRef.current = 0;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const viewportH = window.innerHeight;

    const bodies: Body[] = Array.from(
      document.querySelectorAll<HTMLElement>(SELECTOR)
    )
      .filter((el) => {
        if (el.closest("[data-interactive-ignore]")) return false;
        const rect = el.getBoundingClientRect();
        return rect.width > 4 && rect.height > 4 && rect.bottom > 0 && rect.top < viewportH;
      })
      .slice(0, 80)
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const orig = {
          position: el.style.position,
          left: el.style.left,
          top: el.style.top,
          transform: el.style.transform,
          zIndex: el.style.zIndex,
          width: el.style.width,
          cursor: el.style.cursor,
        };
        el.style.position = "fixed";
        el.style.left = `${rect.left}px`;
        el.style.top = `${rect.top}px`;
        el.style.width = `${rect.width}px`;
        el.style.transform = "none";
        el.style.zIndex = "50";
        el.style.cursor = "grab";
        return { el, x: rect.left, y: rect.top, vx: 0, vy: 0, w: rect.width, h: rect.height, orig };
      });

    let dragged: Body | null = null;
    let grabOffsetX = 0;
    let grabOffsetY = 0;
    let prevX = 0, prevY = 0, prevPrevX = 0, prevPrevY = 0;
    let lastTs: number | null = null;
    let rafId = 0;

    const step = (ts: number) => {
      const dt = lastTs === null ? 0 : Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts;

      for (const body of bodies) {
        if (body === dragged) continue;
        body.vy += GRAVITY * dt;
        body.x += body.vx * dt;
        body.y += body.vy * dt;
        if (body.y + body.h > viewportH) {
          body.y = viewportH - body.h;
          body.vy *= -RESTITUTION;
          body.vx *= 0.85;
        }
        body.el.style.left = `${body.x}px`;
        body.el.style.top = `${body.y}px`;
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      if ((e.target as HTMLElement).closest("[data-interactive-ignore]")) return;
      const body = bodies.find((b) => b.el === e.target || b.el.contains(e.target as Node));
      if (!body) return;
      e.preventDefault();
      dragged = body;
      body.vx = 0;
      body.vy = 0;
      grabOffsetX = e.clientX - body.x;
      grabOffsetY = e.clientY - body.y;
      prevX = prevPrevX = e.clientX;
      prevY = prevPrevY = e.clientY;
      body.el.style.cursor = "grabbing";
      body.el.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragged) return;
      prevPrevX = prevX;
      prevPrevY = prevY;
      prevX = e.clientX;
      prevY = e.clientY;
      dragged.x = e.clientX - grabOffsetX;
      dragged.y = e.clientY - grabOffsetY;
      dragged.el.style.left = `${dragged.x}px`;
      dragged.el.style.top = `${dragged.y}px`;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragged) return;
      dragged.el.releasePointerCapture(e.pointerId);
      dragged.vx = (prevX - prevPrevX) * 60;
      dragged.vy = (prevY - prevPrevY) * 60;
      dragged.el.style.cursor = "grab";
      suppressClickRef.current = Date.now() + 200;
      dragged = null;
    };

    const onClickCapture = (e: MouseEvent) => {
      if (Date.now() <= suppressClickRef.current) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener("pointerdown", onPointerDown, { capture: true });
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("click", onClickCapture, { capture: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointerdown", onPointerDown, { capture: true });
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("click", onClickCapture, { capture: true });
      for (const body of bodies) {
        body.el.style.position = body.orig.position;
        body.el.style.left = body.orig.left;
        body.el.style.top = body.orig.top;
        body.el.style.width = body.orig.width;
        body.el.style.transform = body.orig.transform;
        body.el.style.zIndex = body.orig.zIndex;
        body.el.style.cursor = body.orig.cursor;
      }
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      data-interactive-ignore=""
      className="fixed bottom-4 right-4 z-[100] flex items-center gap-2 rounded-2xl border border-base-300 bg-base-100/95 p-2 shadow-lg backdrop-blur"
    >
      <span className="px-2 text-xs font-semibold uppercase tracking-wide text-warning">
        Interactive
      </span>
      <button
        type="button"
        onClick={() => setEnabled(false)}
        className="btn btn-xs btn-outline"
      >
        Exit
      </button>
    </div>
  );
}
