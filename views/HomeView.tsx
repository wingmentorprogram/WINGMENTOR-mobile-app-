import React from 'react';
import { AppView } from '../types';
import { ChevronDown, Calculator, CloudSun, Scale } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: AppView) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  return (
    <div className="p-6 flex flex-col min-h-full animate-fade-in pb-8">
      {/* Header */}
      <div className="mt-0 flex flex-col items-center justify-center mb-2">
        <img 
          src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR" 
          alt="WingMentor Logo" 
          className="h-10 w-auto object-contain drop-shadow-sm dark:brightness-0 dark:invert"
        />
        <p className="text-slate-400 dark:text-slate-500 font-semibold text-[10px] mt-1 tracking-[0.2em] uppercase">Earn Your Career</p>
      </div>

      {/* App Grid */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 px-1 mb-2 leading-tight">
          Pilot Apps
          <span className="block text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 uppercase tracking-wide">Made for Pilots by Pilots</span>
        </h2>
        <div className="grid grid-cols-3 gap-3">
          
          <AppCard 
            image="https://lh3.googleusercontent.com/d/11j7ZHv874EBZZ6O36etvuHC6rRWWm8kF"
            title="Exam Terminal"
            onClick={() => onNavigate(AppView.EXAM_TERMINAL)}
          />

          <AppCard 
            image="https://lh3.googleusercontent.com/d/1yLM_bGVPN8Sa__fqR95C0EeA1CUsTAA7"
            title="Black Box DB"
            onClick={() => onNavigate(AppView.BLACK_BOX)}
          />

          <AppCard 
            image="https://lh3.googleusercontent.com/d/1sUUBI2blGY9oNoutvN9fH1cJ8j6RVOiX"
            title="Passport & Progress"
            onClick={() => onNavigate(AppView.INTERVIEW_PREP)}
            imgClassName="scale-[2.3] translate-x-6"
          />

           <AppCard 
            image="https://lh3.googleusercontent.com/d/1GbUopHNGyXMhzi5sW1Ybo5gZMh2_YSKN"
            title="Program Handbook"
            href="https://programhandbook.vercel.app"
          />

           <AppCard 
            image="https://lh3.googleusercontent.com/d/1HpzTC2mR312qpDeG6i1Cy4FU0JeRrfuE"
            title="Simulator Room"
            onClick={() => onNavigate(AppView.INTERVIEW_PREP)}
            imgClassName="scale-150"
          />

           <AppCard 
            image="https://lh3.googleusercontent.com/d/1InHXB-jhAZ3UNDXcvHbENwbB5ApY8eOp"
            title="Pilot Gap Forum"
            onClick={() => onNavigate(AppView.CHAT)}
          />

        </div>
      </div>

      {/* Navigation Hint */}
      <div className="mt-auto flex flex-col items-center justify-center opacity-90 pt-4 pb-2">
         <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 text-center">
            Press to view pilot tools
         </p>
         <div className="flex flex-col items-center -space-y-3 mb-6">
            <ChevronDown size={24} className="text-yellow-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <ChevronDown size={24} className="text-yellow-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <ChevronDown size={24} className="text-yellow-400 animate-bounce" style={{ animationDelay: '300ms' }} />
         </div>

         {/* Pilot Tools Section */}
         <div className="grid grid-cols-2 gap-4 w-full">
            <button 
              onClick={() => onNavigate(AppView.CHAT)}
              className="bg-slate-900 dark:bg-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-white shadow-lg active:scale-95 transition-all border border-slate-700 dark:border-slate-600 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-1 opacity-10">
                 <Calculator size={64} />
              </div>
              <Calculator className="text-yellow-400 mb-2 group-hover:scale-110 transition-transform" size={28} />
              <span className="text-xs font-bold uppercase tracking-wider text-center z-10">Digital E6B</span>
              <span className="text-[10px] text-slate-400 font-medium z-10">Calculator</span>
            </button>

            <button 
              onClick={() => onNavigate(AppView.INTERVIEW_PREP)}
              className="bg-slate-900 dark:bg-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-white shadow-lg active:scale-95 transition-all border border-slate-700 dark:border-slate-600 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-1 opacity-10">
                 <CloudSun size={64} />
              </div>
              <CloudSun className="text-yellow-400 mb-2 group-hover:scale-110 transition-transform" size={28} />
              <span className="text-xs font-bold uppercase tracking-wider text-center z-10">Weather</span>
              <span className="text-[10px] text-slate-400 font-medium z-10">Translator</span>
            </button>

            <button 
              onClick={() => onNavigate(AppView.WEIGHT_BALANCE)}
              className="col-span-2 bg-slate-900 dark:bg-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-white shadow-lg active:scale-95 transition-all border border-slate-700 dark:border-slate-600 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-1 opacity-10">
                 <Scale size={64} />
              </div>
              <Scale className="text-yellow-400 mb-2 group-hover:scale-110 transition-transform" size={28} />
              <span className="text-xs font-bold uppercase tracking-wider text-center z-10">Weight & Balance</span>
              <span className="text-[10px] text-slate-400 font-medium z-10">Performance Calc</span>
            </button>
         </div>
      </div>
    </div>
  );
};

interface AppCardProps {
  image: string;
  title: string;
  onClick?: () => void;
  href?: string;
  imgClassName?: string;
}

const AppCard: React.FC<AppCardProps> = ({ image, title, onClick, href, imgClassName }) => {
  const commonClasses = "relative w-full aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all active:scale-95 group bg-white dark:bg-slate-900 block";

  if (href) {
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className={commonClasses}
      >
        <img src={image} alt={title} className={`w-full h-full object-cover ${imgClassName || ''} dark:opacity-90`} />
      </a>
    );
  }

  return (
    <button 
      onClick={onClick}
      className={commonClasses}
    >
      <img src={image} alt={title} className={`w-full h-full object-cover ${imgClassName || ''} dark:opacity-90`} />
    </button>
  );
};