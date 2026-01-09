import React, { useState, useEffect } from 'react';
import { Home, MessageCircle, FileText, BrainCircuit, Moon, Sun } from 'lucide-react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check local storage, default to light mode if not set
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-300">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24 relative">
        <div className="max-w-md mx-auto min-h-full relative">
          {/* Dark Mode Toggle - Top Right */}
          <button 
            onClick={toggleTheme}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-sm active:scale-95 transition-all hover:bg-white dark:hover:bg-slate-800"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe z-50 shadow-lg transition-colors duration-300">
        <div className="max-w-md mx-auto flex justify-around items-center h-16 px-2">
          <NavButton 
            active={currentView === AppView.HOME} 
            onClick={() => onNavigate(AppView.HOME)} 
            icon={<Home size={24} />} 
            label="Home" 
          />
          <NavButton 
            active={currentView === AppView.INTERVIEW_PREP} 
            onClick={() => onNavigate(AppView.INTERVIEW_PREP)} 
            icon={<BrainCircuit size={24} />} 
            label="Tools" 
          />
           <NavButton 
            active={currentView === AppView.MENTOR_COMMUNITY} 
            onClick={() => onNavigate(AppView.MENTOR_COMMUNITY)} 
            icon={<MessageCircle size={24} />} 
            label="Mentor" 
          />
          <NavButton 
            active={currentView === AppView.RESUME_REVIEW} 
            onClick={() => onNavigate(AppView.RESUME_REVIEW)} 
            icon={<FileText size={24} />} 
            label="Debrief" 
          />
        </div>
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 ${active ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
  >
    <div className={`mb-1 transition-transform duration-200 ${active ? 'scale-110' : 'scale-100'}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-semibold tracking-wide ${active ? 'text-sky-700 dark:text-sky-300' : 'text-slate-500 dark:text-slate-600'}`}>{label}</span>
  </button>
);