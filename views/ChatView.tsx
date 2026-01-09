import React, { useState, useEffect, useRef } from 'react';
import { Send, User, MessageCircle, Loader2 } from 'lucide-react';
import { sendChatMessage } from '../services/geminiService';
import { ChatMessage, MessageRole } from '../types';

export const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: MessageRole.MODEL,
      text: "Captain here. I know the road from 250 hours to the right seat is tough. What's on your mind? We can talk about career paths, interview anxiety, or technical questions.",
      timestamp: Date.now(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      text: input,
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Prepare history for API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await sendChatMessage(history, userMsg.text);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.MODEL,
        text: responseText || "Standby, I'm checking my manuals.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.MODEL,
        text: "Communication failure. Please try again.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm z-10 transition-colors">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
           Mentor Chat
           <span className="text-xs font-normal text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 px-2 py-0.5 rounded-full border border-sky-100 dark:border-sky-900/50">Live</span>
        </h2>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-slate-50 dark:bg-slate-950 transition-colors">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === MessageRole.USER 
                  ? 'bg-sky-600 text-white rounded-br-none' 
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-800'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
           <div className="flex justify-start">
             <div className="bg-white dark:bg-slate-900 rounded-2xl rounded-bl-none p-4 border border-slate-200 dark:border-slate-800 flex items-center gap-2 shadow-sm">
               <Loader2 size={16} className="animate-spin text-sky-600 dark:text-sky-400" />
               <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Captain is typing...</span>
             </div>
           </div>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe transition-colors">
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 rounded-full border border-slate-200 dark:border-slate-800 px-4 py-2 focus-within:border-sky-400 focus-within:ring-1 focus-within:ring-sky-100 dark:focus-within:ring-sky-900 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask for advice..."
            className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none h-10"
            disabled={loading}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className={`p-2 rounded-full transition-colors ${
              input.trim() && !loading ? 'text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/30' : 'text-slate-300 dark:text-slate-600'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};