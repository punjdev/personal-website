# devpunjabi.com

This site. Built with Next.js 15 App Router, TypeScript, TailwindCSS v4, and DaisyUI v5. Deployed on Vercel.

## Deployment

The frontend runs on Vercel. The RAG API runs separately on Railway, not Vercel, because it holds a BM25 index in memory between requests. Serverless functions spin down between invocations and lose that state every time. Railway keeps the process alive.

`NEXT_PUBLIC_` environment variables are baked into the client bundle at build time, not at runtime. Adding or changing an API endpoint requires a redeploy, not just an environment variable update.

## A few things worth mentioning

### Server and client components

Next.js 15 App Router defaults to Server Components. Most pages here are pure server renders that read files and return HTML with no JavaScript sent to the browser. Client components are used only where browser APIs are needed: the theme toggle, interactive mode, and the RAG chat interface. The split is managed by a layout wrapper that uses `usePathname()` to decide what chrome to render.

Project pages are Server Components that read markdown from disk at request time and pass it to a shared renderer. No static generation, no build step for content changes.

### The Konami code

Type ↑↑↓↓←→←→BA on any page and every visible element detaches from the DOM and falls under gravity. No physics library. Each element converts to `position: fixed` at its current screen position, and a `requestAnimationFrame` loop handles gravity, floor bounce, and drag-to-throw. About 150 lines total.

### Custom themes

Light and dark are both custom DaisyUI v5 theme definitions rather than built-in presets. The pair is called `retro` and `retro-dark`. A single checkbox in the header toggles between them, and light mode is the deliberate default regardless of OS preference.
