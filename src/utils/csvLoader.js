import { supabase } from '../lib/supabase';

/**
 * Fetch text content from Supabase Storage
 * @param {string} path - Path in storage bucket
 * @returns {Promise<string>} File content
 */
async function fetchSupabaseFile(path) {
    try {
        const { data, error } = await supabase.storage
            .from('results')
            .download(path);

        if (error) throw error;
        return await data.text();
    } catch (error) {
        console.error('Error downloading file from Supabase:', error);
        return null;
    }
}

/**
 * Get public URL for a file in Supabase Storage
 */
function getSupabaseFileUrl(path) {
    const { data } = supabase.storage
        .from('results')
        .getPublicUrl(path);
    return data.publicUrl;
}

/**
 * Fetch CSV from a URL (local or Google Sheets published CSV)
 * @param {string} url - URL to fetch
 * @returns {Promise<Array<Object>>} Parsed CSV data
 */
export async function fetchCSV(url) {
    try {
        // Prepend base URL for local files to work with Vite's base config
        const baseUrl = (import.meta.env && import.meta.env.BASE_URL) || '/';
        const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? url.slice(1) : url}`;

        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${fullUrl}`);
        }
        const text = await response.text();
        return parseCSV(text);
    } catch (error) {
        // Return clear error context but empty array to prevent app crash
        console.warn(`Error loading CSV at ${url}:`, error);
        return [];
    }
}

/**
 * Check if the row contains only empty values or commas
 * @param {string} line 
 * @returns {boolean}
 */
function isEmptyLine(line) {
    return !line || line.trim() === '' || line.replace(/,/g, '').trim() === '';
}

/**
 * Parse CSV text into array of objects
 * @param {string} csvText - Raw CSV text
 * @returns {Array<Object>} Array of objects with headers as keys
 */
export function parseCSV(csvText) {
    // Check for Soft 404 (HTML response)
    if (csvText.trim().startsWith('<!DOCTYPE') || csvText.trim().startsWith('<html')) {
        console.error('CSV Loader: Received HTML content instead of CSV. This suggests a 404 Not Found or configuration error.');
        return [];
    }

    const lines = csvText.trim().split('\n');
    lines.forEach((line, index) => {
        lines[index] = line.replace(/\r$/, '');
    });

    if (lines.length < 2) return [];

    // Check for legacy format
    // Legacy files often start with an empty cell (comma) or the club name
    const firstLine = lines[0].trim();
    if (firstLine.startsWith(',') || firstLine.toUpperCase().includes('KETTERING ARCHERS')) {
        return parseLegacyCSV(lines);
    }

    // Default to standard format
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
    return lines.slice(1).map(line => {
        if (isEmptyLine(line)) return null;
        const values = parseCSVLine(line);
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = values[index]?.trim() || '';
        });
        return obj;
    }).filter(item => item !== null);
}

/**
 * Parse legacy CSV format (print-ready format)
 * @param {Array<string>} lines - Array of CSV lines
 * @returns {Array<Object>} Parsed data
 */
