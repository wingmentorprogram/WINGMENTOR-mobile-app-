import React, { useState, useRef } from 'react';
import { Upload, Camera, CheckCircle, X, Loader2, ThumbsUp, ThumbsDown, Lightbulb, FileText } from 'lucide-react';
import { reviewResume } from '../services/geminiService';
import { ResumeReviewResult, ImageUpload } from '../types';

export const ProfileRoastView: React.FC = () => {
  const [image, setImage] = useState<ImageUpload | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeReviewResult | null>(null);
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
        setResult(null); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReview = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const data = await reviewResume(image.base64, image.mimeType);
      setResult(data);
    } catch (e) {
      alert("Something went wrong. Try another photo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 h-full overflow-y-auto no-scrollbar pb-20">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2 pt-4 px-2">Document Audit</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 px-2 mb-6">Upload your Resume or Logbook page for a recruiter's perspective.</p>
      
      {!result ? (
        <div className="flex flex-col items-center justify-center space-y-8 mt-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-[3/4] max-h-96 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-sky-400 dark:hover:border-sky-500 transition-colors"
          >
            {image ? (
              <>
                <img src={image.previewUrl} alt="Preview" className="w-full h-full object-contain" />
                <button 
                  onClick={(e) => { e.stopPropagation(); setImage(null); }}
                  className="absolute top-4 right-4 bg-slate-900/70 text-white p-2 rounded-full hover:bg-slate-900"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <div className="text-center p-6">
                <div className="bg-sky-50 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-sky-500 dark:text-sky-400 group-hover:scale-110 transition-transform">
                  <FileText size={40} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Upload Document</h3>
                <p className="text-sm text-slate-400 dark:text-slate-500 max-w-[200px] mx-auto">Snap a photo of your logbook or upload a screenshot of your CV.</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>

          <button
            onClick={handleReview}
            disabled={!image || loading}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-md
              ${!image || loading 
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600' 
                : 'bg-sky-600 dark:bg-sky-600 text-white hover:bg-sky-700 dark:hover:bg-sky-500 active:scale-[0.98]'
              }`}
          >
             {loading ? <Loader2 className="animate-spin" /> : <CheckCircle />}
             {loading ? 'Auditing...' : 'Review My Document'}
          </button>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in pb-10">
           {/* Score Card */}
           <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden shadow-sm transition-colors">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"></div>
             <span className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-widest font-bold">Readiness Score</span>
             <div className="text-6xl font-black text-slate-800 dark:text-slate-100 mt-2 mb-2">{result.score}<span className="text-3xl text-slate-300 dark:text-slate-600">/10</span></div>
             <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">"{result.summary}"</p>
           </div>

           {/* Strengths & Weaknesses */}
           <div className="grid grid-cols-1 gap-4">
             <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-5 border border-emerald-100 dark:border-emerald-900/50">
               <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold mb-3">
                 <ThumbsUp size={18} /> Strengths
               </div>
               <ul className="space-y-2">
                 {result.strengths.map((p, i) => (
                   <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                     <span className="text-emerald-500 dark:text-emerald-400 mt-0.5 font-bold">•</span> {p}
                   </li>
                 ))}
               </ul>
             </div>

             <div className="bg-red-50 dark:bg-red-950/30 rounded-xl p-5 border border-red-100 dark:border-red-900/50">
               <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold mb-3">
                 <ThumbsDown size={18} /> Improvements Needed
               </div>
               <ul className="space-y-2">
                 {result.weaknesses.map((p, i) => (
                   <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                     <span className="text-red-500 dark:text-red-400 mt-0.5 font-bold">•</span> {p}
                   </li>
                 ))}
               </ul>
             </div>
           </div>

           {/* Action Plan */}
           <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-sky-200 dark:border-sky-900/50 shadow-sm transition-colors">
             <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400 font-bold mb-3">
                <Lightbulb size={18} />
                Fixes & Tips
             </div>
             <ul className="space-y-3">
                {result.improvements.map((t, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <div className="bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i+1}</div>
                    {t}
                  </li>
                ))}
             </ul>
           </div>
           
           <button 
             onClick={() => { setImage(null); setResult(null); }}
             className="w-full py-3 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
           >
             Analyze Another Document
           </button>
        </div>
      )}
    </div>
  );
};