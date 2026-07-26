# Agent Collaboration & Architecture Directives

This repository was built in pair-programming collaboration with **Antigravity (Gemini 3.6 Flash)**, following strict agent execution rules, architectural guidelines, and modular component patterns.

---

## 1. Agent Steering Principles

### Codebase Organization
- **Separation of Concerns**: Keep business logic, AI integrations, API service calls, and UI presentation cleanly decoupled into dedicated modules.
  - `client/src/services/api.js`: REST API client wrapper.
  - `client/src/services/aiService.js`: Dedicated Google Gemini AI service.
  - `client/src/components/AiInsightCard.jsx`: Isolated React component for rendering per-card AI insights.
  - `client/src/components/TestimonialCard.jsx`: Pure UI presentation card for customer reviews.

### Clean Code Directives
- **No Over-Engineering**: Write plain, readable JavaScript and standard React hooks (`useState`, `useEffect`). Avoid obscure syntax or unnecessary dependencies.
- **Graceful Degradation**: Always handle network failures, missing API keys, or service errors gracefully with fallback logic so the UI never crashes.
- **Aesthetics & UX**: Enforce modern UI design standards using Tailwind CSS, Google Fonts (**Poppins**), glassmorphic elements, loading skeletons, and responsive grid layouts.

---

## 2. Work Division & Task Workflow

The project execution followed a structured 4-phase plan:

1. **Phase 1 (P0 Core Loop)**:
   - Form submission → Backend persistence (MongoDB/Express API) → Admin moderation dashboard (Approve/Reject) → Public Wall of Love.

2. **Phase 2 (P1 Embeddable Widget)**:
   - Standalone `/embed` route accepting query params (`accent`, `layout`, `limit`).
   - Root `demo.html` page proving iframe embed functionality on external websites.
   - Honeypot anti-spam validation & pagination support.

3. **Phase 3 (P2 AI Integration)**:
   - Dedicated `aiService.js` connecting to Google Gemini REST API (`gemini-2.5-flash` / `gemini-1.5-flash`).
   - Modular `AiInsightCard.jsx` component offering on-demand sentiment tagging, 1-sentence summaries, key highlights, and auto-generated tags per card.

4. **Phase 4 (P2 Design & Polish)**:
   - Applied **Poppins** font family globally across all views.
   - Enhanced Dashboard with summary stat cards (Total, Pending, Approved, Rejected).
   - Added ambient mesh background and responsive card hover micro-interactions.

---

## 3. Tooling & Environment Configuration

- **Frontend**: React + Vite + Tailwind CSS + React Router DOM
- **Backend**: Node.js + Express.js + Mongoose / MongoDB
- **AI Model**: Google Gemini API via REST `generateContent` endpoint
- **Media Uploads**: Cloudinary direct upload integration
