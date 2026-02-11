import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/admin';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { error } = await signIn({ email, password });
            if (error) throw error;
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-forest-50">
            <SEO title="Admin Login | Kettering Archers" description="Admin login for Kettering Archers website." />

            <div className="w-full max-w-md glass-card p-8 border-forest-500/30 shadow-xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-forest-900 mb-2">Admin Login</h1>
                    <p className="text-charcoal-600 text-sm">Sign in to manage the website</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 text-sm border border-red-200">
                        {error}
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

                    <div>
                        <label className="block text-sm font-medium text-forest-900 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-charcoal-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-200 outline-none transition-all"
                            placeholder="••••••••"
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
                            'Sign In'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
