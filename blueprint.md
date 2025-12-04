# Project Blueprint: Legal Library Offline

## 1. Overview
"Legal Library Offline" is a mobile-first, offline-capable web application designed to provide law students, lawyers, and the general public with fast access to Indian legal bare acts (e.g., IPC, Constitution, BNS).

**Key Goals:**
- **Offline First:** All data is bundled; no internet required after initial load.
- **Fast Navigation:** Drill-down from Act -> Chapter -> Section.
- **Searchability:** Global search across all acts and specific content.
- **Readability:** Clean typography, adjustable font sizes, and clear formatting.

## 2. Architecture & Tech Stack
- **Framework:** React 19
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Routing:** React Router (HashRouter for easy static hosting compatibility)
- **Icons:** Lucide React

## 3. Directory Structure
```
/
├── index.html              # Entry HTML
├── index.tsx               # React Entry point
├── App.tsx                 # Main application shell & Routing components
├── data.ts                 # Central registry for Acts
├── types.ts                # TypeScript interfaces for data models
├── utils.ts                # Helper functions (search, flattening lists)
├── metadata.json           # App metadata
├── blueprint.md            # This file
├── parsing_template.ts     # Template for AI to parse PDFs into app format
└── acts/                   # Directory containing individual Act data files
    ├── ipc.ts              # Indian Penal Code data
    ├── constitution.ts     # Constitution of India data
    ├── bns.ts              # Bharatiya Nyaya Sanhita data
    └── simple_edict.ts     # Example data
```

## 4. Data Model
The data is structured hierarchically. See `types.ts` for strict definitions.

- **Act**: The root object (e.g., "Indian Penal Code").
  - `act_name`: String
  - `chapters`: Array of **Chapter** objects.
  - `schedules`: Array of **Schedule** objects (optional).
  - `sections`: Array of **Section** objects (if act has no chapters).

- **Chapter**:
  - `chapter_number`: String (e.g., "IV")
  - `chapter_title`: String
  - `sections`: Array of **Section** objects.

- **Section**:
  - `section_number`: String
  - `section_title`: String
  - `text`: String (Supports basic Markdown-like formatting: `\n\n` for paragraphs, tables).
  - `annotations`: Array of footnote objects.
  - `explanation`: Simplified summary string.

## 5. Adding New Acts
To maintain the app, new acts are added via the following workflow:

1.  **Source Data**: Obtain the text (PDF/Word).
2.  **Parse**: Use an LLM (like Gemini) with the `parsing_template.ts` prompt to convert the text into the valid TypeScript object structure.
3.  **Save**: Create a new file in `acts/` (e.g., `acts/evidence_act.ts`).
4.  **Register**: Import the new file in `data.ts` and add it to the `acts` array.

## 6. UI/UX Flow
1.  **Home Screen (`/`)**:
    - Search Bar (Global search).
    - List of available Acts.
2.  **Act Details (`/act/:id`)**:
    - List of Chapters/Schedules.
    - Accordion expansion to see Section titles.
3.  **Section View (`/act/:id/section/:secNum`)**:
    - Full text view.
    - Previous/Next navigation.
    - Toolbar (Font size, Copy, Share, Bookmark).
