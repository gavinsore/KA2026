import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';

const ResultsManager = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState(null); // For success/error messages
    const [dataMode, setDataMode] = useState('event'); // 'event', 'records', 'pbs'

    // Form State
    const [formData, setFormData] = useState({
        event_name: '',
        event_date: new Date().toISOString().split('T')[0], // Default to today
        venue: 'Outdoor',
        file: null
    });

    // List files on load
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
            let dbInsert = true; // Whether to insert into results_files table

            if (dataMode === 'event') {
                // Standard Event Result Upload
                if (!formData.event_name || !formData.event_date) {
                    throw new Error('Event Name and Date are required.');
                }
                const fileExt = formData.file.name.split('.').pop();
                const fileName = `${formData.event_date}_${formData.event_name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${fileExt}`;
                filePath = `${formData.venue.toLowerCase()}/${fileName}`;
            } else {
                // Special Record File Upload (Overwrite)
                // We format the filename drastically to ensure it matches what the loader expects
                if (dataMode === 'records') {
                    filePath = 'special/club-records.csv';
                } else if (dataMode === 'pbs') {
                    filePath = 'special/personal-bests.csv';
                }
                dbInsert = false; // We don't track these in the events table
            }

            // Upload to Supabase Storage (Upsert = true to overwrite)
            const { error: uploadError } = await supabase.storage
                .from('results')
                .upload(filePath, formData.file, { upsert: true });

            if (uploadError) throw uploadError;

            // Only insert metadata for Events
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
                fetchFiles(); // Refresh list
            }

            setMessage({ type: 'success', text: 'File uploaded successfully!' });
            // Reset form
            setFormData({
                file: null,
                event_name: '',
                event_date: new Date().toISOString().split('T')[0],
                venue: 'Outdoor'
            });
            // Reset file input manually
            document.getElementById('file-upload').value = '';

        } catch (error) {
            console.error('Upload error:', error);
            setMessage({ type: 'error', text: error.message || 'Error uploading file.' });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id, filePath) => {
        if (!window.confirm('Are you sure you want to delete this result?')) return;

        setLoading(true);
        try {
            // Delete from Storage
            const { error: storageError } = await supabase.storage
                .from('results')
                .remove([filePath]);

            if (storageError) {
                console.warn('Storage delete warning:', storageError);
                // Continue anyway to delete from DB if file is missing
            }

            // Delete from DB
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

    return (
        <div className="min-h-screen py-10 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                                    accept=".csv,.pdf,.xls,.xlsx" // Accept common formats
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

                    {/* List Events only */}
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
                                        <th className="p-3 text-sm font-semibold text-charcoal-700 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {files.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="p-4 text-center text-charcoal-500">No result files uploaded yet.</td>
                                        </tr>
                                    ) : (
                                        files.map((file) => (
                                            <tr key={file.id} className="border-b border-charcoal-100 hover:bg-charcoal-50">
                                                <td className="p-3 text-charcoal-700">{new Date(file.event_date).toLocaleDateString()}</td>
                                                <td className="p-3 text-forest-800 font-medium">{file.event_name}</td>
                                                <td className="p-3 text-charcoal-600">
                                                    <span className={`px-2 py-1 rounded text-xs ${file.venue === 'Indoor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                                        {file.venue}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-charcoal-500 text-sm">{file.filename}</td>
                                                <td className="p-3 text-right">
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
