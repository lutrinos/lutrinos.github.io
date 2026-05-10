import {
    type SupportedLanguage,
    SUPPORTED_LANGUAGES,
    langToTranslateMap,
    translateToLangMap,
    LANGUAGE_CONFIG,
} from "@i18n/language";
import {
    siteConfig,
} from "@/config";


// Re-export for backward compatibility
export { SUPPORTED_LANGUAGES, type SupportedLanguage, langToTranslateMap, translateToLangMap };


// Get default language configuration
export function getDefaultLanguage(): string {
    const fallback = siteConfig.lang;

    if (typeof document !== "undefined") {
        const configCarrier = document.getElementById("config-carrier");
        return configCarrier?.dataset.lang || fallback;
    }

    return fallback;
}

// Convert config file language code to translation service language code
export function getTranslateLanguageFromConfig(configLang: string): string {
    return langToTranslateMap[configLang] || "fr";
}

// Get resolved site language code
export function getResolvedSiteLang(): SupportedLanguage {
    const configLang = getDefaultLanguage() as any;
    if (SUPPORTED_LANGUAGES.includes(configLang)) {
        return configLang as SupportedLanguage;
    }
    // If siteConfig.lang is invalid, use the browser-detected language
    return detectBrowserLanguage();
}

// Convert translation service language code to config file language code
export function getConfigLanguageFromTranslate(translateLang: string): string {
    return translateToLangMap[translateLang] || "en";
}

// Get display name of the language
export function getLanguageDisplayName(langCode: string): string {
    // Try looking up as a config language code first
    if (langCode in LANGUAGE_CONFIG) {
        return LANGUAGE_CONFIG[langCode as SupportedLanguage].displayName;
    }
    // Try looking up as a translation service code
    const configLang = translateToLangMap[langCode];
    if (configLang && configLang in LANGUAGE_CONFIG) {
        return LANGUAGE_CONFIG[configLang as SupportedLanguage].displayName;
    }
    // If none found, return the original code
    return langCode;
}

// Detect browser language and return supported language code
export function detectBrowserLanguage(fallbackLang: SupportedLanguage = "en"): SupportedLanguage {
    // Return fallback language during server-side rendering
    if (typeof window === "undefined" || typeof navigator === "undefined") {
        return fallbackLang;
    }
    // Get browser language list
    const browserLangs = navigator.languages || [navigator.language];
    // Iterate through browser language list and find the first supported language
    for (const browserLang of browserLangs) {
        // Extract primary language code (e.g., 'zh-CN' -> 'zh', 'en-US' -> 'en')
        const langCode = browserLang.toLowerCase().split("-")[0];
        // Check if it's in the supported language list
        if (SUPPORTED_LANGUAGES.includes(langCode as SupportedLanguage)) {
            return langCode as SupportedLanguage;
        }
    }
    // If no supported language found, return the fallback language
    return fallbackLang;
}

// Get current site language (prefer cache, then config language, finally browser detection)
export function getSiteLanguage(configLang?: string): string {
    // Second, use the passed config language or default language from carrier
    const defaultLang = configLang || getDefaultLanguage();
    if (SUPPORTED_LANGUAGES.includes(defaultLang as SupportedLanguage)) {
        return langToTranslateMap[defaultLang];
    }
    // Finally, auto-detect browser language and convert to translation service code
    const browserLang = detectBrowserLanguage();
    return langToTranslateMap[browserLang];
}

// Toggle language
export function toggleLanguage(langCode: string): void {
    
}

export function getLocaleParams(locale?: string) {
    // @ts-ignore
    if (locale !== "fr" && SUPPORTED_LANGUAGES.includes(locale)) {
        return locale;
    }
    return undefined;
}