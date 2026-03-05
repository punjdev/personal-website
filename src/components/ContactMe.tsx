"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { RoughNotation } from "react-rough-notation";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

const CONTACT_EMAIL = "dev.punjabi@mail.utoronto.ca";

export default function ContactMe() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const accentColor = useMemo(() => "#1d65e9", []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = encodeURIComponent(`Website message from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <main className="px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-2xl">
        <div className="card border border-base-300 bg-base-100 shadow-xl fade-up">
          <div className="card-body gap-6">
            <div className="space-y-3 text-center">
              <p className="text-sm uppercase tracking-[0.2em] text-secondary">
                Contact
              </p>
              <h1 className="text-3xl font-bold lg:text-4xl">
                <RoughNotation
                  show
                  type="highlight"
                  color={accentColor}
                  animationDelay={200}
                  animationDuration={1200}
                >
                  Let&apos;s connect
                </RoughNotation>
              </h1>
              <p className="text-base-content/75">
                Open to new opportunities or jus want to say hi?
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 fade-up delay-1">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="btn btn-outline h-auto justify-start gap-3 px-4 py-3"
                aria-label="Email"
              >
                <FaEnvelope className="text-lg" />
                <span>Email</span>
              </a>

              <a
                href="https://www.linkedin.com/in/devpunjabi/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline h-auto justify-start gap-3 px-4 py-3"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-lg" />
                <span>LinkedIn</span>
              </a>

              <a
                href="https://github.com/punjdev"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline h-auto justify-start gap-3 px-4 py-3"
                aria-label="GitHub"
              >
                <FaGithub className="text-lg" />
                <span>GitHub</span>
              </a>
            </div>

            <div className="divider my-0 fade-up delay-2">or send a message</div>

            <form onSubmit={handleSubmit} className="space-y-4 fade-up delay-3">
              <label className="form-control w-full">
                <span className="label-text mb-1 text-sm">Name</span>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="input input-bordered w-full"
                  placeholder="Your name"
                />
              </label>

              <label className="form-control w-full">
                <span className="label-text mb-1 text-sm">Email</span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="input input-bordered w-full"
                  placeholder="you@company.com"
                />
              </label>

              <label className="form-control w-full">
                <span className="label-text mb-1 text-sm">Message</span>
                <textarea
                  required
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="textarea textarea-bordered min-h-32 w-full"
                  placeholder="Tell me what you're working on"
                />
              </label>

              <button type="submit" className="btn btn-primary w-full">
                Open Email Draft
              </button>
            </form>

            <div className="text-center fade-up delay-3">
              <Link
                href="/"
                className="text-sm text-base-content/70 underline-offset-4 hover:underline"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .fade-up {
          animation: fadeUp 0.55s ease-out both;
        }

        .delay-1 {
          animation-delay: 120ms;
        }

        .delay-2 {
          animation-delay: 200ms;
        }

        .delay-3 {
          animation-delay: 280ms;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
