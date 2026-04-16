// Dispatches a custom event that CookieBanner listens for, re-opening the preferences dialog.
export const showCookiePreferences = () => {
    window.dispatchEvent(new CustomEvent('ka-show-cookie-preferences'));
};
