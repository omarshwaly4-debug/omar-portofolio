
import React, { useState, useEffect } from 'react';
import { RotateCcw, Volume2, VolumeX, Target, Hash } from 'lucide-react';

const Misbaha: React.FC = () => {
  const [count, setCount] = useState(0);
  const [laps, setLaps] = useState(0);
  const [goal, setGoal] = useState(33);
  const [total, setTotal] = useState(() => {
    const saved = localStorage.getItem('misbaha_total');
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('misbaha_total', total.toString());
  }, [total]);

  const handleIncrement = () => {
    const newCount = count + 1;
    setTotal(prev => prev + 1);

    if (newCount > goal) {
      setCount(1);
      setLaps(prev => prev + 1);
    } else {
      setCount(newCount);
    }

    if (newCount === goal && navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  };

  const resetAll = () => {
    setCount(0);
    setLaps(0);
  };

  return (
    <div className="max-w-xl mx-auto p-4 text-center">
      <div className="mb-10">
        <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">المسبحة الذكية</h2>
        <p className="text-slate-400 font-medium">استثمر وقتك في ذكر الله</p>
        
        <div className="flex justify-center gap-3 mt-8">
          {[33, 100, 1000].map(g => (
            <button
              key={g}
              onClick={() => {setGoal(g); setCount(0);}}
              className={`px-6 py-2.5 rounded-2xl text-sm font-black transition-all transform active:scale-95 ${goal === g ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200' : 'bg-white text-slate-400 border border-slate-100 hover:border-emerald-200'}`}
            >
              هدف: {g}
            </button>
          ))}
        </div>
      </div>

      <div className="relative group max-w-sm mx-auto">
        <div className="w-80 h-80 mx-auto rounded-full border-[16px] border-white bg-white flex flex-col items-center justify-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] relative overflow-hidden">
          {/* Wave Progress Background */}
          <div 
            className="absolute bottom-0 left-0 right-0 bg-emerald-500/5 transition-all duration-700 ease-out" 
            style={{ height: `${(count / goal) * 100}%` }}
          ></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <span className="text-8xl font-black text-slate-900 tabular-nums mb-1 tracking-tighter">{count}</span>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full">
               <Hash size={14} />
               <span className="text-sm font-black">الدورات: {laps}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleIncrement}
          className="mt-12 w-full py-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[48px] shadow-2xl shadow-emerald-600/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-4 text-4xl font-black"
        >
          <span>اضغط للتسبيح</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-10">
        <button 
          onClick={resetAll}
          className="py-5 bg-white border border-slate-100 rounded-3xl text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all flex items-center justify-center gap-3 font-black text-lg"
        >
          <RotateCcw size={24} />
          تصفير العداد
        </button>
        
        <div className="bg-slate-900 text-white p-5 rounded-3xl flex items-center justify-between shadow-lg">
          <div className="text-right">
            <span className="block text-[10px] uppercase tracking-widest text-emerald-400 font-bold opacity-60">الإجمالي</span>
            <span className="text-2xl font-black tabular-nums">{total}</span>
          </div>
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
             <Target size={20} className="text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Misbaha;
