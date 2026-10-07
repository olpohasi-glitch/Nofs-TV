import React, { useState, useMemo } from 'react';
import { Search, Filter, X, Calendar, User, ArrowLeft } from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { ArticleCard } from './ArticleCard';
import { toBengaliNumber } from '../utils/bengali';

interface SearchSystemProps {
  initialQuery?: string;
  onOpenArticle: (id: string) => void;
  onClose: () => void;
  onSelectCategory: (cat: string) => void;
}

export const SearchSystem: React.FC<SearchSystemProps> = ({
  initialQuery = '',
  onOpenArticle,
  onClose,
  onSelectCategory
}) => {
  const { news, categories, reporters } = useNews();
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [selectedRep, setSelectedRep] = useState<string>('all');

  const filteredNews = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return news.filter(item => {
      // Category filter
      if (selectedCat !== 'all' && item.category !== selectedCat) {
        return false;
      }
      // Reporter filter
      if (selectedRep !== 'all' && item.reporterName !== selectedRep) {
        return false;
      }

      if (!q) return true;

      // Handle brand & regional alias intents
      const isBrandQuery =
        q.includes('nofs') ||
        q.includes('নফস') ||
        q.includes('বাংলা অনলাইন নিউজ');
      const isSylhetQuery =
        q.includes('সিলেট') ||
        q.includes('sylhet');

      if (isBrandQuery) {
        // Return articles by founder or key editorial reports
        return true;
      }

      if (isSylhetQuery && (item.category === 'সিলেট' || item.title.includes('সিলেট') || item.content.includes('সিলেট') || item.content.includes('সুরমা'))) {
        return true;
      }

      const titleMatch = item.title.toLowerCase().includes(q);
      const subtitleMatch = item.subtitle?.toLowerCase().includes(q);
      const summaryMatch = item.summary.toLowerCase().includes(q);
      const contentMatch = item.content.toLowerCase().includes(q);
      const categoryMatch = item.category.toLowerCase().includes(q);
      const reporterMatch = item.reporterName.toLowerCase().includes(q);
      const tagsMatch = item.tags?.some(tag => tag.toLowerCase().includes(q));

      return (
        titleMatch ||
        subtitleMatch ||
        summaryMatch ||
        contentMatch ||
        categoryMatch ||
        reporterMatch ||
        tagsMatch
      );
    });
  }, [news, searchTerm, selectedCat, selectedRep]);

  return (
    <div className="py-8 bg-gray-50 min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Header & Back Button */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
              title="পিছনে যান"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                সংবাদ অনুসন্ধান (Search)
              </h1>
              <p className="text-xs text-gray-500">
                শিরোনাম, ক্যাটাগরি, প্রতিবেদক অথবা প্রাসঙ্গিক কি-ওয়ার্ড দিয়ে খুঁজুন
              </p>
            </div>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="relative mb-4">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="সংবাদের শিরোনাম বা কি-ওয়ার্ড লিখুন (যেমন: বাজেট, সিলেট, ক্রিকেট, প্রযুক্তি)..."
              className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-red-600 focus:bg-white transition-all"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Category Filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                ক্যাটাগরি ফিল্টার:
              </label>
              <select
                value={selectedCat}
                onChange={e => setSelectedCat(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-red-600"
              >
                <option value="all">সকল ক্যাটাগরি</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Reporter Filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                প্রতিবেদক ফিল্টার:
              </label>
              <select
                value={selectedRep}
                onChange={e => setSelectedRep(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-red-600"
              >
                <option value="all">সকল প্রতিবেদক</option>
                {reporters.map(rep => (
                  <option key={rep.id} value={rep.name}>
                    {rep.name} ({rep.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filter Button */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCat('all');
                  setSelectedRep('all');
                }}
                className="w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-md transition-colors cursor-pointer"
              >
                ফিল্টার রিসেট
              </button>
            </div>
          </div>
        </div>

        {/* Results Count Bar */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-gray-700">
            অনুসন্ধানের ফলাফল:{' '}
            <span className="text-red-700 font-bold">
              {toBengaliNumber(filteredNews.length)} টি সংবাদ পাওয়া গেছে
            </span>
          </p>
        </div>

        {/* Results Grid */}
        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNews.map(item => (
              <ArticleCard
                key={item.id}
                article={item}
                variant="medium"
                onClick={() => onOpenArticle(item.id)}
                onSelectCategory={onSelectCategory}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-xl border border-gray-200">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">
              কোনো সংবাদ পাওয়া যায়নি
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              অন্য কোনো শব্দ বা কি-ওয়ার্ড দিয়ে পুনরায় চেষ্টা করুন।
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
