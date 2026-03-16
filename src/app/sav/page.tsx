"use client";

import Image from "next/image";

export default function SavPage() {
  return (
    <section className="relative left-1/2 min-h-dvh w-screen -translate-x-1/2 overflow-hidden bg-black">
      <div className="sav-background absolute inset-[-12vh_-12vw]" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="sav-bouncer relative aspect-square w-[min(40vw,20rem)] min-w-40 overflow-hidden rounded-[2rem] border border-white/35 bg-white/10 shadow-[0_0_80px_rgba(255,255,255,0.16)]">
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
          animation: sav-bounce 11s linear infinite;
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

        @keyframes sav-bounce {
          0% {
            transform: translate(-28vw, -18vh) rotate(-10deg);
          }
          18% {
            transform: translate(24vw, -15vh) rotate(8deg);
          }
          38% {
            transform: translate(18vw, 16vh) rotate(-6deg);
          }
          55% {
            transform: translate(-22vw, 14vh) rotate(9deg);
          }
          74% {
            transform: translate(-10vw, -5vh) rotate(-4deg);
          }
          100% {
            transform: translate(-28vw, -18vh) rotate(-10deg);
          }
        }

        @media (max-width: 640px) {
          .sav-background {
            background-size: 7.5rem 7.5rem;
            animation-duration: 11s;
          }

          .sav-bouncer {
            animation-duration: 9s;
          }

          @keyframes sav-scroll {
            from {
              background-position: 0 0;
            }
            to {
              background-position: 7.5rem 0;
            }
          }

          @keyframes sav-bounce {
            0% {
              transform: translate(-18vw, -15vh) rotate(-8deg);
            }
            25% {
              transform: translate(18vw, -11vh) rotate(7deg);
            }
            50% {
              transform: translate(12vw, 16vh) rotate(-5deg);
            }
            75% {
              transform: translate(-16vw, 12vh) rotate(8deg);
            }
            100% {
              transform: translate(-18vw, -15vh) rotate(-8deg);
            }
          }
        }
      `}</style>
    </section>
  );
}
