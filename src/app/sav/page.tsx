"use client";

import SavPageExp from "@/components/SavPageExp";

const savPhotos = [
  "/sav/bc1.jpeg",
  "/sav/gh1.jpeg",
  "/sav/bc2.jpeg",
  "/sav/levi.jpeg",
  "/sav/mp1.jpeg",
  "/sav/cgh2.jpeg",
  "/sav/torando.png",
  "/sav/hawt.jpeg",
  "/sav/mp2.jpeg",
  "/sav/pumpkin.jpeg",
  "/sav/bc1.jpeg",
  "/sav/gh1.jpeg",
  "/sav/bc2.jpeg",
  "/sav/levi.jpeg",
  "/sav/mp1.jpeg",
  "/sav/cgh2.jpeg",
  "/sav/torando.png",
  "/sav/hawt.jpeg",
  "/sav/mp2.jpeg",
  "/sav/pumpkin.jpeg",
] as const;

const rowCount = 6;

function rotateRow<T>(items: readonly T[], offset: number) {
  return items.map((_, index) => items[(index + offset) % items.length]);
}

export default function SavPage() {
  const rows = Array.from({ length: rowCount }, (_, rowIndex) =>
    rotateRow(savPhotos, rowIndex),
  );

  return (
    <section className="relative left-1/2 min-h-dvh w-screen -translate-x-1/2 overflow-hidden bg-black">
      <div className="sav-background absolute inset-[-8vh_-8vw]">
        <div className="sav-track">
          {Array.from({ length: 2 }, (_, panelIndex) => (
            <div key={panelIndex} className="sav-panel">
              {rows.map((rowPhotos, rowIndex) => (
                <div key={`${panelIndex}-${rowIndex}`} className="sav-row">
                  {rowPhotos.map((photo, photoIndex) => (
                    <div
                      key={`${panelIndex}-${rowIndex}-${photoIndex}-${photo}`}
                      className="sav-tile"
                      style={{ backgroundImage: `url("${photo}")` }}
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <SavPageExp />

      <style jsx>{`
        .sav-background {
          background: #000;
        }

        .sav-track {
          display: flex;
          width: max-content;
          animation: sav-scroll 25s linear infinite;
          will-change: transform;
        }

        .sav-panel {
          display: grid;
        }

        .sav-row {
          display: grid;
          grid-template-columns: repeat(${savPhotos.length}, minmax(0, 10rem));
        }

        .sav-tile {
          aspect-ratio: 1 / 1;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        }

        @keyframes sav-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 640px) {
          .sav-track {
            animation-duration: 14s;
          }

          .sav-row {
            grid-template-columns: repeat(${savPhotos.length}, minmax(0, 7rem));
          }
        }
      `}</style>
    </section>
  );
}
