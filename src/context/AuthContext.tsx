import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const isAuthenticated = !!user;

  useEffect(() => {
    // Check if Supabase is configured before attempting to use it
    if (!isSupabaseConfigured()) {
      console.error('Supabase is not properly configured. Check your environment variables.');
      toast({
        title: "Configuration Error",
        description: "The app requires Supabase configuration. Please set the environment variables.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Check active session and set user when the component mounts
    const checkSession = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking auth session:', error);
        } else if (data.session) {
          const { data: userData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();
          
          if (userData) {
            setUser({
              id: data.session.user.id,
              name: userData.full_name || data.session.user.email?.split('@')[0] || 'User',
              email: data.session.user.email || '',
              avatar: userData.avatar_url || '/placeholder.svg',
            });
          } else {
            // If profile doesn't exist yet, create with basic info
            const { data: newUserData } = await supabase.from('profiles').insert({
              id: data.session.user.id,
              full_name: data.session.user.email?.split('@')[0] || 'User',
              email: data.session.user.email,
              avatar_url: '/placeholder.svg'
            }).select('*').single();
            
            if (newUserData) {
              setUser({
                id: newUserData.full_name,
                name: newUserData.full_name,
                email: newUserData.email || '',
                avatar: newUserData.avatar_url || '/placeholder.svg',
              });
            }
          }
        }
      } catch (err) {
        console.error('Error in auth check:', err);
      } finally {
        setLoading(false);
      }
    };

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          try {
            const { data: userData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (userData) {
              setUser({
                id: session.user.id,
                name: userData.full_name || session.user.email?.split('@')[0] || 'User',
                email: session.user.email || '',
                avatar: userData.avatar_url || '/placeholder.svg',
              });
            }
          } catch (err) {
            console.error('Error handling auth state change:', err);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    checkSession();
    
    return () => {
      // Clean up subscription on component unmount
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [toast]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Google login failed",
        description: error.message || "An error occurred during Google login",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });
      
      if (error) throw error;
      
      // Create a profile record for the new user
      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: name,
          email: email,
          avatar_url: '/placeholder.svg'
        });
        
        if (profileError) throw profileError;
        
        toast({
          title: "Success",
          description: "Please check your email to confirm your account",
        });
      }
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // User state will be cleared by the auth state change listener
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred during logout",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        loginWithGoogle,
        signup,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
