import React, { useState, useMemo, useEffect } from 'react';
import { 
  HashRouter, 
  Routes, 
  Route, 
  Link, 
  useParams, 
  useNavigate 
} from 'react-router-dom';
import { 
  Search, 
  Book, 
  ChevronRight, 
  ChevronDown, 
  ArrowLeft, 
  Share2, 
  Copy, 
  Bookmark, 
  Type, 
  Home
} from 'lucide-react';
import { acts } from './data';
import { flattenActSections } from './utils';
import { Act, Chapter, Schedule, Section } from './types';

// --- Components ---

// 1. Home Screen
const HomeScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Search Logic
  const filteredActs = useMemo(() => {
    if (!searchQuery.trim()) return acts;
    const lowerQuery = searchQuery.toLowerCase();
    
    // Simple filter: Check Act Name
    // Advanced: could check internal content, but for list view, act name is primary.
    // If we want global search, we would return a "Global Search Result" list instead of just filtering Acts.
    // Let's implement a filtered list of Acts first.
    return acts.filter(act => act.act_name.toLowerCase().includes(lowerQuery));
  }, [searchQuery]);

  // Global Search Results (if query exists)
  const globalSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const lowerQuery = searchQuery.toLowerCase();
    const results: { act: Act; actIndex: number; section: Section; context: string }[] = [];

    acts.forEach((act, actIndex) => {
      const flat = flattenActSections(act, actIndex);
      flat.forEach(item => {
        const inTitle = item.section.section_title?.toLowerCase().includes(lowerQuery);
        const inNum = item.section.section_number.toLowerCase().includes(lowerQuery);
        const inText = item.section.text.toLowerCase().includes(lowerQuery);

        if (inTitle || inNum || inText) {
          results.push({
            act,
            actIndex,
            section: item.section,
            context: inTitle ? 'Title' : inNum ? 'Section Number' : 'Text Content'
          });
        }
      });
    });
    return results;
  }, [searchQuery]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 shadow-md sticky top-0 z-10">
        <h1 className="text-xl font-bold mb-2">Legal Library Offline</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search acts, sections, or text..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-20">
        
        {searchQuery && globalSearchResults && globalSearchResults.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Global Search Results ({globalSearchResults.length})
            </h2>
            <div className="space-y-3">
              {globalSearchResults.map((res, idx) => (
                <Link 
                  key={`${res.act.act_name}-${res.section.section_number}-${idx}`}
                  to={`/act/${res.actIndex}/section/${encodeURIComponent(res.section.section_number)}`}
                  className="block bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:border-blue-300 transition-colors"
                >
                  <div className="text-xs text-blue-600 font-medium mb-1">{res.act.act_name}</div>
                  <div className="font-semibold text-gray-800">
                    Section {res.section.section_number}
                    {res.section.section_title && ` - ${res.section.section_title}`}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Found in: {res.context}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {!searchQuery && (
          <>
             <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Bare Acts</h2>
             <div className="grid gap-4">
               {filteredActs.map((act, index) => (
                 <Link
                   key={act.act_name}
                   to={`/act/${index}`}
                   className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors active:scale-[0.98]"
                 >
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                       <Book className="w-5 h-5" />
                     </div>
                     <div>
                       <h3 className="font-semibold text-gray-800 leading-tight">{act.act_name}</h3>
                       <p className="text-xs text-gray-500 mt-1">
                         {act.chapters ? `${act.chapters.length} Chapters` : 'Sections Only'}
                       </p>
                     </div>
                   </div>
                   <ChevronRight className="w-5 h-5 text-gray-400" />
                 </Link>
               ))}
             </div>
          </>
        )}

        {searchQuery && globalSearchResults?.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <p>No results found for "{searchQuery}"</p>
          </div>
        )}
      </main>
    </div>
  );
};

// 2. Act Detail Screen (Chapter List)
const ActDetailScreen: React.FC = () => {
  const { actId } = useParams<{ actId: string }>();
  const navigate = useNavigate();
  const actIndex = parseInt(actId || '0', 10);
  const act = acts[actIndex];

  // Accordion State: storing which chapter/schedule index is open
  // Format: "chapter-0", "schedule-0"
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);

  if (!act) return <div className="p-4">Act not found</div>;

  const toggleSection = (id: string) => {
    setOpenSectionId(openSectionId === id ? null : id);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 p-3 sticky top-0 z-10 flex items-center gap-3 shadow-sm">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-gray-900 truncate">{act.act_name}</h1>
          <p className="text-xs text-gray-500">Table of Contents</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {/* Render Chapters */}
          {act.chapters?.map((chapter, cIndex) => {
            const id = `chapter-${cIndex}`;
            const isOpen = openSectionId === id;
            return (
              <div key={id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(id)}
                  className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left"
                >
                  <div>
                    <div className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                      Chapter {chapter.chapter_number}
                    </div>
                    <div className="font-medium text-gray-800">{chapter.chapter_title}</div>
                    {chapter.section_range && (
                      <div className="text-xs text-gray-400 mt-1">Sections {chapter.section_range}</div>
                    )}
                  </div>
                  {isOpen ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                </button>
                
                {isOpen && (
                  <div className="bg-slate-50 border-t border-gray-100">
                    {chapter.sections.map((section) => (
                      <Link
                        key={section.section_number}
                        to={`/act/${actIndex}/section/${encodeURIComponent(section.section_number)}`}
                        className="block p-3 pl-6 border-b border-gray-100 last:border-0 hover:bg-slate-100 transition-colors"
                      >
                        <span className="font-bold text-gray-700 mr-2">Section {section.section_number}</span>
                        <span className="text-gray-600 text-sm">{section.section_title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Render Schedules */}
          {act.schedules?.map((schedule, sIndex) => {
            const id = `schedule-${sIndex}`;
            const isOpen = openSectionId === id;
            return (
              <div key={id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                 <button
                  onClick={() => toggleSection(id)}
                  className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left"
                >
                  <div>
                    <div className="text-xs font-bold text-purple-600 uppercase tracking-wide">
                      {schedule.schedule_number}
                    </div>
                    <div className="font-medium text-gray-800">{schedule.schedule_title}</div>
                  </div>
                  {isOpen ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                </button>
                {isOpen && (
                  <div className="bg-slate-50 border-t border-gray-100">
                    {schedule.sections.map((section) => (
                      <Link
                        key={section.section_number}
                        to={`/act/${actIndex}/section/${encodeURIComponent(section.section_number)}`}
                        className="block p-3 pl-6 border-b border-gray-100 last:border-0 hover:bg-slate-100 transition-colors"
                      >
                        <span className="font-bold text-gray-700 mr-2">Entry {section.section_number}</span>
                        <span className="text-gray-600 text-sm">{section.section_title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

           {/* Render Direct Sections (if Act has no chapters) */}
           {act.sections && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
                    Sections
                </div>
                {act.sections.map((section) => (
                    <Link
                    key={section.section_number}
                    to={`/act/${actIndex}/section/${encodeURIComponent(section.section_number)}`}
                    className="block p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                    >
                    <div className="font-bold text-gray-800 mb-1">Section {section.section_number}</div>
                    <div className="text-sm text-gray-600">{section.section_title}</div>
                    </Link>
                ))}
            </div>
           )}
        </div>
      </main>
    </div>
  );
};

// 3. Section Reading Screen
const SectionViewScreen: React.FC = () => {
  const { actId, sectionNum } = useParams<{ actId: string; sectionNum: string }>();
  const navigate = useNavigate();
  const actIndex = parseInt(actId || '0', 10);
  const act = acts[actIndex];
  
  // Font Size State
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Derive Data
  const flatSections = useMemo(() => act ? flattenActSections(act, actIndex) : [], [act, actIndex]);
  const currentIndex = flatSections.findIndex(
    s => s.section.section_number === decodeURIComponent(sectionNum || '')
  );
  
  const currentItem = flatSections[currentIndex];

  useEffect(() => {
    // Reset scroll on navigation
    window.scrollTo(0, 0);
  }, [sectionNum]);

  if (!act || !currentItem) return <div className="p-4">Section not found</div>;

  const { section, chapterTitle } = currentItem;

  // Navigation Handlers
  const handleNext = () => {
    if (currentIndex < flatSections.length - 1) {
      const nextSec = flatSections[currentIndex + 1];
      navigate(`/act/${actIndex}/section/${encodeURIComponent(nextSec.section.section_number)}`);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevSec = flatSections[currentIndex - 1];
      navigate(`/act/${actIndex}/section/${encodeURIComponent(prevSec.section.section_number)}`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${act.act_name} - Section ${section.section_number}`,
        text: section.text
      }).catch(console.error);
    } else {
      alert("Sharing not supported on this browser.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(section.text);
    alert("Copied to clipboard!");
  };

  // Text Formatter (Basic Markdown-ish handling for tables/newlines)
  // Converting '¹' to accessible span is good practice but for now we render as is.
  const formatText = (text: string) => {
    return text.split('\n\n').map((paragraph, idx) => {
      // Very basic table detection
      if (paragraph.includes('|')) {
         const rows = paragraph.split('\n').filter(r => r.trim() !== '');
         return (
             <div key={idx} className="my-4 overflow-x-auto border border-gray-300 rounded-lg">
                 <table className="min-w-full text-sm divide-y divide-gray-200">
                     <tbody className="bg-white divide-y divide-gray-200">
                     {rows.map((row, rIdx) => {
                         const cols = row.split('|').filter(c => c.trim() !== '');
                         if (row.includes('---')) return null; // skip separator row
                         return (
                             <tr key={rIdx} className={rIdx === 0 ? "bg-gray-100 font-bold" : ""}>
                                 {cols.map((col, cIdx) => (
                                     <td key={cIdx} className="px-4 py-2 whitespace-nowrap">{col}</td>
                                 ))}
                             </tr>
                         )
                     })}
                     </tbody>
                 </table>
             </div>
         )
      }
      return <p key={idx} className="mb-4 leading-relaxed">{paragraph}</p>;
    });
  };

  // Font size classes
  const fontClasses = {
    'sm': 'text-sm',
    'base': 'text-base',
    'lg': 'text-lg',
    'xl': 'text-xl'
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 p-2 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <button onClick={() => navigate(`/act/${actIndex}`)} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        
        <div className="flex gap-1">
           <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="p-2 hover:bg-gray-100 rounded-full">
             <Type className="w-5 h-5 text-gray-600" />
           </button>
           <button onClick={() => setIsBookmarked(!isBookmarked)} className="p-2 hover:bg-gray-100 rounded-full">
             <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />
           </button>
           <button onClick={handleCopy} className="p-2 hover:bg-gray-100 rounded-full">
             <Copy className="w-5 h-5 text-gray-600" />
           </button>
           <button onClick={handleShare} className="p-2 hover:bg-gray-100 rounded-full">
             <Share2 className="w-5 h-5 text-gray-600" />
           </button>
        </div>

        {/* Font Size Popup */}
        {isSettingsOpen && (
          <div className="absolute top-14 right-2 bg-white shadow-xl border border-gray-200 rounded-lg p-3 w-48 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-xs text-gray-500 mb-2 font-semibold">Text Size</p>
            <div className="flex justify-between bg-gray-100 rounded-lg p-1">
               {(['sm', 'base', 'lg', 'xl'] as const).map((s) => (
                 <button 
                  key={s}
                  onClick={() => setFontSize(s)}
                  className={`w-8 h-8 flex items-center justify-center rounded ${fontSize === s ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                 >
                   <span className={s === 'sm' ? 'text-xs' : s === 'base' ? 'text-sm' : s === 'lg' ? 'text-base' : 'text-lg'}>A</span>
                 </button>
               ))}
            </div>
          </div>
        )}
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto p-5 pb-24">
        {/* Breadcrumbs */}
        <div className="text-xs text-gray-500 mb-4 flex flex-wrap gap-1 items-center">
            <span className="truncate max-w-[150px]">{act.act_name}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="truncate max-w-[150px]">{chapterTitle}</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Section {section.section_number}
        </h1>
        {section.section_title && (
             <h2 className="text-lg font-semibold text-gray-700 mb-6 border-l-4 border-blue-500 pl-3">
                 {section.section_title}
             </h2>
        )}

        {/* The Text */}
        <div className={`text-gray-800 font-serif ${fontClasses[fontSize]}`}>
           {formatText(section.text)}
        </div>

        {/* Annotations / Explanations */}
        {(section.annotations || section.explanation) && (
            <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
                {section.explanation && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="text-sm font-bold text-blue-800 mb-1 flex items-center gap-2">
                             INFO & EXPLANATION
                        </h4>
                        <p className="text-sm text-blue-900">{section.explanation}</p>
                    </div>
                )}
                {section.annotations && section.annotations.length > 0 && (
                     <div className="text-sm text-gray-600">
                         <h4 className="font-bold text-gray-800 mb-2">Footnotes</h4>
                         <ul className="list-decimal pl-5 space-y-1">
                             {section.annotations.map(a => (
                                 <li key={a.id}><span className="font-medium">[{a.id}]</span> {a.detail}</li>
                             ))}
                         </ul>
                     </div>
                )}
            </div>
        )}
      </main>

      {/* Footer Navigation */}
      <div className="absolute bottom-0 w-full bg-white border-t border-gray-200 p-3 flex justify-between items-center safe-area-pb">
         <button 
           onClick={handlePrev} 
           disabled={currentIndex === 0}
           className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${currentIndex === 0 ? 'text-gray-300' : 'text-blue-600 hover:bg-blue-50'}`}
         >
             <ArrowLeft className="w-4 h-4" /> Previous
         </button>

         <span className="text-xs text-gray-400 font-mono">
            {currentIndex + 1} / {flatSections.length}
         </span>

         <button 
           onClick={handleNext}
           disabled={currentIndex === flatSections.length - 1}
           className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${currentIndex === flatSections.length - 1 ? 'text-gray-300' : 'text-blue-600 hover:bg-blue-50'}`}
         >
             Next <ChevronRight className="w-4 h-4" />
         </button>
      </div>
    </div>
  );
};

// --- Main App Shell ---

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/act/:actId" element={<ActDetailScreen />} />
        <Route path="/act/:actId/section/:sectionNum" element={<SectionViewScreen />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
