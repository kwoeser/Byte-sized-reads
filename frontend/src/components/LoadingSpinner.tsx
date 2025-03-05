import React from 'react';

const LoadingSpinner = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        {/* Spinner animation */}
        <div className="w-16 h-16 border-4 border-neutral-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <div className="text-lg font-medium text-neutral-700">Loading...</div>
        
        {/* Add the keyframes animation */}
        <style jsx>{`
          @keyframes loading {
            0% { width: 0%; }
            50% { width: 100%; }
            100% { width: 0%; }
          }
        `}</style>
      </div>
    );
  };

export default LoadingSpinner