import React from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { ArticleCard } from './ArticleCard';
import { toBengaliNumber } from '../utils/bengali';

interface CategoryArchivePageProps {
  categoryName: string;
  onOpenArticle: (id: string) => void;
  onNavigateHome: () => void;
  onSelectCategory: (cat: string) => void;
}

export const CategoryArchivePage: React.FC<CategoryArchivePageProps> = ({
  categoryName,
  onOpenArticle,
  onNavigateHome,
  onSelectCategory
}) => {
  const { news, categories } = useNews();

  const isLatest = categoryName === 'সর্বশেষ';

  const categoryObj = categories.find(c => c.name === categoryName);

  const publishedNews = news.filter(n => n.status === 'published');

  const filteredNews = isLatest
    ? [...publishedNews].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : publishedNews.filter(n => n.category === categoryName);

  const leadStory = filteredNews[0];
  const remainingStories = filteredNews.slice(1);

  return (
    <div className="py-8 bg-gray-50 min-h-[75vh]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 mb-6">
          <button
            onClick={onNavigateHome}
            className="hover:text-red-700 cursor-pointer"
          >
            হোম
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-red-700">{categoryName}</span>
        </nav>

        {/* Category Header Banner */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="w-3 h-8 bg-red-700 inline-block rounded-xs"></span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {categoryName}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {categoryObj?.description ||
                  `NOFS TV-এর ${categoryName} বিভাগের সকল সর্বশেষ ও গুরুত্বপূর্ণ সংবাদ`}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>
              মোট সংবাদ: <strong className="text-red-700">{toBengaliNumber(filteredNews.length)}</strong> টি
            </span>
          </div>
        </div>

        {/* Lead Story if available */}
        {leadStory && (
          <div className="mb-8">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
              বিভাগের প্রধান সংবাদ
            </h2>
            <ArticleCard
              article={leadStory}
              variant="large"
              onClick={() => onOpenArticle(leadStory.id)}
              onSelectCategory={onSelectCategory}
            />
          </div>
        )}

        {/* Remaining Stories Grid */}
        {remainingStories.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
              অন্যান্য সংবাদ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {remainingStories.map(item => (
                <ArticleCard
                  key={item.id}
                  article={item}
                  variant="medium"
                  onClick={() => onOpenArticle(item.id)}
                  onSelectCategory={onSelectCategory}
                />
              ))}
            </div>
          </div>
        )}

        {filteredNews.length === 0 && (
          <div className="bg-white p-12 text-center rounded-xl border border-gray-200">
            <p className="text-base text-gray-600 font-medium">
              এই বিভাগে বর্তমানে কোনো সংবাদ নেই।
            </p>
            <button
              onClick={onNavigateHome}
              className="mt-4 px-4 py-2 bg-red-700 text-white font-bold text-xs rounded hover:bg-red-800 transition-colors cursor-pointer"
            >
              হোমপেজে ফিরুন
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
