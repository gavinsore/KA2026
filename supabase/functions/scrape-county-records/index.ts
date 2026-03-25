// Supabase Edge Function: scrape-county-records
// Scrapes all NCAS (Northamptonshire County Archery Society) county records
// from https://www.ncasarchery.org.uk and upserts into the county_records table.
// Intended to be called by a weekly pg_cron schedule.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const NCAS_CATEGORIES = [
  // Recurve
  { bow_type: 'Recurve', category: 'Men',         url: 'http://www.ncasarchery.org.uk/rules_for_records/recurve/gents-recurve/' },
  { bow_type: 'Recurve', category: 'Women',       url: 'http://www.ncasarchery.org.uk/rules_for_records/recurve/ladies-recurve/' },
  { bow_type: 'Recurve', category: 'Men 50+',     url: 'http://www.ncasarchery.org.uk/recurve-men-50/' },
  { bow_type: 'Recurve', category: 'Women 50+',   url: 'http://www.ncasarchery.org.uk/recurve-women-50/' },
  { bow_type: 'Recurve', category: 'Junior Men',  url: 'http://www.ncasarchery.org.uk/recurve-junior-men/' },
  { bow_type: 'Recurve', category: 'Junior Women',url: 'http://www.ncasarchery.org.uk/recurve-junior-women/' },
  // Compound
  { bow_type: 'Compound', category: 'Men',         url: 'http://www.ncasarchery.org.uk/rules_for_records/compound-county-records/gents-compound/' },
  { bow_type: 'Compound', category: 'Women',       url: 'http://www.ncasarchery.org.uk/rules_for_records/compound-county-records/ladies-compound/' },
  { bow_type: 'Compound', category: 'Men 50+',     url: 'http://www.ncasarchery.org.uk/compound-men-50/' },
  { bow_type: 'Compound', category: 'Women 50+',   url: 'http://www.ncasarchery.org.uk/compound-women-50/' },
  { bow_type: 'Compound', category: 'Junior Men',  url: 'http://www.ncasarchery.org.uk/compound-junior-men/' },
  { bow_type: 'Compound', category: 'Junior Women',url: 'http://www.ncasarchery.org.uk/compound-junior-women/' },
  { bow_type: 'Compound', category: 'Limited',     url: 'http://www.ncasarchery.org.uk/rules_for_records/compound-county-records/compound-limited/' },
  // Barebow
  { bow_type: 'Barebow', category: 'Men',         url: 'http://www.ncasarchery.org.uk/rules_for_records/barebow-county-records/gents-barebow/' },
  { bow_type: 'Barebow', category: 'Women',       url: 'http://www.ncasarchery.org.uk/rules_for_records/barebow-county-records/ladies-barebow/' },
  { bow_type: 'Barebow', category: 'Men 50+',     url: 'http://www.ncasarchery.org.uk/barebow-men-50/' },
  { bow_type: 'Barebow', category: 'Women 50+',   url: 'http://www.ncasarchery.org.uk/barebow-women-50/' },
  { bow_type: 'Barebow', category: 'Junior Men',  url: 'http://www.ncasarchery.org.uk/barebow-junior-men/' },
  { bow_type: 'Barebow', category: 'Junior Women',url: 'http://www.ncasarchery.org.uk/barebow-junior-women/' },
  // Longbow
  { bow_type: 'Longbow', category: 'Men',         url: 'http://www.ncasarchery.org.uk/rules_for_records/longbow-county-records/gents-longbow-2/' },
  { bow_type: 'Longbow', category: 'Women',       url: 'http://www.ncasarchery.org.uk/rules_for_records/longbow-county-records/ladies-longbow/' },
  { bow_type: 'Longbow', category: 'Men 50+',     url: 'http://www.ncasarchery.org.uk/longbow-men-50/' },
  { bow_type: 'Longbow', category: 'Women 50+',   url: 'http://www.ncasarchery.org.uk/longbow-women-50/' },
  { bow_type: 'Longbow', category: 'Junior Men',  url: 'http://www.ncasarchery.org.uk/longbow-junior-men/' },
  { bow_type: 'Longbow', category: 'Junior Women',url: 'http://www.ncasarchery.org.uk/longbow-junior-women/' },
  // Flatbow
  { bow_type: 'Flatbow', category: 'Men',         url: 'http://www.ncasarchery.org.uk/rules_for_records/flatbow-county-records/gents-flatbow-county-records/' },
  { bow_type: 'Flatbow', category: 'Women',       url: 'http://www.ncasarchery.org.uk/rules_for_records/flatbow-county-records/ladies-flatbow-county-records/' },
  { bow_type: 'Flatbow', category: 'Men 50+',     url: 'http://www.ncasarchery.org.uk/flatbow-men-50/' },
  { bow_type: 'Flatbow', category: 'Women 50+',   url: 'http://www.ncasarchery.org.uk/flatbow-women-50/' },
  { bow_type: 'Flatbow', category: 'Junior Men',  url: 'http://www.ncasarchery.org.uk/flatbow-junior-men/' },
  { bow_type: 'Flatbow', category: 'Junior Women',url: 'http://www.ncasarchery.org.uk/flatbow-junior-women/' },
  // Traditional
  { bow_type: 'Traditional', category: 'Men',         url: 'http://www.ncasarchery.org.uk/traditional-men/' },
  { bow_type: 'Traditional', category: 'Women',       url: 'http://www.ncasarchery.org.uk/traditional-women/' },
  { bow_type: 'Traditional', category: 'Men 50+',     url: 'http://www.ncasarchery.org.uk/traditional-men-50/' },
  { bow_type: 'Traditional', category: 'Women 50+',   url: 'http://www.ncasarchery.org.uk/traditional-women-50/' },
  { bow_type: 'Traditional', category: 'Junior Men',  url: 'http://www.ncasarchery.org.uk/traditional-junior-men/' },
  { bow_type: 'Traditional', category: 'Junior Women',url: 'http://www.ncasarchery.org.uk/traditional-junior-women/' },
  // Specialty
  { bow_type: 'Clout',  category: 'All',  url: 'http://www.ncasarchery.org.uk/rules_for_records/clout-county-records/' },
  { bow_type: 'Field',  category: 'All',  url: 'http://www.ncasarchery.org.uk/rules_for_records/field-archery-county-records/' },
  { bow_type: 'Flight', category: 'All',  url: 'http://www.ncasarchery.org.uk/rules_for_records/flight-archery-county-records/' },
];

