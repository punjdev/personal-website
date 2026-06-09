"use client";

import { RoughNotation } from "react-rough-notation";

export default function ProjectsHeading() {
  return (
    <h1 className="text-3xl font-bold mb-2">
      <RoughNotation
        show
        type="underline"
        color="currentColor"
        animationDelay={200}
        animationDuration={600}
        strokeWidth={2}
      >
        <span className="text-primary">Projects</span>
      </RoughNotation>
    </h1>
  );
}
