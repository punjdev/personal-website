"use client";

export default function ContactMe() {
  return (
    <section className="flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center text-base-content bg-base-100 lg:px-10">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold text-primary mb-6">Get in Touch</h1>

        <p className="text-lg text-base-content/80 leading-relaxed mb-8">
          I’m always open to chatting about new opportunities! Feel free to reach out via email or connect with me
          on LinkedIn!
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a href="" className="btn btn-primary">
            Email Me
          </a>

          <a
            href="https://www.linkedin.com/in/devpunjabi/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-neutral"
          >
            LinkedIn
          </a>

          <a
            href="https://github.com/punjdev"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
