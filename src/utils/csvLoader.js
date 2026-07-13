import { supabase } from '../lib/supabase';

/**
 * Determine the season for an event based on its date and venue.
 * Outdoor: strictly calendar year.
 * Indoor: September (Y) to April (Y+1).
 * @param {string|Date} dateStr 
 * @param {string} venue 'Indoor' or 'Outdoor'
 * @returns {Object} Season metadata { id, name, type, startYear }
 */
export function getSeasonFromDate(dateStr, venue = 'Outdoor') {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth(); // 0 is Jan, 8 is Sep, 11 is Dec

    if (venue && venue.toLowerCase() === 'indoor') {
        // Indoor season starts in September
        if (month >= 8) { // Sep-Dec
            return {
                id: `${year}_${year + 1}_indoor`,
                name: `${year}/${year + 1} Indoor Season`,
                type: 'indoor',
                startYear: year
            };
        } else { // Jan-Aug
            return {
                id: `${year - 1}_${year}_indoor`,
                name: `${year - 1}/${year} Indoor Season`,
                type: 'indoor',
                startYear: year - 1
            };
        }
    } else {
        // Outdoor season is based strictly on the calendar year
        return {
            id: `${year}_outdoor`,
            name: `${year} Outdoor Season`,
            type: 'outdoor',
            startYear: year
        };
    }
}

/**
 * Get the current seasons based on today's date.
 */
export function getCurrentSeasons() {
    const today = new Date();
    return {
        outdoor: getSeasonFromDate(today, 'Outdoor'),
        indoor: getSeasonFromDate(today, 'Indoor')
    };
}

/**
 * Fetch text content from Supabase Storage
 * @param {string} path - Path in storage bucket
 * @returns {Promise<string>} File content
 */
