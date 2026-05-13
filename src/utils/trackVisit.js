const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

/**
 * Returns a session-scoped random ID stored in sessionStorage.
 * Dies when the tab/browser closes — not a cookie, not persistent.
 * Used only for counting unique sessions in aggregate analytics.
 */
function getSessionId() {
    const KEY = 'ka_sid';
    let id = sessionStorage.getItem(KEY);
    if (!id) {
        // crypto.randomUUID() is available in all modern browsers
        id = crypto.randomUUID();
        sessionStorage.setItem(KEY, id);
    }
    return id;
}

/**
 * Tracks a page visit via the Supabase Edge Function.
 *
 * - Uses sessionStorage to avoid counting the same page more than once
 *   per session (prevents refresh-spamming the counter).
 * - Sends a session ID so the dashboard can show unique sessions per day.
 *   The ID is ephemeral (sessionStorage) — no cookies, no persistent tracking.
 *
 * Compliant with UK PECR and UK GDPR (legitimate interest basis).
 */
export async function trackVisit(page) {
    try {
        // One visit per page per browser session
        const sessionKey = `pv_${page}`;
        if (sessionStorage.getItem(sessionKey)) return;
        sessionStorage.setItem(sessionKey, '1');

        await fetch(`${SUPABASE_URL}/functions/v1/track-visit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                page,
                referrer: document.referrer || null,
                sessionId: getSessionId(),
            }),
        });
    } catch {
        // Silent failure — tracking must never affect the user experience
    }
}
