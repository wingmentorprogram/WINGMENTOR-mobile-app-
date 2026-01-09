import React from 'react';
import { Home, MessageCircle, FileText, BrainCircuit } from 'lucide-react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24 relative">
        <div className="max-w-md mx-auto min-h-full">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 pb-safe z-50 shadow-lg">
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
            label="Review" 
          />
        </div>
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 ${active ? 'text-sky-600' : 'text-slate-400 hover:text-slate-600'}`}
  >
    <div className={`mb-1 transition-transform duration-200 ${active ? 'scale-110' : 'scale-100'}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-semibold tracking-wide ${active ? 'text-sky-700' : 'text-slate-500'}`}>{label}</span>
  </button>
);