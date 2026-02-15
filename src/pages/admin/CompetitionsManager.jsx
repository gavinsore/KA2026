import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import CompetitionEntriesViewer from '../../components/admin/CompetitionEntriesViewer';
import AdminBreadcrumbs from '../../components/admin/AdminBreadcrumbs';

const CompetitionsManager = () => {
    const [competitions, setCompetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentComp, setCurrentComp] = useState(null);
    const [formData, setFormData] = useState(getInitialState());

    // Helper to reset form
    function getInitialState() {
        return {
            name: '',
            slug: '',
            date: '',
            time: '09:00',
            location: 'Kettering Sports Ground',
            entry_fee_adult: 0,
            entry_fee_junior: 0,
            payment_details: 'Payment by bank transfer to:\nAccount Name: Kettering Archers\nSort Code: 12-34-56\nAccount Number: 12345678',
            judges_str: '', // Helper for array
            medals: '',
            eligible_classes_str: '', // Helper for array
            eligible_distances_str: '', // Helper for array
            dress_code: 'Archery GB dress regulations apply.',
            gdpr_notice: 'By submitting this form, you consent to Kettering Archers storing and processing your personal data.',
            closing_date: '',
            additional_info: '',
            max_entries: 0,
            is_open: true
        };
    }

    const [entryStats, setEntryStats] = useState({});

    useEffect(() => {
        fetchCompetitions();
        fetchEntryStats();
    }, []);

    const fetchEntryStats = async () => {
        try {
            const { data, error } = await supabase
                .from('competition_entries')
                .select('competition_id, is_paid');

            if (error) throw error;

            const stats = {};
            data.forEach(entry => {
                if (!stats[entry.competition_id]) {
                    stats[entry.competition_id] = { paid: 0, unpaid: 0, total: 0 };
                }
                stats[entry.competition_id].total++;
                if (entry.is_paid) {
                    stats[entry.competition_id].paid++;
                } else {
                    stats[entry.competition_id].unpaid++;
                }
            });
            setEntryStats(stats);
        } catch (error) {
            console.error('Error fetching entry stats:', error);
        }
    };

    const fetchCompetitions = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('competitions')
                .select('*')
                .order('date', { ascending: false });

            if (error) throw error;
            setCompetitions(data);
        } catch (error) {
            console.error('Error fetching competitions:', error);
            alert('Error loading competitions');
        } finally {
            setLoading(false);
        }
    };



    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Auto-generate slug from name if creating new and slug is empty
        if (name === 'name' && !currentComp && (!formData.slug || formData.slug === slugify(formData.name))) {
            setFormData(prev => ({ ...prev, slug: slugify(value) }));
        }
    };

    const slugify = (text) => {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w-]+/g, '')       // Remove all non-word chars
            .replace(/--+/g, '-')          // Replace multiple - with single -
            .replace(/^-+/, '')            // Trim - from start of text
            .replace(/-+$/, '');           // Trim - from end of text
    };

    const openModal = (comp = null) => {
        if (comp) {
            setCurrentComp(comp);
            setFormData({
                ...comp,
                judges_str: comp.judges ? comp.judges.join(', ') : '',
                eligible_classes_str: comp.eligible_classes ? comp.eligible_classes.join(', ') : '',
                eligible_distances_str: comp.eligible_distances ? comp.eligible_distances.join(', ') : '',
            });
        } else {
            setCurrentComp(null);
            setFormData(getInitialState());
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentComp(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Prepare data for submission (convert helper strings to arrays)
            const submissionData = {
                ...formData,
                judges: formData.judges_str.split(',').map(s => s.trim()).filter(Boolean),
                eligible_classes: formData.eligible_classes_str.split(',').map(s => s.trim()).filter(Boolean),
                eligible_distances: formData.eligible_distances_str.split(',').map(s => s.trim()).filter(Boolean),
            };

            // Remove helper fields
            delete submissionData.judges_str;
            delete submissionData.eligible_classes_str;
            delete submissionData.eligible_distances_str;

            if (currentComp) {
                // Update
                const { error } = await supabase
                    .from('competitions')
                    .update(submissionData)
                    .eq('id', currentComp.id);
                if (error) throw error;
            } else {
                // Insert
                const { error } = await supabase
                    .from('competitions')
                    .insert([submissionData]);
                if (error) throw error;
            }
            closeModal();
            fetchCompetitions();
        } catch (error) {
            console.error('Error saving competition:', error);
            alert('Error saving competition: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this competition?')) return;
        try {
            const { error } = await supabase
                .from('competitions')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchCompetitions();
        } catch (error) {
            console.error('Error deleting competition:', error);
            alert('Error deleting competition');
        }
    };

    const [viewingEntriesFor, setViewingEntriesFor] = useState(null);

    // ... existing functions ...

    return (
        <div className="min-h-screen py-10 bg-gray-50">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AdminBreadcrumbs />
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Competitions Manager</h1>
                    <button
                        onClick={() => openModal()}
                        className="bg-forest-600 text-white px-4 py-2 rounded-lg hover:bg-forest-700 transition-colors flex items-center gap-2 shadow-md"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Competition
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : (
                    <div className="bg-white shadow overflow-hidden rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entries</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {competitions.map((comp) => (
                                        <tr key={comp.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {format(new Date(comp.date), 'dd MMM yyyy')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {comp.name}
                                                <span className="block text-xs text-gray-500">{comp.slug}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${comp.is_open ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {comp.is_open ? 'Open' : 'Closed'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div>Max: {comp.max_entries || 'Unlimited'}</div>
                                                {entryStats[comp.id] && (
                                                    <div className="text-xs mt-1 space-y-0.5">
                                                        <div className="flex gap-2">
                                                            <span className="text-green-600 font-medium bg-green-50 px-1.5 rounded">{entryStats[comp.id].paid} Paid</span>
                                                            <span className="text-red-600 font-medium bg-red-50 px-1.5 rounded">{entryStats[comp.id].unpaid} Unpaid</span>
                                                        </div>
                                                        <div className="text-gray-400 font-medium pl-0.5">Total: {entryStats[comp.id].total}</div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => setViewingEntriesFor(comp)}
                                                    className="text-forest-600 hover:text-forest-900 mr-4"
                                                >
                                                    Entries
                                                </button>
                                                <button
                                                    onClick={() => openModal(comp)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(comp.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {competitions.length === 0 && (
                            <div className="text-center py-8 text-gray-500">No competitions found.</div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                // ... existing modal code ...
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeModal}></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full relative z-50">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[80vh] overflow-y-auto">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                        {currentComp ? 'Edit Competition' : 'New Competition'}
                                    </h3>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-forest-500 focus:border-forest-500 sm:text-sm"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Slug (URL friendly ID)</label>
                                            <input
                                                type="text"
                                                name="slug"
                                                required
                                                value={formData.slug}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-forest-500 focus:border-forest-500 sm:text-sm"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Date</label>
                                            <input
                                                type="date"
                                                name="date"
                                                required
                                                value={formData.date}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-forest-500 focus:border-forest-500 sm:text-sm"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Time</label>
                                            <input
                                                type="time"
                                                name="time"
                                                value={formData.time}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-forest-500 focus:border-forest-500 sm:text-sm"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Location</label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-forest-500 focus:border-forest-500 sm:text-sm"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Adult Fee (£)</label>
                                            <input
                                                type="number"
                                                name="entry_fee_adult"
                                                value={formData.entry_fee_adult}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-forest-500 focus:border-forest-500 sm:text-sm"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Junior Fee (£)</label>
                                            <input
                                                type="number"
                                                name="entry_fee_junior"
                                                value={formData.entry_fee_junior}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-forest-500 focus:border-forest-500 sm:text-sm"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Closing Date</label>
                                            <input
                                                type="date"
                                                name="closing_date"
                                                value={formData.closing_date}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-forest-500 focus:border-forest-500 sm:text-sm"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Max Entries</label>
                                            <input
                                                type="number"
                                                name="max_entries"
                                                value={formData.max_entries}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-forest-500 focus:border-forest-500 sm:text-sm"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Payment Details</label>
                                            <textarea
                                                name="payment_details"
                                                rows="3"
                                                value={formData.payment_details}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-forest-500 focus:border-forest-500 sm:text-sm"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Judges (comma separated)</label>
                                            <input
                                                type="text"
                                                name="judges_str"
                                                value={formData.judges_str}
                                                onChange={handleInputChange}
                                                placeholder="e.g. John Smith (AGB), Jane Doe (AGB)"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-forest-500 focus:border-forest-500 sm:text-sm"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Medals / Awards</label>
                                            <textarea
                                                name="medals"
                                                rows="2"
                                                value={formData.medals}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-forest-500 focus:border-forest-500 sm:text-sm"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Eligible Classes (comma separated)</label>
                                            <input
                                                type="text"
                                                name="eligible_classes_str"
                                                value={formData.eligible_classes_str}
                                                onChange={handleInputChange}
                                                placeholder="e.g. Recurve, Compound, Longbow"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-forest-500 focus:border-forest-500 sm:text-sm"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Eligible Distances (comma separated)</label>
                                            <input
                                                type="text"
                                                name="eligible_distances_str"
                                                value={formData.eligible_distances_str}
                                                onChange={handleInputChange}
                                                placeholder="e.g. 70m, 60m, 50m"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-forest-500 focus:border-forest-500 sm:text-sm"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Dress Code</label>
                                            <textarea
                                                name="dress_code"
                                                rows="2"
                                                value={formData.dress_code}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-forest-500 focus:border-forest-500 sm:text-sm"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Additional Information</label>
                                            <textarea
                                                name="additional_info"
                                                rows="3"
                                                value={formData.additional_info}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-forest-500 focus:border-forest-500 sm:text-sm"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    name="is_open"
                                                    checked={formData.is_open}
                                                    onChange={handleInputChange}
                                                    className="rounded border-gray-300 text-forest-600 focus:ring-forest-500"
                                                />
                                                <span className="text-sm font-medium text-gray-700">Accepting Entries</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-forest-600 text-base font-medium text-white hover:bg-forest-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        {currentComp ? 'Update' : 'Create'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Entries Viewer Modal */}
            {viewingEntriesFor && (
                <CompetitionEntriesViewer
                    competition={viewingEntriesFor}
                    onClose={() => setViewingEntriesFor(null)}
                />
            )}
        </div>
    );
};

export default CompetitionsManager;
