
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ThemeToggle from '../layout/ThemeToggle';
import MotivationalQuote from '../quotes/MotivationalQuote';

interface AuthPageProps {
  type: 'login' | 'signup';
}

const AuthPage: React.FC<AuthPageProps> = ({ type }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel for branding and info */}
      <div className="md:w-1/2 bg-primary/10 p-8 flex flex-col">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <h1 className="text-xl font-bold">Journalix</h1>
          </div>
          <ThemeToggle />
        </div>

        <div className="flex flex-col justify-center flex-1">
          <h2 className="text-3xl font-bold mb-4">
            {type === 'login' ? 'Welcome back!' : 'Join Journalix'}
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            {type === 'login'
              ? 'Sign in to continue your journey of self-improvement and habit tracking.'
              : 'Start building better habits, journal your thoughts, and track your progress.'}
          </p>

          <div className="mb-8">
            <MotivationalQuote />
          </div>

          <div className="space-y-4 mb-8">
            <div className="p-4 rounded-lg bg-background border border-border flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-accent flex-shrink-0 flex items-center justify-center text-accent-foreground">
                ✓
              </div>
              <div>
                <h3 className="font-medium mb-1">Track Daily Habits</h3>
                <p className="text-sm text-muted-foreground">
                  Build streaks and celebrate your consistency
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-background border border-border flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-accent flex-shrink-0 flex items-center justify-center text-accent-foreground">
                ✓
              </div>
              <div>
                <h3 className="font-medium mb-1">Journal Your Thoughts</h3>
                <p className="text-sm text-muted-foreground">
                  Capture your daily reflections and insights
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-background border border-border flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-accent flex-shrink-0 flex items-center justify-center text-accent-foreground">
                ✓
              </div>
              <div>
                <h3 className="font-medium mb-1">Visualize Progress</h3>
                <p className="text-sm text-muted-foreground">
                  See insights and track your improvement over time
                </p>
              </div>
            </div>
          </div>

          <div className="mt-auto rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80" 
              alt="Productivity" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>

      {/* Right panel for the form */}
      <div className="md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {type === 'login' ? <LoginForm /> : <SignupForm />}
          
          <div className="mt-8 text-center">
            {type === 'login' ? (
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/auth/signup" className="text-primary font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/auth/login" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
