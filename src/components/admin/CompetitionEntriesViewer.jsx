import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { exportToCSV } from '../../utils/csvLoader';

const CompetitionEntriesViewer = ({ competition, onClose }) => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, paid: 0, junior: 0, senior: 0 });

    useEffect(() => {
        fetchEntries();
    }, [competition]);

    const fetchEntries = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('competition_entries')
                .select('*')
                .eq('competition_id', competition.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setEntries(data);
            calculateStats(data);
        } catch (error) {
            console.error('Error fetching entries:', error);
            alert('Error fetching entries');
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data) => {
        const stats = {
            total: data.length,
            paid: data.filter(e => e.is_paid).length,
            junior: data.filter(e => e.age_category === 'Junior').length,
            senior: data.filter(e => e.age_category !== 'Junior').length // approximate
        };
        setStats(stats);
    };

    const togglePaid = async (entry) => {
        try {
            const { error } = await supabase
                .from('competition_entries')
                .update({ is_paid: !entry.is_paid })
                .eq('id', entry.id);

            if (error) throw error;

            // Update local state
            const updatedEntries = entries.map(e =>
                e.id === entry.id ? { ...e, is_paid: !e.is_paid } : e
            );
            setEntries(updatedEntries);
            calculateStats(updatedEntries);
        } catch (error) {
            console.error('Error updating payment status:', error);
            alert('Failed to update payment status');
        }
    };

    const handleDelete = async (entry) => {
        if (!window.confirm(`Delete entry for ${entry.full_name}?`)) return;
        try {
            const { error } = await supabase
                .from('competition_entries')
                .delete()
                .eq('id', entry.id);

            if (error) throw error;

            const updatedEntries = entries.filter(e => e.id !== entry.id);
            setEntries(updatedEntries);
            calculateStats(updatedEntries);
        } catch (error) {
            console.error('Error deleting entry:', error);
            alert('Failed to delete entry');
        }
    };

    const handlePurge = async () => {
        const confirmMsg = `WARNING: This will permanently DELETE ALL ${entries.length} entries for ${competition.name}. \n\nType "DELETE" to confirm.`;
        const userInput = prompt(confirmMsg);

        if (userInput === 'DELETE') {
            try {
                const { error } = await supabase
                    .from('competition_entries')
                    .delete()
                    .eq('competition_id', competition.id);

                if (error) throw error;

                setEntries([]);
                setStats({ total: 0, paid: 0, junior: 0, senior: 0 });
                alert('All entries purged successfully.');
            } catch (error) {
                console.error('Error purging entries:', error);
                alert('Failed to purge entries');
            }
        }
    };

    const handleExport = () => {
        const filename = `${competition.slug}_entries_${new Date().toISOString().split('T')[0]}.csv`;
        // Prepare data for export - remove internal IDs if needed or keep them. 
        // Let's format it nicely.
        const exportData = entries.map(e => ({
            'Full Name': e.full_name,
            'Email': e.email,
            'Bow Type': e.bowtype,
            'Distance': e.distance,
            'Category': e.category,
            'Age Category': e.age_category,
            'DOB': e.dob || '',
            'AGB Number': e.agb_number,
            'Club': e.club,
            'Seated': e.seated ? 'Yes' : 'No',
            'Emergency Contact': e.emergency_contact,
            'Paid': e.is_paid ? 'Yes' : 'No',
            'Entry Date': new Date(e.created_at).toLocaleString()
        }));

        exportToCSV(exportData, filename);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{competition.name} - Entries</h2>
                        <div className="text-sm text-gray-500 mt-1 flex gap-4">
                            <span>Total: {stats.total}</span>
                            <span>Paid: {stats.paid}</span>
                            <span>Unpaid: {stats.total - stats.paid}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Toolbar */}
                <div className="px-6 py-3 border-b border-gray-200 bg-white flex flex-wrap gap-2 justify-between items-center">
                    <div className="flex gap-2">
                        <button
                            onClick={fetchEntries}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        >
                            <svg className="-ml-1 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleExport}
                            disabled={entries.length === 0}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-forest-600 hover:bg-forest-700 focus:outline-none disabled:opacity-50"
                        >
                            <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Export CSV
                        </button>
                        <button
                            onClick={handlePurge}
                            disabled={entries.length === 0}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none disabled:opacity-50"
                        >
                            <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Purge All
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600"></div>
                        </div>
                    ) : entries.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                            <svg className="h-12 w-12 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p>No entries found for this competition.</p>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Archer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bow / Dist / Cat</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Info</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {entries.map((entry) => (
                                    <tr key={entry.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => togglePaid(entry)}
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer transition-colors
                                                    ${entry.is_paid ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                                            >
                                                {entry.is_paid ? 'Paid' : 'Unpaid'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{entry.full_name}</div>
                                            <div className="text-sm text-gray-500">{entry.email}</div>
                                            <div className="text-xs text-gray-400">AGB: {entry.agb_number}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{entry.bowtype}</div>
                                            <div className="text-sm text-gray-500">{entry.distance}</div>
                                            <div className="text-xs text-gray-500">{entry.category} - {entry.age_category}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {entry.club}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex flex-col gap-1">
                                                {entry.seated && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 w-fit">Seated</span>}
                                                {entry.dob && <span className="text-xs">DOB: {entry.dob}</span>}
                                                <span className="text-xs truncate max-w-[150px]" title={entry.emergency_contact}>EC: {entry.emergency_contact}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleDelete(entry)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <div className="text-xs text-gray-500 text-center">
                        {entries.length > 0 && `Last updated: ${new Date().toLocaleTimeString()}`}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompetitionEntriesViewer;
