import React from 'react';
import { Signup as SignupComponent, Logo } from '../components';
import { Link } from 'react-router-dom';

function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-indigo-50 p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-200 p-8 transition-transform hover:scale-[1.02]">
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-4">
          Join Vihaara
        </h1>

        {/* Updated subtext */}
        <p className="text-center text-gray-500 mb-6">
          Sign up to start your wellness journey, connect with mindfulness content, and track your personal growth.
        </p>

        {/* Signup form component */}
        <SignupComponent />

        {/* Already have account link */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
