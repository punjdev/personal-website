"use client";

import { FormEvent, useState } from "react";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import { RoughNotation } from "react-rough-notation";

const CONTACT_EMAIL = "dev@devpunjabi.com";

export default function ContactMe() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
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
              <button type="submit" className="btn btn-primary w-full">
                Send
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
  );
}
