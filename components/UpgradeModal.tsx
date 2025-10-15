
import React from 'react';
import { XIcon, CheckCircleIcon, ZapIcon } from './Icons';

interface UpgradeModalProps {
  onClose: () => void;
  onUpgrade: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ onClose, onUpgrade }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-surface rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 relative transform transition-all" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors">
          <XIcon className="w-6 h-6" />
        </button>
        
        <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                <ZapIcon className="w-8 h-8 text-accent"/>
            </div>
            <h2 className="text-2xl font-bold text-text-primary">Upgrade to Klug AI Pro</h2>
            <p className="text-text-secondary mt-2">You've reached your daily limit. Unlock your full potential!</p>
        </div>

        <ul className="mt-6 space-y-3 text-left">
          <li className="flex items-center gap-3">
            <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0"/>
            <span className="text-text-primary">Unlimited questions</span>
          </li>
          <li className="flex items-center gap-3">
            <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0"/>
            <span className="text-text-primary">Priority access to new features</span>
          </li>
          <li className="flex items-center gap-3">
            <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0"/>
            <span className="text-text-primary">Faster response times</span>
          </li>
        </ul>

        <div className="mt-8">
            <button 
                onClick={onUpgrade}
                className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg"
            >
                Upgrade Now for $2/month
            </button>
            <p className="text-xs text-center text-text-secondary mt-3">
                Payment processed by Safepay. You can cancel anytime.
            </p>
            {/* 
              SECURITY NOTE: A real Safepay integration would happen on a server. 
              The frontend should not handle secret keys. This is a mock upgrade button.
            */}
        </div>
      </div>
    </div>
  );
};
