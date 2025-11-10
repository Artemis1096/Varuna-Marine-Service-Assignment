/**
 * Shared Tailwind CSS class names for consistent styling across the application
 */

// Layout
export const container = "container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl";
export const pageContainer = `${container} py-6 sm:py-8 lg:py-10`;
export const sectionSpacing = "space-y-6 sm:space-y-8";

// Headings
export const pageTitle = "text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100";
export const sectionTitle = "text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100";
export const cardTitle = "text-base font-medium text-gray-900 dark:text-gray-100";

// Cards
export const card = "rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md transition-colors";
export const cardPadding = "p-4 sm:p-6";
export const cardContent = `${card} ${cardPadding}`;

// KPI Cards
export const kpiCard = "rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md p-4 transition-colors";
export const kpiLabel = "text-sm font-medium text-gray-600 dark:text-gray-400";
export const kpiValue = "text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1";

// Tables
export const tableContainer = "overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md";
export const table = "w-full border-collapse divide-y divide-gray-200 dark:divide-gray-700";
export const tableHeader = "bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 uppercase text-xs tracking-wide font-semibold";
export const tableHeaderCell = "px-4 py-3 text-left";
export const tableRow = "hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors";
export const tableCell = "px-4 py-3 text-sm text-gray-800 dark:text-gray-200";

// Buttons
export const btnBase = "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
export const btnPrimary = `${btnBase} bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600`;
export const btnSecondary = `${btnBase} bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100`;
export const btnDanger = `${btnBase} bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600`;
export const btnSuccess = `${btnBase} bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 dark:bg-green-500 dark:hover:bg-green-600`;

// Inputs
export const inputBase = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors";
export const inputError = "border-red-300 dark:border-red-600 focus:ring-red-400 focus:border-red-400";

// Charts
export const chartCard = "rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md p-4 sm:p-6 transition-colors";
export const chartTitle = "text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100";

// Filters
export const filterContainer = "rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md p-4 sm:p-6 transition-colors";

// Badges
export const badgeBase = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
export const badgeSuccess = `${badgeBase} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`;
export const badgeDanger = `${badgeBase} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300`;
export const badgeInfo = `${badgeBase} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300`;

// Grid
export const kpiGrid = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4";

