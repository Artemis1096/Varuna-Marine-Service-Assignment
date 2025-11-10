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

## Validation & Corrections

- Verified each API with Postman / Browser.

- Fixed schema inconsistencies with Prisma migrate feedback.

- Ensured no direct API calls were made from components — adapters used instead.

- Validated dark mode across all pages and components.

- Tested theme persistence across page refreshes.

- Debugged dark mode toggle issue: State was updating but styles weren't applying.

- Fixed Tailwind CSS v4 configuration: Replaced `darkMode` config with `@variant` directive in CSS.

- Verified dark mode functionality after configuration fix.

## Observations

- Cursor is excellent for structured tasks and incremental diffs.

- ChatGPT is better for domain reasoning (FuelEU rules).

- Copilot is good only for UI boilerplate.

- Cursor's codebase search is effective for finding empty files and understanding structure.

- Systematic approach to UI styling (design tokens → components → pages) ensures consistency.

- Debugging with console logs is essential when state updates but UI doesn't reflect changes.

- Version-specific configuration differences (Tailwind v3 vs v4) require careful documentation review.

## Best Practices Followed

- Maintained Hexagonal Architecture.

- All external calls isolated to adapters.

- Domain logic lives in core application services.

- Consistent UI styling with shared components and design tokens.

- Dark mode implemented with proper state management and persistence.

- Clean codebase with no empty placeholder files.
