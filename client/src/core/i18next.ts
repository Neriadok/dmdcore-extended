import i18next from "i18next";

i18next.init({
    fallbackLng: 'en',
    ns: ['en', 'es'],
    defaultNS: 'en',
    debug: true
});
i18next.addResourceBundle('en', 'en', require('../translations/en'), true, true);
i18next.addResourceBundle('es', 'es', require('../translations/es'), true, true);