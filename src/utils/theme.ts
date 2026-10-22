import {
    SYSTEM_MODE,
    DARK_MODE,
    LIGHT_MODE,
} from "@constants/constants";
import type {
    LIGHT_DARK_MODE,
} from "@/types/config";
import {
    siteConfig,
} from "@/config";


// Function to apply theme to document
export function applyThemeToDocument(theme: LIGHT_DARK_MODE, force = false) {
    if (typeof document === "undefined") return;
    // Get full information about current theme status
    const currentIsDark = document.documentElement.classList.contains("dark");
    const currentTheme = document.documentElement.getAttribute("data-theme");
    // Calculate target theme state
    let targetIsDark: boolean;
    switch (theme) {
        case LIGHT_MODE:
            targetIsDark = false;
            break;
        case DARK_MODE:
            targetIsDark = true;
            break;
        case SYSTEM_MODE:
            targetIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            break;
        default:
            targetIsDark = currentIsDark; // fallback to current mode if theme is unknown
            break;
    }
    // Detect if a theme change is actually needed
    const needsThemeChange = currentIsDark !== targetIsDark;
    const targetTheme = targetIsDark ? "github-dark" : "github-light";
    const needsCodeThemeUpdate = currentTheme !== targetTheme;
    // If no theme change or code theme update is needed and it's not a forced update, return early
    if (!force && !needsThemeChange && !needsCodeThemeUpdate) {
        return;
    }
    // Add transition protection only when a theme change is needed
    if (needsThemeChange) {
        document.documentElement.classList.add("is-theme-transitioning");
    }
    // Use requestAnimationFrame to ensure execution in the next frame, avoiding flickering
    requestAnimationFrame(() => {
        // Apply theme changes
        if (needsThemeChange) {
            if (targetIsDark) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }
        // Set the theme for Expressive Code based on current mode
        document.documentElement.setAttribute("data-theme", targetTheme);
        // Remove the protection class quickly in the next frame, using microtasks to ensure DOM update is complete
        if (needsThemeChange) {
            // Use requestAnimationFrame to ensure the transition protection class is removed in the next frame
            requestAnimationFrame(() => {
                document.documentElement.classList.remove("is-theme-transitioning");
            });
        }
    });
}

// Function to set theme
export function setTheme(theme: LIGHT_DARK_MODE): void {
    if (typeof localStorage !== "undefined") {
        localStorage.setItem("theme", theme);
    }
    applyThemeToDocument(theme);
}

// Function to get default theme from config-carrier
export function getDefaultTheme(): LIGHT_DARK_MODE {
    const fallback = siteConfig.defaultTheme;
    if (typeof document !== "undefined") {
        const configCarrier = document.getElementById("config-carrier");
        return (configCarrier?.dataset.theme as LIGHT_DARK_MODE) || fallback;
    }
    return fallback;
}

// Function to get stored theme from local storage or default
export function getStoredTheme(): LIGHT_DARK_MODE {
    if (typeof localStorage !== "undefined") {
        return (localStorage.getItem("theme") as LIGHT_DARK_MODE) || getDefaultTheme();
    }
    return getDefaultTheme();
}

// Function to initialize theme from local storage or default
export function initTheme(): void {
    if (typeof window === "undefined") return;
    const storedTheme = getStoredTheme();
    applyThemeToDocument(storedTheme, true);
    // Listen for system theme changes
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
        const currentStored = getStoredTheme();
        if (currentStored === SYSTEM_MODE) {
            applyThemeToDocument(SYSTEM_MODE);
        }
    });
}