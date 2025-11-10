# AI Agent Workflow Log

## Agents Used

- Cursor ( Code Generation & Refactoring )

- ChatGPT ( Architecture and Domain Logic Reasoning )

- Copilot ( Inline Code Suggestions inside Editor )

## Workflow Summary

Describe the general pattern:

- Used ChatGPT to understand FuelEU Maritime domain rules (baseline, CB, banking, pooling).

- Used Cursor tasks to scaffold backend folders, services, ports, adapters.

- Used Copilot to auto-complete boilerplate React/Tailwind UI components.

## Prompts & Outputs (Examples)

### Example 1: Backend ComputeCB

Prompt: "Implement compliance balance calculation using FuelEU formula."

Output: A service function that correctly computes CB using target vs actual intensity and fuel energy content.

### Example 2: Pooling Redistribution Fix

Prompt: "Fix pooling to retain cbBefore and cbAfter values."

Output: Updated service where cbBefore is stored separately before redistribution.

### Example 3: Codebase Cleanup

Prompt: "Remove empty files from the codebase."

Output: Identified and removed 10 empty index.ts files that only contained comments, improving codebase cleanliness.

### Example 4: Enterprise UI Styling

Prompt: "Apply full enterprise UI styling across the React frontend."

Output: 
- Added global design tokens and CSS variables
- Created shared Layout component with consistent styling
- Standardized button styles in shared/styles.ts
- Implemented sidebar navigation with active states
- Applied consistent table styling across all pages
- Wrapped all page content in standardized panels

### Example 5: Dark Mode Implementation

Prompt: "Add dark mode functionality."

Output:
- Configured Tailwind for class-based dark mode
- Created useDarkMode hook with localStorage persistence
- Added dark mode toggle button in header
- Applied dark mode classes across all components
- Updated button styles with dark mode variants
- Ensured smooth transitions and no flash on load

### Example 6: Dark Mode Toggle Fix

Prompt: "Dark mode toggle button not working."

Issue: Toggle button was updating state correctly, but styles weren't applying.

Debugging Process:
- Added extensive console logging to track state changes and DOM class application
- Verified that `dark` class was being added/removed from `<html>` element
- Discovered Tailwind CSS v4 requires different configuration than v3

Solution:
- Removed `darkMode` config from `tailwind.config.js` (not needed in v4)
- Added `@variant dark (&:where(.dark, .dark *));` directive in CSS file
- Updated hook to apply both `dark` class and `data-theme="dark"` attribute
- Restarted dev server to apply Tailwind v4 configuration changes

Key Learning: Tailwind CSS v4 uses `@variant` directive in CSS instead of `darkMode` in config file.

### Example 7: Shared UI Components & Error Handling

Prompt: "Improve UX across pages with shared components and normalized error handling."

Output:
- Created shared ErrorBanner, Loading, and SuccessBanner components in `src/ui/components/`
- Updated all pages (Routes, Compare, Banking, Pooling) to use shared components
- Normalized API error handling to consistently handle `{ error, code }` format
- Added disabled/loading states to all action buttons to prevent duplicate submissions
- Implemented proper error display with dismissible banners and field-level validation

Key Features:
- Consistent error display across all pages
- Loading states for async operations
- Success feedback for user actions
- Button state management to prevent duplicate submissions

### Example 8: Theme System & Styling Improvements

Prompt: "Improve overall styling with Tailwind: create theme system, update tables, buttons, KPIs, and charts."

Output:
- Created `src/shared/theme.ts` with shared Tailwind classNames for consistent styling
- Updated all pages to use theme classes (pageContainer, sectionSpacing, pageTitle, etc.)
- Improved tables with `rounded-2xl`, `shadow-md`, `divide-y`, and hover row highlights
- Standardized buttons with primary/secondary variants and disabled states
- Created KPI card grid layout with `rounded-2xl`, `shadow-md`, and proper spacing
- Enhanced chart cards with padding, titles, and subtle shadows
- Ensured all colors are dark-mode friendly

Key Improvements:
- Single source of truth for styling (theme.ts)
- Consistent visual design across all pages
- Responsive spacing and layout
- Dark mode support throughout
- Better visual hierarchy with shadows and rounded corners

## Validation & Corrections

- Verified each API with Postman / Browser.

- Fixed schema inconsistencies with Prisma migrate feedback.

- Ensured no direct API calls were made from components — adapters used instead.

- Validated dark mode across all pages and components.

- Tested theme persistence across page refreshes.

- Debugged dark mode toggle issue: State was updating but styles weren't applying.

- Fixed Tailwind CSS v4 configuration: Replaced `darkMode` config with `@variant` directive in CSS.

- Verified dark mode functionality after configuration fix.

- Fixed JSX syntax error in RoutesPage: Missing closing div tag for padding wrapper.

- Fixed BankingPage bug: `handleApply` was calling `setLoading(false)` instead of `setApplying(false)`, preventing button re-enabling.

- Validated shared components work correctly across all pages.

- Tested error handling and loading states for all async operations.

- Verified theme classes are applied consistently across all components.

## Observations

- Cursor is excellent for structured tasks and incremental diffs.

- ChatGPT is better for domain reasoning (FuelEU rules).

- Copilot is good only for UI boilerplate.

- Cursor's codebase search is effective for finding empty files and understanding structure.

- Systematic approach to UI styling (design tokens → components → pages) ensures consistency.

- Debugging with console logs is essential when state updates but UI doesn't reflect changes.

- Version-specific configuration differences (Tailwind v3 vs v4) require careful documentation review.

- Shared components significantly reduce code duplication and ensure consistency.

- Theme system (shared classNames) makes styling updates easier and more maintainable.

- Normalized error handling improves user experience and debugging.

- Button state management (loading/disabled) prevents user confusion and duplicate submissions.

- Careful attention to state variable names prevents bugs (e.g., `setLoading` vs `setApplying`).

## Best Practices Followed

- Maintained Hexagonal Architecture.

- All external calls isolated to adapters.

- Domain logic lives in core application services.

- Consistent UI styling with shared components and design tokens.

- Dark mode implemented with proper state management and persistence.

- Clean codebase with no empty placeholder files.

- Shared UI components (ErrorBanner, Loading, SuccessBanner) for consistency.

- Theme system with centralized Tailwind classNames for maintainability.

- Normalized API error handling across all pages.

- Proper loading and disabled states for all async operations.

- Responsive design with consistent spacing and layout.

- Dark mode support throughout all components.
