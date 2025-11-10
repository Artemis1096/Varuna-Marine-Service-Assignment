# Reflection

This project demonstrated how AI-assisted development can support both architecture reasoning and code generation.

## What Worked Well

- ChatGPT was highly effective for explaining FuelEU Maritime compliance formulas and translating regulation rules into domain logic.

- Cursor's task-based workflow sped up creating consistent ports, adapters, and services.

- Copilot was useful for UI scaffolding and repetitive JSX patterns.

- Cursor's systematic approach to UI refactoring (design tokens → shared components → page updates) ensured consistency.

- Dark mode implementation required troubleshooting Tailwind CSS v4 configuration differences.

## Efficiency Gains

- Architectural design decisions were clarified faster.

- Logical bugs (baseline logic, pooling redistribution correctness) were corrected through iterative AI reasoning.

- Development time was significantly lower than building without AI assistance.

- Codebase cleanup (removing empty files) improved maintainability.

- Enterprise UI styling was applied systematically across all pages in a single session.

- Dark mode was added comprehensively across the entire frontend with minimal effort.

## Challenges

- AI sometimes hallucinated field names, requiring validation against schema and error logs.

- Pooling redistribution required step-by-step debugging to ensure no state overwriting.

- Ensuring dark mode classes were applied consistently across all components required careful review.

- Balancing design token approach with Tailwind's utility classes required thoughtful decisions.

- Dark mode toggle initially didn't work despite correct state management - discovered Tailwind CSS v4 requires `@variant` directive instead of `darkMode` config.

- Debugging process involved extensive console logging to track state changes and DOM manipulation, revealing the issue was configuration-related rather than code logic.

## Recent Improvements

### Codebase Cleanup
- Removed 10 empty index.ts files that only contained comments
- Improved codebase cleanliness and maintainability

### Enterprise UI Styling
- Implemented global design tokens with CSS variables
- Created shared Layout component with consistent header and navigation
- Standardized button styles in shared/styles.ts
- Applied consistent table styling across all pages
- Wrapped all page content in standardized panels with proper spacing

### Dark Mode
- Implemented class-based dark mode with Tailwind
- Created useDarkMode hook with localStorage persistence
- Added theme toggle button in header with sun/moon icons
- Applied dark mode classes across all components (tables, inputs, panels, buttons)
- Ensured smooth transitions and no flash on initial load
- System preference detection for first-time users
- **Troubleshooting**: Fixed dark mode toggle issue by updating Tailwind CSS v4 configuration
  - Issue: State was updating correctly but styles weren't applying
  - Root cause: Tailwind v4 requires `@variant dark` directive in CSS instead of `darkMode` in config
  - Solution: Added `@variant dark (&:where(.dark, .dark *));` to CSS and removed `darkMode` from config
  - Debugging: Used console logs to verify DOM class application and identify configuration issue

## Improvements for Future

- Add unit test coverage for banking and pooling edge cases.

- Extend UI with better validation and accessibility improvements.

- Add multi-ship and voyage aggregation support.

- Consider adding theme customization options (beyond light/dark).

- Add loading states and error boundaries for better UX.

- Implement responsive design improvements for mobile devices.

- Document version-specific configuration requirements (e.g., Tailwind v4 vs v3) to avoid similar issues.

- Create a troubleshooting checklist for common UI issues (state updates but no visual changes).
