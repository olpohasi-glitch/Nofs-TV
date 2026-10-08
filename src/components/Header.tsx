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
  MapPin
} from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { getCurrentBengaliDate } from '../utils/bengali';
import { useSylhetWeather } from '../utils/useSylhetWeather';
import { PublicView, NOFS_TV_LOGO_URL, NOFS_TV_LOGO_REMOTE_URL } from '../types';

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
  const { categories, breakingNews, settings, isAdminLoggedIn } = useNews();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const bengaliDate = getCurrentBengaliDate();
  const sylhetWeather = useSylhetWeather();

  const activeBreaking = breakingNews.filter(b => b.isActive);

  const mainNavItems = [
    { name: 'হোম', id: 'home', action: onNavigateHome },
    { name: 'সর্বশেষ', id: 'latest', action: () => onSelectCategory('সর্বশেষ') },
    ...categories.map(cat => ({
      name: cat.name,
      id: cat.name,
      action: () => onSelectCategory(cat.name)
    }))
  ];

  return (
    <header className="w-full bg-white border-b border-gray-200">
      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Bengali Date | Location | Live Temperature | Founder (small & elegant) */}
          <div className="flex items-center space-x-2.5 flex-wrap">
            <span className="font-medium text-slate-200">
              {bengaliDate.fullDateString}
            </span>

            <span className="text-slate-600">|</span>

            {/* Sylhet Live Weather */}
            <div className="flex items-center text-amber-400 gap-1 font-medium">
              <MapPin className="w-3 h-3 text-red-400" />
              <span className="text-slate-200">সিলেট</span>
              <span className="text-slate-500">|</span>
              <CloudSun className="w-3.5 h-3.5 text-amber-400 ml-0.5" />
              <span className="text-amber-300" title={`সিলেটের বর্তমান আবহাওয়া: ${sylhetWeather.conditionText}`}>
                {sylhetWeather.temperatureText}
              </span>
            </div>

            <span className="hidden lg:inline-block text-slate-600">|</span>

            {/* Small tasteful founder credit */}
            <span className="hidden lg:inline-block text-slate-400 text-[11px]">
              প্রতিষ্ঠাতা ও প্রকাশক: <strong className="text-slate-200 font-semibold">{settings.founderName}</strong>
            </span>
          </div>

          {/* Right utility links & social */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenEPaper}
              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Newspaper className="w-3.5 h-3.5 text-red-500" />
              <span>ই-পেপার</span>
            </button>

            <span className="text-slate-600">|</span>

            {/* Social Icons */}
            <div className="flex items-center space-x-1.5">
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                title="Facebook"
                className="w-5 h-5 rounded-full bg-slate-800 hover:bg-blue-600 flex items-center justify-center text-white transition-colors text-[10px] font-bold"
              >
                f
              </a>
              <a
                href={settings.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                title="YouTube"
                className="w-5 h-5 rounded-full bg-slate-800 hover:bg-red-600 flex items-center justify-center text-white transition-colors text-[10px] font-bold"
              >
                ▶
              </a>
              <a
                href={settings.tiktokUrl}
                target="_blank"
                rel="noreferrer"
                title="TikTok"
                className="w-5 h-5 rounded-full bg-slate-800 hover:bg-neutral-700 flex items-center justify-center text-white transition-colors text-[10px] font-bold"
              >
                ♪
              </a>
            </div>

            <span className="text-slate-600">|</span>

            {/* Admin shortcut */}
            <button
              onClick={onOpenAdminLogin}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-red-700 text-slate-200 hover:text-white transition-all text-xs font-medium cursor-pointer"
              title="অ্যাডমিন ড্যাশবোর্ড"
            >
              <Shield className="w-3 h-3 text-red-400" />
              <span>{isAdminLoggedIn ? 'অ্যাডমিন ড্যাশবোর্ড' : 'অ্যাডমিন লগইন'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Logo & Brand Banner */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-5 flex items-center justify-between">
        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="মোবাইল মেনু খুলুন"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo: Official NOFS TV Logo Image */}
        <div
          onClick={onNavigateHome}
          className="cursor-pointer flex items-center select-none group py-1"
          title="NOFS TV - বাংলা অনলাইন নিউজ পোর্টাল"
        >
          <img
            src={settings.logoUrl || NOFS_TV_LOGO_URL}
            alt="NOFS TV"
            referrerPolicy="no-referrer"
            onError={e => {
              (e.currentTarget as HTMLImageElement).src = NOFS_TV_LOGO_REMOTE_URL;
            }}
            className="h-20 sm:h-24 md:h-28 w-auto max-w-[220px] sm:max-w-[280px] md:max-w-[320px] object-contain drop-shadow-xs transition-transform duration-200 group-hover:scale-[1.02]"
          />
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-3">
          {/* Live broadcast button */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 font-bold text-xs">
            <Radio className="w-4 h-4 text-red-600 animate-pulse" />
            <span>লাইভ টিভি</span>
          </div>

          {/* Search Trigger Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors text-sm font-medium cursor-pointer"
            title="সংবাদ খুঁজুন"
          >
            <Search className="w-4 h-4 text-red-600" />
            <span className="hidden md:inline">সংবাদ খুঁজুন...</span>
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
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <img
              src={settings.logoUrl || NOFS_TV_LOGO_URL}
              alt="NOFS TV"
              referrerPolicy="no-referrer"
              onError={e => {
                (e.currentTarget as HTMLImageElement).src = NOFS_TV_LOGO_REMOTE_URL;
              }}
              className="h-14 w-auto object-contain bg-white/5 p-1 rounded"
            />
            <span className="text-xs text-slate-300 font-medium">বাংলা অনলাইন নিউজ পোর্টাল</span>
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
              className="text-red-400 hover:text-white font-semibold cursor-pointer"
            >
              অ্যাডমিন পোর্টাল →
            </button>
          </div>
        </div>
      )}

      {/* BREAKING NEWS Ticker */}
      <div className="bg-red-50 border-b border-red-200 py-1.5 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          {/* Badge */}
          <div className="shrink-0 flex items-center gap-1.5 bg-red-700 text-white text-xs font-bold px-2.5 py-1 rounded shadow-xs uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>ব্রেকিং নিউজ</span>
          </div>

          {/* Marquee Ticker */}
          <div className="overflow-hidden relative flex-1 text-sm text-red-950 font-medium">
            <div className="animate-ticker inline-block whitespace-nowrap">
              {activeBreaking.length > 0 ? (
                activeBreaking.map((item, idx) => (
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
                ))
              ) : (
                <span>
                  • ব্রেকিং নিউজ: সর্বশেষ গুরুত্বপূর্ণ সংবাদ জানতে NOFS TV-এর
                  সঙ্গে থাকুন।
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
