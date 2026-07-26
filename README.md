# 💬 Testimonial Platform with Gemini AI Insights

A full-stack testimonial collection, moderation, and embeddable widget platform built with **React**, **Node.js/Express**, **MongoDB**, **Tailwind CSS**, and **Google Gemini AI**.

---

## 🌟 Key Features

### P0 — Core Loop (Completed)
- **Public Submission Form** (`/`): Allows customers to submit testimonials with name, email, company, rating, testimonial text, and optional photo upload (via Cloudinary integration). Includes anti-bot honeypot protection.
- **RESTful API Backend**: Express server persisting submissions to a real database (MongoDB via Mongoose).
- **Moderation Dashboard** (`/dashboard`): Allows business owners to filter submissions by status (`all`, `pending`, `approved`, `rejected`), approve or reject items, and delete testimonials. Features real-time count stat cards.
- **Public Wall of Love** (`/wall`): Displays approved testimonials with pagination. Rejected testimonials are strictly excluded.

### P1 — Embeddable Widget & Customization (Completed)
- **Embeddable Iframe Widget** (`/embed`): Renders approved testimonials cleanly on third-party websites.
- **Widget Customization via URL Params**:
  - `accent`: Custom accent color (e.g. `?accent=#4f46e5`).
  - `layout`: `grid` vs `list` layout.
  - `limit`: Custom items per page.
- **Third-Party HTML Demo**: Root `demo.html` page proving iframe embed functionality on an external website.
- **Empty, Loading & Error States**: Skeleton loaders, error retry banners, and empty state illustrations across all pages.

### P2 — Gemini AI Integration & Design (Completed)
- **Gemini AI Service (`aiService.js`)**: Integrates Google Gemini REST API (`gemini-2.5-flash` / `gemini-1.5-flash`) with automatic fallback retry and local heuristic parser.
- **Modular AI Component (`AiInsightCard.jsx`)**: Per-card **"✨ AI Insights"** toggle button delivering:
  - **Sentiment Analysis & Score**: (`Positive`, `Neutral`, `Negative` + confidence %).
  - **AI Summary**: Short 1-sentence summary quote.
  - **Key Highlights**: Bullet points of praised features.
  - **Hashtags**: Auto-generated topic tags.
- **Typography & Aesthetics**: Standardized on **Poppins** font family with smooth ambient background mesh gradients and responsive card micro-interactions.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local instance or MongoDB Atlas cluster connection string)

---

### Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd Saleshandy
   ```

2. **Backend Setup**:
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file inside the `server/` directory:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/testimonials
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd ../client
   npm install
   ```
   Create a `.env` file inside the `client/` directory:
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 🌐 Embeddable Widget Usage

To embed approved testimonials on any website, use an iframe code snippet:

```html
<iframe 
  src="http://localhost:5173/embed?accent=%234f46e5&layout=grid&limit=6" 
  width="100%" 
  height="600px" 
  frameborder="0"
></iframe>
```

### Testing the Demo Page
Open the `demo.html` file in the root directory in any web browser to see a live demonstration of the embeddable widget working on a simulated third-party landing page!

---

## 📁 Repository Structure

```
.
├── AGENTS.md             # Agent collaboration guidelines & workflow rules
├── JOURNAL.md            # Required development journal detailing trade-offs
├── README.md             # Project documentation & setup instructions
├── demo.html             # Third-party HTML demo proving widget iframe embed
├── client/               # React (Vite) Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AiInsightCard.jsx   # Modular AI insights component
│   │   │   ├── TestimonialCard.jsx# Testimonial presentation card
│   │   │   ├── Navbar.jsx          # Glassmorphism navbar
│   │   │   └── RatingStars.jsx     # Interactive star rating component
│   │   ├── pages/
│   │   │   ├── Submit.jsx          # Testimonial submission form
│   │   │   ├── Dashboard.jsx       # Moderation dashboard with stats
│   │   │   ├── Wall.jsx            # Public Wall of Love
│   │   │   └── Embed.jsx           # Standalone embed widget route
│   │   └── services/
│   │       ├── aiService.js        # Gemini AI API logic & fallback
│   │       └── api.js              # Axios REST API service
└── server/               # Node.js Express Backend
    ├── controllers/      # Route controllers
    ├── models/           # Mongoose schemas
    └── routes/           # Testimonial API routes
```
