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


// 重新导出以保持向后兼容
export { SUPPORTED_LANGUAGES, type SupportedLanguage, langToTranslateMap, translateToLangMap };


// 获取默认语言配置
export function getDefaultLanguage(): string {
    const fallback = siteConfig.lang;
    if (typeof document !== "undefined") {
        const configCarrier = document.getElementById("config-carrier");
        return configCarrier?.dataset.lang || fallback;
    }
    return fallback;
}

// 将配置文件的语言代码转换为翻译服务的语言代码
export function getTranslateLanguageFromConfig(configLang: string): string {
    return langToTranslateMap[configLang] || "en";
}

// 获取解析后的站点语言代码
export function getResolvedSiteLang(): SupportedLanguage {
    const configLang = getDefaultLanguage() as any;
    if (SUPPORTED_LANGUAGES.includes(configLang)) {
        return configLang as SupportedLanguage;
    }
    // 如果 siteConfig.lang 不合规，则使用浏览器检测到的语言
    return detectBrowserLanguage();
}

// 将翻译服务的语言代码转换为配置文件的语言代码
export function getConfigLanguageFromTranslate(translateLang: string): string {
    return translateToLangMap[translateLang] || "en";
}

// 获取语言的显示名称
export function getLanguageDisplayName(langCode: string): string {
    // 先尝试作为配置语言代码查找
    if (langCode in LANGUAGE_CONFIG) {
        return LANGUAGE_CONFIG[langCode as SupportedLanguage].displayName;
    }
    // 尝试作为翻译服务代码查找
    const configLang = translateToLangMap[langCode];
    if (configLang && configLang in LANGUAGE_CONFIG) {
        return LANGUAGE_CONFIG[configLang as SupportedLanguage].displayName;
    }
    // 如果都找不到，返回原始代码
    return langCode;
}

// 检测浏览器语言并返回支持的语言代码
export function detectBrowserLanguage(fallbackLang: SupportedLanguage = "en"): SupportedLanguage {
    // 服务端渲染时返回备用语言
    if (typeof window === "undefined" || typeof navigator === "undefined") {
        return fallbackLang;
    }
    // 获取浏览器语言列表
    const browserLangs = navigator.languages || [navigator.language];
    // 遍历浏览器语言列表，找到第一个支持的语言
    for (const browserLang of browserLangs) {
        // 提取主语言代码（例如：'zh-CN' -> 'zh', 'en-US' -> 'en'）
        const langCode = browserLang.toLowerCase().split("-")[0];
        // 检查是否在支持的语言列表中
        if (SUPPORTED_LANGUAGES.includes(langCode as SupportedLanguage)) {
            return langCode as SupportedLanguage;
        }
    }
    // 如果没有找到支持的语言，返回备用语言
    return fallbackLang;
}

// 获取当前站点语言（优先使用缓存，其次是配置语言，最后是浏览器检测）
export function getSiteLanguage(configLang?: string): string {
    // 其次使用传入的配置语言或从 carrier 获取的默认语言
    const defaultLang = configLang || getDefaultLanguage();
    if (SUPPORTED_LANGUAGES.includes(defaultLang as SupportedLanguage)) {
        return langToTranslateMap[defaultLang];
    }
    // 最后自动检测浏览器语言并转换为翻译服务代码
    const browserLang = detectBrowserLanguage();
    return langToTranslateMap[browserLang];
}

// 切换语言
export function toggleLanguage(langCode: string): void {
    const translate = (window as any).translate;
    if (!translate) return;
    // 切换语言
    translate.changeLanguage(langCode);
}