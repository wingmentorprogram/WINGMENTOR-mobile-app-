import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

export const ExamTerminalView: React.FC = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="absolute inset-0 w-full h-full bg-white dark:bg-slate-900">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-950 z-20">
          <div className="flex flex-col items-center gap-3 animate-pulse">
             <img 
              src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR" 
              alt="Loading" 
              className="w-16 h-auto opacity-50 mb-2 dark:brightness-0 dark:invert" 
             />
            <Loader2 className="animate-spin text-sky-600 dark:text-sky-400" size={24} />
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Establishing Link...</p>
          </div>
        </div>
      )}
      <iframe 
        src="https://examinationterminal.vercel.app/"
        title="Exam Terminal"
        className="w-full h-full border-0 block"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        onLoad={() => setLoading(false)}
      />
    </div>
  );
};