import { useDarkMode } from "./useDarkMode";

export function Layout({ children }: { children: React.ReactNode }) {
  const { isDark, toggle } = useDarkMode();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-3 shadow-sm flex items-center justify-between transition-colors">
        <h1 className="font-semibold text-lg tracking-tight text-gray-900 dark:text-gray-100">
          FuelEU Maritime Dashboard
        </h1>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("Button clicked, current isDark:", isDark);
            toggle();
          }}
          type="button"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            // Sun icon - click to switch to light mode
            <svg className="w-5 h-5 text-gray-900 dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            // Moon icon - click to switch to dark mode
            <svg className="w-5 h-5 text-gray-900 dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </header>
      <main className="max-w-6xl mx-auto w-full py-8 px-4">
        {children}
      </main>
    </div>
  );
}

