# Aqarsas Assignment (Next.js + Mapbox)

Implementation of the Aqarsas assignment: build a responsive property browsing experience using **Next.js (App Router)** and **Mapbox GL**, based on a provided Figma design.

<img width="1059" height="686" alt="UI screenshot" src="https://github.com/user-attachments/assets/7065d60b-5519-4b91-b353-e01c10364895" />

## What this project does

- **Filter panel (RTL UI)**
  - Purpose (rent/sale)
  - Location (city + district)
  - Duration
  - Area range + price range
  - "Radical" toggle
  - Advanced search (date range)
- **Interactive Mapbox map**
  - Renders markers for the filtered properties
  - Zoom controls
  - Cycles between multiple map styles
  - Flies to the first result when filters change

## Tech stack

- **Next.js 16** (App Router)
- **React 19** + **TypeScript**
- **Mapbox GL JS** (`mapbox-gl`)
- **Zustand** for state management and filtering logic
- **Tailwind CSS v4**
- **shadcn/ui + Radix UI** components
- **Lucide** icons
- **Framer Motion** (animations)

## Getting started

### 1) Install

```bash
npm install
```

### 2) Configure environment variables

This project requires a Mapbox token.

- Create a `.env.local` file in the project root (or copy from `.env.example` if available).
- Add:

```bash
NEXT_PUBLIC_MAPBOX_TOKEN=YOUR_MAPBOX_TOKEN
```

You can create a token from: https://account.mapbox.com/

### 3) Run the dev server

```bash
npm run dev
```

Then open: http://localhost:3000

## Scripts

- **`npm run dev`**: start Next.js in development mode
- **`npm run build`**: build for production
- **`npm run start`**: start the production server

## Project structure (high level)

```text
src/
  app/
    page.tsx                     # Renders Filter + Map
    layout.tsx                   # Global layout
    globals.css                  # Global styles
    store/
      useFilterProperties.ts     # Zustand store + filter logic
    types/
      property-type.ts           # Property/GeoJSON types
  components/
    feature/
      Filter.tsx                 # Desktop sidebar + mobile drawer
      Map.tsx                    # Mapbox map + markers
    layout/filter/               # Filter UI building blocks
  constans/
    propertiesData               # Mock property dataset (local)
```

## Notes / troubleshooting

- **Blank map / token error**: ensure `NEXT_PUBLIC_MAPBOX_TOKEN` is set in `.env.local`, then restart `npm run dev`.
- **RTL**: the filter UI uses `dir="rtl"` in multiple places; the map itself remains LTR.


## My Development Approach

This is the Implimintation of Aqarsas Assiginment where the objective is to Create a web page using React and Mapbox, based on a provided Figma design
<img width="1059" height="686" alt="image" src="https://github.com/user-attachments/assets/7065d60b-5519-4b91-b353-e01c10364895" />

## Objective
StackEdit stores your files in your browser, which means all your files are automatically saved locally and are accessible **offline!**

## Responsibilities

The system has 4 core responsibilities:

1.  **Data**
    
    -   Properties list
        
    -   Selected property
        
    -   Filters / map bounds
        
2.  **Map Engine**
    
    -   Rendering map
        
    -   Markers
        
    -   Camera movement (flyTo, zoom)
        
3.  **UI**
    
    -   Sidebar list
        
    -   Property card
        
    -   Popups
        
4.  **Orchestration**
    
    -   Sync Control Panal ↔ map
        
    -   Handle user interactions

## My Development Approach
I will follow a feature-based branching strategy where **map**, **sidebar**, and **filter panel** are developed independently and integrated via shared state. 



