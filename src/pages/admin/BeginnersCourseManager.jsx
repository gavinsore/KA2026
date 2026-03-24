import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import AdminBreadcrumbs from '../../components/admin/AdminBreadcrumbs';
import SEO from '../../components/SEO';

const BeginnersCourseManager = () => {
    const [adultPrice, setAdultPrice] = useState('');
    const [juniorPrice, setJuniorPrice] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPrices();
    }, []);

    const fetchPrices = async () => {
        setLoading(true);
        setError('');
        const { data, error: fetchError } = await supabase
            .from('site_settings')
            .select('key, value')
            .in('key', ['beginners_price_adult', 'beginners_price_junior']);

        if (fetchError) {
            setError('Failed to load settings: ' + fetchError.message);
        } else {
            const adult = data.find(r => r.key === 'beginners_price_adult');
            const junior = data.find(r => r.key === 'beginners_price_junior');
            setAdultPrice(adult?.value ?? '40');
            setJuniorPrice(junior?.value ?? '30');
        }
        setLoading(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccess(false);
        setError('');

        const adultVal = parseFloat(adultPrice);
        const juniorVal = parseFloat(juniorPrice);

        if (isNaN(adultVal) || adultVal < 0) {
            setError('Adult price must be a valid positive number.');
            setSaving(false);
            return;
        }
        if (isNaN(juniorVal) || juniorVal < 0) {
            setError('Junior price must be a valid positive number.');
            setSaving(false);
            return;
        }

        const updates = [
            supabase.from('site_settings').update({ value: String(adultVal), updated_at: new Date().toISOString() }).eq('key', 'beginners_price_adult'),
            supabase.from('site_settings').update({ value: String(juniorVal), updated_at: new Date().toISOString() }).eq('key', 'beginners_price_junior'),
        ];

        const results = await Promise.all(updates);
        const failed = results.find(r => r.error);

        if (failed) {
            setError('Failed to save: ' + failed.error.message);
        } else {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 4000);
        }
        setSaving(false);
    };

    return (
        <div className="min-h-screen py-10 md:py-16">
            <SEO title="Beginners Course Settings | Admin" description="Manage beginners course pricing." />
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <AdminBreadcrumbs />

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-forest-900">Beginners Course</h1>
                        <p className="text-charcoal-600 mt-1">Update the fees displayed on the public enrollment page.</p>
                    </div>
                    <Link to="/admin" className="btn-secondary text-sm px-4 py-2">
                        ← Back
                    </Link>
                </div>

                {loading ? (
                    <div className="glass-card p-8 text-center text-charcoal-500">Loading settings…</div>
                ) : (
                    <form onSubmit={handleSave} className="glass-card p-6 md:p-8">
                        <h2 className="text-xl font-semibold text-forest-900 mb-6">Course Fees</h2>

                        <div className="grid sm:grid-cols-2 gap-6 mb-8">
                            {/* Adult Price */}
                            <div>
                                <label className="block text-sm font-medium text-charcoal-600 mb-2">
                                    Adult Fee (£)
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-charcoal-400 font-semibold">£</span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={adultPrice}
                                        onChange={e => setAdultPrice(e.target.value)}
                                        className="input-field pl-7"
                                        placeholder="40"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-charcoal-400 mt-1">Shown to all non-junior applicants</p>
                            </div>

                            {/* Junior Price */}
                            <div>
                                <label className="block text-sm font-medium text-charcoal-600 mb-2">
                                    Junior Fee (£)
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-charcoal-400 font-semibold">£</span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={juniorPrice}
                                        onChange={e => setJuniorPrice(e.target.value)}
                                        className="input-field pl-7"
                                        placeholder="30"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-charcoal-400 mt-1">Shown for under‑18 applicants</p>
                            </div>
                        </div>

                        {/* Feedback */}
                        {error && (
                            <div className="mb-4 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-4 p-4 rounded-lg bg-forest-500/20 border border-forest-500/50 text-forest-700 text-sm font-medium">
                                ✓ Prices updated successfully! The public enrollment page will now show the new fees.
                            </div>
                        )}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={saving}
                            >
                                {saving ? 'Saving…' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default BeginnersCourseManager;