/**
 * Parse HTML from a single NCAS category page into an array of record objects.
 * The page contains one or more <table> elements where:
 *   - Row 0 is the header: [Round, Score, Archer, Date, Results]
 *   - Subsequent rows are data rows
 * The Score cell may contain a "National Record" badge (a <span> or <p> with that text).
 */
function parseCategoryPage(html, bow_type, category, source_url) {
  const records = [];

  // Extract all <table> blocks
  const tableMatches = html.matchAll(/<table[\s\S]*?<\/table>/gi);
  for (const tableMatch of tableMatches) {
    const tableHtml = tableMatch[0];

    // Get all rows
    const rowMatches = [...tableHtml.matchAll(/<tr[\s\S]*?<\/tr>/gi)];
    if (rowMatches.length < 2) continue;

    // Check if first row looks like a header (contains "Score" or "Round")
    const firstRowText = stripHtml(rowMatches[0][0]).toLowerCase();
    if (!firstRowText.includes('score') && !firstRowText.includes('round')) continue;

    // Process data rows (skip header row)
    for (let i = 1; i < rowMatches.length; i++) {
      const rowHtml = rowMatches[i][0];

      // Split on opening <td or <th tags — handles malformed HTML where NCAS pages
      // omit the closing </span></td> on the archer cell (so a closing-tag regex drops the row).
      // Each element after splitting is the raw content that came after that opening tag.
      const cellParts = rowHtml.split(/<t[dh](?:\s[^>]*)?\s*>/i).slice(1);
      // Strip any trailing </td>, </th>, </tr> etc. from each part
      const cells = cellParts.map((p: string) => p.replace(/<\/t[dhr][^>]*>/gi, '').trim());

      if (cells.length < 3) continue;

      const roundName = stripHtml(cells[0]).trim();
      const scoreRaw = cells[1]; // may contain "National Record" marker
      const archerRaw = stripHtml(cells[2]).trim();
      const dateRaw = cells[3] ? stripHtml(cells[3]).trim() : '';

      if (!roundName || roundName.toLowerCase() === 'round') continue;

      // Score: strip HTML but check for national record indicator first
      const isNationalRecord = /national\s*record/i.test(scoreRaw);
      const score = stripHtml(scoreRaw).replace(/national\s*record/i, '').trim();

      // Archer field: Name\nClub (two lines in the cell)
      const archerLines = archerRaw.split(/\n|\r|\s{2,}/).map(s => s.trim()).filter(Boolean);
      const archer_name = archerLines[0] || '';
      const club = archerLines[1] || '';

      if (!archer_name) continue;

      records.push({
        bow_type,
        category,
        round: roundName,
        score,
        archer_name,
        club,
        date_text: dateRaw,
        is_national_record: isNationalRecord,
        source_url,
        updated_at: new Date().toISOString(),
      });
    }
  }
  return records;
}

/** Strip HTML tags from a string */
function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#8211;/g, '–')   // en dash
    .replace(/&#8212;/g, '—')   // em dash
    .replace(/&#8216;/g, '\u2018') // left single quote
    .replace(/&#8217;/g, '\u2019') // right single quote
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .trim();
}

Deno.serve(async (req) => {
  // Allow manual POST triggers as well as cron calls
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const results = {
    processed: 0,
    upserted: 0,
    errors: [] as string[],
  };

  for (const { bow_type, category, url } of NCAS_CATEGORIES) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; KetteringArchersBot/1.0)',
        },
      });

      if (!response.ok) {
        results.errors.push(`${bow_type} ${category}: HTTP ${response.status} from ${url}`);
        continue;
      }

      const html = await response.text();
      const records = parseCategoryPage(html, bow_type, category, url);

      if (records.length === 0) {
        console.log(`No records found for ${bow_type} ${category} (${url})`);
        continue;
      }

      // De-duplicate: some NCAS pages list the same round twice.
      // Keep the entry with the highest numeric score per round.
      const dedupedMap = new Map<string, typeof records[0]>();
      for (const record of records) {
        const key = record.round.toLowerCase();
        const existing = dedupedMap.get(key);
        if (!existing || parseInt(record.score) > parseInt(existing.score)) {
          dedupedMap.set(key, record);
        }
      }
      const dedupedRecords = Array.from(dedupedMap.values());
      results.processed += dedupedRecords.length;

      // Upsert: on conflict (bow_type, category, round), update all other fields
      const { error } = await supabase
        .from('county_records')
        .upsert(dedupedRecords, {
          onConflict: 'bow_type,category,round',
          ignoreDuplicates: false,
        });

      if (error) {
        results.errors.push(`${bow_type} ${category}: DB error - ${error.message}`);
      } else {
        results.upserted += dedupedRecords.length;
      }

    } catch (err) {
      results.errors.push(`${bow_type} ${category}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return new Response(
    JSON.stringify({ success: true, ...results }),
    {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    }
  );
});
