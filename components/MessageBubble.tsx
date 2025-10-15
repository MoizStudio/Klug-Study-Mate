
import React from 'react';
import { Message, Sender } from '../types';
import { UserIcon, AiIcon } from './Icons';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === Sender.USER;

  const bubbleClasses = isUser
    ? 'bg-accent self-end'
    : 'bg-primary self-start';
  
  const textClasses = isUser ? 'text-white' : 'text-text-primary';

  return (
    <div className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
          <AiIcon className="w-5 h-5 text-text-primary" />
        </div>
      )}
      <div className={`flex flex-col max-w-lg md:max-w-2xl ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 rounded-2xl ${bubbleClasses} ${isUser ? 'rounded-br-none' : 'rounded-bl-none'} shadow-md transition-all duration-300`}
        >
          {message.imageUrl && (
            <img 
              src={message.imageUrl} 
              alt="User upload" 
              className="rounded-lg mb-2 max-h-64"
            />
          )}
          <p className={`text-base leading-relaxed ${textClasses}`}>{message.text}</p>
        </div>
        <span className="text-xs text-text-secondary mt-1 px-1">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
          <UserIcon className="w-5 h-5 text-text-primary" />
        </div>
      )}
    </div>
  );
};
