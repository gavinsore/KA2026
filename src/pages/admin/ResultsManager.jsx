import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import AdminBreadcrumbs from '../../components/admin/AdminBreadcrumbs';

const ResultsManager = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(null);
    const [dataMode, setDataMode] = useState('event'); // 'event', 'records', 'pbs'

    // PDF upload state: which row is showing the inline upload form
    const [pdfUploadingFor, setPdfUploadingFor] = useState(null); // file.id
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfUploading, setPdfUploading] = useState(false);
    const pdfInputRef = useRef(null);

    // Form State (for CSV event upload)
    const [formData, setFormData] = useState({
        event_name: '',
        event_date: new Date().toISOString().split('T')[0],
        venue: 'Outdoor',
        file: null
    });

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('results_files')
                .select('*')
                .order('event_date', { ascending: false });

            if (error) throw error;
            setFiles(data);
        } catch (error) {
            console.error('Error fetching files:', error);
            setMessage({ type: 'error', text: 'Failed to load files.' });
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setUploading(true);
        setMessage(null);

        try {
            if (!formData.file) throw new Error('Please select a file.');

            let filePath = '';
            let dbInsert = true;

            if (dataMode === 'event') {
                if (!formData.event_name || !formData.event_date) {
                    throw new Error('Event Name and Date are required.');
                }
                const fileExt = formData.file.name.split('.').pop();
                const fileName = `${formData.event_date}_${formData.event_name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${fileExt}`;
                filePath = `${formData.venue.toLowerCase()}/${fileName}`;
            } else {
                if (dataMode === 'records') {
                    filePath = 'special/club-records.csv';
                } else if (dataMode === 'pbs') {
                    filePath = 'special/personal-bests.csv';
                }
                dbInsert = false;
            }

            const { error: uploadError } = await supabase.storage
                .from('results')
                .upload(filePath, formData.file, { upsert: true });

            if (uploadError) throw uploadError;

            if (dbInsert) {
                const { error: dbError } = await supabase
                    .from('results_files')
                    .insert([{
                        filename: formData.file.name,
                        file_path: filePath,
                        event_name: formData.event_name,
                        event_date: formData.event_date,
                        venue: formData.venue,
                        uploaded_by: (await supabase.auth.getUser()).data.user.id
                    }]);

                if (dbError) throw dbError;
                fetchFiles();
            }

            setMessage({ type: 'success', text: 'File uploaded successfully!' });
            setFormData({
                file: null,
                event_name: '',
                event_date: new Date().toISOString().split('T')[0],
                venue: 'Outdoor'
            });
            document.getElementById('file-upload').value = '';

        } catch (error) {
            console.error('Upload error:', error);
            setMessage({ type: 'error', text: error.message || 'Error uploading file.' });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id, filePath) => {
        if (!window.confirm('Are you sure you want to delete this result? The associated PDF (if any) will NOT be automatically deleted from storage.')) return;

        setLoading(true);
        try {
            const { error: storageError } = await supabase.storage
                .from('results')
                .remove([filePath]);

            if (storageError) {
                console.warn('Storage delete warning:', storageError);
            }

            const { error: dbError } = await supabase
                .from('results_files')
                .delete()
                .eq('id', id);

            if (dbError) throw dbError;

            setMessage({ type: 'success', text: 'Result deleted.' });
            fetchFiles();
        } catch (error) {
            console.error('Delete error:', error);
            setMessage({ type: 'error', text: 'Failed to delete result.' });
        } finally {
            setLoading(false);
        }
    };

    // ── PDF Upload ──────────────────────────────────────────────────────────

    const buildPdfPath = (file) => {
        const baseName = file.file_path
            .split('/')
            .pop()
            .replace(/\.[^.]+$/, ''); // strip extension
        const folder = file.file_path.substring(0, file.file_path.lastIndexOf('/'));
        return `${folder}/${baseName}_programme.pdf`;
    };

    const handlePdfUpload = async (file) => {
        if (!pdfFile) return;
        setPdfUploading(true);
        setMessage(null);

        try {
            const pdfPath = buildPdfPath(file);

            const { error: uploadError } = await supabase.storage
                .from('results')
                .upload(pdfPath, pdfFile, { upsert: true, contentType: 'application/pdf' });

            if (uploadError) throw uploadError;

            const { error: dbError } = await supabase
                .from('results_files')
                .update({ pdf_path: pdfPath })
                .eq('id', file.id);

            if (dbError) throw dbError;

            setMessage({ type: 'success', text: 'PDF uploaded successfully!' });
            setPdfUploadingFor(null);
            setPdfFile(null);
            fetchFiles();
        } catch (error) {
            console.error('PDF upload error:', error);
            setMessage({ type: 'error', text: error.message || 'Error uploading PDF.' });
        } finally {
            setPdfUploading(false);
        }
    };

    const handlePdfRemove = async (file) => {
        if (!window.confirm('Remove the PDF for this event?')) return;
        setPdfUploading(true);
        setMessage(null);

        try {
            if (file.pdf_path) {
                await supabase.storage.from('results').remove([file.pdf_path]);
            }

            const { error: dbError } = await supabase
                .from('results_files')
                .update({ pdf_path: null })
                .eq('id', file.id);

            if (dbError) throw dbError;

            setMessage({ type: 'success', text: 'PDF removed.' });
            fetchFiles();
        } catch (error) {
            console.error('PDF remove error:', error);
            setMessage({ type: 'error', text: 'Failed to remove PDF.' });
        } finally {
            setPdfUploading(false);
        }
    };

    const cancelPdfUpload = () => {
        setPdfUploadingFor(null);
        setPdfFile(null);
        if (pdfInputRef.current) pdfInputRef.current.value = '';
    };

    // ────────────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen py-10 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AdminBreadcrumbs />
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-forest-900">Results Manager</h1>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {message.text}
                        </div>
                    )}

                    {/* Upload Section */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-charcoal-100">
                        <h2 className="text-xl font-semibold text-forest-800 mb-4">Upload New File</h2>

                        {/* Mode Selection */}
                        <div className="flex gap-4 mb-6">
                            <button
                                onClick={() => setDataMode('event')}
                                className={`px-4 py-2 rounded-md transition-colors ${dataMode === 'event' ? 'bg-forest-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                Event Result
                            </button>
                            <button
                                onClick={() => setDataMode('records')}
                                className={`px-4 py-2 rounded-md transition-colors ${dataMode === 'records' ? 'bg-forest-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                Club Records (CSV)
                            </button>
                            <button
                                onClick={() => setDataMode('pbs')}
                                className={`px-4 py-2 rounded-md transition-colors ${dataMode === 'pbs' ? 'bg-forest-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                Personal Bests (CSV)
                            </button>
                        </div>

                        <form onSubmit={handleUpload} className="space-y-4">

                            {dataMode === 'event' && (
                                <>
                                    <div className="p-3 bg-blue-50 text-blue-800 rounded-md border border-blue-200 text-sm">
                                        <p className="font-semibold flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Uploading Archived Results
                                        </p>
                                        <p className="mt-1 ml-6 text-blue-700">Events with past dates are automatically sorted into the Historical Archive.</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-charcoal-700 mb-1">Event Name</label>
                                            <input
                                                type="text"
                                                name="event_name"
                                                value={formData.event_name}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-charcoal-200 rounded-md focus:ring-forest-500 focus:border-forest-500"
                                                placeholder="e.g. Spring Handicap"
                                                required={dataMode === 'event'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-charcoal-700 mb-1">Date</label>
                                            <input
                                                type="date"
                                                name="event_date"
                                                value={formData.event_date}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-charcoal-200 rounded-md focus:ring-forest-500 focus:border-forest-500"
                                                required={dataMode === 'event'}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-charcoal-700 mb-1">Venue</label>
                                            <select
                                                name="venue"
                                                value={formData.venue}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-charcoal-200 rounded-md focus:ring-forest-500 focus:border-forest-500"
                                            >
                                                <option value="Outdoor">Outdoor</option>
                                                <option value="Indoor">Indoor</option>
                                            </select>
                                        </div>
                                    </div>
                                </>
                            )}

                            {dataMode !== 'event' && (
                                <div className="p-4 bg-orange-50 text-orange-800 rounded-md border border-orange-200 text-sm">
                                    <p className="font-semibold">⚠️ Overwrite Warning</p>
                                    <p>Uploading a file here will <strong>completely replace</strong> the existing {dataMode === 'records' ? 'Club Records' : 'Personal Bests'} file on the website.</p>
                                    <p className="mt-1">Make sure your CSV matches the required format exactly.</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 mb-1">Result File (CSV or PDF)</label>
                                <input
                                    id="file-upload"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".csv,.pdf,.xls,.xlsx"
                                    className="w-full p-2 border border-charcoal-200 rounded-md focus:ring-forest-500 focus:border-forest-500"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={uploading}
                                className="btn-primary w-full md:w-auto"
                            >
                                {uploading ? 'Uploading...' : (dataMode === 'event' ? 'Upload Event Result' : 'Overwrite Records File')}
                            </button>
                        </form>
                    </div>

                    {/* List Events */}
                    <div className="bg-white p-6 rounded-lg shadow-md border border-charcoal-100">
                        <h2 className="text-xl font-semibold text-forest-800 mb-4">Uploaded Event Results</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-charcoal-50 border-b border-charcoal-200">
                                        <th className="p-3 text-sm font-semibold text-charcoal-700">Date</th>
                                        <th className="p-3 text-sm font-semibold text-charcoal-700">Event</th>
                                        <th className="p-3 text-sm font-semibold text-charcoal-700">Venue</th>
                                        <th className="p-3 text-sm font-semibold text-charcoal-700">Filename</th>
                                        <th className="p-3 text-sm font-semibold text-charcoal-700">PDF</th>
                                        <th className="p-3 text-sm font-semibold text-charcoal-700 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {files.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="p-4 text-center text-charcoal-500">No result files uploaded yet.</td>
                                        </tr>
                                    ) : (
                                        files.map((file) => (
                                            <tr key={file.id} className="border-b border-charcoal-100 hover:bg-charcoal-50 align-top">
                                                <td className="p-3 text-charcoal-700 whitespace-nowrap">{new Date(file.event_date).toLocaleDateString()}</td>
                                                <td className="p-3 text-forest-800 font-medium">{file.event_name}</td>
                                                <td className="p-3 text-charcoal-600">
                                                    <span className={`px-2 py-1 rounded text-xs ${file.venue === 'Indoor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                                        {file.venue}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-charcoal-500 text-sm">{file.filename}</td>

                                                {/* PDF Column */}
                                                <td className="p-3">
                                                    {file.pdf_path ? (
                                                        /* PDF exists — show badge + remove */
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold">
                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                                                </svg>
                                                                PDF
                                                            </span>
                                                            <button
                                                                onClick={() => handlePdfRemove(file)}
                                                                disabled={pdfUploading}
                                                                className="text-xs text-charcoal-400 hover:text-red-600 transition-colors"
                                                                title="Remove PDF"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    ) : pdfUploadingFor === file.id ? (
                                                        /* Inline upload form */
                                                        <div className="flex flex-col gap-2">
                                                            <input
                                                                ref={pdfInputRef}
                                                                type="file"
                                                                accept=".pdf"
                                                                onChange={(e) => setPdfFile(e.target.files[0])}
                                                                className="text-xs border border-charcoal-200 rounded p-1 w-44"
                                                            />
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handlePdfUpload(file)}
                                                                    disabled={!pdfFile || pdfUploading}
                                                                    className="text-xs px-2 py-1 bg-forest-600 text-white rounded hover:bg-forest-700 disabled:opacity-50 transition-colors"
                                                                >
                                                                    {pdfUploading ? 'Uploading…' : 'Upload'}
                                                                </button>
                                                                <button
                                                                    onClick={cancelPdfUpload}
                                                                    className="text-xs px-2 py-1 bg-charcoal-100 text-charcoal-700 rounded hover:bg-charcoal-200 transition-colors"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        /* No PDF yet — prompt to upload */
                                                        <button
                                                            onClick={() => {
                                                                setPdfUploadingFor(file.id);
                                                                setPdfFile(null);
                                                            }}
                                                            className="inline-flex items-center gap-1 text-xs text-charcoal-400 hover:text-forest-600 transition-colors"
                                                            title="Upload PDF for this event"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                            </svg>
                                                            Add PDF
                                                        </button>
                                                    )}
                                                </td>

                                                <td className="p-3 text-right whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleDelete(file.id, file.file_path)}
                                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                        disabled={loading}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsManager;
