# Geotab Analytics Copilot

## Table of Contents

- [Brief description of the problem I solved](#brief-description-of-the-problem-i-solved)
- [GEOTAB ANALYTICS - BACKEND ARCHITECTURE](#geotab-analytics---backend-architecture)
- [GEOTAB ANALYTICS - FRONTEND ARCHITECTURE](#geotab-analytics---frontend-architecture)
- [Backend prompts examples](#backend-prompts-examples)
- [Frontend prompts examples](#frontend-prompts-examples)
- [Frontend main prompt](#frontend-main-prompt)
- [Youtube video](#youtube-video)

===============================================================================

## Brief description of the problem I solved

===============================================================================

The Problem: Telemetry tells you how a truck is running, but it’s blind to the chaos outside. I built GeotabAnalytics to bridge that gap. Our AI Copilot cross-references Geotab data with real-time web events (crashes, weather, road risks) to reroute vehicles on the fly, cut CO2 from static idling, and prevent accidents before they happen.

The "Vibe Coding" Journey: It felt more like directing than programming. Instead of fighting syntax and boilerplate, I focused entirely on the logic and prompt engineering. I just described the "vibe" I wanted—a bilingual, cyberpunk-inspired UI with glassmorphism—and the AI translated it into React and Tailwind. Even when we hit complex issues, like map coordinate collisions or background-fetch bugs, we solved them conversationally. It was pure flow state.

===============================================================================

## GEOTAB ANALYTICS - BACKEND ARCHITECTURE

===============================================================================

1. CORE ARCHITECTURE STRATEGY
   The system follows a "Specialized Agent Pipeline." Instead of one agent doing
   everything, we split tasks to avoid tool conflicts (Google Search vs. Custom
   Geocoding) and to maximize speed through parallel processing.

2. THE AGENT FLEET
   All agents are generated via Factory Functions to support dynamic language
   injection (i18n).

A. News Searcher Agent (The Investigator)

- Task: Crawls the live web for traffic, security, and weather events.
- Tool: GOOGLE_SEARCH (Native Grounding).
- Rules: Categorizes events into Road Risk, Security, and Social Blockade
  while ensuring source URLs are cited.

B. Map Formatter Agent (The Cartographer)

- Task: Transforms unstructured text into a strict, geocoded JSON.
- Tool: geocode_locations_batch (Custom Tool).
- Rules: Converts location names to (lat, lon) using the Google Maps API
  and translates descriptions into the user's requested language.

C. Fleet & Global Analyzers

- Task: Processes raw Geotab telemetry.
- Goal: Generates EV transition recommendations and executive summaries
  for fleet managers.

3. TECHNICAL COMPONENTS

- AgentRunner (runner.ts):
  The bridge between the ADK and Gemini. It manages in-memory sessions,
  user history, and handles stream processing. It includes a "Safety Shield"
  to prevent server crashes if the AI returns an empty or blocked response.

- Geocoding Batch Tool (agent.tool.ts):
  A high-performance custom tool that uses 'Promise.all' to resolve multiple
  addresses in parallel, reducing geocoding time from minutes to seconds.

- Agent Service (index.ts):
  The Orchestrator. It triggers the Investigator first, passes the raw text
  to the Cartographer, and performs a final JSON sanitization before
  sending data to the Frontend.

4. DATA FLOW (REQUEST LIFECYCLE)
   1. Request: Controller receives 'lang' (en/es) from the React Frontend.
   2. Investigation: Searcher Agent finds the 4-5 most critical real-time events.
   3. Geolocation: Formatter Agent maps those events to coordinates in a single batch.
   4. Sanitization: Service Layer parses the JSON and adds fallback data if needed.
   5. Response: MapView.jsx receives a clean JSON payload and renders the UI.

===============================================================================

## GEOTAB ANALYTICS - FRONTEND ARCHITECTURE

===============================================================================

CORE ARCHITECTURE STRATEGY
The frontend is built as a modern Single Page Application (SPA) using React. It
prioritizes modularity and real-time responsiveness to translate raw telemetry
into actionable visual intelligence.

MAIN COMPONENTS

A. Navigation & Global Controls (Sidebar.jsx)

Task: Manages application state and user preferences.

Controls: Includes a view switcher, a theme toggle (Dark/Light mode), and a
bilingual language toggle (EN/ES).

Logic: Uses i18next to provide immediate translation across the entire
interface.

B. Intelligence Map (MapView.jsx)

Task: Visualizes environmental and traffic risks in real-time.

Integration: Connects to the Google Maps API with a custom "Dark Cyberpunk"
style.

AI Layers: Renders dynamic "Orbs" for Safety, Road Risk, and Natural Disasters
based on AI-processed event data.

C. Business Intelligence Dashboard (PerformanceView.jsx)

Task: Monitors fleet efficiency, fuel consumption, and CO2 emissions.

Logic: Implements a "Background Fetch" pattern using 'useRef' to update data
silently during language changes without unmounting the UI.

Stat Cards: Reusable components with SVG animations to display real-time
KPIs like Idling Time and Operating Costs.

D. AI Agent Panel (AgentPanel.jsx)

Task: Acts as the interactive "Copilot" for the fleet manager.

Logic: Dynamically maps AI categories to specific UI themes, icons, and
Geotab-specific actions like "Activate preventive engine kill".

DATA & STATE MANAGEMENT

View Orchestration (App.jsx):
Manages the lifecycle of the application, including the login state, theme
application to the root HTML element, and centralizing the AI analysis
logic.

Internationalization (src/i18n.js):
The central dictionary for the application. It manages dual-language
resources and handles dynamic text injection for UI labels and AI
recommendations.

Responsive Styling (index.css):
Uses Tailwind CSS utilities and custom layers to implement Glassmorphism
panels and a specialized "Autofill Fix" to ensure text visibility across
browsers and themes.

FRONTEND DATA FLOW (REQUEST LIFECYCLE)

Interaction: User clicks "Analyze" or changes language in the Sidebar.

API Request: App.jsx appends the 'lang' parameter to fetch requests to
ensure the Backend LLM responds in the correct language.

Loading State: The UI activates localized spinners (analyzingId) to
provide immediate visual feedback.

UI Update: The Agent Panel or MapView receives the JSON payload and
updates the state, triggering localized rendering and animations.

===============================================================================

## Backend prompts examples

===============================================================================

1. Hackathon Pitch Strategy: "Give me ideas on how to record a demonstration video where it is explicitly clear that I am using the Google ADK as the brain of my project."

2. Exploring ADK Capabilities: "Explain what other tools the Gemini ADK has. I want to win the hackathon—is it possible to query tweets or news to map traffic and weather events?"

3. Spatial Intelligence Agent Design: "Design an agent that reads tweets from government agencies (like CAPUFE) and news about traffic and weather, calculates their coordinates, and formats them to be displayed as zones on a map and as KPIs."

4. TypeScript & ADK Tools Debugging: "Fix this TypeScript error: 'Type is not assignable to type ToolUnion'. I am using Zod schemas for my custom ADK tools but it is failing to compile."

5. API Conflict & Agent Orchestration: "Fix this error: 'Built-in tools and Custom tools cannot be combined in the same request'. Show me how to structure the code to solve this limitation."

6. React Map UI Troubleshooting: "Tell me why the information card (InfoWindow) is not opening when I click on the map icons in my React application."

7. React Component Refactoring: "Modify my React code so that clicking a map pin opens the incident details inside the 'AgentPanel' component instead of floating over the map. Don't delete my existing logic."

8. Refining Data Volume & Sources: "Update the 'newsSearcherAgent' prompt to strictly require source URLs. Force it to search for a maximum of 10 to 20 road incidents and exactly 3 weather events."

9. Preserving Sources in JSON Parsing: "Update the 'mapFormatterAgent' prompt so that it extracts the source URLs found by the first agent and includes them in the final JSON structure."

10. Integrating Real Geocoding: "The mock tool is returning the same coordinates for everything. Update the 'geocodingTool' to calculate real coordinates using the actual Google Maps API."

11. Expanding Hackathon Use Cases: "What other news categories can I search for to make my project less generic and win the hackathon? Give me the exact search queries and the pitch for the judges."

12. API Key Management: "Explain where the ADK agent establishes or reads the Gemini API key, because I don't see it explicitly defined in my code."

13. Enhancing Map Visuals: "What else can I add or draw on my React Google Map to make it look visually impressive and win awards?"

14. Strict Category Normalization: "Update the 'mapFormatterAgent' and the 'newsSearcherAgent' to strictly categorize the map events into exactly 4 types: 'Riesgo Vial', 'Seguridad', 'Bloqueo Social', and 'Desastre Natural'."

15. Fixing Frontend Render Error: "Fix this React error: 'Element type is invalid: expected a string but got: undefined'. It crashed my map after we updated the event categories."

16. Implementing Multilingual Support (i18n): "Modify the backend agents so they can receive a 'lang' property ('es' or 'en') from the request, forcing the AI to translate the descriptions but keeping the JSON keys intact."

17. Refactoring Express Controllers: "Update my Express service and controller files so they can dynamically instantiate the agent runners and pass the 'lang' parameter on every request."

18. Handling LLM Exceptions: "Fix this backend error: 'TypeError: Cannot read properties of undefined (reading parts)' that crashes my server when running the global fleet agent."

===============================================================================

## Frontend prompts examples

===============================================================================

Prompt:

Write a highly professional and persuasive project description (under 500 characters) for a web application developed for the Geotab Hackathon. The app is based on telemetry reports, uses AI to generate executive summaries and fleet predictions, and has strong potential for integration into the ecosystem. Focus on sustainability and operational cost reduction.

Map Rendering & Coordinate Deduplication

Prompt:

My React Google Maps component is only rendering a single marker even though the API returns multiple traffic events. All events have the exact same latitude and longitude. How can I fix this in the frontend to prevent React key collision, and what prompt should I add to my backend LLM to force it to approximate unique coordinates for different street events?

UI/UX: Flat Elevated Design & Intelligent Animations

Prompt:

Update my Map component UI. Remove the 3D glassmorphism effects and replace them with a modern 'Flat Elevated' design using Tailwind CSS (solid colors, clean borders, and soft shadows). Additionally, configure the radar-ping animation (animate-ping) so it only triggers dynamically if the event description explicitly mentions a car crash or accident.

Dynamic Filtering & Event Categorization

Prompt:

Implement a dynamic filtering system in the Map component. Consolidate all backend events into three main categories: 'Road Risk' (Riesgo Vial), 'Security' (Seguridad), and 'Natural Disaster' (Desastre Natural). Assign specific Lucide-react icons (CarCrash, ShieldAlert, Flame) and distinct Tailwind color themes to each category. Create a pill-style toggle bar to hide/show these categories on the map.

AI Agent Panel Enhancements

Prompt:

Update the AI Agent Panel component. If the AI payload includes a source property, render it dynamically. If the source is a valid URL (starts with 'http'), render it as a clickable blue hyperlink saying 'View official report'. Otherwise, render it as plain text. Also, ensure the panel clears its previous state immediately when a new analysis is triggered.

Global Internationalization (i18n) Setup

Prompt:

Implement a global bilingual system (Spanish/English) across the entire React application using react-i18next. Provide the global configuration setup, and update the API fetch calls to append a ?lang= query parameter dynamically based on the active language state so the backend LLM can respond in the correct language.

UI Components and Theme Toggle

Prompt:

Enhance the Login View using a refined aesthetic with Tailwind CSS. Add a floating control panel in the top right corner containing a Dark/Light mode toggle and a custom, complex 'pill-style' language switcher that slides smoothly between 'ES' and 'EN'. Ensure the text contrast adapts correctly between light and dark modes.

CSS Webkit Autofill Bug Fix

Prompt:

Fix a CSS bug where Chrome's -webkit-autofill makes the input text invisible on light mode. Provide a Tailwind/CSS solution that forces dark text for autofilled inputs in light mode, and white text for autofilled inputs in dark mode, overriding the browser's default yellow background.

State Management & Background Fetching

Prompt:

Fix a re-rendering issue in the Performance View. Currently, when the user toggles the language via i18n, the useEffect triggers a full reload, wiping the UI and showing a full-screen spinner. Implement a 'Background Fetch' pattern using useRef to track the initial load, so language changes update the data silently behind the scenes without unmounting the data tables.

===============================================================================

## Frontend main prompt:

===============================================================================

Act as an expert Senior Frontend Developer specializing in React and Tailwind CSS. Your goal is to create a functional prototype within a single HTML file (using React, ReactDOM, Babel, and Tailwind via CDN, along with Lucide Icons).

I will provide you with a base code (a React App component) that features a highly specific "Cyber-SaaS" design (deep dark mode, neon accents, glassmorphism effects, AI pulse). Your task is to use that visual design as a strict template and build a complete application with the following state logic and flow:

1. Global State Logic (React useState):

- currentScreen: Controls the current view ('login', 'dashboard-rendimiento', 'dashboard-conductores').
- theme: Controls the visual theme ('dark' or 'light'). Defaults to 'dark'.
- isAgentOpen: Boolean to show/hide the Agent's right panel (defaults to false on small screens, true on large screens).
- agentAnalysis: Object that stores the current analysis result to display it in the chat.

2. Screen Flow:
   Login Screen (currentScreen === 'login'):

- Must maintain the base code's aesthetic. Centered background.
- Central card with a glassmorphism effect (bg-neutral-900/50 backdrop-blur).
- Title: "Geotab Vibe Intelligence".
- 3 Inputs (Username, Password, Database) with subtle borders and neon blue focus states.
- Main "Login" button that changes currentScreen to 'dashboard-rendimiento' when clicked.

Main Layout (If not on login):

- Use exactly the flex-row structure from the base code.
- Sidebar: Must be functional. The LayoutDashboard icon switches to the Performance view. The UserCircle icon switches to the Drivers view. The bottom settings button (Settings or a Sun/Moon icon) must toggle the theme state.
- Light/Dark Theme: Adapt the base code to support both themes. Use Tailwind classes like dark:bg-[#0a0a0a] bg-gray-50, dark:text-white text-gray-900, etc. Keep the neon accents (Blue and Green) bright in both themes.

3. View Content (Center Area):
   View 1: Performance & EV (dashboard-rendimiento):

- This is exactly the center content from the provided base code (the 3 fuel/CO2 StatCards and the "Fleet Status" table with vehicles).

View 2: Drivers (dashboard-conductores):

- Create an alternative view with the same layout but different data.
- StatCards: "Average Rating" (e.g., 85/100, green icon), "Safety Exceptions" (e.g., 45, red icon), "At-Risk Drivers" (e.g., 2, yellow icon).
- Table: "Driver Status". Columns: ID/Name, Exceptions, Rating (use the progress bar from the base code), and the "Analyze" button. Use mock data (e.g., John Doe, 20 events, rating 70).

4. AI Agent Functionality (Right Panel):

- Use exactly the right panel from the base code (the header with "AI ONLINE" and the pulse, and the chat container).
- Link the "Analyze" buttons from the tables: When a vehicle/driver is clicked, show a loading state on the button (like in your base code). After 1.5s, update the agentAnalysis state and ensure the right panel is visible (isAgentOpen = true).
- The chat must display a simulated message based on the analyzed item (e.g., if it analyzes John Doe, the AI says: "John Doe has 20 safety events. I suggest scheduling coaching." and displays the action buttons just like your base design).

Here is the base code you must strictly use as a design and component structure reference:

// [HERE THE SYSTEM MUST ASSUME THE FULL CODE YOU PROVIDED IS PASTED]

Constraints:

- It must be a single index.html file.
- Include the Babel, React, ReactDOM, and Tailwind CDN scripts in the <head>.
- Ensure Lucide icons render correctly in a bundler-less browser environment (use the web component or configure Babel to import from lucide-react via a compatible CDN like esm.sh).

===============================================================================

## Youtube video

===============================================================================

https://www.youtube.com/watch?v=BGzI7i0RTOw
