/**
 * Fallback navigation function
 * Uses normal page jumps when Swup is unavailable
 */
function fallbackNavigation(
    url: string,
    options?: {
        replace?: boolean;
        force?: boolean;
    },
): void {
    if (typeof window === "undefined") return;
    if (options?.replace) {
        window.location.replace(url);
    } else {
        window.location.href = url;
    }
}

/**
 * Navigate to specified page
 * @param url Target page URL
 * @param options Navigation options
 */
export function navigateToPage(
    url: string,
    options?: {
        replace?: boolean;
        force?: boolean;
    },
): void {
    // Check if URL is valid
    if (!url || typeof url !== "string") {
        console.warn("navigateToPage: Invalid URL provided");
        return;
    }

    // If it is an external link, jump directly
    if (
        url.startsWith("http://") ||
        url.startsWith("https://") ||
        url.startsWith("//")
    ) {
        window.open(url, "_blank");
        return;
    }

    // If it is an anchor link, scroll to the corresponding position
    if (url.startsWith("#")) {
        if (typeof document !== "undefined") {
            const element = document.getElementById(url.slice(1));
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
        return;
    }

    // Check if Swup is available
    if (typeof window !== "undefined" && (window as any).swup) {
        try {
            // Use Swup for refreshless jump
            if (options?.replace) {
                (window as any).swup.navigate(url, { history: false });
            } else {
                (window as any).swup.navigate(url);
            }
        } catch (error) {
            console.error("Swup navigation failed:", error);
            // Fallback to normal jump
            fallbackNavigation(url, options);
        }
    } else {
        // Fallback handling when Swup is unavailable
        fallbackNavigation(url, options);
    }
}

/**
 * Get current page path
 */
export function getCurrentPath(): string {
    return typeof window !== "undefined" ? window.location.pathname : "";
}

/**
 * Check if it is the home page
 */
export function isHomePage(): boolean {
    const path = getCurrentPath();
    return path === "/" || path === "";
}