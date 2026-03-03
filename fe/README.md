# 🚀 Vibe AI - Development Prompt Engineering Log

This document contains the curated list of prompt instructions used to build, debug, and scale the **Vibe EcoMap & Analytics Platform** using React, Tailwind CSS, and Google Maps.

---

### 1. 📝 Project Overview & Pitch

**Prompt:**

> "Write a highly professional and persuasive project description (under 500 characters) for a web application developed for the Geotab Hackathon. The app is based on BI Analytics v2 reports, uses AI to generate executive summaries and fleet predictions, and has strong potential for integration into the IRIS ecosystem. Focus on sustainability and operational cost reduction."

### 2. 🗺️ Map Rendering & Coordinate Deduplication

**Prompt:**

> "My React Google Maps component is only rendering a single marker even though the API returns multiple traffic events. All events have the exact same latitude and longitude. How can I fix this in the frontend to prevent React key collision, and what prompt should I add to my backend LLM to force it to approximate unique coordinates for different street events?"

### 3. 🎨 UI/UX: Flat Elevated Design & Intelligent Animations

**Prompt:**

> "Update my Map component UI. Remove the 3D glassmorphism effects and replace them with a modern 'Flat Elevated' design using Tailwind CSS (solid colors, clean borders, and soft shadows). Additionally, configure the radar-ping animation (`animate-ping`) so it only triggers dynamically if the event description explicitly mentions a car crash or accident."

### 4. 🚦 Dynamic Filtering & Event Categorization

**Prompt:**

> "Implement a dynamic filtering system in the Map component. Consolidate all backend events into three main categories: 'Road Risk' (Riesgo Vial), 'Security' (Seguridad), and 'Natural Disaster' (Desastre Natural). Assign specific Lucide-react icons (CarCrash, ShieldAlert, Flame) and distinct Tailwind color themes to each category. Create a pill-style toggle bar to hide/show these categories on the map."

### 5. 🤖 AI Agent Panel Enhancements

**Prompt:**

> "Update the AI Agent Panel component. If the AI payload includes a `source` property, render it dynamically. If the source is a valid URL (starts with 'http'), render it as a clickable blue hyperlink saying 'View official report'. Otherwise, render it as plain text. Also, ensure the panel clears its previous state immediately when a new analysis is triggered."

### 6. 🌐 Global Internationalization (i18n) Setup

**Prompt:**

> "Implement a global bilingual system (Spanish/English) across the entire React application using `react-i18next`. Provide the global configuration setup, and update the API fetch calls to append a `?lang=` query parameter dynamically based on the active language state so the backend LLM can respond in the correct language."

### 7. 🔐 Glassmorphism Login & Complex UI Components

**Prompt:**

> "Enhance the Login View using a glassmorphism aesthetic with Tailwind CSS. Add a floating control panel in the top right corner containing a Dark/Light mode toggle and a custom, complex 'pill-style' language switcher that slides smoothly between 'ES' and 'EN'. Ensure the text contrast adapts correctly between light and dark modes."

### 8. 🐛 CSS Webkit Autofill Bug Fix

**Prompt:**

> "Fix a CSS bug where Chrome's `-webkit-autofill` makes the input text invisible on light mode. Provide a Tailwind/CSS solution that forces dark text for autofilled inputs in light mode, and white text for autofilled inputs in dark mode, overriding the browser's default yellow background."

### 9. ⚡ State Management & Background Fetching

**Prompt:**

> "Fix a re-rendering issue in the Performance View. Currently, when the user toggles the language via i18n, the `useEffect` triggers a full reload, wiping the UI and showing a full-screen spinner. Implement a 'Background Fetch' pattern using `useRef` to track the initial load, so language changes update the data silently behind the scenes without unmounting the data tables."
