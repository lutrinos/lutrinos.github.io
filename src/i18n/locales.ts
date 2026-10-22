/**
 * Unified language configuration file
 * All language-related mappings and configurations are exported from here
 */

export interface LocaleConfig {
    /** Language display name */
    displayName: string;
    /** Locale used by Intl.DateTimeFormat */
    locale: string;
    /** Language icon (flag emoji) */
    icon: string;
}

/**
 * Supported language configurations
 * Single source of truth to avoid duplicate definitions
 */
export const LOCALE_CONFIG: Record<string, LocaleConfig> = {
    en: {
        displayName: "English",
        locale: "en-UK",
        icon: "🇬🇧",
    },
    /*es: {
        displayName: "Español",
        locale: "es-ES",
        icon: "🇪🇸",
    },*/
    fr: {
        displayName: "Français",
        locale: "fr-FR",
        icon: "🇫🇷",
    },
    /*de: {
        displayName: "Deutsch",
        locale: "de-DE",
        icon: "🇩🇪",
    },*/
};

/** List of supported language codes */
export const SUPPORTED_LOCALES = Object.keys(LOCALE_CONFIG);
