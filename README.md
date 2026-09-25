# 💥 ComicAI — AI Story-to-Comic Generator

An AI-powered full-stack application that transforms any natural language story into a multi-panel visual comic book complete with consistent character designs, sequential panel illustrations, Cloudinary image storage, dialogue balloons, narrator captions, sound effects, layout modes, and single panel regeneration using Google Gemini and Imagen.

---

## ⚡ Complete End-to-End Pipeline (Phases 1-12)

$$\text{User Story} \xrightarrow{\textbf{Helmet \& Rate Limit}} \text{Gemini Analysis} \longrightarrow \text{Character Bible} \longrightarrow \text{Storyboard} \xrightarrow{\textbf{Imagen 3}} \text{Panel Images} \xrightarrow{\textbf{Cloudinary CDN}} \text{Cloud URLs} \xrightarrow[\textbf{JWT Auth}]{\textbf{MongoDB}} \text{Saved Archive} \xrightarrow{\textbf{Export Engine}} \begin{cases} \textbf{PNG Image} \\ \textbf{PDF Document} \end{cases}$$

---

## 🏛️ Project Architecture

```
radiant-fermi/
├── backend/                              # Node.js + Express REST API Server
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js               # MongoDB connection & status manager
│   │   │   └── gemini.js                 # Gemini AI configuration & client
│   │   ├── controllers/
│   │   │   ├── auth.controller.js        # User registration, login, profile (/api/auth)
│   │   │   ├── comic.controller.js       # Comic generation & user-linked Mongo auto-save
│   │   │   ├── comicsCrud.controller.js  # User-isolated CRUD APIs (POST/GET/DELETE /api/comics)
│   │   │   └── story.controller.js       # Story analysis controller
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js        # JWT authentication & optionalAuth guards
│   │   │   ├── errorHandler.js           # Centralized API error & 404 handlers
│   │   │   └── validateStoryRequest.js   # Input payload validation
│   │   ├── models/                       # Mongoose Models
│   │   │   ├── Comic.js                  # Comic document schema with user association
│   │   │   ├── Panel.js                  # Panel subdocument schema
│   │   │   ├── Story.js                  # Story model
│   │   │   └── User.js                   # User model with unique email & hashed password
│   │   ├── routes/
│   │   │   ├── auth.routes.js            # POST /register, POST /login, GET /me
│   │   │   ├── comic.routes.js           # POST /api/comic/generate, POST /api/comic/panel/regenerate
│   │   │   ├── comicsCrud.routes.js      # Protected GET, POST, DELETE /api/comics
│   │   │   └── story.routes.js           # POST /api/story/analyze
│   │   │   └── index.js                  # API route registry & health check
│   │   ├── services/
│   │   │   ├── characterService.js       # Character Bible & prompt consistency engine
│   │   │   ├── cloudinaryService.js      # Secure Cloudinary upload, URLs & cleanup
│   │   │   ├── gemini.service.js         # Story analysis & Character Bible parsing
│   │   │   └── imageService.js           # Sequential Imagen 3 panel generation & single-panel rendering
│   │   ├── utils/
│   │   │   ├── authUtils.js              # Scrypt password hashing & RFC 7519 JWT handling
│   │   │   ├── prompts.js                # System prompt engineering for comic scripts
│   │   │   └── validateSchema.js         # Schema validation & normalizer
│   │   ├── app.js                        # Express app & middleware pipeline
│   │   └── server.js                     # HTTP server entry point
│   ├── .env.example                      # Environment template (Gemini, Cloudinary, MongoDB, JWT)
│   └── package.json
│
├── frontend/                             # React 18 + Vite + Tailwind CSS SPA
│   ├── src/
│   │   ├── api/
│   │   │   ├── authApi.js                # Client auth methods, storage & token management
│   │   │   └── comicApi.js               # API client with automatic JWT header injection
│   │   ├── components/
│   │   │   ├── LandingPage.jsx           # Phase 11: Commercial SaaS Hero, 6-Step Journey & Feature Matrix
│   │   │   ├── Header.jsx                # Navigation switcher (Home, Create, My Comics), Profile badge, Theme toggle
│   │   │   ├── HeroSection.jsx           # Hero banner & value proposition
│   │   │   ├── StoryInput.jsx            # Textarea, panel picker (4,6,8), style & language selectors
│   │   │   ├── StoryboardView.jsx        # Phase 11: Tabbed Storyboard scene inspector & Character Bible drawer
│   │   │   ├── ComicDetailsModal.jsx     # Phase 11: Comic metadata, full script reader & export triggers modal
│   │   │   ├── SkeletonLoader.jsx        # Phase 11: Shimmering comic page wireframes during generation
│   │   │   ├── Toast.jsx                 # Phase 11: Animated floating comic notifications (success/error/info/warning)
│   │   │   ├── AuthModal.jsx             # Comic-styled Sign In & Create Account modal
│   │   │   ├── MyComics.jsx              # Protected user comics archive with search & cover grid
│   │   │   ├── ComicToolbar.jsx          # Layout switcher, Edit Mode, Add Panel, Save to DB, PNG/PDF Export
│   │   │   ├── ComicPage.jsx             # Professional comic book page renderer with masthead & gutters
│   │   │   ├── ComicPanel.jsx            # Panel card with Cloudinary URL display, Regenerate, and In-place editing
│   │   │   ├── SpeechBubble.jsx          # Auto-resizing Speech, Thought, and Shout dialogue balloons
│   │   │   ├── Caption.jsx               # Classic editable yellow narrator caption box
│   │   │   ├── ComicViewer.jsx           # Master container orchestrating toolbar, page, and Character Bible
│   │   │   ├── CharacterList.jsx         # Character Bible roster with traits (appearance, clothing, keywords)
│   │   │   ├── LoadingState.jsx          # Sequential panel generation progress checklist & creative tips
│   │   │   ├── ErrorMessage.jsx          # High-contrast alert with retry action
│   │   │   └── EmptyPreview.jsx          # Ghost wireframe layout
│   │   ├── services/
│   │   │   └── comicExportService.js     # Phase 10: High-Res 2D Canvas, PNG & PDF 1.4 Export Engine
│   │   ├── styles/
│   │   │   └── index.css                 # Tailwind CSS + Comic speech bubbles & theme styling
│   │   ├── App.jsx                       # Main application state, auth session, toast provider & view router
│   │   └── main.jsx                      # React DOM rendering entry
│   ├── tailwind.config.js                # Custom fonts (Bangers, Kalam, Inter) & dark mode
│   ├── vite.config.js                    # Vite configuration
│   └── package.json
│
└── README.md                             # Project documentation
```

---

## 🔒 Security & Environment Variables

`CLOUDINARY_API_SECRET`, `GEMINI_API_KEY`, `JWT_SECRET`, and `MONGODB_URI` are strictly confined to the backend in `backend/.env`.

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
MONGODB_URI=mongodb://localhost:27017/comicai
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

---

## 🚀 How to Run the Project

### 1. Start Backend Server

```bash
cd backend
npm install
npm run dev
```
*Backend runs on `http://localhost:5000` (Health check: `http://localhost:5000/api/health`, Auth API: `http://localhost:5000/api/auth`, Comics API: `http://localhost:5000/api/comics`).*

### 2. Start Frontend Application

```bash
cd frontend
npm install
npm run dev
```
*Open your browser at `http://localhost:3000`.*
