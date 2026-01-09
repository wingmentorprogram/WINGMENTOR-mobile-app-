import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { HomeView } from './views/HomeView';
import { ReplyWizardView } from './views/ReplyWizardView';
import { ProfileRoastView } from './views/ProfileRoastView';
import { ChatView } from './views/ChatView';
import { MentorCommunityView } from './views/MentorCommunityView';
import { ExamTerminalView } from './views/ExamTerminalView';
import { BlackBoxView } from './views/BlackBoxView';
import { AppView } from './types';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate startup loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case AppView.HOME:
        return <HomeView onNavigate={setCurrentView} />;
      case AppView.INTERVIEW_PREP:
        return <ReplyWizardView />;
      case AppView.RESUME_REVIEW:
        return <ProfileRoastView />;
      case AppView.CHAT:
        return <ChatView />;
      case AppView.MENTOR_COMMUNITY:
        return <MentorCommunityView />;
      case AppView.EXAM_TERMINAL:
        return <ExamTerminalView />;
      case AppView.BLACK_BOX:
        return <BlackBoxView />;
      default:
        return <HomeView onNavigate={setCurrentView} />;
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-slate-50 dark:bg-slate-950 flex items-center justify-center z-50 transition-colors">
        <div className="flex flex-col items-center animate-fade-in p-6">
          <img 
            src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR" 
            alt="WingMentor Loading" 
            className="w-40 h-auto object-contain mb-6 drop-shadow-sm dark:brightness-0 dark:invert"
          />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-sky-600 dark:bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-sky-600 dark:bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-sky-600 dark:bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {renderView()}
    </Layout>
  );
}

export default App;