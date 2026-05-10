/**
 * Unified language configuration file
 * All language-related mappings and configurations are exported from here
 */

export interface LanguageConfig {
    /** Language code used by the translation service */
    translateCode: string;
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
export const LANGUAGE_CONFIG = {
    en: {
        translateCode: "english",
        displayName: "English",
        locale: "en-US",
        icon: "🇺🇸",
    },
    /*es: {
        translateCode: "spanish",
        displayName: "Español",
        locale: "es-ES",
        icon: "🇪🇸",
    },*/
    fr: {
        translateCode: "french",
        displayName: "Français",
        locale: "fr-FR",
        icon: "🇫🇷",
    },
    /*de: {
        translateCode: "german",
        displayName: "Deutsch",
        locale: "de-DE",
        icon: "🇩🇪",
    },*/
} as const satisfies Record<string, LanguageConfig>;

/** List of supported language codes */
export const SUPPORTED_LANGUAGES = Object.keys(LANGUAGE_CONFIG) as Array<
    keyof typeof LANGUAGE_CONFIG
>;

export type SupportedLanguage = keyof typeof LANGUAGE_CONFIG;

/**
 * Mapping from config file language codes to translation service language codes
 * Automatically generated from LANGUAGE_CONFIG
 */
export const langToTranslateMap: Record<string, string> = Object.fromEntries(
    Object.entries(LANGUAGE_CONFIG).map(([lang, config]) => [
        lang,
        config.translateCode,
    ]),
);

/**
 * Mapping from translation service language codes to configuration file language codes
 * Automatically generated from LANGUAGE_CONFIG
 */
export const translateToLangMap: Record<string, string> = Object.fromEntries(
    Object.entries(LANGUAGE_CONFIG).map(([lang, config]) => [
        config.translateCode,
        lang,
    ]),
);

/**
 * Mapping from language codes to locales
 * Automatically generated from LANGUAGE_CONFIG
 */
export const langToLocaleMap: Record<string, string> = Object.fromEntries(
    Object.entries(LANGUAGE_CONFIG).map(([lang, config]) => [lang, config.locale]),
);

/**
 * Get the list of all languages supported for translation (used by Translator)
 */
export function getSupportedTranslateLanguages() {
    return Object.entries(LANGUAGE_CONFIG).map(([code, config]) => ({
        code: config.translateCode,
        name: config.displayName,
        icon: config.icon,
        langCode: code,
    }));
}
