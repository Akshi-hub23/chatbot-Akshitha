# Real-Time Generative AI Chatbot 🚀

A professional, real-time generative AI chatbot built during the Generative AI Intensive by HCLTech - GUVI. This project demonstrates streaming LLM responses, voice input, and adaptable response modes with clean UI and prompt engineering tools—ideal for showcasing in a GitHub portfolio.

<!-- Badges -->
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Built With Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?logo=next.js)](https://nextjs.org)
[![Generative AI](https://img.shields.io/badge/Generative%20AI-LLM-blue)](#)

---

## 1. Project Summary

This repository contains a real-time generative AI chatbot built as part of the Generative AI Intensive by HCLTech - GUVI. The app focuses on low-latency streaming responses, voice-based input, and flexible response modes (short/detailed), coupled with prompt engineering features and a user-friendly UI.

## 2. Key Features ✨

- **Real-time streaming chatbot:** Incremental streaming responses for low-latency conversational experience.
- **Voice-to-text input:** Record audio and transcribe using Wispr Flow (or other voice-to-text providers).
- **Short and detailed response modes:** Toggle between concise and expanded responses for different user needs.
- **Prompt engineering:** Easily tweak system and user prompts to shape model behavior.
- **User-friendly interface:** Clean, responsive UI built with Next.js and Tailwind for portfolio-ready presentation.

## 3. Tech Stack 🛠️

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Next.js API routes (serverless functions)
- Realtime / Streaming: Web streams + server-sent events (or similar streaming mechanisms)
- Voice: Browser Media APIs + Wispr Flow (voice-to-text)
- Dev tools: ESLint, Prettier, Vite/Next dev server

## 4. AI Tools & APIs Used 🔬

- **Groq API** — primary LLM inference provider (highlighted for recruiters)
- **Ollama** — local model testing & iteration
- **Wispr Flow** — voice-to-text (transcription) service for voice input
- **Large Language Models (LLMs)** — foundation of responses and prompt engineering
- **Generative AI concepts** — prompt conditioning, response streaming, sampling strategies

## 5. Architecture Overview 🏗️

- Client: `app/` — UI components, chat interface, voice capture, and streamer handling.
- Server / API: `src/app/api/*` — routes that coordinate LLM inference and transcription requests.
- Streaming: Client opens stream to API; API proxies incremental LLM tokens from Groq (or local Ollama during dev) to the client.
- Voice: Client captures audio -> sends to Wispr Flow route -> receives transcript -> forwarded to LLM.

Diagram (high-level):

- Browser UI ↔ API routes (Next.js) ↔ Groq API / Ollama
- Browser -> Wispr Flow -> Transcript -> API -> LLM

## 6. Installation & Setup ⚙️

Prerequisites:

- Node.js (v18+ recommended)
- npm or yarn
- (Optional) Ollama installed locally for local model testing

Steps:

1. Clone the repository:

```bash
git clone https://github.com/<your-username>/chatbot-Akshitha.git
cd chatbot-Akshitha
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create environment file `.env.local` with keys (example):

```
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
GROQ_API_KEY=your_groq_api_key
WISPR_FLOW_KEY=your_wispr_key
```

Replace placeholders with your real keys. For local testing with Ollama, follow Ollama docs.

## 7. How to Run Locally ▶️

Start the dev server:

```bash
npm run dev
# or
yarn dev
```

Open `http://localhost:3000` in your browser and interact with the chat UI. Use voice input via the microphone button and toggle response modes in the composer.

## 8. Deployment 🚀

- Recommended: Deploy to Vercel for seamless Next.js support.
- Set environment variables in your hosting provider (GROQ_API_KEY, WISPR_FLOW_KEY).
- For private/local models with Ollama, keep Ollama hosted locally and use a secure proxy or VPN for production only when necessary.

## 9. Use Cases 🎯

- Customer support assistants with live streaming replies
- Voice-driven assistants for accessibility
- Developer demos for prompt engineering and LLM behavior tuning
- Research projects exploring streaming LLM UX

## 10. Future Improvements 🚧

- Add authentication and per-user conversation history
- Support more voice providers and offline transcription
- Add conversation summarization and context window management
- Advanced prompt management UI with templates and versioning
- Integration tests and E2E workflow for streaming reliability

## 11. Screenshots & Demo 📸

- Demo video: (placeholder) Add demo video link here
- Screenshots:
	- Placeholder: `screenshots/chat_main.png`
	- Placeholder: `screenshots/voice_flow.png`

Add images in `assets/screenshots/` and update this section with real images.

## 12. Contributing & License 🤝

Contributions welcome — open an issue or submit a pull request. Please follow simple contribution guidelines:

- Fork the repo and create a feature branch
- Run tests and linting locally
- Open a PR describing your change

License: MIT — see `LICENSE` for details.

---

## Keywords / Tags

Generative AI, LLM, AI Chatbot, Full Stack, Prompt Engineering, Streaming, Voice-to-Text, Groq API, Ollama, Wispr Flow

---

## Notes for Recruiters

This project highlights real-time LLM streaming, voice input pipelines, prompt engineering, and production-ready frontend using Next.js and Tailwind. Contact for live demo or walkthrough.

<!-- End of README -->
# chatbot-Akshitha

