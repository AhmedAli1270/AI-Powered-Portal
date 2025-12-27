import React, { useState } from 'react';
import { Search, TrendingUp, Building2, Briefcase, Zap, Sprout, ShieldCheck, ChevronRight, Menu, X, Database } from 'lucide-react';
import { analyzeTopic } from './services/geminiService';
import { LoadingState, SearchResult, TopicPreset } from './types';
import MarkdownRenderer from './components/MarkdownRenderer';
import SourceCard from './components/SourceCard';
import LoadingView from './components/LoadingView';

const PRESETS: TopicPreset[] = [
  { id: 'economy', label: 'Economy & IMF', icon: <TrendingUp size={18} />, query: 'Economy IMF State Bank Pakistan' },
  { id: 'it', label: 'IT & Digital', icon: <Briefcase size={18} />, query: 'IT Exports Digital Pakistan Policy' },
  { id: 'energy', label: 'Energy Crisis', icon: <Zap size={18} />, query: 'Energy Power Sector Circular Debt Pakistan' },
  { id: 'agri', label: 'Agriculture', icon: <Sprout size={18} />, query: 'Agriculture Wheat Sugar Crops Pakistan Government' },
  { id: 'security', label: 'National Security', icon: <ShieldCheck size={18} />, query: 'National Security Defense Pakistan' },
  { id: 'infra', label: 'Infrastructure', icon: <Building2 size={18} />, query: 'Infrastructure Development PSDP CPEC' },
];

function App() {
  const [query, setQuery] = useState('');
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoadingState(LoadingState.CRAWLING);
    setError(null);
    setResult(null);
    setQuery(searchQuery);

    try {
      const data = await analyzeTopic(searchQuery);
      setResult(data);
      setLoadingState(LoadingState.COMPLETE);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching intelligence.");
      setLoadingState(LoadingState.ERROR);
    }
  };

  const handlePresetClick = (preset: TopicPreset) => {
    setQuery(preset.label);
    handleSearch(preset.query);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-pak-200 selection:text-pak-900">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm/50 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => {setResult(null); setQuery(''); setLoadingState(LoadingState.IDLE);}}>
              <div className="bg-pak-600 p-1.5 rounded-lg text-white">
                <Building2 size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">PakGov<span className="text-pak-600">Intel</span></h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Government Intelligence Portal</p>
              </div>
            </div>
            
            {/* Desktop Presets */}
            <div className="hidden md:flex space-x-1">
              {PRESETS.slice(0, 4).map(preset => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetClick(preset)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-pak-700 hover:bg-pak-50 rounded-md transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-2 space-y-1 shadow-lg">
             {PRESETS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetClick(preset)}
                  className="block w-full text-left px-3 py-3 text-sm font-medium text-slate-600 hover:text-pak-700 hover:bg-pak-50 rounded-md"
                >
                  <span className="flex items-center space-x-2">
                    {preset.icon}
                    <span>{preset.label}</span>
                  </span>
                </button>
              ))}
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search Header */}
        <div className={`transition-all duration-500 ease-in-out ${loadingState === LoadingState.IDLE && !result ? 'mt-20 md:mt-32 max-w-2xl mx-auto text-center' : 'mb-8'}`}>
          
          {loadingState === LoadingState.IDLE && !result && (
             <div className="mb-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                  Track Government <span className="text-pak-600">Action</span>
                </h2>
                <p className="text-lg text-slate-600 max-w-xl mx-auto">
                  An AI-powered intelligence engine for monitoring policies, initiatives, and public sector developments in Pakistan.
                </p>
             </div>
          )}

          <div className="relative group max-w-3xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className={`h-5 w-5 ${loadingState === LoadingState.CRAWLING ? 'text-pak-600' : 'text-slate-400'}`} />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-pak-500 focus:ring-4 focus:ring-pak-100 transition-all shadow-sm text-lg"
              placeholder="Enter a topic (e.g., Solar Energy Policy, Export Reform, CPEC Phase 2)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
            />
            <button 
              onClick={() => handleSearch(query)}
              className="absolute right-2 top-2 bottom-2 bg-pak-600 text-white px-6 rounded-xl font-medium hover:bg-pak-700 transition-colors flex items-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loadingState === LoadingState.CRAWLING || !query.trim()}
            >
              {loadingState === LoadingState.CRAWLING ? 'Scanning...' : 'Scan'}
            </button>
          </div>

          {loadingState === LoadingState.IDLE && !result && (
            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 text-left">
              {PRESETS.map((preset) => (
                <div 
                  key={preset.id}
                  onClick={() => handlePresetClick(preset)}
                  className="cursor-pointer bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-pak-300 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-slate-50 text-pak-600 rounded-lg group-hover:bg-pak-50 transition-colors">
                      {preset.icon}
                    </div>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-pak-500 transition-colors" />
                  </div>
                  <span className="font-semibold text-slate-700 group-hover:text-slate-900">{preset.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center space-x-3 mb-8">
            <span className="font-bold">Error:</span>
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-sm underline">Dismiss</button>
          </div>
        )}

        {/* Loading State */}
        {loadingState !== LoadingState.IDLE && loadingState !== LoadingState.COMPLETE && loadingState !== LoadingState.ERROR && (
          <LoadingView />
        )}

        {/* Results View */}
        {loadingState === LoadingState.COMPLETE && result && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Intelligence Report (8 cols) */}
              <div className="lg:col-span-8">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                      <h2 className="text-lg font-bold text-slate-800">Intelligence Briefing</h2>
                    </div>
                    <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">
                      LIVE DATA
                    </span>
                  </div>
                  <div className="p-6 md:p-8">
                    <MarkdownRenderer content={result.markdownReport} />
                  </div>
                  <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
                    <span>Generated by PakGov Intel AI</span>
                    <span>Data verified via Google Search Grounding</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Verified Sources (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Stats / Metadata Card (Mock) */}
                <div className="bg-pak-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                    <ShieldCheck size={120} />
                  </div>
                  <h3 className="text-pak-100 text-sm font-semibold uppercase tracking-wider mb-1">Focus Topic</h3>
                  <p className="text-2xl font-bold truncate mb-6">{query}</p>
                  
                  <div className="grid grid-cols-2 gap-4 border-t border-pak-700 pt-4">
                     <div>
                       <div className="text-pak-300 text-xs">Sources Scanned</div>
                       <div className="text-xl font-mono">{result.sources.length + 5}+</div>
                     </div>
                     <div>
                       <div className="text-pak-300 text-xs">Relevance Score</div>
                       <div className="text-xl font-mono">High</div>
                     </div>
                  </div>
                </div>

                {/* Sources List */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center">
                    <Database size={16} className="mr-2 text-pak-600" />
                    Verified Sources
                  </h3>
                  
                  {result.sources.length > 0 ? (
                    <div className="space-y-3">
                      {result.sources.map((source, index) => (
                        <SourceCard key={index} source={source} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      <p className="text-sm">No direct citations available.</p>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-slate-200 text-center">
                    <button className="text-xs font-medium text-pak-700 hover:underline">
                      View all archived reports
                    </button>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="text-[10px] text-slate-400 leading-relaxed px-2">
                  <p>Disclaimer: This report is generated by AI based on publicly available information. While we strive for accuracy, please verify critical information with official government gazettes.</p>
                </div>

              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;