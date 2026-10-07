import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { NewsArticle } from '../types';
import { ArticleCard } from './ArticleCard';

interface CategorySectionProps {
  categoryTitle: string;
  categorySlug: string;
  articles: NewsArticle[];
  accentColor?: string;
  onOpenArticle: (id: string) => void;
  onViewAllCategory: (categoryName: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  categoryTitle,
  articles,
  onOpenArticle,
  onViewAllCategory
}) => {
  if (!articles || articles.length === 0) return null;

  const featured = articles[0];
  const supporting = articles.slice(1, 4);

  return (
    <section className="py-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-2 mb-5 border-b-2 border-red-700">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-red-700 inline-block"></span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              {categoryTitle}
            </h2>
          </div>

          <button
            onClick={() => onViewAllCategory(categoryTitle)}
            className="flex items-center gap-1 text-sm font-bold text-red-700 hover:text-red-900 hover:underline cursor-pointer group transition-colors"
          >
            <span>সব খবর দেখুন</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Layout: Left Featured Card (5 cols) + Right Supporting Grid (7 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Main Card */}
          <div className="md:col-span-5">
            <div
              onClick={() => onOpenArticle(featured.id)}
              className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col h-full"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 bg-red-700 text-white text-xs font-bold rounded">
                  {featured.category}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-red-700 transition-colors leading-snug line-clamp-2">
                    {featured.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                    {featured.summary}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-4 pt-2 border-t border-gray-100">
                  <span className="font-medium text-gray-700">
                    {featured.reporterName}
                  </span>
                  <span>{featured.publishTime || featured.publishDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Supporting Stories */}
          <div className="md:col-span-7 flex flex-col gap-3.5">
            {supporting.map(item => (
              <ArticleCard
                key={item.id}
                article={item}
                variant="horizontal"
                onClick={() => onOpenArticle(item.id)}
              />
            ))}

            {supporting.length === 0 && (
              <div className="p-6 bg-gray-50 rounded-lg text-center text-gray-500 text-sm">
                এই বিভাগে আরও সংবাদ প্রকাশের অপেক্ষায় রয়েছে।
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
