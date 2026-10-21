# Venice Tile & Marble — Modernized Website & Interactive Slider Suite

A complete modernization of **[venicetileandmarble.com](https://www.venicetileandmarble.com/)**, transforming the original Squarespace 7.1 static masonry/grid galleries into an architectural luxury experience with dual interactive sliders across all image pages.

---

## 1. Analysis of the Original Website (`venicetileandmarble.com`)

### Site Architecture & Content Inventory
| Original URL | Original Page Title | Image Count | Original Layout & Issues |
| :--- | :--- | :---: | :--- |
| `/home` | `Venice Tile & Marble` | 1 | Empty top section (`customSectionHeight: 0`), justified paragraph with lowercase `"bay's"` and `"northern california"`, 5 floating text links around a single static image, yellow marker highlight on phone number, and an empty `<footer>`. |
| `/rare-precious-stone` | `Rare Precious Stone — Venice Tile & Marble` | 19 | Static masonry gallery with zero intro text and hidden captions (stone titles only existed in `alt` / `sitemap.xml`). |
| `/kitchen` | `Kitchen — Venice Tile & Marble` | 51 | Unpaginated static grid gallery (`gallery-grid--layout-grid`) with zero captions rendered and raw filenames (`vt_barry_ln-0911.jpg`). |
| `/bathroom` | `Bath — Venice Tile & Marble` | 135 | Massive unpaginated vertical dump of 135 photos; only 13 had captions (with typos like `"Porcelin"`, `"Calcata"`, `"Quartzsite"`). |
| `/indoor` | `Indoor — Venice Tile & Marble` | 142 | 142 unpaginated photos on a single page; 19 captioned (`"Cutsom Medallion"`, `"Negro-Marquin"`, `"Quartzsite"`). |
| `/outdoor` | `Outdoor — Venice Tile & Marble` | 250 | 250 unpaginated photos dumped on a single page with zero captions or categorization, causing extreme scroll fatigue and heavy initial payload. |
| `/contact` | `Contact 1 — Venice Tile & Marble` | 0 | Left with placeholder title `"Contact 1"`, plain text contact info, no inquiry form, no map on the contact page itself, and a broken social icon linking to `http://instagram.com/squarespace`. |

---

## 2. What Was Modernized

1. **All Image Pages Converted to Interactive Sliders**:
   - **Primary Cinema Stage Slider** (`js/slider.js`):
     - High-resolution main stage (`?format=1500w`) with an adaptive **ambient blurred stone backdrop** (`#cinema-ambient-bg`) so both portrait and landscape photos frame cleanly without jarring black bars or forced cropping.
     - **Filter Toggle**: Switch between `All Slides` and `Featured Highlights` (curated captioned works & architectural estate shoots).
     - **Slideshow Autoplay**: Play/Pause toggle with a live top gold progress bar and selectable speed (`3s`, `4.5s`, `7s`).
     - **View Controls**: Toggle between `Fit Whole Slab` and `Fill Stage`, plus a dedicated `Fullscreen Stage` lightbox mode.
     - **Quick-Jump Scrubber & Step Controls**: Jump to any slide across large collections (up to 250 slides) using the range scrubber or `|◀ First`, `-10`, `+10`, `Last ▶|` buttons, plus keyboard (`←` / `→` / `Esc`) and touch swipe support.
   - **Synchronized Thumbnail Filmstrip Slider**:
     - Horizontal scrolling thumbnail carousel below the main stage that automatically centers the active slide and marks featured pieces with a gold indicator.
   - **Secondary 3-Up Curated Spotlight Carousel**:
     - Multi-card horizontal slider below the main stage showcasing featured installations; clicking any card smoothly scrolls up and loads that exact slide into the Cinema Stage.
   - **Homepage Hero Showcase Slider & Live Collection Tab Slider**:
     - `index.html` now features an auto-advancing **Hero Showcase Slider** plus an interactive **5-Collection Tab Slider** allowing visitors to preview and slide through all 5 categories right from the homepage.

2. **Editorial Polish & Authentic Brand Preservation**:
   - Preserves the authentic company story (*Founded in San Jose in June 1987, 35+ years of experience, natural stone, quartz, and porcelain slab fabrication, tile, pavers, concrete, hardscape, outdoor kitchens, fire pits, pool coping, artificial grass, pergolas*) with corrected capitalization and editorial typography (`Cormorant Garamond`, `Plus Jakarta Sans`, `JetBrains Mono`).
   - Corrects caption typos (`Porcelain`, `Calacatta`, `Quartzite`, `Nero Marquina`, `Custom Waterjet Stone Medallion`) and identifies architectural photography shoots (`Barry Lane Residence`, `Mountain Home Rd Estate`, `San Marcos Residence`).
   - Includes a **Dark Luxury Atelier / Light Alabaster Showroom** theme toggle in the sticky header.

---

## 3. Project File Structure

```text
Venice/
├── index.html                 # Modernized Home page with Hero Slider & Collection Tab Slider
├── rare-precious-stone.html   # Rare & Semi-Precious Stone Slider Page (19 slides)
├── kitchen.html               # Custom Kitchens & Waterfall Islands Slider Page (51 slides)
├── bathroom.html              # Luxury Bathroom & Custom Sinks Slider Page (135 slides)
├── indoor.html                # Bespoke Indoor & Waterjet Medallions Slider Page (142 slides)
├── outdoor.html               # Outdoor Living, Pools & Hardscape Slider Page (250 slides)
├── contact.html               # Modernized Contact, Showroom Map & Consultation Inquiry Page
├── assets/
│   └── logo.jpg               # Local copy of the Venice Tile & Marble Blue Agate "V" logo
├── css/
│   └── styles.css             # Complete responsive design system (Dark Atelier & Light Showroom themes)
└── js/
    ├── gallery-data.js        # All 597 original images & enriched captions from venicetileandmarble.com
    ├── slider.js              # Interactive Cinema Slider, Filmstrip Slider & Multi-Card Carousel engine
    └── main.js                # Theme switcher, mobile navigation & consultation form controller
```

## 4. Running Locally

You can open `index.html` directly in any modern browser, or serve the folder over HTTP:

```bash
python3 -m http.server 8080
```
Then visit `http://localhost:8080`.
