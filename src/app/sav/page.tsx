"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export default function SavPage() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bouncerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bouncer = bouncerRef.current;

    if (!section || !bouncer) return;

    let rafId = 0;
    let lastTs = 0;
    let x = 0;
    let y = 0;
    let vx = 220;
    let vy = 180;

    const resetPosition = () => {
      const maxX = Math.max(0, section.clientWidth - bouncer.offsetWidth);
      const maxY = Math.max(0, section.clientHeight - bouncer.offsetHeight);

      x = maxX / 2;
      y = maxY / 2;
      bouncer.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(0deg)`;
    };

    const tick = (ts: number) => {
      if (!lastTs) {
        lastTs = ts;
      }

      const dt = Math.min((ts - lastTs) / 1000, 0.032);
      lastTs = ts;

      const maxX = Math.max(0, section.clientWidth - bouncer.offsetWidth);
      const maxY = Math.max(0, section.clientHeight - bouncer.offsetHeight);

      x += vx * dt;
      y += vy * dt;

      if (x <= 0) {
        x = 0;
        vx = Math.abs(vx);
      } else if (x >= maxX) {
        x = maxX;
        vx = -Math.abs(vx);
      }

      if (y <= 0) {
        y = 0;
        vy = Math.abs(vy);
      } else if (y >= maxY) {
        y = maxY;
        vy = -Math.abs(vy);
      }

      const rotation = (vx / 220) * 7;
      bouncer.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg)`;

      rafId = window.requestAnimationFrame(tick);
    };

    const handleResize = () => {
      lastTs = 0;
      resetPosition();
    };

    resetPosition();
    rafId = window.requestAnimationFrame(tick);
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative left-1/2 min-h-dvh w-screen -translate-x-1/2 overflow-hidden bg-black"
    >
      <div className="sav-background absolute inset-[-12vh_-12vw]" />

      <div className="absolute inset-0 pointer-events-none">
        <div
          ref={bouncerRef}
          className="sav-bouncer absolute left-0 top-0 aspect-square w-[min(40vw,20rem)] min-w-40 overflow-hidden rounded-[2rem] border border-white/35 bg-white/10 shadow-[0_0_80px_rgba(255,255,255,0.16)]"
        >
          <Image
            src="/sav.png"
            alt="Sav"
            fill
            sizes="(max-width: 768px) 56vw, 22rem"
            className="object-cover"
            priority
          />
        </div>
      </div>

      <style jsx>{`
        .sav-background {
          background-color: #000;
          background-image: url("/sav.png");
          background-position: 0 0;
          background-repeat: repeat;
          background-size: 10rem 10rem;
          animation: sav-scroll 14s linear infinite;
          will-change: background-position;
        }

        .sav-bouncer {
          will-change: transform;
        }

        @keyframes sav-scroll {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 10rem 0;
          }
        }

        @media (max-width: 640px) {
          .sav-background {
            background-size: 7.5rem 7.5rem;
            animation-duration: 11s;
          }

          @keyframes sav-scroll {
            from {
              background-position: 0 0;
            }
            to {
              background-position: 7.5rem 0;
            }
          }
        }
      `}</style>
    </section>
  );
}
