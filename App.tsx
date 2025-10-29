
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageDisplay } from './components/ImageDisplay';
import { ControlPanel } from './components/ControlPanel';
import { generateImage, editImage } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import type { AppState, ImageFile } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    prompt: '',
    imageFile: null,
    generatedImage: null,
    isLoading: false,
    error: null,
  });

  const handlePromptChange = (newPrompt: string) => {
    setAppState(prev => ({ ...prev, prompt: newPrompt }));
  };
  
  const handleImageUpload = async (file: File) => {
    setAppState(prev => ({ ...prev, isLoading: true, error: null, generatedImage: null }));
    try {
      const { base64, mimeType } = await fileToBase64(file);
      setAppState(prev => ({ ...prev, imageFile: { base64, mimeType, name: file.name }, isLoading: false }));
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to read image file.';
      setAppState(prev => ({ ...prev, error, isLoading: false }));
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!appState.prompt || appState.isLoading) return;
    setAppState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const newImageBase64 = await generateImage(appState.prompt);
      setAppState(prev => ({
        ...prev,
        generatedImage: `data:image/png;base64,${newImageBase64}`,
        imageFile: null, // Clear uploaded image after generating a new one
        isLoading: false
      }));
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An unknown error occurred during image generation.';
      setAppState(prev => ({ ...prev, error, isLoading: false }));
    }
  }, [appState.prompt, appState.isLoading]);

  const handleEdit = useCallback(async () => {
    if (!appState.prompt || !appState.imageFile || appState.isLoading) return;
    setAppState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const { base64, mimeType } = appState.imageFile;
      const newImageBase64 = await editImage(appState.prompt, base64, mimeType);
      setAppState(prev => ({
        ...prev,
        generatedImage: `data:image/png;base64,${newImageBase64}`,
        imageFile: null,
        isLoading: false
      }));
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An unknown error occurred during image editing.';
      setAppState(prev => ({ ...prev, error, isLoading: false }));
    }
  }, [appState.prompt, appState.imageFile, appState.isLoading]);

  const handleClear = () => {
    setAppState({
      prompt: '',
      imageFile: null,
      generatedImage: null,
      isLoading: false,
      error: null,
    });
  };

  const handleDownload = () => {
    const imageToDownload = appState.generatedImage || appState.imageFile?.base64;
    if (!imageToDownload) return;

    const link = document.createElement('a');
    link.href = imageToDownload;
    link.download = 'nano-banana-creation.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const currentImage = appState.generatedImage || appState.imageFile?.base64 || null;

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center w-full">
        {appState.error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative w-full max-w-2xl mb-4" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{appState.error}</span>
            </div>
        )}
        <ImageDisplay
          imageSrc={currentImage}
          isLoading={appState.isLoading}
        />
      </main>
      <ControlPanel
        prompt={appState.prompt}
        onPromptChange={handlePromptChange}
        onImageUpload={handleImageUpload}
        onGenerate={handleGenerate}
        onEdit={handleEdit}
        onClear={handleClear}
        onDownload={handleDownload}
        isLoading={appState.isLoading}
        imageFile={appState.imageFile}
        generatedImage={appState.generatedImage}
      />
    </div>
  );
};

export default App;
