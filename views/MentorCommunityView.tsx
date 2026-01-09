import React from 'react';
import { Send } from 'lucide-react';

export const MentorCommunityView: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 animate-fade-in bg-slate-50 dark:bg-slate-950 pb-20 transition-colors">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-full shadow-md mb-6 relative transition-colors">
        <div className="absolute inset-0 bg-sky-100 dark:bg-sky-900/50 rounded-full scale-125 opacity-50 animate-pulse"></div>
        <Send size={48} className="text-sky-500 dark:text-sky-400 relative z-10 -ml-1 mt-1 transform -rotate-12" />
      </div>

      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center mb-3">
        Pilot Community
      </h2>
      
      <p className="text-slate-500 dark:text-slate-400 text-center mb-10 max-w-[280px] leading-relaxed font-medium">
        Communicate and mentor on our community groupchat on Telegram.
      </p>

      <a 
        href="https://t.me/+qzRaI1K_-Sc1MDM1"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full max-w-xs bg-[#229ED9] hover:bg-[#1b8abf] text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-sky-100 dark:shadow-none transition-all active:scale-95 flex items-center justify-center gap-3 group"
      >
        <Send size={24} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
        <span>Open Telegram</span>
      </a>
      
      <p className="mt-8 text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-600 text-center px-4">
        Network • Share • Learn
      </p>
    </div>
  );
};