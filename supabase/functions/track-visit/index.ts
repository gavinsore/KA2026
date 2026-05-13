import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
}

// Common bot / crawler patterns — no analytics value, discard silently
const BOT_PATTERN =
    /bot|crawler|spider|crawling|googlebot|bingbot|slurp|duckduckbot|facebookexternalhit|linkedinbot|twitterbot|whatsapp|semrush|ahrefs|mj12bot|yandex|baidu|sogou|exabot|ia_archiver/i

Deno.serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: CORS_HEADERS })
    }

    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
            status: 405,
            headers: CORS_HEADERS,
        })
    }

    try {
        const userAgent = req.headers.get('user-agent') ?? ''

        // Silently discard known bots
        if (BOT_PATTERN.test(userAgent)) {
            return new Response(JSON.stringify({ ok: true }), { headers: CORS_HEADERS })
        }

        const body      = await req.json().catch(() => ({}))
        const page      = (body.page ?? '/').slice(0, 500)
        const referrer  = body.referrer ? String(body.referrer).slice(0, 500) : null
        const UUID_RE   = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        const sessionId = body.sessionId && UUID_RE.test(body.sessionId) ? body.sessionId : null

        // ── Daily visitor hash ───────────────────────────────────────────────
        // HMAC-SHA256(ip + userAgent + utcDate, VISITOR_HASH_SECRET)
        //
        // Including the UTC date means the SAME visitor gets a DIFFERENT hash
        // tomorrow — cross-day tracking is structurally impossible.
        // The raw IP is used only as input and is NEVER stored or logged.
        const ip      = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
        const utcDate = new Date().toISOString().slice(0, 10) // YYYY-MM-DD UTC
        const secret  = Deno.env.get('VISITOR_HASH_SECRET') ?? ''
        let dailyHash: string | null = null

        if (secret) {
            const enc  = new TextEncoder()
            const key  = await crypto.subtle.importKey(
                'raw', enc.encode(secret),
                { name: 'HMAC', hash: 'SHA-256' },
                false, ['sign'],
            )
            const sig  = await crypto.subtle.sign(
                'HMAC', key,
                enc.encode(`${ip}|${userAgent.slice(0, 50)}|${utcDate}`),
            )
            dailyHash = Array.from(new Uint8Array(sig))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('')
                .slice(0, 32) // 32 hex chars (128 bits) — ample collision resistance
        }
        // ip is a local variable that goes out of scope here — never written to DB
        // ────────────────────────────────────────────────────────────────────

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
        )

        const { error } = await supabase.from('page_visits').insert({
            page,
            referrer,
            user_agent: userAgent.slice(0, 500),
            session_id: sessionId,
            daily_hash: dailyHash,
            // NOTE: raw IP address is NOT stored — only the irreversible daily hash above
        })

        if (error) {
            console.error('[track-visit] insert error:', error.message)
            return new Response(JSON.stringify({ ok: false }), {
                status: 500,
                headers: CORS_HEADERS,
            })
        }

        return new Response(JSON.stringify({ ok: true }), { headers: CORS_HEADERS })
    } catch (err) {
        console.error('[track-visit] unexpected error:', err)
        return new Response(JSON.stringify({ ok: false }), { status: 500, headers: CORS_HEADERS })
    }
})
