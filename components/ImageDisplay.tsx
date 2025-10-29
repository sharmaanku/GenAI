
import React from 'react';
import { ImageIcon } from './icons/ImageIcon';

interface ImageDisplayProps {
  imageSrc: string | null;
  isLoading: boolean;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageSrc, isLoading }) => {
  return (
    <div className="w-full max-w-2xl aspect-square bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-600 flex items-center justify-center p-4 relative overflow-hidden transition-all duration-300 mb-6">
      {isLoading && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
          <div className="w-16 h-16 border-4 border-t-purple-500 border-gray-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-semibold text-gray-200">Conjuring pixels...</p>
        </div>
      )}

      {imageSrc ? (
        <img src={imageSrc} alt="Generated or uploaded content" className="max-w-full max-h-full object-contain rounded-lg" />
      ) : (
        <div className="text-center text-gray-500">
          <ImageIcon className="w-20 h-20 mx-auto" />
          <h3 className="mt-4 text-xl font-semibold text-gray-400">Your visual canvas awaits</h3>
          <p className="mt-1">Generate an image from a prompt or upload your own to begin editing.</p>
        </div>
      )}
    </div>
  );
};
