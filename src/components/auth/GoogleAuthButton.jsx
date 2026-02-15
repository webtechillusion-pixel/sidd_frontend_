import React from 'react';
import { FcGoogle } from 'react-icons/fc';

const GoogleAuthButton = ({ onSuccess, onError, loading, text = 'Continue with Google' }) => {
  const handleGoogleLogin = async () => {
    if (loading) return;
    
    try {
      // Load Google API
      if (!window.google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        
        script.onload = () => initializeGoogleAuth();
      } else {
        initializeGoogleAuth();
      }
    } catch (error) {
      onError?.(error);
    }
  };

  const initializeGoogleAuth = () => {
    try {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      
      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInButton'),
        {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: '100%',
        }
      );
    } catch (error) {
      onError?.(error);
    }
  };

  const handleCredentialResponse = (response) => {
    if (response.credential) {
      onSuccess?.(response.credential);
    } else {
      onError?.(new Error('Google authentication failed'));
    }
  };

  return (
    <div className="w-full">
      <div id="googleSignInButton" className="w-full"></div>
      
      {/* Fallback button if Google API fails */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="mt-2 w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <FcGoogle className="h-5 w-5" />
        <span className="text-sm font-medium text-gray-700">
          {loading ? 'Connecting...' : text}
        </span>
      </button>
    </div>
  );
};

export default GoogleAuthButton;