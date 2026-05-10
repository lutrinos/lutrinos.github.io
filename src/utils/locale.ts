import { SUPPORTED_LOCALES, LOCALE_CONFIG } from "@i18n/locales";
import { siteConfig } from "@/config";


// Re-export for backward compatibility
export { SUPPORTED_LOCALES, LOCALE_CONFIG };


// Get default language configuration
export function getDefaultLanguage(): string {
    const fallback = siteConfig.lang;

    if (typeof document !== "undefined") {
        const configCarrier = document.getElementById("config-carrier");
        return configCarrier?.dataset.lang || fallback;
    }

    return fallback;
}


// Get display name of the language
export function getLocaleName(locale: string): string {

    // Try looking up as a config language code first
    if (SUPPORTED_LOCALES.includes(locale)) {
        return LOCALE_CONFIG[locale].displayName;
    } else if (SUPPORTED_LOCALES.includes(siteConfig.lang)) {
        return LOCALE_CONFIG[siteConfig.lang].displayName;
    }

    // If none found, return the original code
    return locale;
}

// Toggle language
export function toggleLanguage(langCode: string): void {

}

export const SUPPORTED_LANGUAGES = SUPPORTED_LOCALES;

export function getLocaleParams(locale?: string) {
    if (locale && locale !== "fr" && SUPPORTED_LOCALES.includes(locale)) {
        return locale;
    }
    return undefined;
}

export function getLocaleStaticPaths() {
    return SUPPORTED_LOCALES.map((locale) => ({
        params: { locale: getLocaleParams(locale) },
    }));
}

export function getLocaleStaticPathsWithId(ids: string[]) {
    return SUPPORTED_LOCALES.flatMap((locale) =>
        ids.map((id) => ({
            params: { locale: getLocaleParams(locale), id },
        })),
    );
}
