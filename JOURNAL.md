# JOURNAL.md — Decision Journal

## 1. Prioritization

- **What I built and in what order:**
  - I started by creating the project structure with a main folder and separate `client` and `server` directories.
  - I worked on the backend first because I already had a basic backend structure in mind from previous MERN projects, and there was no authentication or authorization required for this assignment.
  - In the server, I created the folder structure (`controllers`, `models`, `routes`, `config`) and `index.js`. Getting the Express server running first gave me early confidence that the core setup was solid.
  - Since the assignment was mainly about the testimonial flow, I focused on the MongoDB model next. I used AI to help brainstorm sensible fields for a testimonial platform. Once the model was ready, the CRUD endpoints became clear.
  - I implemented the controllers and routes together. I used AI to improve API response messages so the frontend received clean success and error responses. I connected MongoDB via Mongoose and verified that data was actually being saved. AI also helped me fix syntax mistakes and configuration issues along the way.
  - Once the backend was working, I moved to the frontend. I set up `components` and `pages` folders, configured Tailwind CSS, and built the views one by one. I used AI to generate initial UI layouts matching my backend fields and then integrated them with my APIs.
  - I built the **submission form** first, then the **public testimonial wall** (rendering approved items using `.map()`), and finally the **moderation dashboard**. While building the dashboard, I realized I needed a `status` field (`pending`, `approved`, `rejected`) in the database, so I updated the backend model and APIs accordingly.
  - My primary goal was completing the **P0 flow** end-to-end: Customer submits → Stored as `pending` → Admin moderates on Dashboard → Approved items appear on Wall.
  - For **P1 (Widget)**: I chose an iframe embed approach. Having worked with Micro Frontends (MFE), the iframe model felt natural for CSS isolation. I wasn't as familiar with configuring script-tag DOM injection, so I used AI to help configure script/iframe parameters and the `demo.html` proof page.
  - For **P2 (AI Feature)**: Having built several AI-integrated applications before, integrating Gemini API (`aiService.js` + `AiInsightCard.jsx`) was straightforward for sentiment analysis, 1-sentence summaries, and key tags.
  - At the end, I used AI to polish the UI, introducing Google Fonts **Poppins**, moderation summary cards, and hover micro-interactions.

- **What I deliberately cut or skipped:**
  - Authentication & user logins (explicitly listed as non-goals in the prompt; hardcoded dashboard route was sufficient).
  - Multi-tenant / multi-business support & email notifications.

---

## 2. Key decisions

- **Decision 1: MERN Stack Architecture (Express + MongoDB/Mongoose)**
  - **Options considered**: Local SQLite / Postgres vs MongoDB Atlas/Local.
  - **Why**: Familiarity with MERN patterns allowed me to build a reliable schema-driven backend without spending setup time on DB migrations.

- **Decision 2: Iframe Embed for Widget (`/embed`)**
  - **Options considered**: Script tag DOM injection vs Iframe embed.
  - **Why**: MFE experience. Iframes prevent CSS leaking between host sites and widget cards while supporting customization via URL search params (`?accent=#4f46e5&layout=grid`).

- **Decision 3: Modular AI Architecture (`AiInsightCard.jsx` & `aiService.js`)**
  - **Options considered**: Inline fetch logic inside `TestimonialCard.jsx` vs separate service and component.
  - **Why**: Keeps `TestimonialCard.jsx` clean and readable. Decoupling AI logic into `aiService.js` with fallback model retries ensures the app never crashes if API key limits are met.

- **Decision 4: Honeypot Field for Anti-Spam Defense**
  - **Options considered**: CAPTCHA vs hidden honeypot field (`website`).
  - **Why**: Silently catches spam bot submissions without frustrating legitimate users with image puzzles.

---

## 3. Working with AI agents

- **Tools and models used:** Antigravity (Gemini 3.6 Flash model).
- **How I split the work:** I directed the architecture, API design, and user flow requirements. I used the AI agent to draft boilerplate code, refine UI styling, and perform code refactoring under my review.
- **Your agent setup:** Committed `AGENTS.md` detailing folder conventions, modular component boundaries, and UI directives.
- **Your 3–5 most important prompts:**
  1. *"i want to add AI feature in it like auto-tag sentiment or summarize... make new file for logic so main clean code"*
  2. *"for AI UI logic written for that AI section make new .jsx component for that... so clean code looks in TestimonialCard.jsx"*
  3. *"make this website more beautiful... use very poppins font family"*
  4. *"in api.js file remove unnecessary comments and make it simple"*

- **At least one time AI was wrong:** Initial AI code placed the AI Insights rendering directly inside `TestimonialCard.jsx`, making the card file long and cluttered. I noticed this right away and instructed the AI to extract it into a separate `AiInsightCard.jsx` component.
- **Something I rejected:** I rejected over-commented boilerplate generated in `api.js` and asked the agent to simplify it into plain, unencumbered JavaScript functions.

---

## 4. Verification

- **How I verified the code works:**
  - Tested the complete P0 loop: Submitted a review on `/` → Checked `/dashboard` to confirm `status: pending` → Approved review → Confirmed immediate display on `/wall` and non-display of rejected items.
  - Verified P1 Widget: Opened `demo.html` in a web browser to confirm iframe rendering with custom accent color.
  - Verified P2 AI Feature: Clicked **"✨ AI Insights"** on testimonial cards to verify Gemini sentiment scoring, summary generation, and tag output.

- **What is still broken or fragile:**
  - Cloudinary photo upload relies on an active internet connection. If Cloudinary fails, it logs a warning and falls back to initials-based avatars.

---

## 5. If I had 5 more hours

- **What I would do next (in order):**
  1. **Embeddable Submission Form**: Build an embeddable submission form widget so businesses can collect customer feedback directly on their own websites without redirecting users to our SaaS product page.
  2. **Multiple Custom Templates & Design Customizer**: Add multiple design templates and customizable themes for both the testimonial wall/widget displays and the submission forms (custom colors, card styles, and layout variations).
  3. **Automated AI Moderation**: Implement automated background AI moderation where positive testimonials (e.g. 5-star positive sentiment) get auto-approved after a configurable duration if not manually moderated.
  4. **Social Media Sharing**: Add a 1-click social media share feature (LinkedIn, X/Twitter) allowing business owners to generate beautiful social graphics or direct share links for top customer praise.
  5. **Live Deployment**: Deploy the frontend to Vercel and backend to Render for online clicking.