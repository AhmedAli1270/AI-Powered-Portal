import React, { useEffect, useState } from 'react';
import { Loader2, Search, Database, FileText } from 'lucide-react';

const LoadingView: React.FC = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 3);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { icon: <Search className="w-6 h-6 text-pak-600" />, text: "Crawling National Sources..." },
    { icon: <Database className="w-6 h-6 text-pak-600" />, text: "Aggregating Government Data..." },
    { icon: <FileText className="w-6 h-6 text-pak-600" />, text: "Generating Intelligence Brief..." },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-100 border-t-pak-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-8 h-8 bg-pak-50 rounded-full flex items-center justify-center animate-pulse">
             {steps[step].icon}
           </div>
        </div>
      </div>
      <h3 className="mt-6 text-lg font-semibold text-slate-800">Processing Request</h3>
      <p className="text-slate-500 text-sm mt-2">{steps[step].text}</p>
      
      <div className="mt-8 flex space-x-2">
        {[0, 1, 2].map((i) => (
          <div 
            key={i} 
            className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-pak-500' : 'w-2 bg-slate-200'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingView;
