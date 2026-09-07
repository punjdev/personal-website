"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import { RoughNotation } from "react-rough-notation";
import { sendContactEmail } from "@/app/actions/contact";

const CONTACT_EMAIL = "dev@devpunjabi.com";

export default function ContactMe() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (status === "idle") return;
    const t = setTimeout(() => setStatus("idle"), 4000);
    return () => clearTimeout(t);
  }, [status]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      try {
        await sendContactEmail(name, email, message);
        setStatus("sent");
        setName("");
        setEmail("");
        setMessage("");
      } catch {
        setStatus("error");
      }
    });
  };

  return (
    <>
    {status !== "idle" && (
      <div className="toast toast-end toast-bottom z-50">
        {status === "sent" && (
          <div role="alert" className="alert alert-success shadow-md">
            <span>Message sent. Check your inbox.</span>
          </div>
        )}
        {status === "error" && (
          <div role="alert" className="alert alert-error shadow-md">
            <span>Something went wrong. Please try again.</span>
          </div>
        )}
      </div>
    )}
    <section className="flex min-h-full items-center px-6 py-10 lg:px-10">
      <div className="mx-auto w-full max-w-lg">
        <h1 className="text-4xl font-bold text-base-content lg:text-5xl">
          Let&apos;s talk.
        </h1>
        <p className="mt-3 text-sm text-base-content/50">
          Open to new opportunities, collaborations, or just saying hi.
        </p>

        <RoughNotation
          type="bracket"
          brackets={["left", "right"]}
          show
          color="#c8943a"
          strokeWidth={2.5}
          padding={14}
          animationDelay={300}
          animationDuration={1200}
        >
          <div className="mt-10 px-2">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="Name"
                />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="Email"
                />
              </div>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="textarea textarea-bordered w-full min-h-36 resize-none"
                placeholder="What's on your mind?"
              />
              <button type="submit" disabled={isPending} className="btn btn-primary w-full">
                {isPending ? "Sending..." : "Send"}
              </button>
            </form>

            <div className="mt-6 flex gap-1">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="btn btn-ghost btn-sm btn-circle text-base-content/50 hover:text-base-content"
                aria-label="Email"
              >
                <FaEnvelope />
              </a>
              <a
                href="https://www.linkedin.com/in/devpunjabi/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm btn-circle text-base-content/50 hover:text-base-content"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://github.com/punjdev"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm btn-circle text-base-content/50 hover:text-base-content"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
            </div>
          </div>
        </RoughNotation>
      </div>
    </section>
    </>
  );
}
