import { useState, useEffect, useCallback } from "react";

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    
    // Check localStorage first
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) {
      const isDarkMode = stored === "true";
      // Apply immediately to avoid flash
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.removeAttribute("data-theme");
      }
      return isDarkMode;
    }
    
    // Fall back to system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    // Apply immediately to avoid flash
    if (prefersDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.removeAttribute("data-theme");
    }
    return prefersDark;
  });

  // Apply dark class when isDark changes
  useEffect(() => {
    const root = document.documentElement;
    
    console.log("useEffect running, isDark:", isDark);
    console.log("Before update - html classes:", root.className);
    
    if (isDark) {
      if (!root.classList.contains("dark")) {
        root.classList.add("dark");
      }
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("darkMode", "true");
      console.log("Added 'dark' class and data-theme to html element");
    } else {
      if (root.classList.contains("dark")) {
        root.classList.remove("dark");
      }
      root.removeAttribute("data-theme");
      localStorage.setItem("darkMode", "false");
      console.log("Removed 'dark' class and data-theme from html element");
    }
    
    // Verify the class was applied
    console.log("After update - html classes:", root.className);
    console.log("Has dark class?", root.classList.contains("dark"));
  }, [isDark]);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      const newValue = !prev;
      console.log("Toggling dark mode from", prev, "to", newValue);
      
      // Apply class immediately, synchronously
      const root = document.documentElement;
      if (newValue) {
        root.classList.add("dark");
        root.setAttribute("data-theme", "dark");
        console.log("Immediately added 'dark' class and data-theme");
      } else {
        root.classList.remove("dark");
        root.removeAttribute("data-theme");
        console.log("Immediately removed 'dark' class and data-theme");
      }
      console.log("Immediate html classes:", root.className);
      console.log("Immediate html data-theme:", root.getAttribute("data-theme"));
      
      return newValue;
    });
  }, []);

  return { isDark, toggle };
}

