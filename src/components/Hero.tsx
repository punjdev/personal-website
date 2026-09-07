"use client";
import Link from "next/link";
// import { navLinks } from "@/lib/constants/links";
import { RoughNotation } from "react-rough-notation";
import { useEffect, useMemo, useState } from "react";

export default function Hero() {
  const [aboutColor, contactColor] = useMemo(() => ["#93c5fd", "#f9a8d4"], []);

  // rough-notation measures its element on mount and animates from there, so
  // mounting it before layout settles puts the highlight in the wrong place and
  // drops the draw animation. Wait for fonts and one paint, then mount it.
  const [annotationsReady, setAnnotationsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const reveal = () => {
      if (!cancelled) setAnnotationsReady(true);
    };

    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    void fontsReady.then(() => requestAnimationFrame(reveal));

    return () => {
      cancelled = true;
    };
  }, []);

  // The highlights are light pastels, so the text sitting on them needs to stay
  // dark in both themes; before they draw it follows the normal body colour.
  const annotatedText = annotationsReady
    ? "text-primary-content"
    : "text-base-content";

  return (
    <section className="flex min-h-full items-center px-6 py-10 text-center text-base-content lg:px-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold lg:text-6xl">
          Hi, I’m <span className="text-primary">Dev Punjabi</span> :)
        </h1>

        <p className="mt-4 text-lg lg:text-2xl text-base-content/80 leading-relaxed">
          I’m a{" "}
          <span className="text-primary font-medium">
            Tech Consultant at Netlight
          </span>{" "}
          and a{" "}
          <span className="text-primary font-medium">
            Computer Science graduate
          </span>{" "}
          from the University of Toronto. Learn more{" "}
          <Link href="/about" className="mx-1 font-normal">
            <span
              className={`inline-block whitespace-nowrap transition-colors ${annotatedText}`}
            >
              {annotationsReady ? (
                <RoughNotation
                  show
                  type="highlight"
                  color={aboutColor}
                  animationDuration={600}
                >
                  about me
                </RoughNotation>
              ) : (
                "about me"
              )}
            </span>
          </Link>
          or{" "}
          <Link href="/contact" className="ml-1 font-normal">
            <span
              className={`inline-block whitespace-nowrap transition-colors ${annotatedText}`}
            >
              {annotationsReady ? (
                <RoughNotation
                  show
                  type="highlight"
                  color={contactColor}
                  animationDuration={600}
                >
                  get in touch
                </RoughNotation>
              ) : (
                "get in touch"
              )}
            </span>
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
