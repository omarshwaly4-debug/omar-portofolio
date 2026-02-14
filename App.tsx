
import React, { useState, useMemo, useEffect } from 'react';
import { Category, Zikr } from './types';
import { INITIAL_AZKAR, CATEGORIES_CONFIG } from './constants';
import ZikrCard from './components/ZikrCard';
import Misbaha from './components/Misbaha';
import GeminiAssistant from './components/GeminiAssistant';
import { LayoutGrid, MessageSquare, Compass, Home, Search, BookOpen, Heart, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'misbaha' | 'assistant' | 'browse' | 'favorites' | 'resources'>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [azkar, setAzkar] = useState<Zikr[]>(() => {
    const saved = localStorage.getItem('user_azkar_v2');
    return saved ? JSON.parse(saved) : INITIAL_AZKAR;
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('user_azkar_v2', JSON.stringify(azkar));
  }, [azkar]);

  const filteredAzkar = useMemo(() => {
    let result = azkar;
    if (activeTab === 'favorites') {
      result = result.filter(z => z.isFavorite);
    } else if (selectedCategory) {
      result = result.filter(z => z.category === selectedCategory);
    }
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(z => z.text.includes(lowerQuery) || z.category.includes(lowerQuery));
    }
    return result;
  }, [azkar, selectedCategory, searchQuery, activeTab]);

  const zikrOfDay = useMemo(() => {
    const day = new Date().getDate();
    return azkar[day % azkar.length];
  }, [azkar]);

  const handleIncrement = (id: string) => {
    setAzkar(prev => prev.map(z => 
      z.id === id ? { ...z, count: Math.min(z.count + 1, z.repeat) } : z
    ));
  };

  const handleReset = (id: string) => {
    setAzkar(prev => prev.map(z => 
      z.id === id ? { ...z, count: 0 } : z
    ));
  };

  const handleToggleFavorite = (id: string) => {
    setAzkar(prev => prev.map(z => 
      z.id === id ? { ...z, isFavorite: !z.isFavorite } : z
    ));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Main Hero */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-[64px] p-12 text-white shadow-2xl">
              <div className="absolute top-0 right-0 p-16 opacity-10 rotate-12 scale-150">
                 <BookOpen size={240} />
              </div>
              <div className="relative z-10 max-w-xl">
                <div className="flex items-center gap-3 mb-6 bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-md">
                   <ShieldCheck size={18} className="text-emerald-400" />
                   <span className="text-xs font-black uppercase tracking-widest">حصن المسلم الشامل</span>
                </div>
                <h1 className="text-6xl font-black mb-8 leading-[1.1] tracking-tighter">نورٌ في كلِّ خطوةٍ <br/>بذِكرِ الله</h1>
                <p className="text-emerald-100/60 text-xl font-medium mb-10 leading-relaxed">تطبيقك المتكامل للأذكار اليومية والأدعية، مصمم بدقة ليكون رفيقك الدائم في كل زمان ومكان.</p>
                <div className="flex gap-4">
                   <button onClick={() => setActiveTab('browse')} className="bg-white text-emerald-900 px-10 py-5 rounded-2xl font-black text-lg shadow-xl transition-all hover:scale-105 active:scale-95">تصفح الأذكار</button>
                   <button onClick={() => setActiveTab('misbaha')} className="bg-emerald-500/20 text-white border border-white/20 px-10 py-5 rounded-2xl font-black text-lg backdrop-blur-md hover:bg-emerald-500 transition-all">ابدأ التسبيح</button>
                </div>
              </div>
            </div>

            {/* Zikr of the Day Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-[48px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50 relative group">
                 <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-3">
                      <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Sparkles size={24} /></div>
                      <h2 className="text-2xl font-black text-slate-900">ذِكْرُ اليَوْم</h2>
                   </div>
                   <button className="text-slate-300 group-hover:text-emerald-500 transition-colors"><ExternalLink size={20}/></button>
                 </div>
                 <div className="bg-slate-50 rounded-[40px] p-10 mb-8 border border-slate-100">
                   <p className="quran-font text-3xl md:text-4xl text-slate-800 text-center leading-relaxed">"{zikrOfDay.text}"</p>
                 </div>
                 <div className="flex items-center justify-between px-2">
                    <span className="text-slate-400 text-sm font-bold flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      قسم {zikrOfDay.category}
                    </span>
                    <button onClick={() => {setSelectedCategory(zikrOfDay.category); setActiveTab('browse');}} className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all">تكرار الذكر</button>
                 </div>
              </div>

              {/* Quick Stats or Promo */}
              <div className="bg-emerald-600 rounded-[48px] p-10 text-white flex flex-col justify-between shadow-xl shadow-emerald-200">
                 <div>
                   <h3 className="text-3xl font-black mb-4">أنا مسلم</h3>
                   <p className="text-emerald-100 font-medium opacity-80 mb-6">محتوى موثوق مستمد من الكتاب والسنة النبوية الشريفة.</p>
                 </div>
                 <button 
                  onClick={() => setActiveTab('resources')}
                  className="w-full py-5 bg-white text-emerald-900 rounded-2xl font-black shadow-lg flex items-center justify-center gap-2"
                 >
                   المصادر والمراجع <ExternalLink size={18} />
                 </button>
              </div>
            </div>

            {/* Categories Grid */}
            <div>
              <div className="flex items-center justify-between mb-8 px-4">
                 <h2 className="text-3xl font-black text-slate-900">تصنيفات الأذكار</h2>
                 <button onClick={() => setActiveTab('browse')} className="text-emerald-600 font-bold hover:underline">عرض الكل</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {CATEGORIES_CONFIG.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setActiveTab('browse');
                    }}
                    className="flex flex-col items-center p-8 bg-white rounded-[40px] border border-slate-50 hover:border-emerald-200 hover:shadow-2xl transition-all group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className={`text-4xl mb-4 p-5 rounded-[28px] transition-all group-hover:scale-110 group-hover:-rotate-3 relative z-10 ${cat.color}`}>{cat.icon}</span>
                    <span className="font-black text-slate-800 relative z-10">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Assistant Promo */}
            <div className="p-10 bg-slate-50 border border-slate-100 rounded-[56px] flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[32px] flex items-center justify-center shrink-0">
                <MessageSquare size={48} />
              </div>
              <div className="flex-1 text-center md:text-right">
                <h3 className="font-black text-slate-900 text-3xl mb-3">اسأل المساعد الذكي</h3>
                <p className="text-slate-500 font-medium text-lg max-w-xl">هل تبحث عن فضل ذكر معين؟ أو تريد دعاءً لمناسبة خاصة؟ مساعدنا الذكي متاح لك دائماً.</p>
              </div>
              <button 
                onClick={() => setActiveTab('assistant')}
                className="bg-slate-900 text-white px-12 py-6 rounded-[28px] font-black text-xl shadow-2xl hover:bg-black transition-all transform hover:-translate-y-1 active:scale-95"
              >
                تحدث معي الآن
              </button>
            </div>
          </div>
        );

      case 'resources':
        return (
          <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
             <div className="text-center">
                <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">المراجع والمصادر</h2>
                <p className="text-slate-400 text-xl font-medium">نحن نلتزم بالدقة والأمانة العلمية في نقل الأذكار.</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a href="https://www.anamuslim.com" target="_blank" className="p-10 bg-white rounded-[40px] border border-slate-100 hover:border-emerald-200 transition-all group shadow-sm">
                   <h3 className="text-2xl font-black mb-4 flex items-center justify-between">
                     موقع أنا مسلم
                     <ExternalLink className="text-slate-200 group-hover:text-emerald-500 transition-colors" />
                   </h3>
                   <p className="text-slate-500 leading-relaxed">أحد أكبر المنصات الإسلامية الموثوقة التي استقينا منها قاعدة البيانات الشاملة للأذكار.</p>
                </a>
                <div className="p-10 bg-white rounded-[40px] border border-slate-100 shadow-sm">
                   <h3 className="text-2xl font-black mb-4">حصن المسلم</h3>
                   <p className="text-slate-500 leading-relaxed">كتاب الشيخ سعيد بن علي بن وهف القحطاني، المرجع الأول لهذا التطبيق.</p>
                </div>
                <div className="p-10 bg-white rounded-[40px] border border-slate-100 shadow-sm">
                   <h3 className="text-2xl font-black mb-4">صحيح البخاري ومسلم</h3>
                   <p className="text-slate-500 leading-relaxed">المصدر الأساسي للأحاديث النبوية الصحيحة المتعلقة بالأدعية والأذكار.</p>
                </div>
                <div className="p-10 bg-emerald-900 text-white rounded-[40px] shadow-xl">
                   <h3 className="text-2xl font-black mb-4">تحديثات مستمرة</h3>
                   <p className="text-emerald-100/60 leading-relaxed font-medium">نعمل دورياً على مراجعة المحتوى وتدقيقه لضمان خلوه من الأحاديث الضعيفة والموضوعة.</p>
                </div>
             </div>
          </div>
        );

      case 'favorites':
      case 'browse':
        return (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" size={28} />
                <input
                  type="text"
                  placeholder="ابحث عن أذكار (مثال: المساء، الطعام، دخول المنزل)..."
                  className="w-full pr-16 pl-8 py-6 bg-white border-none rounded-[32px] focus:ring-4 focus:ring-emerald-500/10 outline-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-xl font-medium placeholder:text-slate-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-6 -mx-6 px-6 sticky top-0 z-20 bg-[#FBFBFC]/90 backdrop-blur-lg pt-2">
                <button 
                  onClick={() => {setSelectedCategory(null); setActiveTab('browse');}}
                  className={`px-10 py-4 rounded-2xl whitespace-nowrap font-black text-lg transition-all ${!selectedCategory && activeTab !== 'favorites' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200 scale-[1.05]' : 'bg-white text-slate-400'}`}
                >
                  الكل
                </button>
                <button 
                  onClick={() => setActiveTab('favorites')}
                  className={`px-10 py-4 rounded-2xl whitespace-nowrap font-black text-lg transition-all flex items-center gap-3 ${activeTab === 'favorites' ? 'bg-red-500 text-white shadow-xl shadow-red-200 scale-[1.05]' : 'bg-white text-slate-400'}`}
                >
                  <Heart size={20} fill={activeTab === 'favorites' ? "currentColor" : "none"} />
                  المفضلة
                </button>
                {CATEGORIES_CONFIG.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {setSelectedCategory(cat.id); setActiveTab('browse');}}
                    className={`px-10 py-4 rounded-2xl whitespace-nowrap font-black text-lg transition-all ${selectedCategory === cat.id && activeTab !== 'favorites' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200 scale-[1.05]' : 'bg-white text-slate-400 border border-slate-50'}`}
                  >
                    {cat.name}
                  </button>
                ))}
            </div>

            {filteredAzkar.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {filteredAzkar.map(zikr => (
                  <ZikrCard 
                    key={zikr.id} 
                    zikr={zikr} 
                    onIncrement={handleIncrement} 
                    onReset={handleReset}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-40 bg-white rounded-[64px] shadow-sm border border-slate-50">
                <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-8">
                   <Search size={40} className="text-slate-200" />
                </div>
                <p className="text-slate-400 font-black text-2xl">لم نجد أي أذكار تطابق بحثك</p>
                <button onClick={() => {setSearchQuery(''); setSelectedCategory(null);}} className="mt-6 text-emerald-600 font-bold text-lg hover:underline">عرض جميع الأذكار</button>
              </div>
            )}
          </div>
        );

      case 'misbaha':
        return <Misbaha />;

      case 'assistant':
        return <GeminiAssistant />;
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-36 md:pb-0 md:pr-80 bg-[#FBFBFC] selection:bg-emerald-100">
      {/* Desktop Navigation Sidebar */}
      <aside className="fixed right-0 top-0 bottom-0 w-80 bg-white border-l border-slate-50 hidden md:flex flex-col p-10 z-50">
        <div className="flex items-center gap-4 mb-16 group">
          <div className="w-14 h-14 bg-emerald-600 rounded-[20px] flex items-center justify-center text-white shadow-2xl transition-transform group-hover:rotate-6">
            <BookOpen size={32} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900 tracking-tighter leading-none mb-1">حصن المسلم</span>
            <span className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em]">أنا مسلم</span>
          </div>
        </div>

        <nav className="flex-1 space-y-4">
          {[
            { id: 'home', label: 'الرئيسية', icon: Home },
            { id: 'browse', label: 'تصفح الأذكار', icon: LayoutGrid },
            { id: 'favorites', label: 'أذكاري المفضلة', icon: Heart },
            { id: 'misbaha', label: 'المسبحة الذكية', icon: Compass },
            { id: 'assistant', label: 'المساعد الذكي', icon: MessageSquare },
            { id: 'resources', label: 'المصادر والمراجع', icon: ShieldCheck },
          ].map((item: any) => (
            <button 
              key={item.id}
              onClick={() => {setActiveTab(item.id); setSelectedCategory(null);}}
              className={`w-full flex items-center gap-5 px-8 py-5 rounded-[24px] font-black text-lg transition-all ${activeTab === item.id ? 'bg-emerald-600 text-white shadow-2xl shadow-emerald-200 scale-[1.05]' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
            >
              <item.icon size={26} fill={activeTab === item.id && item.id === 'favorites' ? "currentColor" : "none"} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-8 bg-slate-50 rounded-[32px] border border-slate-100/50">
          <p className="text-sm text-slate-400 font-black leading-relaxed text-center opacity-80 mb-2">
            {new Date().toLocaleDateString('ar-EG', { weekday: 'long' })}
          </p>
          <p className="text-xs text-slate-300 font-bold text-center">
            {new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </aside>

      {/* Mobile Top Navigation Header */}
      <header className="md:hidden bg-white/80 backdrop-blur-xl px-10 py-8 sticky top-0 z-50 flex items-center justify-between border-b border-slate-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-[18px] flex items-center justify-center text-white shadow-xl shadow-emerald-100">
            <BookOpen size={24} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-2xl text-slate-900 tracking-tighter">حصن المسلم</span>
            <span className="text-[8px] text-emerald-600 font-black uppercase tracking-[0.2em]">أنا مسلم</span>
          </div>
        </div>
        <button onClick={() => setActiveTab('resources')} className="p-3 bg-slate-50 rounded-xl text-slate-400"><ShieldCheck size={20}/></button>
      </header>

      {/* Main Content Render Area */}
      <main className="flex-1 p-8 md:p-20 max-w-7xl mx-auto w-full">
        {renderContent()}
      </main>

      {/* Floating Bottom Mobile Nav Bar */}
      <div className="md:hidden fixed bottom-10 left-8 right-8 z-50">
        <nav className="bg-slate-900/95 backdrop-blur-2xl rounded-[40px] flex justify-around items-center h-24 px-6 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/5">
          {[
            { id: 'home', label: 'الرئيسية', icon: Home },
            { id: 'browse', label: 'الأذكار', icon: LayoutGrid },
            { id: 'misbaha', label: 'المسبحة', icon: Compass },
            { id: 'assistant', label: 'المساعد', icon: MessageSquare },
          ].map((item: any) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-3xl transition-all ${activeTab === item.id ? 'text-emerald-400 scale-110' : 'text-slate-500'}`}
            >
              <item.icon size={30} />
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default App;
