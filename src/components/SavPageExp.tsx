"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

const PASSWORD = "20260402";
const PASSWORD_PROMPT = "Enter Password";

const restaurants = [
  { name: "Bar Isabel", url: "https://barisabel.com/" },
  { name: "Mamakas", url: "https://www.mamakas.ca/" },
  { name: "Dreyfus", url: "https://www.dreyfustoronto.com/" },
  { name: "Piano Piano", url: "https://www.pianopianotherestaurant.com/" },
  { name: "Mimi Chinese", url: "https://mimichinese.com/" },
  { name: "Gia", url: "https://giarestaurant.ca/" },
] as const;

type Scene = "gate" | "p1" | "p2" | "p3" | "p4" | "p5" | "p6";
type TypewriterPhase = "typing" | "idle" | "deleting";

function buildSceneText(scene: Scene, restaurantName: string) {
  switch (scene) {
    case "gate":
      return PASSWORD_PROMPT;
    case "p1":
      return "Hey Savannah\nI need your help\nwith something";
    case "p2":
      return "I've been looking at\nall these restaurants\nand I can't decide";
    case "p3":
      return "Will you help me pick\nwhere we should go?";
    case "p4":
      return "Okay, great choice.\nThough there's one\nthing missing.";
    case "p5":
      return "I still need a\ngorgeous girl\nto come with me";
    case "p6":
      return `Savannah\ncan I take you out\nthis Friday to ${restaurantName}?`;
  }
}

