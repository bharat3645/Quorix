# Quorix — Agent Console

A small, local-first reference app for the agentic UI patterns that showed up
everywhere in AI products in 2026: streaming responses, inline tool-call
visualization, and generative UI (rendering a real result component instead
of describing one in prose).

Everything in the default view is real and runs entirely in your browser —
there is no backend, no server, and no API key required to use it.

## What it actually does

Type a message and a tiny local intent router decides whether one of the
built-in tools applies. If it does, the tool runs for real and its result is
rendered as an inline "tool call" card above the reply — the same pattern
used by modern agent UIs to show *what the agent did*, not just what it said.
If nothing matches, you get a short canned response explaining what Quorix
can do.

Built-in tools (`src/lib/tools.ts`), all pure TypeScript, no dependencies:

- **Calculator** — a hand-written recursive-descent parser (`+ - * / % ^ ()`),
  not `eval()`.
- **Unit converter** — length, weight, and temperature, with common aliases
  (`"convert 10 km to miles"`, `"convert 100 f to c"`).
- **JSON formatter/validator** — pretty-prints valid JSON, reports real parse
  errors for invalid input.
- **Word/character counter**.
- **UUID (v4) generator** — uses `crypto.randomUUID()` where available.
- **Password generator** — uses `crypto.getRandomValues()` where available.
- **World clock** — current time in a small set of cities/timezones via
  `Intl.DateTimeFormat`.

Try things like:

```
2 + 2 * 10
convert 10 km to miles
{"hello": "world", "n": 42}
generate a password 24
what time is it in Tokyo
word count: the quick brown fox jumps
```

### Streaming

Replies are revealed progressively (word-by-word) to match the streaming UX
users now expect from chat interfaces, whether the text comes from a local
tool result or a remote model.

### Optional: bring your own model

Quorix ships with no API keys and calls no external service by default.
Open **Settings** and you can optionally enable "Use my own API key" to route
open-ended messages (anything the local router doesn't recognize as a tool
call) to a real model over any OpenAI-compatible `/chat/completions`
streaming endpoint — OpenAI, OpenRouter, Groq, or a local server such as
Ollama/LM Studio that speaks the same protocol.

The key and base URL are stored **only** in your browser's `localStorage`
and sent **only** directly from your browser to the base URL you configure.
Quorix has no backend of its own to send them to. Leave this off and the app
still works fully offline via the local tools and canned fallback.

## Tech stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- [lucide-react](https://lucide.dev/) icons

This project intentionally keeps the exact dependency set it started with —
nothing exotic, nothing that needs a build step beyond `vite build`.

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build
npm run lint      # eslint
```

## Project structure

```
src/
├── App.tsx                  # layout, message state, send/stop wiring
├── lib/
│   ├── tools.ts              # calculator, converter, JSON, text, uuid, password, clock
│   └── agent.ts               # intent router + local/streamed reply planning
├── hooks/
│   └── useLocalStorage.ts
├── components/
│   ├── ChatWindow.tsx         # message list + empty-state example prompts
│   ├── MessageBubble.tsx      # single message, renders tool-call card
│   ├── ToolCallCard.tsx       # inline "ran X, got Y" visualization
│   ├── Composer.tsx           # input box, keyboard shortcuts
│   └── SettingsPanel.tsx      # optional bring-your-own-key configuration
└── types/index.ts
```

## Why this exists

This repo previously held an unfinished, unbranded generated demo (a
hardcoded-data Q&A clone with no real backend or auth) that was never
developed past its first scaffold. It's been replaced with something small
but genuinely working, in a space — agentic, streaming AI interfaces — that
reflects where full-stack UI work is actually headed in 2026.

## License

MIT
