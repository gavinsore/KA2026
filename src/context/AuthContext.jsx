import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            checkAdminRole(session?.user?.id);
            setLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            // Check for recovery or invite flow
            if (event === 'PASSWORD_RECOVERY') {
                navigate('/admin/update-password');
            } else if (event === 'SIGNED_IN') {
                // Check if this was from an invite or recovery link by inspecting hash
                // Note: supabase client strips the hash sometimes, so this is a fallback or primary check
                const hash = window.location.hash;
                if (hash && (hash.includes('type=invite') || hash.includes('type=recovery'))) {
                    navigate('/admin/update-password');
                }
            }

            setUser(session?.user ?? null);
            checkAdminRole(session?.user?.id);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    const checkAdminRole = async (userId) => {
        if (!userId) {
            setIsAdmin(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();

            if (data && data.role === 'admin') {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        } catch (error) {
            console.error('Error checking admin role:', error);
            setIsAdmin(false);
        }
    };

    const value = {
        signUp: (data) => supabase.auth.signUp(data),
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signOut: () => supabase.auth.signOut(),
        user,
        isAdmin,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
