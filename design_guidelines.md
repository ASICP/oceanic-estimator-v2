# Design Guidelines: Esteemed Ventures Multi-Agent Cost Estimator

## Design Approach
**Reference-Based Approach**: Drawing inspiration from premium financial platforms like Notion (for wizard flows), Linear (for clean interfaces), and enterprise tools like Salesforce for professional data presentation.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Dark Mode: Deep navy blue (220 85% 8%) for backgrounds
- Light Mode: Clean white (0 0% 98%) with subtle gray tones
- Brand Accent: Professional blue (220 90% 50%) for CTAs and highlights
- Success: Muted green (140 60% 45%) for positive metrics and savings
- Warning: Amber (45 90% 55%) for validation alerts

**Gradient Treatments:**
- Subtle blue-to-indigo gradients (220 90% 50% to 250 80% 60%) for hero sections and key CTAs
- Light gray gradients (0 0% 98% to 0 0% 94%) for card backgrounds in light mode

### B. Typography
**Font Stack:** Inter via Google Fonts CDN
- Headlines: Inter 600-700 weight, 24-32px for section titles
- Body: Inter 400-500 weight, 14-16px for content
- Data/Numbers: Inter 500-600 weight for emphasis on cost figures
- Captions: Inter 400 weight, 12-14px for helper text

### C. Layout System
**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16
- Consistent p-6 for card padding
- m-8 for section spacing
- gap-4 for form elements
- h-12 for input heights

### D. Component Library

**Navigation:**
- Clean header with EV logo, progress indicator for wizard steps
- Breadcrumb navigation showing current step (1 of 5)

**Forms:**
- Large, accessible input fields with floating labels
- Dropdown selectors for agent selection with avatars
- Multi-select components for workflow capabilities
- Validation states with inline messaging

**Data Displays:**
- Interactive pie charts for cost breakdowns
- Slider components for sensitivity analysis
- Card-based layouts for agent profiles and presets
- Tabular data for detailed cost itemization

**Overlays:**
- Modal dialogs for agent details and confirmations
- Tooltip overlays for help text and definitions
- Loading states with skeleton screens

### E. Key Design Patterns

**Wizard Flow:**
- Progress bar at top showing 5 distinct steps
- Large, centered cards (max-width-4xl) for each step
- Clear primary/secondary action buttons at bottom
- Persistent sidebar showing cost summary

**Agent Selection:**
- Grid layout of agent cards with photos, names, specialties
- Hover states revealing detailed capabilities
- Selected state with checkmarks and blue borders
- Compatibility badges and warnings

**Cost Dashboard:**
- Split-screen layout: charts left, details right
- Real-time updates with smooth transitions
- Export buttons prominently placed
- Comparison tables showing traditional vs. AI costs

## Visual Hierarchy
- Bold section headers with ample whitespace
- Cost figures prominently displayed in larger typography
- Secondary information in muted colors
- Clear visual separation between wizard steps

## Images
**No large hero image required** - focus on clean, professional interface with:
- Small agent avatar photos (64x64px rounded)
- Company logo in header
- Simple iconography from Heroicons for navigation and features
- Placeholder charts and graphs for cost visualizations

This design emphasizes trust, professionalism, and clarity - essential for a financial decision-making tool targeting investment professionals.