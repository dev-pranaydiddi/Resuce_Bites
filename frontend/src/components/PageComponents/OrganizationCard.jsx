import React from 'react';
import { UserPlus, Handshake, Home, Utensils } from 'lucide-react';

const OrganizationCard = ({ organization, iconType = 'heart' }) => {
  const getIcon = () => {
    switch (iconType) {
      case 'heart':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        );
      case 'hands':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 11v2a6 6 0 0 0 6 6v-1a5 5 0 0 1-5-5v-2a5 5 0 0 1 5-5V5a6 6 0 0 0-6 6Z" />
            <path d="M17 11v2a6 6 0 0 1-6 6v-1a5 5 0 0 0 5-5v-2a5 5 0 0 0-5-5V5a6 6 0 0 1 6 6Z" />
          </svg>
        );
      case 'home':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        );
      case 'utensils':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
            <path d="M7 2v20" />
            <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3" />
            <path d="M21 22v-7" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getColorClass = () => {
    switch (iconType) {
      case 'heart':
        return { bg: 'bg-[hsl(var(--primary-light))]', text: 'text-[hsl(var(--primary-dark))]' };
      case 'hands':
        return { bg: 'bg-[hsl(var(--secondary-light))]', text: 'text-[hsl(var(--secondary-dark))]' };
      case 'home':
        return { bg: 'bg-[hsl(var(--accent-light))]', text: 'text-[hsl(var(--accent-dark))]' };
      case 'utensils':
        return { bg: 'bg-[hsl(var(--primary-light))]', text: 'text-[hsl(var(--primary-dark))]' };
      default:
        return { bg: 'bg-gray-200', text: 'text-gray-800' };
    }
  };

  const { bg, text } = getColorClass();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center">
      <div className={`w-16 h-16 ${bg} rounded-full flex items-center justify-center mb-3 ${text}`}>
        {getIcon()}
      </div>
      <h3 className="font-heading font-semibold text-center">
        {organization.orgName}
      </h3>
    </div>
  );
};

export default OrganizationCard;
