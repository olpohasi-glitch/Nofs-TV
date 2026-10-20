import React, { useState } from 'react';
import {
  Search,
  Menu,
  X,
  Radio,
  Newspaper,
  ChevronRight,
  Shield,
  CloudSun,
  Flame,
  MapPin,
  Calendar,
  Lock
} from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { getCurrentBengaliDate } from '../utils/bengali';
import { useSylhetWeather } from '../utils/useSylhetWeather';
import { PublicView, NOFS_TV_LOGO_URL } from '../types';
import { isDemoArticle } from '../data/initialData';

interface HeaderProps {
  currentView: PublicView;
  selectedCategory: string | null;
  onNavigateHome: () => void;
  onSelectCategory: (categoryName: string) => void;
  onOpenSearch: () => void;
  onOpenArticle: (articleId: string) => void;
  onOpenAdminLogin: () => void;
  onOpenEPaper: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  selectedCategory,
  onNavigateHome,
  onSelectCategory,
  onOpenSearch,
  onOpenArticle,
  onOpenAdminLogin,
  onOpenEPaper
}) => {
  const { news, categories, breakingNews, settings, isAdminLoggedIn } = useNews();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const bengaliDate = getCurrentBengaliDate();
  const sylhetWeather = useSylhetWeather();

  // Strict Real Breaking News: ONLY published articles where isBreaking === true
  const realPublishedBreaking = news
    .filter(n => n.status === 'published' && n.isBreaking && !isDemoArticle(n))
    .map(n => ({
      id: `art-break-${n.id}`,
      text: n.title,
      articleId: n.id,
      isActive: true,
      createdAt: n.createdAt
    }));

  const activeBreaking = realPublishedBreaking.length > 0
    ? realPublishedBreaking
    : breakingNews.filter(b => b.isActive);

  // Exact requested categories order:
  // শীর্ষ সংবাদ | সর্বশেষ | সিলেট | জাতীয় | রাজনীতি | আন্তর্জাতিক | খেলাধুলা | বিনোদন | প্রযুক্তি | শিক্ষা | অর্থনীতি | লাইফস্টাইল
  const mainNavItems = [
    { name: 'শীর্ষ সংবাদ', id: 'home', action: onNavigateHome },
    { name: 'সর্বশেষ', id: 'latest', action: () => onSelectCategory('সর্বশেষ') },
    ...categories.map(cat => ({
      name: cat.name,
      id: cat.name,
      action: () => onSelectCategory(cat.name)
    }))
  ];

  return (
    <header className="w-full bg-white border-b border-gray-200">
      {/* 8. TOP INFORMATION BAR */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-3 sm:px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Left: Bangladesh Date + English Date + Bengali Era + Sylhet Weather */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-center md:justify-start">
            {/* Bengali Gregorian Date (শনিবার, ১৭ অক্টোবর ২০২৬) */}
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-medium text-white">
              <Calendar className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="font-bengali-num text-[13px] sm:text-xs font-bold text-white tracking-wide leading-normal">
                {bengaliDate.gregorianWithDay}
              </span>
            </span>

            <span className="text-slate-600 hidden sm:inline">•</span>

            {/* English Date starting with Saturday (Saturday, 17 October 2026) */}
            <span className="inline-flex items-center gap-1 whitespace-nowrap font-sans text-[11px] sm:text-xs font-semibold text-slate-100 bg-slate-800/90 px-2 py-0.5 rounded border border-slate-700/80">
              <span>{bengaliDate.englishWithDay}</span>
            </span>

            <span className="text-slate-600 hidden sm:inline">•</span>

            {/* Official Bengali Era (বঙ্গাব্দ) Badge */}
            <span className="inline-flex items-center gap-1 whitespace-nowrap text-amber-300 font-semibold bg-slate-800/95 px-2.5 py-0.5 rounded text-xs border border-slate-700 shadow-xs tracking-wide leading-normal">
              <span className="font-bengali-num text-[12px] sm:text-xs text-amber-300 font-semibold">
                {bengaliDate.bengaliEra}
              </span>
            </span>

            <span className="text-slate-600 hidden md:inline">•</span>

            {/* Sylhet Live Weather */}
            <div className="inline-flex items-center text-amber-400 gap-1.5 font-medium whitespace-nowrap">
              <MapPin className="w-3 h-3 text-red-400 shrink-0" />
              <span className="text-slate-200 font-medium">সিলেট</span>
              <span className="text-slate-500">•</span>
              <CloudSun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span
                className="text-amber-300 font-semibold font-bengali-num text-[13px] sm:text-xs"
                title={`সিলেটের বর্তমান আবহাওয়া: ${sylhetWeather.conditionText}`}
              >
                {sylhetWeather.temperatureText}
              </span>
            </div>
          </div>

          {/* Right: Founder & Live TV */}
          <div className="hidden lg:flex items-center gap-3 shrink-0 text-slate-300 text-[11px]">
            <span className="text-slate-400">
              প্রতিষ্ঠাতা ও প্রকাশক: <strong className="text-slate-200 font-semibold">{settings.founderName}</strong>
            </span>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-950/80 text-red-400 font-bold border border-red-900/60">
              <Radio className="w-3 h-3 text-red-500 animate-pulse" />
              <span>লাইভ টিভি</span>
            </div>
          </div>
        </div>
      </div>

      {/* 9. MAIN HEADER: Logo | Menu | Search | E-paper | Facebook | YouTube | Admin Login */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 sm:py-4 flex items-center justify-between gap-4">
        {/* Left: Mobile menu toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="মেনু খুলুন"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Official NOFS TV Logo */}
          <div
            onClick={onNavigateHome}
            className="cursor-pointer flex items-center select-none group py-1"
            title="NOFS TV - সত্যের সন্ধানে, মানুষের পাশে"
          >
            <img
              src={settings.logoUrl || NOFS_TV_LOGO_URL}
              alt="NOFS TV"
              referrerPolicy="no-referrer"
              onError={e => {
                (e.currentTarget as HTMLImageElement).src = NOFS_TV_LOGO_URL;
              }}
              className="h-16 sm:h-20 md:h-24 w-auto max-w-[200px] sm:max-w-[260px] md:max-w-[300px] object-contain drop-shadow-xs transition-transform duration-200 group-hover:scale-[1.01]"
            />
          </div>
        </div>

        {/* Right Header Controls: E-paper | Social (Facebook, YouTube) | Search | Admin Login */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* ই-পেপার */}
          <button
            onClick={onOpenEPaper}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md border border-gray-200 hover:border-red-600 hover:text-red-700 text-gray-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer bg-white shadow-xs"
            title="দৈনিক ই-পেপার"
          >
            <Newspaper className="w-4 h-4 text-red-600" />
            <span className="hidden sm:inline">ই-পেপার</span>
          </button>

          {/* Facebook & YouTube */}
          <div className="hidden sm:flex items-center space-x-1.5">
            <a
              href={settings.facebookUrl}
              target="_blank"
              rel="noreferrer"
              title="Facebook"
              className="w-7 h-7 rounded-md bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white transition-colors text-xs font-bold shadow-xs"
            >
              f
            </a>
            <a
              href={settings.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              title="YouTube"
              className="w-7 h-7 rounded-md bg-red-600 hover:bg-red-700 flex items-center justify-center text-white transition-colors text-xs font-bold shadow-xs"
            >
              ▶
            </a>
          </div>

          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors text-xs sm:text-sm font-medium cursor-pointer"
            title="সংবাদ খুঁজুন"
          >
            <Search className="w-4 h-4 text-red-600" />
            <span className="hidden md:inline">সংবাদ খুঁজুন</span>
          </button>

          {/* Admin Login: Only entry point to the secure admin area */}
          <button
            onClick={onOpenAdminLogin}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs whitespace-nowrap ${
              isAdminLoggedIn
                ? 'bg-red-700 hover:bg-red-800 text-white'
                : 'bg-slate-900 hover:bg-red-700 text-white'
            }`}
            title={isAdminLoggedIn ? 'অ্যাডমিন ড্যাশবোর্ড' : 'অ্যাডমিন লগইন'}
          >
            {isAdminLoggedIn ? (
              <>
                <Shield className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">ড্যাশবোর্ড</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>লগইন</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Sticky Navigation Menu */}
      <nav className="sticky top-0 z-40 bg-red-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="hidden lg:flex items-center space-x-1 overflow-x-auto py-0.5 scrollbar-none">
            {mainNavItems.map(item => {
              const isActive =
                item.id === 'home'
                  ? currentView === 'home' && !selectedCategory
                  : selectedCategory === item.name;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2.5 text-[15px] font-semibold transition-all whitespace-nowrap cursor-pointer border-b-2 ${
                    isActive
                      ? 'bg-red-800 text-white border-amber-400'
                      : 'border-transparent text-white hover:bg-red-800 hover:text-amber-200'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* Quick search icon on right of sticky nav */}
          <div className="hidden lg:flex items-center ml-auto pl-4">
            <button
              onClick={onOpenSearch}
              className="p-2 text-white hover:text-amber-300 transition-colors cursor-pointer"
              title="সংবাদ অনুসন্ধান"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Current Section Title */}
          <div className="lg:hidden py-2 text-sm font-semibold flex items-center justify-between w-full">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              {selectedCategory ? selectedCategory : 'শীর্ষ সংবাদ'}
            </span>
            <button
              onClick={onOpenSearch}
              className="p-1.5 text-white hover:text-amber-300"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 text-white border-b border-slate-700 px-4 py-4 transition-all">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 mb-3 border-b border-slate-800 gap-2">
            <div className="flex items-center gap-2.5">
              <img
                src={settings.logoUrl || NOFS_TV_LOGO_URL}
                alt="NOFS TV"
                referrerPolicy="no-referrer"
                onError={e => {
                  (e.currentTarget as HTMLImageElement).src = NOFS_TV_LOGO_URL;
                }}
                className="h-12 w-auto object-contain bg-white/5 p-1 rounded"
              />
              <span className="text-xs text-slate-300 font-medium">বাংলা অনলাইন নিউজ পোর্টাল</span>
            </div>
            <div className="text-left sm:text-right text-xs">
              <div className="font-bold text-white font-bengali-num">{bengaliDate.gregorianWithDay}</div>
              <div className="text-[11px] text-slate-300 font-sans font-medium">{bengaliDate.englishWithDay}</div>
              <div className="text-[11px] text-amber-400 font-semibold font-bengali-num">{bengaliDate.bengaliEra}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm font-medium mb-4">
            {mainNavItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  item.action();
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded bg-slate-800 hover:bg-red-700 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>{item.name}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <span>প্রতিষ্ঠাতা: {settings.founderName}</span>
            <button
              onClick={() => {
                onOpenAdminLogin();
                setMobileMenuOpen(false);
              }}
              className="text-amber-400 hover:text-white font-semibold cursor-pointer flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAdminLoggedIn ? 'অ্যাডমিন ড্যাশবোর্ড →' : 'অ্যাডমিন লগইন →'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 11. BREAKING NEWS BAR */}
      <div className="bg-red-50 border-b border-red-200 py-1.5 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          {/* Badge */}
          <div className="shrink-0 flex items-center gap-1.5 bg-red-700 text-white text-xs font-bold px-2.5 py-1 rounded shadow-xs uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>ব্রেকিং নিউজ</span>
          </div>

          {/* Marquee Ticker or Clean Empty State */}
          <div className="overflow-hidden relative flex-1 text-sm font-medium">
            {activeBreaking.length > 0 ? (
              <div className="animate-ticker inline-block whitespace-nowrap text-red-950">
                {activeBreaking.map((item, idx) => (
                  <span
                    key={item.id}
                    onClick={() => {
                      if (item.articleId) {
                        onOpenArticle(item.articleId);
                      }
                    }}
                    className={`inline-block mr-12 hover:text-red-700 hover:underline cursor-pointer ${
                      idx === 0 ? 'font-semibold' : ''
                    }`}
                  >
                    • {item.text}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-slate-500 font-normal italic">
                এই মুহূর্তে কোনো ব্রেকিং নিউজ নেই।
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
