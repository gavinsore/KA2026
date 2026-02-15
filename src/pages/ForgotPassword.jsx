import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/admin/update-password`,
            });

            if (error) throw error;

            setMessage('Check your email for the password reset link');
        } catch (err) {
            setError(err.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-forest-50">
            <SEO title="Forgot Password | Kettering Archers" description="Reset your admin password." />

            <div className="w-full max-w-md glass-card p-8 border-forest-500/30 shadow-xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-forest-900 mb-2">Reset Password</h1>
                    <p className="text-charcoal-600 text-sm">Enter your email to receive a reset link</p>
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
                        <label className="block text-sm font-medium text-forest-900 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-charcoal-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-200 outline-none transition-all"
                            placeholder="admin@ketteringarchers.co.uk"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary justify-center"
                    >
                        {loading ? (
                            <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        ) : (
                            'Send Reset Link'
                        )}
                    </button>

                    <div className="text-center">
                        <Link to="/login" className="text-sm text-forest-600 hover:text-forest-800 transition-colors">
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
