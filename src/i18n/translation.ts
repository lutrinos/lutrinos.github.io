import { getResolvedSiteLang } from "@utils/language";

// @ts-ignore
import en from "./en.yml";

// @ts-ignore
import fr from "./fr.yml";

import type I18nKey from "./i18nKey";

export type Translation = {
    [K in I18nKey]: string;
};

const map: { [key: string]: Translation } = {
    en: en,
    fr: fr,
};

export function getTranslation(lang: string): Translation {
    return map[lang.toLowerCase()] || fr;
}

export function i18n(key: I18nKey): string {
    const lang = getResolvedSiteLang();
    return getTranslation(lang)[key];
}