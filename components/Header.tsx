
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
          Nano Banana Image Studio
        </h1>
        <p className="text-center text-gray-400 mt-1 text-sm sm:text-base">
          Generate & Edit Images with Gemini AI
        </p>
      </div>
    </header>
  );
};
