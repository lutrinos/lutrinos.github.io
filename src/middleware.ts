import { defineMiddleware } from "astro:middleware";

const languages = ['en', 'fr'];
const defaultLanguage = 'fr'

export const onRequest = defineMiddleware((context, next) => {

    /*console.log('\n\nMIDDLEWARE\n\n');
    
    if (!context.currentLocale) {
        return context.rewrite(`/fr${context.url.pathname}`);
    } else if (!context.url.pathname.startsWith(`/${context.currentLocale}/`)) {
        return context.rewrite(`/${context.currentLocale}${context.url.pathname}`);
    }*/

    return next();
});