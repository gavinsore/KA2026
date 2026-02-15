import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import SEO from '../../components/SEO';

const UpdatePassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            setMessage('Password updated successfully');
            setTimeout(() => {
                navigate('/admin/dashboard');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-forest-50">
            <SEO title="Update Password | Kettering Archers" description="Update your admin password." />

            <div className="w-full max-w-md glass-card p-8 border-forest-500/30 shadow-xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-forest-900 mb-2">Update Password</h1>
                    <p className="text-charcoal-600 text-sm">Enter your new password below</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 text-sm border border-red-200">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="mb-6 p-4 rounded-lg bg-green-50 text-green-600 text-sm border border-green-200">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-forest-900 mb-1">New Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-charcoal-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-200 outline-none transition-all"
                            placeholder="To update password, enter a new one"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-forest-900 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-charcoal-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-200 outline-none transition-all"
                            placeholder="Confirm new password"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/dashboard')}
                            className="w-1/2 px-4 py-2 rounded-lg border border-charcoal-300 text-charcoal-700 hover:bg-charcoal-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-1/2 btn-primary justify-center"
                        >
                            {loading ? (
                                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            ) : (
                                'Update'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdatePassword;
