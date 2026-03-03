PROJECT PROMPTS AND INSTRUCTIONS LOG

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

19. Repository Documentation: "Generate a README.md file in English containing a list of the main prompts we used to create the Agents and a summary of our technical architectural discussions."
