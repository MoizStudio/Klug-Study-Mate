import React, { useState, useRef } from 'react';
import { SendIcon, CameraIcon, PaperclipIcon, MicIcon, StopCircleIcon, XCircleIcon } from './Icons';

interface InputAreaProps {
  onSendMessage: (text: string) => void;
  onCameraClick: () => void;
  onFileUpload: (file: File) => void;
  onVoiceClick: () => void;
  isListening: boolean;
  disabled: boolean;
  pendingImage: string | null;
  onClearPendingImage: () => void;
}

export const InputArea: React.FC<InputAreaProps> = ({ 
  onSendMessage, 
  onCameraClick, 
  onFileUpload, 
  onVoiceClick, 
  isListening, 
  disabled,
  pendingImage,
  onClearPendingImage
}) => {
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (text.trim() || pendingImage) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
    e.target.value = ''; // Reset file input
  };

  return (
    <footer className="bg-primary/50 backdrop-blur-sm border-t border-secondary p-4 shrink-0">
      <div className="max-w-4xl mx-auto">
        {pendingImage && (
            <div className="p-2 pt-0">
                <div className="relative inline-block bg-secondary p-1 rounded-lg">
                <img src={pendingImage} alt="Attachment preview" className="h-20 w-auto max-w-xs object-contain rounded" />
                <button
                    onClick={onClearPendingImage}
                    className="absolute -top-2 -right-2 p-0.5 bg-primary hover:bg-secondary rounded-full text-text-secondary hover:text-white transition-colors"
                    aria-label="Remove image"
                    disabled={disabled}
                >
                    <XCircleIcon className="w-6 h-6" />
                </button>
                </div>
            </div>
        )}
        <div className="flex items-center gap-2 md:gap-4">
            <button 
            onClick={onCameraClick}
            disabled={disabled}
            className="p-2 rounded-full hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Use camera"
            >
            <CameraIcon className="w-6 h-6 text-text-secondary" />
            </button>
            <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            className="hidden" 
            accept="image/*"
            />
            <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="p-2 rounded-full hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Attach file"
            >
            <PaperclipIcon className="w-6 h-6 text-text-secondary" />
            </button>
            <button 
            onClick={onVoiceClick}
            disabled={disabled && !isListening}
            className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500/50' : 'hover:bg-secondary'} disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
            >
                {isListening ? 
                    <StopCircleIcon className="w-6 h-6 text-red-300 animate-pulse" /> : 
                    <MicIcon className="w-6 h-6 text-text-secondary" />}
            </button>

            <div className="relative flex-1">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                disabled={disabled}
                className="w-full bg-secondary border border-transparent rounded-2xl text-text-primary px-4 py-3 pr-12 resize-none focus:ring-2 focus:ring-accent focus:outline-none transition-shadow disabled:opacity-50"
                rows={1}
                style={{ maxHeight: '120px' }}
            />
            <button 
                onClick={handleSend}
                disabled={(!text.trim() && !pendingImage) || disabled}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent rounded-full hover:bg-accent-hover disabled:bg-secondary disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
            >
                <SendIcon className="w-5 h-5 text-white" />
            </button>
            </div>
        </div>
      </div>
    </footer>
  );
};