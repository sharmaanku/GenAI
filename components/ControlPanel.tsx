
import React, { useRef } from 'react';
import { GenerateIcon } from './icons/GenerateIcon';
import { UploadIcon } from './icons/UploadIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { EditIcon } from './icons/EditIcon';
import { ClearIcon } from './icons/ClearIcon';
import type { ImageFile } from '../types';

interface ControlPanelProps {
  prompt: string;
  onPromptChange: (newPrompt: string) => void;
  onImageUpload: (file: File) => void;
  onGenerate: () => void;
  onEdit: () => void;
  onClear: () => void;
  onDownload: () => void;
  isLoading: boolean;
  imageFile: ImageFile | null;
  generatedImage: string | null;
}

const ActionButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  className: string;
  title: string;
}> = ({ onClick, disabled, children, className, title }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

export const ControlPanel: React.FC<ControlPanelProps> = ({
  prompt,
  onPromptChange,
  onImageUpload,
  onGenerate,
  onEdit,
  onClear,
  onDownload,
  isLoading,
  imageFile,
  generatedImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasImage = !!imageFile || !!generatedImage;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-gray-900/70 backdrop-blur-lg border-t border-gray-700/50 w-full p-4 z-20">
      <div className="container mx-auto flex flex-col sm:flex-row gap-4 items-center">
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder={imageFile ? "Describe how you want to edit the image..." : "Describe the image you want to generate..."}
          className="w-full flex-grow bg-gray-800 border-2 border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 resize-none"
          rows={2}
          disabled={isLoading}
        />
        <div className="flex flex-wrap sm:flex-nowrap gap-2 justify-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
            disabled={isLoading}
          />
          <ActionButton
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500"
            title="Upload Image"
          >
            <UploadIcon className="w-5 h-5" /> <span className="hidden sm:inline">Upload</span>
          </ActionButton>
          
          <ActionButton
            onClick={onGenerate}
            disabled={!prompt || isLoading}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white focus:ring-indigo-500"
            title="Generate New Image"
          >
            <GenerateIcon className="w-5 h-5" /> <span className="hidden sm:inline">Generate</span>
          </ActionButton>

          <ActionButton
            onClick={onEdit}
            disabled={!prompt || !imageFile || isLoading}
            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white focus:ring-cyan-400"
            title="Edit Uploaded Image"
          >
            <EditIcon className="w-5 h-5" /> <span className="hidden sm:inline">Edit</span>
          </ActionButton>

           <ActionButton
            onClick={onDownload}
            disabled={!hasImage || isLoading}
            className="bg-green-600 hover:bg-green-700 text-white focus:ring-green-500"
            title="Download Image"
          >
            <DownloadIcon className="w-5 h-5" /> <span className="hidden sm:inline">Download</span>
          </ActionButton>

           <ActionButton
            onClick={onClear}
            disabled={isLoading}
            className="bg-red-700 hover:bg-red-800 text-white focus:ring-red-600"
            title="Start Over"
          >
            <ClearIcon className="w-5 h-5" />
          </ActionButton>
        </div>
      </div>
    </div>
  );
};
