import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminBreadcrumbs from '../../components/admin/AdminBreadcrumbs';

const RoundsManager = () => {
    const [rounds, setRounds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRound, setCurrentRound] = useState(null);
    const [formData, setFormData] = useState(getInitialState());
    const [filter, setFilter] = useState('all');

    const categories = [
        { id: 'indoor', label: 'Indoor' },
        { id: 'outdoor', label: 'Outdoor' },
        { id: 'clout', label: 'Clout' },
        { id: 'field', label: 'Field' },
        { id: 'fun', label: 'Fun / Novelty' }
    ];

    function getInitialState() {
        return {
            name: '',
            category: 'indoor',
            measurement: 'metric',
            is_official: true,
            description: '',
            max_score: '',
            distance_breakdown: [{ distance: '', arrows: '' }]
        };
    }

    useEffect(() => {
        fetchRounds();
    }, []);

    const fetchRounds = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('archery_rounds')
                .select('*')
                .order('category', { ascending: true })
                .order('name', { ascending: true });

            if (error) throw error;
            setRounds(data);
        } catch (error) {
            console.error('Error fetching rounds:', error);
            alert('Error loading rounds');
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
    };

    // Handle dynamic distance breakdown inputs
    const handleBreakdownChange = (index, field, value) => {
        const newBreakdown = [...formData.distance_breakdown];
        newBreakdown[index][field] = value;
        setFormData(prev => ({ ...prev, distance_breakdown: newBreakdown }));
    };

    const addBreakdownRow = () => {
        setFormData(prev => ({
            ...prev,
            distance_breakdown: [...prev.distance_breakdown, { distance: '', arrows: '' }]
        }));
    };

    const removeBreakdownRow = (index) => {
        const newBreakdown = formData.distance_breakdown.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, distance_breakdown: newBreakdown }));
    };

    const openModal = (round = null) => {
        if (round) {
            setCurrentRound(round);
            // Ensure distance_breakdown is an array and has at least one item
            let breakdown = round.distance_breakdown;
            if (!breakdown || !Array.isArray(breakdown) || breakdown.length === 0) {
                breakdown = [{ distance: '', arrows: '' }];
            }

            setFormData({
                ...round,
                distance_breakdown: breakdown
            });
        } else {
            setCurrentRound(null);
            setFormData(getInitialState());
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentRound(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Clean up breakdown data: ensure arrows is a number if possible, filter empty rows
            const cleanBreakdown = formData.distance_breakdown
                .filter(row => row.distance.trim() !== '')
                .map(row => ({
                    distance: row.distance,
                    arrows: parseInt(row.arrows) || 0
                }));

            const submissionData = {
                ...formData,
                distance_breakdown: cleanBreakdown
            };

            if (currentRound) {
                // Update
                const { error } = await supabase
                    .from('archery_rounds')
                    .update(submissionData)
                    .eq('id', currentRound.id);
                if (error) throw error;
            } else {
                // Insert
                const { error } = await supabase
                    .from('archery_rounds')
                    .insert([submissionData]);
                if (error) throw error;
            }
            closeModal();
            fetchRounds();
        } catch (error) {
            console.error('Error saving round:', error);
            alert('Error saving round: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this round?')) return;
        try {
            const { error } = await supabase
                .from('archery_rounds')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchRounds();
        } catch (error) {
            console.error('Error deleting round:', error);
            alert('Error deleting round');
        }
    };

    const filteredRounds = filter === 'all'
        ? rounds
        : rounds.filter(r => r.category === filter);

    return (
        <div className="min-h-screen py-10 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AdminBreadcrumbs />
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">Rounds Manager</h1>

                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${filter === 'all' ? 'bg-forest-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                        >
                            All
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setFilter(cat.id)}
                                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${filter === cat.id ? 'bg-forest-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => openModal()}
                        className="bg-forest-600 text-white px-4 py-2 rounded-lg hover:bg-forest-700 transition-colors flex items-center gap-2 shadow-md shrink-0"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Round
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Score</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Official</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredRounds.map((round) => (
                                        <tr key={round.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {round.name}
                                                <div className="text-xs text-gray-500 truncate max-w-xs">{round.description}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                                {round.category} <span className="text-xs text-gray-400">({round.measurement})</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {round.max_score}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${round.is_official ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {round.is_official ? 'Yes' : 'No'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => openModal(round)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(round.id)}
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
                        {filteredRounds.length === 0 && (
                            <div className="text-center py-8 text-gray-500">No rounds found.</div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeModal}></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full relative z-50">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[85vh] overflow-y-auto">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                        {currentRound ? 'Edit Round' : 'New Round'}
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Round Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-forest-500 focus:border-forest-500 sm:text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Category</label>
                                            <select
                                                name="category"
                                                required
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-forest-500 focus:border-forest-500 sm:text-sm"
                                            >
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Measurement</label>
                                            <select
                                                name="measurement"
                                                value={formData.measurement}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-forest-500 focus:border-forest-500 sm:text-sm"
                                            >
                                                <option value="metric">Metric</option>
                                                <option value="imperial">Imperial</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Max Score</label>
                                            <input
                                                type="text"
                                                name="max_score"
                                                value={formData.max_score}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-forest-500 focus:border-forest-500 sm:text-sm"
                                            />
                                        </div>

                                        <div className="flex items-end pb-3">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    name="is_official"
                                                    checked={formData.is_official}
                                                    onChange={handleInputChange}
                                                    className="rounded border-gray-300 text-forest-600 focus:ring-forest-500"
                                                />
                                                <span className="text-sm font-medium text-gray-700">Official Round</span>
                                            </label>
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Description</label>
                                            <textarea
                                                name="description"
                                                rows="2"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-forest-500 focus:border-forest-500 sm:text-sm"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Distance Breakdown</label>
                                            {formData.distance_breakdown.map((row, index) => (
                                                <div key={index} className="flex gap-2 mb-2">
                                                    <div className="flex-1">
                                                        <input
                                                            type="text"
                                                            placeholder="Distance (e.g. 60 yards)"
                                                            value={row.distance}
                                                            onChange={(e) => handleBreakdownChange(index, 'distance', e.target.value)}
                                                            className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:ring-forest-500 focus:border-forest-500 sm:text-sm"
                                                        />
                                                    </div>
                                                    <div className="w-24">
                                                        <input
                                                            type="number"
                                                            placeholder="Arrows"
                                                            value={row.arrows}
                                                            onChange={(e) => handleBreakdownChange(index, 'arrows', e.target.value)}
                                                            className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:ring-forest-500 focus:border-forest-500 sm:text-sm"
                                                        />
                                                    </div>
                                                    <div className="w-8 flex items-center justify-center">
                                                        {index > 0 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeBreakdownRow(index)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={addBreakdownRow}
                                                className="mt-1 text-sm text-forest-600 hover:text-forest-800 flex items-center gap-1"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Add Distance
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-forest-600 text-base font-medium text-white hover:bg-forest-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        {currentRound ? 'Update' : 'Create'}
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
        </div>
    );
};

export default RoundsManager;
