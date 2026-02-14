
import React, { useState } from 'react';
import { Zikr } from '../types';
import { Check, RotateCcw, Copy, Heart, Play, Volume2, Loader2 } from 'lucide-react';
import { playZikrAudio } from '../services/ttsService';

interface ZikrCardProps {
  zikr: Zikr;
  onIncrement: (id: string) => void;
  onReset: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const ZikrCard: React.FC<ZikrCardProps> = ({ zikr, onIncrement, onReset, onToggleFavorite }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const isCompleted = zikr.count >= zikr.repeat;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(zikr.text);
  };

  const handlePlay = async () => {
    setIsPlaying(true);
    await playZikrAudio(zikr.text);
    setIsPlaying(false);
  };

  return (
    <div 
      className={`relative p-6 rounded-3xl shadow-sm border transition-all duration-500 ${
        isCompleted ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100 hover:shadow-xl'
      }`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-2">
          <button 
            onClick={handleCopy}
            className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"
            title="نسخ"
          >
            <Copy size={18} />
          </button>
          <button 
            onClick={() => onReset(zikr.id)}
            className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"
            title="إعادة تعيين"
          >
            <RotateCcw size={18} />
          </button>
          <button 
            onClick={handlePlay}
            disabled={isPlaying}
            className={`p-2.5 rounded-xl hover:bg-emerald-50 transition-colors ${isPlaying ? 'text-emerald-600' : 'text-slate-400'}`}
            title="استماع"
          >
            {isPlaying ? <Loader2 size={18} className="animate-spin" /> : <Volume2 size={18} />}
          </button>
        </div>
        
        <button 
          onClick={() => onToggleFavorite(zikr.id)}
          className={`p-2.5 rounded-xl transition-colors ${zikr.isFavorite ? 'bg-red-50 text-red-500' : 'text-slate-300 hover:text-red-400'}`}
        >
          <Heart size={20} fill={zikr.isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      <p className="quran-font text-2xl md:text-3xl leading-relaxed text-slate-800 text-center mb-10 px-2">
        {zikr.text}
      </p>

      {zikr.reference && (
        <p className="text-sm text-emerald-600/60 text-center mb-6 font-medium">
          — {zikr.reference}
        </p>
      )}

      <div className="flex flex-col items-center">
        <button
          onClick={() => !isCompleted && onIncrement(zikr.id)}
          disabled={isCompleted}
          className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black text-xl transition-all transform active:scale-95 ${
            isCompleted 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
              : 'bg-slate-900 hover:bg-black text-white shadow-xl'
          }`}
        >
          {isCompleted ? (
            <>
              <Check size={24} />
              تَمّ
            </>
          ) : (
            <>
              <span className="text-3xl">{zikr.count}</span>
              <span className="text-lg opacity-40">/</span>
              <span className="text-lg opacity-40">{zikr.repeat}</span>
            </>
          )}
        </button>
        
        <div className="w-full h-2 bg-slate-100 rounded-full mt-6 overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-700 ease-out"
            style={{ width: `${(zikr.count / zikr.repeat) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ZikrCard;
