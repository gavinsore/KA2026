/**
 * CSV Loader Utility
 * Fetches and parses CSV files from local public folder or Google Sheets
 */

/**
 * Parse CSV text into array of objects
 * @param {string} csvText - Raw CSV text
 * @returns {Array<Object>} Array of objects with headers as keys
 */
export function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));

    return lines.slice(1).map(line => {
        const values = parseCSVLine(line);
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = values[index]?.trim() || '';
        });
        return obj;
    });
}

/**
 * Parse a single CSV line, handling quoted values
 * @param {string} line - CSV line
 * @returns {Array<string>} Array of values
 */
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current);
    return values;
}

/**
 * Fetch CSV from a URL (local or Google Sheets published CSV)
 * @param {string} url - URL to fetch
 * @returns {Promise<Array<Object>>} Parsed CSV data
 */
export async function fetchCSV(url) {
    try {
        // Prepend base URL for local files to work with Vite's base config
        const baseUrl = import.meta.env.BASE_URL || '/';
        const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? url.slice(1) : url}`;

        const response = await fetch(fullUrl);
        if (!response.ok) throw new Error(`Failed to fetch ${fullUrl}`);
        const text = await response.text();
        return parseCSV(text);
    } catch (error) {
        console.error('Error loading CSV:', error);
        return [];
    }
}

/**
 * Load events index from CSV
 * @returns {Promise<Array<Object>>} Events metadata sorted by date (newest first)
 */
export async function loadEventsIndex() {
    const data = await fetchCSV('/data/results/events.csv');
    return data.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Load event results from a specific event CSV file
 * @param {string} filename - Filename of the event CSV
 * @returns {Promise<Array<Object>>} Event results
 */
export async function loadEventResults(filename) {
    return fetchCSV(`/data/results/${filename}`);
}

/**
 * Load all event results, grouped by venue (indoor/outdoor), with each event separate
 * @returns {Promise<{indoor: Array, outdoor: Array}>} Events grouped by venue, each containing event metadata and results
 */
export async function loadAllEventResults() {
    const events = await loadEventsIndex();
    const results = { indoor: [], outdoor: [] };

    for (const event of events) {
        const eventResults = await loadEventResults(event.file);
        const eventData = {
            id: event.id,
            date: event.date,
            eventName: event.event_name,
            venue: event.venue,
            results: eventResults
        };

        if (event.venue?.toLowerCase() === 'indoor') {
            results.indoor.push(eventData);
        } else {
            results.outdoor.push(eventData);
        }
    }

    return results;
}

/**
 * Load club records
 * @returns {Promise<Array<Object>>} Club records sorted alphabetically by round name
 */
export async function loadClubRecords() {
    const records = await fetchCSV('/data/results/club-records.csv');
    return records.sort((a, b) => (a.round || '').localeCompare(b.round || ''));
}

/**
 * Load personal bests
 * @returns {Promise<Array<Object>>} Personal bests sorted by archer name, then round name
 */
export async function loadPersonalBests() {
    const pbs = await fetchCSV('/data/results/personal-bests.csv');
    return pbs.sort((a, b) => {
        const nameCompare = (a.archer_name || '').localeCompare(b.archer_name || '');
        if (nameCompare !== 0) return nameCompare;
        return (a.round || '').localeCompare(b.round || '');
    });
}
