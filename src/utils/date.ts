import { getDefaultLanguage, LOCALE_CONFIG } from "./locale";


export function formatDateToYYYYMMDD(date: Date): string {
    return date.toISOString().substring(0, 10);
}

// Internationalized date formatting function
export function formatDateI18n(dateString: string): string {
    const date = new Date(dateString);
    const lang = getDefaultLanguage();

    // Set different date formats based on language
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    // Use unified language configuration to get locale
    return date.toLocaleDateString(LOCALE_CONFIG[lang].locale, options);
}