function parseLegacyCSV(lines) {
    // Find the header row
    let headerRowIndex = -1;
    for (let i = 0; i < lines.length; i++) {
        const lineVal = lines[i].trim().toUpperCase();
        // Check for 'CLASS,' or '"CLASS",'
        if (lineVal.startsWith('CLASS,') || lineVal.startsWith('"CLASS",')) {
            headerRowIndex = i;
            break;
        }
    }

    if (headerRowIndex === -1) {
        console.warn('Legacy CSV parser: Could not find header row starting with "CLASS,"');
        return [];
    }

    const headerParts = parseCSVLine(lines[headerRowIndex]);
    const headers = headerParts.map(h => h.trim().toUpperCase());

    // Map headers to field names
    const fieldMap = {
        'POSITION': 'position',
        'NAME': 'archer_name',
        'CLUB': 'club',
        'ROUND': 'round',
        'HITS': 'hits',
        'GOLDS': 'golds',
        'CLOUTS': 'golds', // Map Clouts to Golds
        'CLOUT': 'golds',
        'SCORE': 'score'
    };

    const results = [];
    let currentClass = '';

    // Process rows after header
    for (let i = headerRowIndex + 1; i < lines.length; i++) {
        const line = lines[i];
        // Skip empty lines or lines that don't look like data
        if (isEmptyLine(line)) continue;

        const values = parseCSVLine(line);

        // Handle Class/Bow Type (first column)
        const rowClass = values[0]?.trim();
        if (rowClass) {
            currentClass = rowClass;
        }

        // Check if this is a data row (has a name)
        const nameIdx = headers.indexOf('NAME');
        if (nameIdx === -1) continue;

        const name = values[nameIdx]?.trim();
        if (!name) continue;

        // Build result object
        const obj = {
            bow_type: currentClass,
            club: 'KA' // Default to KA if not present
        };

        headers.forEach((header, index) => {
            const keys = Object.keys(fieldMap);
            if (keys.includes(header)) {
                obj[fieldMap[header]] = values[index]?.trim() || '';
            }
        });

        results.push(obj);
    }

    return results;
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
 * Load events index from CSV
 * @param {string} [path='/data/results/current_outdoor/events.csv'] - Path to the events index file
 * @returns {Promise<Array<Object>>} Events metadata sorted by date (newest first)
 */
export async function loadEventsIndex(path = '/data/results/current_outdoor/events.csv') {
    const data = await fetchCSV(path);
    return data.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Load event results from a specific event CSV file
 * @param {string} filename - Filename or path of the event CSV
 * @param {string} [basePath='/data/results/current_outdoor/'] - Base directory for the file
 * @returns {Promise<Array<Object>>} Event results
 */
export async function loadEventResults(filename, basePath = '/data/results/current_outdoor/') {
    // If filename is already a full path or absolute, use it, otherwise join with basePath
    const path = filename.startsWith('/') || filename.startsWith('http')
        ? filename
        : `${basePath}${filename}`;
    return fetchCSV(path);
}


/**
 * Load all event results from Supabase ONLY
 * @returns {Promise<{indoor: Array, outdoor: Array}>} Events grouped by venue
 */
export async function loadAllEventResults() {
    const results = { indoor: [], outdoor: [] };

    try {
        // Load Supabase Results
        const { data: files, error } = await supabase
            .from('results_files')
            .select('*')
            .order('event_date', { ascending: false });

        if (!error && files) {
            for (const file of files) {
                let eventResults = [];
                const isCsv = file.filename.toLowerCase().endsWith('.csv');
                const fileUrl = getSupabaseFileUrl(file.file_path);

                if (isCsv) {
                    const csvText = await fetchSupabaseFile(file.file_path);
                    if (csvText) {
                        eventResults = parseCSV(csvText);
                    }
                }

                const eventData = {
                    id: file.id,
                    date: file.event_date,
                    eventName: file.event_name,
                    venue: file.venue, // 'Indoor' or 'Outdoor'
                    results: eventResults,
                    fileUrl: fileUrl,
                    fileType: isCsv ? 'csv' : 'file'
                };

                if (file.venue === 'Indoor') {
                    results.indoor.push(eventData);
                } else {
                    results.outdoor.push(eventData);
                }
            }
        }

        // Sort results by date (newest first)
        results.outdoor.sort((a, b) => new Date(b.date) - new Date(a.date));
        results.indoor.sort((a, b) => new Date(b.date) - new Date(a.date));

        return results;

    } catch (error) {
        console.error('Error in loadAllEventResults:', error);
        return results;
    }
}

/**
 * Load results for a specific archive
 * @param {string} archivePath - Path to the archive folder (e.g. 'archive/2025_outdoor')
 * @returns {Promise<Array<Object>>} Events for this archive
 */
export async function loadArchiveResults(archivePath) {
    // Determine FULL path for events.csv. 
    // archivePath comes from archives.json as 'archive/2025_outdoor'
    const indexUrl = `/data/results/${archivePath}/events.csv`;
    const events = await loadEventsIndex(indexUrl);

    const processedEvents = [];
    for (const event of events) {
        const eventResults = await loadEventResults(event.file, `/data/results/${archivePath}/`);
        processedEvents.push({
            id: event.id,
            date: event.date,
            eventName: event.event_name,
            venue: event.venue,
            results: eventResults
        });
    }
    return processedEvents;
}

/**
 * Load list of available archives
 * @returns {Promise<Array<Object>>} List of archive metadata
 */
export async function loadArchivesIndex() {
    const text = await fetchText('/data/results/archives.json');
    if (!text) return [];
    try {
        return JSON.parse(text);
    } catch (e) {
        console.error("Failed to parse archives.json", e);
        return [];
    }
}

/**
 * Load club records
 * @returns {Promise<Array<Object>>} Club records sorted alphabetically by round name
 */
export async function loadClubRecords() {
    // Try Supabase first (Supabase Storage path: special/club-records.csv)
    let text = await fetchSupabaseFile('special/club-records.csv');

    // Fallback to local file if not in Supabase yet (or error)
    if (!text) {
        // console.log('Checking local club-records.csv...');
        text = await fetchText('/data/results/club-records.csv');
    }

    if (!text) return [];
    return parseClubRecordsCSV(text.split('\n'));
}

/**
 * Helper to fetch raw text
 */
async function fetchText(url) {
    try {
        const baseUrl = (import.meta.env && import.meta.env.BASE_URL) || '/';
        const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? url.slice(1) : url}`;
        const response = await fetch(fullUrl);
        if (!response.ok) {
            // Quietly fail for local fallbacks if not found
            return null;
        }
        return await response.text();
    } catch (error) {
        console.error('Error loading text:', error);
        return null;
    }
}

/**
 * Parse specific Club Records CSV format
 * @param {Array<string>} lines 
 * @returns {Array<Object>}
 */
function parseClubRecordsCSV(lines) {
    const records = [];
    let currentRound = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (isEmptyLine(line)) continue;

        const values = parseCSVLine(line);

        // Logic based on column positions:
        // Index 0: Metadata (e.g. "Kettering Archers", Date/Page) -> Ignore
        // Index 1: Round Name (e.g. "3-Way Clout") IF Index 2 is empty
        // Index 2: Archer Name -> Record Row

        // 1. Check for Metadata/Page info (Index 0 has text)
        if (values[0] && values[0].trim() !== '') {
            continue;
        }

        // 2. Check for Round Header (Index 1 has text, Index 2 is empty)
        if (values[1] && values[1].trim() !== '' && (!values[2] || values[2].trim() === '')) {
            currentRound = values[1].trim();
            continue;
        }

        // 3. Check for Record Row (Index 2 has text)
        if (values[2] && values[2].trim() !== '') {
            records.push({
                round: currentRound, // Inherit current round
                archer_name: values[2].trim(),
                score: values[4]?.trim() || '0',
                bow_type: values[6]?.trim() || '',
                date: parseUKDate(values[8]?.trim()),
                archer_category: values[9]?.trim() || ''
            });
        }
    }

    return records.sort((a, b) => (a.round || '').localeCompare(b.round || ''));
}

/**
 * Load personal bests
 * @returns {Promise<Array<Object>>} Personal bests sorted by archer name, then round name
 */
export async function loadPersonalBests() {
    // Try Supabase first (Supabase Storage path: special/personal-bests.csv)
    let text = await fetchSupabaseFile('special/personal-bests.csv');

    // Fallback to local file
    if (!text) {
        // console.log('Checking local personal-bests.csv...');
        text = await fetchText('/data/results/personal-bests.csv');
    }

    if (!text) return [];

    return parsePersonalBestsCSV(text.split('\n')).sort((a, b) => {
        const nameCompare = (a.archer_name || '').localeCompare(b.archer_name || '');
        if (nameCompare !== 0) return nameCompare;
        return (a.round || '').localeCompare(b.round || '');
    });
}

/**
 * Parse Personal Bests CSV format
 * Structure:
 * - Entity Line (Index 1): Could be Archer Name OR Bow Type
 * - Header Line (Index 2 == "Round"): Confirms previous entity was Bow Type. 
 *   If there was an entity before THAT, it was the Archer Name.
 * - Record Line (Index 2 has data): params: Round, Date, Hits, Golds, Score
 */
function parsePersonalBestsCSV(lines) {
    const records = [];
    let currentArcher = null;
    let currentBow = null;
    let potentialEntity = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (isEmptyLine(line)) continue;

        const values = parseCSVLine(line);

        // 1. Metadata / Flagged lines (Index 0 has text) -> Ignore
        if (values[0] && values[0].trim() !== '') continue;

        // 2. Entity Line (Index 1 has text)
        if (values[1] && values[1].trim() !== '') {
            // If we already have a potential entity pending, it must be the Archer
            if (potentialEntity) {
                currentArcher = potentialEntity;
            }
            potentialEntity = values[1].trim();
            continue;
        }

        // 3. Header Line (Index 2 is "Round")
        if (values[2] && values[2].trim() === 'Round') {
            if (potentialEntity) {
                currentBow = potentialEntity;
                potentialEntity = null;
            }
            continue;
        }

        // 4. Record Line (Index 2 has text and is NOT "Round")
        if (values[2] && values[2].trim() !== '' && values[2].trim() !== 'Round') {
            // Ensure we have context
            if (!currentArcher && potentialEntity) {
                // Fallback: If we hit records but potentialEntity wasn't promoted, 
                // it might mean strict Archer->Bow structure wasn't followed exactly?
                // But strictly following the logic: currentBow should be set by Header line.
            }

            if (currentArcher && currentBow) {
                records.push({
                    archer_name: currentArcher,
                    bow_type: currentBow,
                    round: values[2].trim(),
                    date: parseUKDate(values[4]?.trim()),
                    hits: values[5]?.trim() || '0',
                    golds: values[8]?.trim() || '0',
                    score: values[10]?.trim() || '0'
                });
            }
        }
    }
    return records;
}

/**
 * Parse date string in dd/mm/yyyy format to ISO YYYY-MM-DD
 * @param {string} dateStr 
 * @returns {string} ISO date string or original if parse fails
 */
function parseUKDate(dateStr) {
    if (!dateStr) return '';

    // Check if matched dd/mm/yyyy format
    const parts = dateStr.split('/');
    if (parts.length === 3) {
        const [day, month, year] = parts;
        // Basic validation: ensure parts are numbers and year is 4 digits
        if (!isNaN(day) && !isNaN(month) && !isNaN(year) && year.length === 4) {
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
    }

    return dateStr;
}
