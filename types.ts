
export interface ImageFile {
  base64: string;
  mimeType: string;
  name: string;
}

export interface AppState {
  prompt: string;
  imageFile: ImageFile | null;
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
}
