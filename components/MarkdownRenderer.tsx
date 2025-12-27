import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const renderedContent: React.ReactNode[] = [];
  
  let currentList: React.ReactNode[] = [];
  let listKey = 0;

  lines.forEach((line, index) => {
    const key = `line-${index}`;
    const trimmed = line.trim();

    // Headers
    if (trimmed.startsWith('# ')) {
      if (currentList.length > 0) {
         renderedContent.push(<ul key={`list-${listKey++}`} className="list-disc pl-5 mb-4 space-y-2 text-slate-700">{currentList}</ul>);
         currentList = [];
      }
      renderedContent.push(
        <h1 key={key} className="text-2xl font-bold text-pak-900 mt-6 mb-3 border-b border-pak-100 pb-2">
          {trimmed.replace('# ', '')}
        </h1>
      );
    } else if (trimmed.startsWith('## ')) {
      if (currentList.length > 0) {
         renderedContent.push(<ul key={`list-${listKey++}`} className="list-disc pl-5 mb-4 space-y-2 text-slate-700">{currentList}</ul>);
         currentList = [];
      }
      renderedContent.push(
        <h2 key={key} className="text-xl font-semibold text-pak-800 mt-5 mb-2 flex items-center">
          {trimmed.replace('## ', '')}
        </h2>
      );
    } 
    // List Items
    else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      const text = trimmed.replace(/^(\*|-)\s+/, '');
      // Bold parsing within list item
      const parts = text.split(/(\*\*.*?\*\*)/g);
      const listContent = parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-pak-900 font-semibold">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      currentList.push(<li key={key} className="leading-relaxed">{listContent}</li>);
    }
    // Normal Paragraphs
    else if (trimmed.length > 0) {
      if (currentList.length > 0) {
         renderedContent.push(<ul key={`list-${listKey++}`} className="list-disc pl-5 mb-4 space-y-2 text-slate-700">{currentList}</ul>);
         currentList = [];
      }
       // Bold parsing within paragraph
       const parts = trimmed.split(/(\*\*.*?\*\*)/g);
       const paraContent = parts.map((part, i) => {
         if (part.startsWith('**') && part.endsWith('**')) {
           return <strong key={i} className="text-pak-900 font-semibold">{part.slice(2, -2)}</strong>;
         }
         return part;
       });
      renderedContent.push(<p key={key} className="mb-3 text-slate-700 leading-relaxed">{paraContent}</p>);
    }
  });

  // Flush remaining list
  if (currentList.length > 0) {
      renderedContent.push(<ul key={`list-${listKey++}`} className="list-disc pl-5 mb-4 space-y-2 text-slate-700">{currentList}</ul>);
  }

  return <div className="markdown-body font-sans text-sm md:text-base">{renderedContent}</div>;
};

export default MarkdownRenderer;
