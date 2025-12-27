import React from 'react';
import { ExternalLink, Globe } from 'lucide-react';
import { SourceItem } from '../types';

interface SourceCardProps {
  source: SourceItem;
}

const SourceCard: React.FC<SourceCardProps> = ({ source }) => {
  return (
    <a 
      href={source.uri} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block group bg-white border border-slate-200 rounded-lg p-3 hover:border-pak-500 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
          <Globe size={12} />
          <span className="uppercase tracking-wider font-semibold">{source.source || 'WEB'}</span>
        </div>
        <ExternalLink size={14} className="text-slate-400 group-hover:text-pak-600" />
      </div>
      <h3 className="text-sm font-medium text-slate-800 line-clamp-2 leading-snug group-hover:text-pak-700">
        {source.title}
      </h3>
    </a>
  );
};

export default SourceCard;