async function fetchSupabaseFile(path, { bustCache = false } = {}) {
    try {
        const { data } = supabase.storage.from('results').getPublicUrl(path);
        // Only append a cache-buster when explicitly requested (e.g. right after
        // an admin upload). For regular reads we let the browser / CDN cache the file.
        const url = bustCache ? `${data.publicUrl}?t=${Date.now()}` : data.publicUrl;

        const response = await fetch(url);
        // If 404 Not Found (e.g. file doesn't exist yet in Supabase), throw error
        // so we can fallback to the local default file.
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} when fetching ${url}`);
        }

        return await response.text();
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
            // Fetch all event CSVs in parallel rather than one-by-one
            const eventDataList = await Promise.all(
                files.map(async (file) => {
                    let eventResults = [];
                    const isCsv = file.filename.toLowerCase().endsWith('.csv');
                    const fileUrl = getSupabaseFileUrl(file.file_path);

                    if (isCsv) {
                        const csvText = await fetchSupabaseFile(file.file_path);
                        if (csvText) {
                            eventResults = parseCSV(csvText);
                        }
                    }

                    const pdfUrl = file.pdf_path ? getSupabaseFileUrl(file.pdf_path) : null;

                    return {
                        id: file.id,
                        date: file.event_date,
                        eventName: file.event_name,
                        venue: file.venue, // 'Indoor' or 'Outdoor'
                        results: eventResults,
                        fileUrl: fileUrl,
                        pdfUrl: pdfUrl,
                        fileType: isCsv ? 'csv' : 'file',
                        season: getSeasonFromDate(file.event_date, file.venue)
                    };
                })
            );

            for (const eventData of eventDataList) {
                if (eventData.venue === 'Indoor') {
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

    // Normalize line endings to ensure \r\n and \n are both handled
    const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = normalizedText.split('\n');

    // Detect format by checking if the first non-empty line is the new named-header format.
    // Strip both the Unicode BOM (﻿) and its Latin-1 decoded equivalent (ï»¿) before checking.
    const firstLine = lines[0].replace(/^﻿/, '').replace(/^ï»¿/, '').trim();
    if (firstLine.startsWith('Date Shot')) {
        return parseNewClubRecordsCSV(lines);
    }
    return parseClubRecordsCSV(lines);
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
 * Parse the newer flat club-records CSV format.
 * Header: Date Shot,Round,Score,Golds,Hits,Tens,Class,Age Group,Name,Place Shot,User1,User2
 * @param {Array<string>} lines
 * @returns {Array<Object>}
 */
function parseNewClubRecordsCSV(lines) {
    // Strip BOM from the raw header line before splitting — handles both the
    // Unicode BOM (﻿) and the same bytes decoded as Latin-1 (ï»¿).
    const rawHeader = lines[0].replace(/^﻿/, '').replace(/^ï»¿/, '');
    const headers = parseCSVLine(rawHeader).map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));

    // Build a column-index lookup so we can fetch values by position,
    // which is immune to any key-naming issues that slipped through the BOM strip.
    const col = {};
    headers.forEach((h, i) => { col[h] = i; });

    const records = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (isEmptyLine(line)) continue;

        const values = parseCSVLine(line);
        const get = (key) => values[col[key]]?.trim() || '';

        const name = get('name');
        if (!name) continue;

        records.push({
            round: get('round'),
            archer_name: name,
            score: get('score') || '0',
            golds: get('golds') || '0',
            hits: get('hits') || '0',
            bow_type: get('class'),
            date: parseUKDate(get('date_shot')),
            archer_category: get('age_group'),
            place_shot: get('place_shot')
        });
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

    // Normalize line endings
    const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = normalizedText.split('\n');

    // Detect format: in the new (2026+) export the header row starts with "Round"
    // in the first column; the old export had the header at column index 2.
    const parsed = isNewPersonalBestsFormat(lines)
        ? parseNewPersonalBestsCSV(lines)
        : parsePersonalBestsCSV(lines);

    return parsed.sort((a, b) => {
        const nameCompare = (a.archer_name || '').localeCompare(b.archer_name || '');
        if (nameCompare !== 0) return nameCompare;
        return (a.round || '').localeCompare(b.round || '');
    });
}

/**
 * Detect the new (2026+) Personal Bests export format.
 * The new export puts the section header row ("Round","Age Group","Date Shot",...)
 * in the FIRST column, whereas the old print-ready export had "Round" at column index 2.
 * @param {Array<string>} lines
 * @returns {boolean}
 */
function isNewPersonalBestsFormat(lines) {
    for (const line of lines) {
        if (isEmptyLine(line)) continue;
        const values = parseCSVLine(line.trim());
        const roundIdx = values.findIndex(v => v.trim() === 'Round');
        if (roundIdx !== -1) {
            return roundIdx === 0;
        }
    }
    return false;
}

/**
 * Parse the new (2026+) Personal Bests CSV export format.
 * Structure (all data starts in the first column):
 * - Page metadata: "Kettering Archers", "Personal Bests in period ending ...",
 *   and page footers like "29/06/2026",,,"Page 2" -> ignored
 * - Archer name line: single populated cell (e.g. "Alan Haynes")
 * - Bow type line: single populated cell (e.g. "Barebow"), always followed by a header row
 * - Header row: "Round","Age Group","Date Shot","Score","Hits",,"Golds","Xs"
 * - Record row: values at [0]=round, [1]=age group, [2]=date, [3]=score,
 *   [4]=hits, [5]=(blank), [6]=golds, [7]=Xs
 * Sections continue across page breaks, so archer/bow state persists until
 * a new entity line appears.
 * @param {Array<string>} lines
 * @returns {Array<Object>}
 */
function parseNewPersonalBestsCSV(lines) {
    const records = [];
    let currentArcher = null;
    let currentBow = null;
    let potentialEntity = null;
    const DATE_RE = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (isEmptyLine(line)) continue;

        const values = parseCSVLine(line).map(v => v.trim());
        const nonEmpty = values.filter(v => v !== '');
        if (nonEmpty.length === 0) continue;

        const first = values[0];

        // Page metadata -> ignore
        if (first.includes('Kettering Archers')) continue;
        if (first.startsWith('Personal Bests')) continue;
        // Page footer, e.g. "29/06/2026",,,"Page 2"
        if (DATE_RE.test(first) && values.some(v => /^Page\s+\d+/i.test(v))) continue;

        // Header row: the entity line directly above it was the bow type;
        // if another entity preceded that one, it was the archer name.
        if (first === 'Round') {
            if (potentialEntity) {
                currentBow = potentialEntity;
                potentialEntity = null;
            }
            continue;
        }

        // Entity line (only the first column populated): archer name or bow type
        if (nonEmpty.length === 1) {
            if (potentialEntity) {
                currentArcher = potentialEntity;
            }
            potentialEntity = first;
            continue;
        }

        // Record rows
        if (!currentArcher || !currentBow) continue;

        if (DATE_RE.test(values[2] || '')) {
            records.push({
                archer_name: currentArcher,
                bow_type: currentBow,
                round: values[0],
                archer_category: values[1] || '',
                date: parseUKDate(values[2]),
                score: values[3] || '0',
                hits: values[4] || '0',
                golds: values[6] || '0'
            });
        } else if (DATE_RE.test(values[1] || '')) {
            // Occasionally the export drops the round name from a row, shifting
            // every column left by one. Without a round the record is unusable.
            console.warn(`Personal Bests parser: skipping record with missing round name for ${currentArcher} (${currentBow})`);
        }
    }

    return records;
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
 * Parse date string in dd/mm/yyyy or dd/mm/yyyy HH:MM format to ISO YYYY-MM-DD
 * @param {string} dateStr
 * @returns {string} ISO date string or original if parse fails
 */
function parseUKDate(dateStr) {
    if (!dateStr) return '';

    // Strip any trailing time component (e.g. "13/01/2013 21:29")
    const datePart = dateStr.split(' ')[0];

    const parts = datePart.split('/');
    if (parts.length === 3) {
        const [day, month, year] = parts;
        if (!isNaN(day) && !isNaN(month) && !isNaN(year) && year.length === 4) {
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
    }

    return dateStr;
}

/**
 * Load county records from the county_records Supabase table.
 * Populated and refreshed weekly by the scrape-county-records Edge Function.
 * @returns {Promise<{records: Array<Object>, lastUpdated: string|null}>}
 */
export async function loadCountyRecords() {
    try {
        // Supabase projects have a server-side max_rows cap (often 1000) that
        // overrides client-side .limit(). Paginate to guarantee all rows are fetched.
        const PAGE_SIZE = 1000;
        let allData = [];
        let page = 0;
        let keepGoing = true;

        while (keepGoing) {
            const from = page * PAGE_SIZE;
            const to = from + PAGE_SIZE - 1;
            const { data, error } = await supabase
                .from('county_records')
                .select('*')
                .order('bow_type', { ascending: true })
                .order('category', { ascending: true })
                .order('round', { ascending: true })
                .range(from, to);

            if (error) {
                console.error('Error loading county records:', error);
                return { records: [], lastUpdated: null };
            }

            if (data && data.length > 0) {
                allData = allData.concat(data);
            }

            // If we got fewer rows than PAGE_SIZE, we've reached the last page
            keepGoing = data && data.length === PAGE_SIZE;
            page++;
        }


        // Find the most recent updated_at for display purposes
        const latestUpdate = allData.reduce((latest, r) => {
            if (!latest) return r.updated_at;
            return r.updated_at > latest ? r.updated_at : latest;
        }, null) || null;

        return {
            records: allData.map(r => ({
                ...r,
                display_round: r.round_override || r.round,
            })),
            lastUpdated: latestUpdate,
        };
    } catch (error) {
        console.error('Error in loadCountyRecords:', error);
        return { records: [], lastUpdated: null };
    }
}

/**
 * Export data to CSV
 * @param {Array<Object>} data - Array of objects to export
 * @param {string} filename - Filename for the downloaded file
 */
export const exportToCSV = (data, filename) => {
    if (!data || !data.length) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => {
            const value = row[header];
            // Handle strings that contain commas or double quotes
            if (typeof value === 'string') {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