export default function SavPageExp() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [scene, setScene] = useState<Scene>("gate");
  const [fullText, setFullText] = useState(PASSWORD_PROMPT);
  const [displayText, setDisplayText] = useState("");
  const [phase, setPhase] = useState<TypewriterPhase>("typing");
  const [nextText, setNextText] = useState<string | null>(null);
  const [pendingScene, setPendingScene] = useState<Scene | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<(typeof restaurants)[number] | null>(null);
  const [answer, setAnswer] = useState<"yes" | null>(null);
  const [noButtonPosition, setNoButtonPosition] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const noButtonRef = useRef<HTMLButtonElement | null>(null);
  const noPlaceholderRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (phase === "idle") {
      return;
    }

    const timeout = window.setTimeout(
      () => {
        if (phase === "typing") {
          if (displayText === fullText) {
            setPhase("idle");
            return;
          }

          setDisplayText(fullText.slice(0, displayText.length + 1));
          return;
        }

        if (displayText.length === 0) {
          if (nextText) {
            setFullText(nextText);
            setNextText(null);
          }
          if (pendingScene) {
            setScene(pendingScene);
            setPendingScene(null);
          }
          setPhase("typing");
          return;
        }

        setDisplayText((current) => current.slice(0, -1));
      },
      phase === "typing" ? 110 : 55,
    );

    return () => window.clearTimeout(timeout);
  }, [displayText, fullText, nextText, pendingScene, phase]);

  const isSceneReady = useMemo(
    () => phase === "idle" && displayText === fullText,
    [displayText, fullText, phase],
  );

  const transitionToScene = (nextScene: Scene, restaurantName?: string) => {
    const chosenName = restaurantName ?? selectedRestaurant?.name ?? restaurants[0].name;

    setPendingScene(nextScene);
    setNextText(buildSceneText(nextScene, chosenName));
    setPhase("deleting");
  };

  const syncNoButtonToPlaceholder = () => {
    const placeholder = noPlaceholderRef.current;
    const button = noButtonRef.current;

    if (!placeholder || !button) {
      return;
    }

    const placeholderRect = placeholder.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const left = placeholderRect.left + placeholderRect.width / 2 - buttonRect.width / 2;
    const top = placeholderRect.top + placeholderRect.height / 2 - buttonRect.height / 2;

    setNoButtonPosition({ left, top });
  };

  const moveNoButton = () => {
    const button = noButtonRef.current;

    if (!button) {
      return;
    }

    const buttonRect = button.getBoundingClientRect();
    const padding = 20;
    const maxX = Math.max(padding, window.innerWidth - buttonRect.width - padding);
    const minY = Math.max(window.innerHeight * 0.55, padding);
    const maxY = Math.max(minY, window.innerHeight - buttonRect.height - padding);

    const candidates = [
      { left: padding, top: minY },
      { left: maxX, top: minY },
      { left: padding, top: maxY },
      { left: maxX, top: maxY },
      { left: window.innerWidth * 0.5 - buttonRect.width / 2, top: minY + 12 },
      { left: window.innerWidth * 0.2, top: minY + (maxY - minY) * 0.45 },
      { left: window.innerWidth * 0.72, top: minY + (maxY - minY) * 0.72 },
      { left: window.innerWidth * 0.45, top: maxY - 10 },
    ];

    const nextSpot = candidates[Math.floor(Math.random() * candidates.length)];
    setNoButtonPosition({
      left: Math.min(maxX, Math.max(padding, nextSpot.left)),
      top: Math.min(maxY, Math.max(minY, nextSpot.top)),
    });
  };

  useEffect(() => {
    if (scene === "p6" && isSceneReady) {
      const timeout = window.setTimeout(syncNoButtonToPlaceholder, 0);
      const handleResize = () => syncNoButtonToPlaceholder();

      window.addEventListener("resize", handleResize);

      return () => {
        window.clearTimeout(timeout);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [isSceneReady, scene]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password === PASSWORD) {
      setError("");
      setPassword("");
      transitionToScene("p1");
      return;
    }

    setError("Wrong password");
  };

  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
        <div className="pointer-events-auto flex w-full flex-col items-center text-center text-white">
          <h1 className="typewriter mx-auto max-w-[28ch] text-3xl font-bold tracking-[0.04em] text-white sm:text-5xl">
            <span>{displayText}</span>
            <span
              aria-hidden="true"
              className={`typewriter-caret ${isSceneReady && scene === "p6" ? "typewriter-caret-idle" : ""}`}
            />
          </h1>

          {scene === "gate" && isSceneReady && (
            <form
              onSubmit={handleSubmit}
              className="mt-6 flex w-full max-w-sm flex-col items-center gap-3"
            >
              <input
                type="text"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                name="play-password"
                inputMode="text"
                className="w-full rounded-full border border-white/50 bg-black/45 px-5 py-3 text-center text-base font-medium tracking-[0.08em] text-white outline-none transition focus:border-white focus:bg-black/60"
                placeholder="Play password"
              />
              <button
                type="submit"
                className="rounded-full border border-white/20 bg-white px-6 py-2.5 text-sm font-semibold tracking-[0.12em] text-black transition hover:bg-white/90"
              >
                Enter
              </button>
              {error && (
                <p className="text-sm font-medium tracking-[0.06em] text-white/90">
                  {error}
                </p>
              )}
            </form>
          )}

          {scene === "p1" && isSceneReady && (
            <button
              type="button"
              onClick={() => transitionToScene("p2")}
              className="mt-6 rounded-full border border-white/20 bg-white px-6 py-2.5 text-sm font-semibold tracking-[0.12em] text-black transition hover:bg-white/90"
            >
              Next
            </button>
          )}

          {scene === "p2" && isSceneReady && (
            <button
              type="button"
              onClick={() => transitionToScene("p3")}
              className="mt-6 rounded-full border border-white/20 bg-white px-6 py-2.5 text-sm font-semibold tracking-[0.12em] text-black transition hover:bg-white/90"
            >
              Let me choose
            </button>
          )}

          {scene === "p3" && isSceneReady && (
            <div className="mt-6 flex w-full max-w-2xl flex-col items-center gap-4">
              <div className="flex flex-wrap items-center justify-center gap-3">
                {restaurants.map((restaurant) => {
                  const isSelected = selectedRestaurant?.name === restaurant.name;

                  return (
                    <a
                      key={restaurant.name}
                      href={restaurant.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setSelectedRestaurant(restaurant)}
                      className={`rounded-full border px-5 py-2.5 text-sm font-semibold tracking-[0.08em] transition ${
                        isSelected
                          ? "border-white bg-white text-black"
                          : "border-white/45 bg-black/35 text-white hover:bg-black/50"
                      }`}
                    >
                      {restaurant.name}
                    </a>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => transitionToScene("p4")}
                disabled={!selectedRestaurant}
                className="rounded-full border border-white/20 bg-white px-6 py-2.5 text-sm font-semibold tracking-[0.12em] text-black transition enabled:hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Select
              </button>
            </div>
          )}

          {scene === "p4" && isSceneReady && (
            <button
              type="button"
              onClick={() => transitionToScene("p5")}
              className="mt-6 rounded-full border border-white/20 bg-white px-6 py-2.5 text-sm font-semibold tracking-[0.12em] text-black transition hover:bg-white/90"
            >
              What is it?
            </button>
          )}

          {scene === "p5" && isSceneReady && (
            <button
              type="button"
              onClick={() => transitionToScene("p6")}
              className="mt-6 rounded-full border border-white/20 bg-white px-6 py-2.5 text-sm font-semibold tracking-[0.12em] text-black transition hover:bg-white/90"
            >
              really?
            </button>
          )}

          {scene === "p6" && isSceneReady && (
            <div className="mt-6 flex flex-col items-center gap-3">
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setAnswer("yes")}
                  className="rounded-full border border-white/20 bg-white px-6 py-2.5 text-sm font-semibold tracking-[0.12em] text-black transition hover:bg-white/90"
                >
                  Yes
                </button>
                <span
                  ref={noPlaceholderRef}
                  aria-hidden="true"
                  className="inline-block h-[46px] w-[94px]"
                />
                <button
                  ref={noButtonRef}
                  type="button"
                  onClick={moveNoButton}
                  onMouseEnter={moveNoButton}
                  className="fixed z-20 rounded-full border border-white/50 bg-black/35 px-6 py-2.5 text-sm font-semibold tracking-[0.12em] text-white transition-[left,top] duration-150 ease-out hover:bg-black/50"
                  style={
                    noButtonPosition
                      ? {
                          left: `${noButtonPosition.left}px`,
                          top: `${noButtonPosition.top}px`,
                        }
                      : { visibility: "hidden" }
                  }
                >
                  No
                </button>
              </div>
              {answer === "yes" && (
                <p className="text-sm font-medium tracking-[0.06em] text-white">
                  yay :) it&apos;s a date
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .typewriter {
          display: inline;
          white-space: pre-line;
          line-height: 1.15;
          text-shadow:
            0 2px 14px rgba(0, 0, 0, 0.85),
            0 0 24px rgba(0, 0, 0, 0.65);
        }

        .typewriter-caret {
          display: inline-block;
          vertical-align: baseline;
          margin-left: 0.08em;
          width: 0.08em;
          height: 0.92em;
          background: rgba(255, 255, 255, 0.85);
          animation: blink-caret 0.75s step-end infinite;
        }

        .typewriter-caret-idle {
          margin-left: 0.12em;
        }

        @keyframes blink-caret {
          from,
          to {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }

        @media (max-width: 640px) {
          .typewriter {
            line-height: 1.2;
          }
        }
      `}</style>
    </>
  );
}
