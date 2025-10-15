
import React from 'react';
import { SparklesIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-primary/50 backdrop-blur-sm border-b border-secondary p-4 flex justify-between items-center shadow-lg z-10 shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <SparklesIcon className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-text-primary tracking-wider">Klug AI</h1>
      </div>
    </header>
  );
};
