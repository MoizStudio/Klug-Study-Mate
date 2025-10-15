
import React from 'react';
import { AiIcon } from './Icons';

export const Loader: React.FC = () => {
  return (
    <div className="flex items-start gap-3 my-4 justify-start">
      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
        <AiIcon className="w-5 h-5 text-text-primary" />
      </div>
      <div className="flex items-center space-x-1 bg-primary px-4 py-3 rounded-2xl rounded-bl-none shadow-md">
        <div className="w-2 h-2 bg-text-secondary rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-text-secondary rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-text-secondary rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};
