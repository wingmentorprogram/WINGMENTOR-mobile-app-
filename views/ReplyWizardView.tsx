import React, { useState, useRef } from 'react';
import { Upload, X, Send, Loader2, Copy, AlertCircle } from 'lucide-react';
import { generateInterviewAnswers } from '../services/geminiService';
import { InterviewSuggestion, ImageUpload } from '../types';

export const ReplyWizardView: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [image, setImage] = useState<ImageUpload | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<InterviewSuggestion[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        setImage({
          file,
          previewUrl: URL.createObjectURL(file),
          base64: base64Data,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!inputText && !image) return;
    
    setLoading(true);
    setSuggestions([]);
    try {
      const results = await generateInterviewAnswers(inputText, image?.base64, image?.mimeType);
      setSuggestions(results);
    } catch (error) {
      alert("Failed to generate responses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2 pt-4 px-2">Flight Deck Tools</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 px-2 mb-6">Analyze scenarios, prepare for interviews, or translate weather reports.</p>

      <div className="flex-1 overflow-y-auto space-y-6 px-2 pb-6 no-scrollbar">
        {/* Input Section */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Input
          </label>
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste a raw METAR string, ask a technical question, or describe an interview scenario..."
            className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg p-3 border border-slate-200 dark:border-slate-800 focus:border-sky-500 dark:focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none resize-none h-24 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors"
          />
          
          {/* Image Attachment */}
          <div className="mt-4">
             {image ? (
               <div className="relative inline-block">
                 <img src={image.previewUrl} alt="Context" className="h-20 w-auto rounded-lg border border-slate-300 dark:border-slate-700 shadow-sm" />
                 <button 
                   onClick={() => setImage(null)}
                   className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                 >
                   <X size={12} />
                 </button>
               </div>
             ) : (
               <button 
                 onClick={() => fileInputRef.current?.click()}
                 className="flex items-center gap-2 text-sm text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium transition-colors py-2"
               >
                 <Upload size={16} />
                 <span>Upload Chart/Diagram (Optional)</span>
               </button>
             )}
             <input 
               type="file" 
               ref={fileInputRef} 
               className="hidden" 
               accept="image/*"
               onChange={handleImageUpload}
             />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || (!inputText && !image)}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-md
            ${loading || (!inputText && !image) 
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed' 
              : 'bg-sky-600 dark:bg-sky-600 text-white hover:bg-sky-700 dark:hover:bg-sky-500 active:scale-[0.98]'
            }`}
        >
          {loading ? (
            <><Loader2 className="animate-spin" /> Analyzing...</>
          ) : (
            <><Send size={20} /> Run Analysis</>
          )}
        </button>

        {/* Results */}
        {suggestions.length > 0 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-slate-800 dark:text-slate-200 font-bold pl-1 border-l-4 border-sky-500 ml-1 pl-3">Analysis Results</h3>
            {suggestions.map((s, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative group hover:border-sky-200 dark:hover:border-sky-900 transition-colors">
                 <div className="flex justify-between items-center mb-3">
                   <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 uppercase tracking-wide">
                     {s.style}
                   </span>
                   <button 
                     onClick={() => copyToClipboard(s.response)}
                     className="text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 p-1"
                   >
                     <Copy size={16} />
                   </button>
                 </div>
                 <p className="text-slate-800 dark:text-slate-200 text-base mb-4 leading-relaxed font-medium whitespace-pre-wrap">"{s.response}"</p>
                 <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800 transition-colors">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                        <AlertCircle size={12} />
                        KEY TAKEAWAY
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                       {s.crmFocus}
                    </p>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};