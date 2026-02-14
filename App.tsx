
import React, { useState, useEffect, useRef } from 'react';
import { 
  User, AuthState, Sermon, Story, Quiz, QuizResult, Music, Devotional, UserRole, 
  PrayerPoint, Testimony, BibleStudyPlan, AppSettings 
} from './types';
import { 
  INITIAL_SERMONS, INITIAL_STORIES, INITIAL_QUIZZES, INITIAL_MUSIC, DAILY_DEVOTIONAL, 
  POPPING_VIDEOS, GROWTH_CHALLENGE_TASKS, BIBLE_VERSIONS, MOCK_BIBLE_CONTENT, 
  INTERCESSORY_SCRIPTURES, PRAYER_INSTRUMENTAL_URL, BIBLE_STUDY_PLANS, INITIAL_TESTIMONIES 
} from './constants';
import { generateMotivation } from './services/gemini';

// --- Simulated Database Helpers ---
const getStoredUsers = () => JSON.parse(localStorage.getItem('teenfaith_registered_users') || '[]');
const setStoredUsers = (users: any[]) => localStorage.setItem('teenfaith_registered_users', JSON.stringify(users));

// --- Components ---

const Navbar = ({ 
  user, 
  onLogout, 
  onNavigate,
  currentPage
}: { 
  user: User | null; 
  onLogout: () => void; 
  onNavigate: (page: string) => void;
  currentPage: string;
}) => (
  <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm overflow-x-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center min-w-[800px] lg:min-w-0">
        <div className="flex items-center cursor-pointer shrink-0" onClick={() => onNavigate('home')}>
          <div className="bg-indigo-600 p-2 rounded-lg mr-2 animate-pulse">
            <i className="fas fa-cross text-white text-xl"></i>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            TeenFaith+
          </span>
        </div>
        
        <div className="hidden lg:flex space-x-4 items-center mx-4">
          <button onClick={() => onNavigate('bible')} className={`text-gray-600 hover:text-indigo-600 font-semibold px-2 py-1 transition ${currentPage === 'bible' ? 'text-indigo-600 border-b-2 border-indigo-600' : ''}`}>Bible</button>
          <button onClick={() => onNavigate('intercession')} className={`text-gray-600 hover:text-indigo-600 font-semibold px-2 py-1 transition ${currentPage === 'intercession' ? 'text-indigo-600 border-b-2 border-indigo-600' : ''}`}>Intercession</button>
          <button onClick={() => onNavigate('faith-hub')} className={`text-gray-600 hover:text-indigo-600 font-semibold px-2 py-1 transition ${currentPage === 'faith-hub' ? 'text-indigo-600 border-b-2 border-indigo-600' : ''}`}>Faith Hub</button>
          <button onClick={() => onNavigate('youth-hub')} className={`text-gray-600 hover:text-indigo-600 font-semibold px-2 py-1 transition ${currentPage === 'youth-hub' ? 'text-indigo-600 border-b-2 border-indigo-600' : ''}`}>Youth Hub</button>
          <button onClick={() => onNavigate('journal')} className={`text-gray-600 hover:text-indigo-600 font-semibold px-2 py-1 transition ${currentPage === 'journal' ? 'text-indigo-600 border-b-2 border-indigo-600' : ''}`}>Journal</button>
          <button onClick={() => onNavigate('sermons')} className={`text-gray-600 hover:text-indigo-600 font-semibold px-2 py-1 transition ${currentPage === 'sermons' ? 'text-indigo-600 border-b-2 border-indigo-600' : ''}`}>Sermons</button>
          <button onClick={() => onNavigate('music')} className={`text-gray-600 hover:text-indigo-600 font-semibold px-2 py-1 transition ${currentPage === 'music' ? 'text-indigo-600 border-b-2 border-indigo-600' : ''}`}>Music</button>
          <button onClick={() => onNavigate('stories')} className={`text-gray-600 hover:text-indigo-600 font-semibold px-2 py-1 transition ${currentPage === 'stories' ? 'text-indigo-600 border-b-2 border-indigo-600' : ''}`}>Stories</button>
          <button onClick={() => onNavigate('quizzes')} className={`text-gray-600 hover:text-indigo-600 font-semibold px-2 py-1 transition ${currentPage === 'quizzes' ? 'text-indigo-600 border-b-2 border-indigo-600' : ''}`}>Quizzes</button>
          <button onClick={() => onNavigate('motivation')} className={`text-gray-600 hover:text-indigo-600 font-semibold px-2 py-1 transition ${currentPage === 'motivation' ? 'text-indigo-600 border-b-2 border-indigo-600' : ''}`}>Motivation</button>
          {user?.role === 'admin' && (
            <button onClick={() => onNavigate('admin')} className="text-indigo-600 font-bold hover:underline">Admin</button>
          )}
        </div>

        <div className="flex items-center space-x-4 shrink-0">
          {user ? (
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => onNavigate('profile')}
                className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                  alt="avatar" 
                  className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-100"
                />
                <span className="hidden sm:inline">{user.name}</span>
              </button>
              <button 
                onClick={handleLogoutWithConfirm(onLogout)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <i className="fas fa-sign-out-alt text-lg"></i>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onNavigate('login')}
              className="bg-indigo-600 text-white px-5 py-2 rounded-full font-medium hover:bg-indigo-700 transition"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  </nav>
);

const handleLogoutWithConfirm = (logoutFn: () => void) => () => {
  if (window.confirm("Ready to sign out? Your progress is saved.")) {
    logoutFn();
  }
};

const SectionHeader = ({ title, subtitle, videoUrl }: { title: string; subtitle: string; videoUrl?: string }) => (
  <div className="relative mb-12 rounded-3xl overflow-hidden bg-gray-900 shadow-2xl group">
    {videoUrl && (
      <div className="absolute inset-0 opacity-40 grayscale group-hover:grayscale-0 transition duration-1000">
        <iframe 
          className="w-full h-full object-cover scale-110"
          src={`${videoUrl}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoUrl.split('/').pop()}`}
          title="background-video"
          frameBorder="0" 
          allow="autoplay"
        ></iframe>
      </div>
    )}
    <div className="relative p-12 lg:p-20 bg-gradient-to-r from-black/60 to-transparent flex flex-col items-start justify-center min-h-[300px]">
      <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight animate-fade-in-up">
        {title}
      </h2>
      <p className="text-lg lg:text-xl text-indigo-100 font-medium max-w-lg opacity-90">
        {subtitle}
      </p>
    </div>
  </div>
);

// --- Pages ---

type BibleTheme = 'light' | 'dark' | 'sepia';
type BibleFontSize = 'base' | 'xl' | '2xl' | '3xl';

const BiblePage = () => {
  const [selectedVersion, setSelectedVersion] = useState<string>('niv');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBook, setFilterBook] = useState('All');
  const [theme, setTheme] = useState<BibleTheme>('light');
  const [fontSize, setFontSize] = useState<BibleFontSize>('xl');

  const currentVerses = MOCK_BIBLE_CONTENT[selectedVersion] || MOCK_BIBLE_CONTENT['niv'];

  const filteredVerses = currentVerses.filter(v => {
    const matchesSearch = v.reference.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBook = filterBook === 'All' || v.reference.startsWith(filterBook);
    return matchesSearch && matchesBook;
  });

  const uniqueBooks = ['All', ...new Set(currentVerses.map(v => v.reference.split(' ')[0]))];

  const themeClasses = {
    light: 'bg-white text-gray-900 border-gray-100',
    dark: 'bg-gray-900 text-gray-100 border-gray-800',
    sepia: 'bg-[#f4ecd8] text-[#5b4636] border-[#e3d5b8]'
  };

  const fontSizeClasses = {
    base: 'text-base',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <SectionHeader 
        title="Holy Bible" 
        subtitle="Search God's Word with ease. Use the search bar for specific verses or filter by book." 
        videoUrl={POPPING_VIDEOS[0]}
      />

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-black text-gray-900 mb-4 uppercase text-xs tracking-widest">Version</h3>
            <div className="space-y-2">
              {BIBLE_VERSIONS.map(v => (
                <button 
                  key={v.id}
                  onClick={() => setSelectedVersion(v.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold transition ${selectedVersion === v.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-black text-gray-900 mb-4 uppercase text-xs tracking-widest">Appearance</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Theme</p>
                <div className="flex gap-2">
                  <button onClick={() => setTheme('light')} className={`w-8 h-8 rounded-full border ${theme === 'light' ? 'ring-2 ring-indigo-600 ring-offset-2' : ''} bg-white`} title="Light"></button>
                  <button onClick={() => setTheme('dark')} className={`w-8 h-8 rounded-full border ${theme === 'dark' ? 'ring-2 ring-indigo-600 ring-offset-2' : ''} bg-gray-900`} title="Dark"></button>
                  <button onClick={() => setTheme('sepia')} className={`w-8 h-8 rounded-full border ${theme === 'sepia' ? 'ring-2 ring-indigo-600 ring-offset-2' : ''} bg-[#f4ecd8]`} title="Sepia"></button>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Font Size</p>
                <div className="flex gap-1 bg-gray-50 p-1 rounded-xl">
                  {(['base', 'xl', '2xl', '3xl'] as BibleFontSize[]).map(size => (
                    <button 
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold transition ${fontSize === size ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      {size.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-black text-gray-900 mb-4 uppercase text-xs tracking-widest">Quick Navigation</h3>
            <div className="flex flex-wrap gap-2">
              {uniqueBooks.map(book => (
                <button 
                  key={book}
                  onClick={() => setFilterBook(book)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${filterBook === book ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-50 text-gray-400'}`}
                >
                  {book}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="relative mb-8">
            <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-gray-300"></i>
            <input 
              type="text" 
              placeholder="Search by keyword or reference (e.g. 'Love' or 'Psalm 23')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition text-lg"
            />
          </div>

          <div className="grid gap-6">
            {filteredVerses.length > 0 ? filteredVerses.map((v, i) => (
              <div key={i} className={`${themeClasses[theme]} p-10 rounded-[2.5rem] shadow-sm border hover:shadow-md transition animate-fade-in group`}>
                <div className="flex justify-between items-start mb-6">
                   <h4 className={`text-2xl font-black tracking-tight group-hover:scale-105 transition transform origin-left ${theme === 'light' ? 'text-indigo-600' : theme === 'sepia' ? 'text-[#8c6d46]' : 'text-indigo-400'}`}>{v.reference}</h4>
                   <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-indigo-400 transition"><i className="fas fa-bookmark"></i></button>
                      <button className="text-gray-400 hover:text-indigo-400 transition"><i className="fas fa-share-nodes"></i></button>
                   </div>
                </div>
                <p className={`${fontSizeClasses[fontSize]} leading-relaxed italic`}>"{v.text}"</p>
                <div className="mt-8 pt-6 border-t border-gray-50 flex justify-end">
                  <span className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">{selectedVersion.toUpperCase()} TRANSLATION</span>
                </div>
              </div>
            )) : (
              <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-100">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                   <i className="fas fa-book-open text-gray-200 text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-400">No verses found matching "{searchTerm}"</h3>
                <p className="text-gray-300 mt-2">Try searching for broader keywords like 'faith', 'love', or 'strength'.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const BibleStudyPage = () => {
  const [selectedLevel, setSelectedLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const plan = BIBLE_STUDY_PLANS.find(p => p.level === selectedLevel);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <SectionHeader 
        title="Bible Study Plans" 
        subtitle="Go deeper into the Word. Choose a level that challenges you and grow day by day." 
        videoUrl={POPPING_VIDEOS[0]}
      />
      
      <div className="flex justify-center space-x-4 mb-12">
        {(['Beginner', 'Intermediate', 'Advanced'] as const).map(level => (
          <button 
            key={level}
            onClick={() => setSelectedLevel(level)}
            className={`px-8 py-3 rounded-2xl font-bold transition-all ${selectedLevel === level ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'}`}
          >
            {level}
          </button>
        ))}
      </div>

      {plan && (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-10 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-black text-gray-900">{plan.title}</h2>
              <p className="text-gray-500 font-medium mt-1">{plan.description}</p>
            </div>
            <span className="bg-indigo-50 text-indigo-600 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
              {plan.days.length} Day Track
            </span>
          </div>

          <div className="grid gap-6">
            {plan.days.map((day, i) => (
              <div key={i} className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-lg group-hover:scale-110 transition">
                    {day.day}
                  </div>
                  {i < plan.days.length - 1 && <div className="w-1 flex-grow bg-gray-100 my-2 rounded-full"></div>}
                </div>
                <div className="bg-gray-50 rounded-3xl p-6 flex-grow border border-transparent hover:border-indigo-100 hover:bg-indigo-50/30 transition group-hover:translate-x-2">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                    <h4 className="text-xl font-bold text-gray-900">{day.title}</h4>
                    <span className="text-indigo-600 font-black text-sm">{day.scripture}</span>
                  </div>
                  <p className="text-gray-600">{day.focus}</p>
                  <button className="mt-4 text-indigo-600 font-bold flex items-center hover:underline">
                    Read Passage <i className="fas fa-arrow-right ml-2"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PrayerJournalPage = ({ 
  user, 
  points, 
  onAddPoint, 
  onTogglePoint 
}: { 
  user: User; 
  points: PrayerPoint[]; 
  onAddPoint: (text: string) => void;
  onTogglePoint: (id: string) => void;
}) => {
  const [newPoint, setNewPoint] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPoint.trim()) {
      onAddPoint(newPoint);
      setNewPoint('');
    }
  };

  const userPoints = points.filter(p => p.userId === user.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <SectionHeader 
        title="Prayer Journal" 
        subtitle="Write your heart out. These points will be used during your intercession moments in the War Room." 
        videoUrl={POPPING_VIDEOS[2]}
      />

      <form onSubmit={handleSubmit} className="mb-12">
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex flex-col sm:flex-row gap-4">
          <input 
            type="text" 
            value={newPoint}
            onChange={e => setNewPoint(e.target.value)}
            placeholder="What are you praying for today?" 
            className="flex-grow p-4 bg-gray-50 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition font-medium"
          />
          <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center justify-center space-x-2">
            <i className="fas fa-plus"></i>
            <span>Add Point</span>
          </button>
        </div>
      </form>

      <div className="space-y-6">
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">Your Prayer Requests</h3>
        {userPoints.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
             <i className="fas fa-pen-nib text-4xl text-gray-200 mb-4"></i>
             <p className="text-gray-400 font-medium">Your journal is empty. Start writing your requests.</p>
          </div>
        ) : (
          userPoints.map(p => (
            <div key={p.id} className={`flex items-center p-6 rounded-3xl border transition-all ${p.isAnswered ? 'bg-emerald-50 border-emerald-100 opacity-60' : 'bg-white border-gray-100 hover:shadow-md'}`}>
              <button 
                onClick={() => onTogglePoint(p.id)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center mr-6 transition ${p.isAnswered ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600'}`}
              >
                <i className="fas fa-check"></i>
              </button>
              <div className="flex-grow">
                <p className={`text-lg font-bold ${p.isAnswered ? 'line-through text-emerald-900' : 'text-gray-900'}`}>{p.text}</p>
                <p className="text-xs text-gray-400 font-medium mt-1">Added on {new Date(p.createdAt).toLocaleDateString()}</p>
              </div>
              {p.isAnswered && <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Answered!</span>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const YouthHubPage = ({ 
  user,
  testimonies,
  onAddTestimony
}: { 
  user: User;
  testimonies: Testimony[];
  onAddTestimony: (t: Omit<Testimony, 'id' | 'date' | 'userName'>) => void;
}) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'video' | 'audio'>('video');
  const [newUrl, setNewUrl] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTestimony({
      userId: user.id,
      title: newTitle,
      type: newType,
      url: newUrl,
      content: newContent
    });
    setIsUploadOpen(false);
    setNewTitle('');
    setNewUrl('');
    setNewContent('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <SectionHeader 
        title="Youth Group Hub" 
        subtitle="One big family. Share your walk with God, your testimonies, and inspire your peers globally." 
        videoUrl={POPPING_VIDEOS[0]}
      />

      <div className="flex justify-between items-center mb-10">
         <h3 className="text-2xl font-black text-gray-900">Latest Testimonies</h3>
         <button 
          onClick={() => setIsUploadOpen(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center space-x-2"
         >
           <i className="fas fa-clapperboard"></i>
           <span>Share Yours</span>
         </button>
      </div>

      {isUploadOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative">
              <button onClick={() => setIsUploadOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition">
                <i className="fas fa-times text-2xl"></i>
              </button>
              <h3 className="text-3xl font-black text-gray-900 mb-8">Post a Testimony</h3>
              <form onSubmit={handleUpload} className="space-y-4">
                 <input 
                  required 
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Title of your story" 
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none" 
                 />
                 <select 
                  value={newType}
                  onChange={e => setNewType(e.target.value as 'video' | 'audio')}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none"
                 >
                    <option value="video">Video Testimony</option>
                    <option value="audio">Audio/Podcast</option>
                 </select>
                 <input 
                  required 
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  placeholder="Video URL (YouTube/Vimeo) or Audio URL" 
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none" 
                 />
                 <textarea 
                  required 
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Write a brief summary..." 
                  className="w-full h-32 p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none resize-none"
                 />
                 <button className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl">Post to Hub</button>
              </form>
           </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonies.map(t => (
          <div key={t.id} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition group">
            <div className="aspect-video bg-black relative">
               {t.type === 'video' ? (
                 <iframe className="w-full h-full" src={t.url} frameBorder="0" allowFullScreen></iframe>
               ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-900 text-white p-6 text-center">
                    <i className="fas fa-volume-high text-4xl mb-4 text-indigo-400"></i>
                    <audio controls className="w-full mt-4 h-10 rounded-full" src={t.url}></audio>
                 </div>
               )}
            </div>
            <div className="p-8">
               <div className="flex items-center space-x-2 mb-4">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.userName}`} className="w-10 h-10 rounded-full border border-indigo-100" alt="user" />
                  <div>
                    <div className="font-black text-gray-900 text-sm">{t.userName}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(t.date).toLocaleDateString()}</div>
                  </div>
               </div>
               <h4 className="text-xl font-black text-gray-900 mb-2">{t.title}</h4>
               <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">{t.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const IntercessionPage = ({ settings, userPrayerPoints }: { settings: AppSettings, userPrayerPoints: PrayerPoint[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [customMusicUrl, setCustomMusicUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const items = [
    ...INTERCESSORY_SCRIPTURES.map(s => ({ id: s.id, type: 'scripture', text: s.text, ref: s.reference, theme: s.theme })),
    ...userPrayerPoints.filter(p => !p.isAnswered).map(p => ({ id: p.id, type: 'personal', text: p.text, ref: 'Your Prayer Point', theme: 'My Journal' }))
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (items.length > 0) {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }
    }, 8000);
    return () => clearInterval(timer);
  }, [items.length]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlayingMusic) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio error", e));
      }
      setIsPlayingMusic(!isPlayingMusic);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomMusicUrl(url);
      setIsPlayingMusic(false); // Reset playback state for new audio
      if (audioRef.current) audioRef.current.load();
    }
  };

  const currentItem = items[currentIndex];
  const activeAudioUrl = customMusicUrl || settings.prayerInstrumentalUrl;

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden relative">
      <audio ref={audioRef} src={activeAudioUrl} loop />
      
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl text-center space-y-12">
        <div className="space-y-2">
           <span className="bg-indigo-600/30 text-indigo-300 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-500/30">
             The War Room
           </span>
           <h2 className="text-4xl lg:text-5xl font-black text-white">Prayer & Proclamation</h2>
        </div>

        <div className="relative min-h-[350px] flex items-center justify-center px-6">
          {currentItem ? (
            <div key={currentItem.id} className="animate-fade-in space-y-8">
              <div className={`backdrop-blur-sm border px-4 py-2 rounded-lg inline-block font-bold uppercase text-xs tracking-widest ${currentItem.type === 'scripture' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                {currentItem.theme}
              </div>
              <p className="text-2xl lg:text-4xl font-serif italic leading-relaxed text-indigo-100 drop-shadow-lg max-w-2xl mx-auto">
                "{currentItem.text}"
              </p>
              <p className="text-xl font-bold text-indigo-400">— {currentItem.ref}</p>
            </div>
          ) : (
            <p className="text-gray-500 italic">Add items to your journal to see them here.</p>
          )}
        </div>

        <div className="flex flex-col items-center space-y-6">
          <div className="flex space-x-2">
            {items.map((_, i) => (
              <div key={i} className={`h-1.5 transition-all duration-500 rounded-full ${i === currentIndex ? 'w-8 bg-indigo-500' : 'w-2 bg-white/20'}`}></div>
            ))}
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
             <button 
                onClick={toggleMusic}
                className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-black transition-all transform active:scale-95 ${isPlayingMusic ? 'bg-indigo-600 shadow-lg shadow-indigo-600/50' : 'bg-white/10 hover:bg-white/20 border border-white/20'}`}
             >
                <i className={`fas ${isPlayingMusic ? 'fa-volume-up' : 'fa-volume-mute'} text-xl`}></i>
                <span>{isPlayingMusic ? 'Atmosphere On' : 'Activate Prayer Music'}</span>
             </button>
             
             <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-3 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 font-black transition"
             >
                <i className="fas fa-file-audio text-xl text-indigo-300"></i>
                <span>{customMusicUrl ? 'Custom Song Selected' : 'Choose Your Own Audio'}</span>
             </button>
             <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/*" className="hidden" />

             {customMusicUrl && (
               <button 
                onClick={() => { setCustomMusicUrl(null); setIsPlayingMusic(false); }}
                className="px-4 py-4 rounded-2xl bg-red-500/20 hover:bg-red-500/40 text-red-300 font-bold transition"
                title="Reset to default music"
               >
                 <i className="fas fa-undo"></i>
               </button>
             )}
          </div>
          <p className="text-xs text-gray-500 italic">Default music: Ebuka - I Will Pray</p>
        </div>
      </div>
    </div>
  );
};

// ... MusicPage, SermonsPage, StoriesPage, QuizzesPage, MotivationPage components ...

const MusicPage = ({ musicList }: { musicList: Music[] }) => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const simulateDownload = (id: string) => {
    setDownloading(id);
    setTimeout(() => {
      setDownloading(null);
      alert("Download Success! Your faith vibes are ready.");
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <SectionHeader title="Teen Music & Vibes" subtitle="Godly music with modern beats." videoUrl={POPPING_VIDEOS[1]} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {musicList.map(m => (
          <div key={m.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition group">
            <div className="relative aspect-square overflow-hidden">
               <img src={m.thumbnailUrl} alt={m.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
               <span className="absolute top-4 left-4 bg-indigo-600/90 text-white text-[10px] font-black uppercase px-2 py-1 rounded">{m.category}</span>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-lg text-gray-900 truncate">{m.title}</h3>
              <p className="text-gray-500 text-sm mb-6">{m.artist}</p>
              <button 
                onClick={() => simulateDownload(m.id)}
                disabled={!!downloading}
                className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-600 hover:text-white transition flex items-center justify-center"
              >
                {downloading === m.id ? 'Downloading...' : 'Download'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SermonsPage = ({ sermons }: { sermons: Sermon[] }) => (
  <div className="max-w-7xl mx-auto px-4 py-12">
    <SectionHeader title="Teen Sermons" subtitle="Watch, listen, and grow." videoUrl={POPPING_VIDEOS[2]} />
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {sermons.map(s => (
        <div key={s.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition">
          <div className="aspect-video bg-gray-200">
            <iframe className="w-full h-full" src={s.videoUrl} title={s.title} frameBorder="0" allowFullScreen></iframe>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-3">{s.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-3">{s.content}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const StoriesPage = ({ stories }: { stories: Story[] }) => (
  <div className="max-w-7xl mx-auto px-4 py-12">
    <SectionHeader title="Faith Stories" subtitle="Moving pictures that speak life." videoUrl={POPPING_VIDEOS[0]} />
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {stories.map(s => (
        <div key={s.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition">
          <div className="aspect-video bg-gray-200">
             <iframe className="w-full h-full" src={s.videoUrl} title={s.title} frameBorder="0" allowFullScreen></iframe>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">{s.type}</span>
            </div>
            <h3 className="text-xl font-bold mb-3">{s.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-3">{s.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MotivationPage = ({ user }: { user: User }) => {
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);
  const [motivation, setMotivation] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateMotivation(user.name, mood);
    setMotivation(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <SectionHeader 
        title="AI Motivation" 
        subtitle="Need a boost? Tell us how you're feeling and let the model inspire you through tailored wisdom." 
      />
      
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 mb-12">
        <h3 className="text-2xl font-black text-gray-900 mb-6">How's your spirit today?</h3>
        <div className="flex flex-wrap gap-3 mb-8">
          {['Joyful', 'Anxious', 'Tired', 'Seeking Direction', 'Grateful', 'Lonely'].map(m => (
            <button 
              key={m} 
              onClick={() => setMood(m)}
              className={`px-6 py-2 rounded-full font-bold transition ${mood === m ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
           <input 
            type="text" 
            value={mood}
            onChange={e => setMood(e.target.value)}
            placeholder="Or type how you feel..." 
            className="flex-grow p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-indigo-100 outline-none"
           />
           <button 
            onClick={handleGenerate}
            disabled={loading}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition disabled:opacity-50"
           >
             {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Get Inspired'}
           </button>
        </div>
      </div>

      {motivation && (
        <div className="bg-gradient-to-br from-indigo-50 to-white p-10 rounded-[2.5rem] border border-indigo-100 shadow-sm animate-fade-in relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <i className="fas fa-quote-right text-6xl text-indigo-600"></i>
           </div>
           <p className="text-2xl font-medium text-gray-800 leading-relaxed relative z-10 whitespace-pre-wrap">
              {motivation}
           </p>
        </div>
      )}
    </div>
  );
};

const LoginPage = ({ onLoginFinal, onRegisterFinal }: { onLoginFinal: (e: string, p: string, r: UserRole) => void, onRegisterFinal: (n: string, e: string, p: string, r: UserRole) => void }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [authStep, setAuthStep] = useState<'details' | 'role'>('details');

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 bg-gray-50">
      {authStep === 'details' ? (
        <div className="bg-white w-full max-w-md p-10 rounded-[2.5rem] shadow-2xl animate-fade-in">
          <h2 className="text-3xl font-black text-gray-900 mb-6">{isRegistering ? 'Join Us' : 'Welcome Back'}</h2>
          <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-8">
            <button type="button" onClick={() => setIsRegistering(false)} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${!isRegistering ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}>Login</button>
            <button type="button" onClick={() => setIsRegistering(true)} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${isRegistering ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}>Register</button>
          </div>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setAuthStep('role'); }}>
            {isRegistering && <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl" placeholder="Full Name" />}
            <input type="text" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl" placeholder="Email / Username" />
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl" placeholder="Password" />
            <button className="w-full py-4.5 bg-indigo-600 text-white font-black rounded-2xl">Continue</button>
          </form>
        </div>
      ) : (
        <div className="bg-white w-full max-w-lg p-12 rounded-[3rem] shadow-2xl animate-fade-in text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-8">Choose Access Type</h2>
          <div className="grid gap-6">
            <button onClick={() => isRegistering ? onRegisterFinal(name, email, pass, 'teen') : onLoginFinal(email, pass, 'teen')} className="p-8 rounded-[2rem] border-2 border-gray-100 bg-gray-50 hover:border-indigo-600 transition group text-left">
              <h4 className="text-2xl font-black text-gray-900 mb-1">Teen Portal</h4>
              <p className="text-gray-500 text-sm">Experience TeenFaith+ growth tracks.</p>
            </button>
            <button onClick={() => isRegistering ? onRegisterFinal(name, email, pass, 'admin') : onLoginFinal(email, pass, 'admin')} className="p-8 rounded-[2rem] border-2 border-gray-100 bg-gray-50 hover:border-indigo-600 transition group text-left">
              <h4 className="text-2xl font-black text-gray-900 mb-1">Admin Command</h4>
              <p className="text-gray-500 text-sm">Global site and content control.</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main App ---

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({ user: null, isAuthenticated: false });
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [prayerPoints, setPrayerPoints] = useState<PrayerPoint[]>([]);
  const [testimonies, setTestimonies] = useState<Testimony[]>(INITIAL_TESTIMONIES);
  const [settings, setSettings] = useState<AppSettings>({ prayerInstrumentalUrl: PRAYER_INSTRUMENTAL_URL });

  useEffect(() => {
    // Check for seeded default admin "Consi"
    const storedUsers = getStoredUsers();
    if (!storedUsers.find((u: any) => u.name === 'Consi')) {
      storedUsers.push({ id: 'admin_consi', name: 'Consi', email: 'Consi', password: '12345', role: 'admin' });
      setStoredUsers(storedUsers);
    }
    const storedUser = localStorage.getItem('teenfaith_user');
    if (storedUser) setAuthState({ user: JSON.parse(storedUser), isAuthenticated: true });

    const storedPoints = localStorage.getItem('teenfaith_prayer_points');
    if (storedPoints) setPrayerPoints(JSON.parse(storedPoints));

    const storedTestimonies = localStorage.getItem('teenfaith_hub_testimonies');
    if (storedTestimonies) setTestimonies(JSON.parse(storedTestimonies));

    const storedSettings = localStorage.getItem('teenfaith_settings');
    if (storedSettings) setSettings(JSON.parse(storedSettings));
  }, []);

  const handleLoginFinal = (email: string, pass: string, role: UserRole) => {
    const found = getStoredUsers().find((u: any) => (u.email === email || u.name === email) && u.password === pass);
    if (found) {
      const user = { id: found.id, name: found.name, email: found.email, role };
      setAuthState({ user, isAuthenticated: true });
      localStorage.setItem('teenfaith_user', JSON.stringify(user));
      setCurrentPage('home');
    } else alert("Invalid credentials.");
  };

  const handleRegisterFinal = (name: string, email: string, pass: string, role: UserRole) => {
    const users = getStoredUsers();
    if (users.some((u: any) => u.email === email)) return alert("User exists.");
    const newUser = { id: Math.random().toString(36).substr(2, 9), name, email, password: pass, role };
    users.push(newUser);
    setStoredUsers(users);
    const sessionUser = { id: newUser.id, name, email, role };
    setAuthState({ user: sessionUser, isAuthenticated: true });
    localStorage.setItem('teenfaith_user', JSON.stringify(sessionUser));
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setAuthState({ user: null, isAuthenticated: false });
    localStorage.removeItem('teenfaith_user');
    setCurrentPage('login');
  };

  const addPrayerPoint = (text: string) => {
    const newPoint = { id: Date.now().toString(), userId: authState.user!.id, text, createdAt: new Date().toISOString(), isAnswered: false };
    const updated = [...prayerPoints, newPoint];
    setPrayerPoints(updated);
    localStorage.setItem('teenfaith_prayer_points', JSON.stringify(updated));
  };

  const togglePrayerPoint = (id: string) => {
    const updated = prayerPoints.map(p => p.id === id ? { ...p, isAnswered: !p.isAnswered } : p);
    setPrayerPoints(updated);
    localStorage.setItem('teenfaith_prayer_points', JSON.stringify(updated));
  };

  const addTestimony = (t: Omit<Testimony, 'id' | 'date' | 'userName'>) => {
    const newT = { ...t, id: Date.now().toString(), userName: authState.user!.name, date: new Date().toISOString() };
    const updated = [newT, ...testimonies];
    setTestimonies(updated);
    localStorage.setItem('teenfaith_hub_testimonies', JSON.stringify(updated));
  };

  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('teenfaith_settings', JSON.stringify(newSettings));
    alert("Settings updated globally!");
  };

  const renderContent = () => {
    if (!authState.isAuthenticated) return <LoginPage onLoginFinal={handleLoginFinal} onRegisterFinal={handleRegisterFinal} />;
    switch (currentPage) {
      case 'home': return (
        <div className="space-y-12 pb-12">
          <header className="relative py-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl overflow-hidden shadow-2xl mx-4 mt-4 text-center text-white">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 animate-fade-in-up">Welcome, {authState.user?.name}!</h1>
            <p className="text-xl md:text-2xl font-light mb-10 opacity-90 max-w-2xl mx-auto px-4">Level up your spiritual walk with our global youth community hub and prayer journal.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => setCurrentPage('faith-hub')} className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold shadow-lg">Start Growth Track</button>
              <button onClick={() => setCurrentPage('youth-hub')} className="bg-indigo-900/40 backdrop-blur-md text-white border border-white/30 px-8 py-3 rounded-full font-bold">Visit Youth Hub</button>
            </div>
          </header>
          <section className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
            <div onClick={() => setCurrentPage('faith-hub')} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md cursor-pointer group">
              <i className="fas fa-book-open text-3xl text-indigo-500 mb-6 block"></i>
              <h3 className="text-xl font-bold mb-3">Bible Study Plans</h3>
              <p className="text-gray-600 text-sm">Graded study tracks for various faith levels.</p>
            </div>
            <div onClick={() => setCurrentPage('journal')} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md cursor-pointer group">
              <i className="fas fa-pen-nib text-3xl text-amber-500 mb-6 block"></i>
              <h3 className="text-xl font-bold mb-3">Prayer Journal</h3>
              <p className="text-gray-600 text-sm">Track your requests and answered prayers.</p>
            </div>
            <div onClick={() => setCurrentPage('youth-hub')} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md cursor-pointer group">
              <i className="fas fa-users text-3xl text-emerald-500 mb-6 block"></i>
              <h3 className="text-xl font-bold mb-3">Youth Hub</h3>
              <p className="text-gray-600 text-sm">Share testimonies & listen to peers.</p>
            </div>
          </section>
        </div>
      );
      case 'faith-hub': return <BibleStudyPage />;
      case 'journal': return <PrayerJournalPage user={authState.user!} points={prayerPoints} onAddPoint={addPrayerPoint} onTogglePoint={togglePrayerPoint} />;
      case 'youth-hub': return <YouthHubPage user={authState.user!} testimonies={testimonies} onAddTestimony={addTestimony} />;
      case 'intercession': return <IntercessionPage settings={settings} userPrayerPoints={prayerPoints.filter(p => p.userId === authState.user?.id)} />;
      case 'bible': return <BiblePage />;
      case 'sermons': return <SermonsPage sermons={INITIAL_SERMONS} />;
      case 'music': return <MusicPage musicList={INITIAL_MUSIC} />;
      case 'stories': return <StoriesPage stories={INITIAL_STORIES} />;
      case 'quizzes': return <div className="max-w-7xl mx-auto px-4 py-12"><SectionHeader title="Growth Quizzes" subtitle="Challenge your biblical knowledge." /></div>;
      case 'motivation': return <MotivationPage user={authState.user!} />;
      case 'admin': return (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <SectionHeader title="Admin HQ" subtitle="Manage site global settings and content." />
          <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm max-w-2xl">
            <h3 className="text-2xl font-black mb-6">Global Settings</h3>
            <div className="space-y-6">
               <div>
                  <label className="block text-xs font-black uppercase text-gray-400 mb-2">Prayer Room Instrumental URL</label>
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      defaultValue={settings.prayerInstrumentalUrl}
                      onBlur={(e) => updateSettings({ ...settings, prayerInstrumentalUrl: e.target.value })}
                      className="flex-grow p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100" 
                      placeholder="Enter Audio Link (MP3/OGG)"
                    />
                    <button className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-bold">Apply</button>
                  </div>
               </div>
               <div className="pt-6 border-t border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-4">Manual Content Management</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="p-4 bg-gray-50 rounded-2xl text-left hover:bg-indigo-50 border border-gray-100 font-bold transition">Add Sermon</button>
                    <button className="p-4 bg-gray-50 rounded-2xl text-left hover:bg-indigo-50 border border-gray-100 font-bold transition">Manage Hub</button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-inter bg-slate-50">
      {authState.isAuthenticated && <Navbar user={authState.user} onLogout={handleLogout} onNavigate={setCurrentPage} currentPage={currentPage} />}
      <main className="flex-grow">{renderContent()}</main>
      <footer className="bg-white border-t border-gray-100 py-12 text-center text-gray-400 text-sm">
        &copy; 2024 TeenFaith+. Global Hub for Bold Young Believers.
      </footer>
    </div>
  );
};

export default App;
