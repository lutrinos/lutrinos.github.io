// @ts-ignore
import en from "./en.yml";

// @ts-ignore
import fr from "./fr.yml";

export { default as I18nKey } from "./i18nKey";
export * from "./locales";

import type I18nKey from "./i18nKey";

export type Translation = {
    [K in I18nKey]: string;
};

export function getTranslation(locale?: string): Translation {
    switch(locale) {
        case 'en':
            return en;
        default:
            return fr;
    }
}

export function useLocale(locale?: string) {
    return (key: I18nKey) => getTranslation(locale)[key];
}
