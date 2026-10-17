import React, { useState } from 'react';
import { Flame, TrendingUp, Clock, ChevronRight, Newspaper, Radio, Sparkles } from 'lucide-react';
import { NewsArticle } from '../types';
import { ArticleCard } from './ArticleCard';
import { toBengaliNumber } from '../utils/bengali';

interface HeroSectionProps {
  articles: NewsArticle[];
  onOpenArticle: (id: string) => void;
  onSelectCategory: (cat: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  articles,
  onOpenArticle,
  onSelectCategory
}) => {
  const [activeTab, setActiveTab] = useState<'latest' | 'popular'>('latest');

  // EMPTY STATE: If no published news exists in the system
  if (!articles || articles.length === 0) {
    return (
      <section className="py-12 border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 flex items-center justify-center shadow-xs">
            <Newspaper className="w-8 h-8" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 mb-3">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            NOFS TV ডিজিটাল নিউজরুম
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
            এই মুহূর্তে কোনো প্রকাশিত সংবাদ নেই।
          </h2>

          <p className="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed mb-6">
            NOFS TV নিউজরুম থেকে নতুন সংবাদ ও বুলেটিন প্রকাশের সাথে সাথে এখানে সরাসরি আপডেট হবে। বস্তুনিষ্ঠ সংবাদ ও তথ্যের সঙ্গে থাকুন।
          </p>

          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-gray-400 font-medium mr-2">বিভাগসমূহ:</span>
            {['জাতীয়', 'রাজনীতি', 'সিলেট', 'আন্তর্জাতিক', 'খেলাধুলা', 'অর্থনীতি', 'প্রযুক্তি'].map(cat => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className="px-3 py-1 bg-gray-50 hover:bg-red-50 hover:text-red-700 border border-gray-200 text-xs font-semibold text-gray-700 rounded-full transition-colors cursor-pointer"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // STRICT FEATURED NEWS RULE:
  // Only an article with isFeatured === true can be the Lead Story.
  // Never automatically make the first article or a random article Featured.
  const featuredStory = articles.find(a => a.isFeatured);
  const supportingStories = featuredStory
    ? articles.filter(a => a.id !== featuredStory.id).slice(0, 3)
    : articles.slice(0, 4);

  // Latest list
  const latestList = [...articles].slice(0, 6);
  // Popular list sorted by views
  const popularList = [...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6);

  return (
    <section className="py-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Top Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-red-700">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-red-700 inline-block"></span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              শীর্ষ ও প্রধান সংবাদ
            </h2>
          </div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            NOFS TV ডিজিটাল ডেস্ক
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Column (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {featuredStory ? (
              <>
                {/* Primary Large Lead Story: ONLY when explicitly marked Featured by Admin */}
                <ArticleCard
                  article={featuredStory}
                  variant="large"
                  onClick={() => onOpenArticle(featuredStory.id)}
                  onSelectCategory={onSelectCategory}
                />

                {/* Supporting cards row */}
                {supportingStories.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {supportingStories.map(story => (
                      <ArticleCard
                        key={story.id}
                        article={story}
                        variant="medium"
                        onClick={() => onOpenArticle(story.id)}
                        onSelectCategory={onSelectCategory}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              /* When Featured News = OFF: Show clean latest published news grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {articles.slice(0, 4).map(story => (
                  <ArticleCard
                    key={story.id}
                    article={story}
                    variant="medium"
                    onClick={() => onOpenArticle(story.id)}
                    onSelectCategory={onSelectCategory}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Side Column (4 cols): Tabbed Latest / Popular feed */}
          <div className="lg:col-span-4 bg-white rounded-lg border border-gray-200 p-4 flex flex-col h-fit shadow-xs">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-3">
              <button
                onClick={() => setActiveTab('latest')}
                className={`flex-1 py-2 text-sm font-bold flex items-center justify-center gap-1.5 border-b-2 cursor-pointer transition-colors ${
                  activeTab === 'latest'
                    ? 'border-red-700 text-red-700'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>সর্বশেষ</span>
              </button>
              <button
                onClick={() => setActiveTab('popular')}
                className={`flex-1 py-2 text-sm font-bold flex items-center justify-center gap-1.5 border-b-2 cursor-pointer transition-colors ${
                  activeTab === 'popular'
                    ? 'border-red-700 text-red-700'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-amber-500" />
                <span>সর্বাধিক পঠিত</span>
              </button>
            </div>

            {/* List items */}
            <div className="divide-y divide-gray-100">
              {(activeTab === 'latest' ? latestList : popularList).map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => onOpenArticle(item.id)}
                  className="py-3 group cursor-pointer flex items-start gap-3"
                >
                  <span
                    className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-bengali-num ${
                      idx < 3
                        ? 'bg-red-700 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {toBengaliNumber(idx + 1)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-red-700 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1">
                      <span className="text-red-600 font-semibold">{item.category}</span>
                      <span>•</span>
                      <span className="font-bengali-num font-medium text-gray-600">{item.publishTime || item.publishDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Live TV promo banner */}
            <div className="mt-4 p-3.5 bg-gradient-to-r from-red-700 to-red-900 rounded-lg text-white">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1">
                <Flame className="w-4 h-4 animate-bounce" />
                <span>NOFS TV ডিজিটাল বুলেটিন</span>
              </div>
              <p className="text-xs text-red-100 leading-relaxed mb-2">
                সত্যের সন্ধানে মানুষের পাশে — প্রতি মুহূর্তে তাজা সংবাদের নির্ভরযোগ্য উৎস।
              </p>
              <button
                onClick={() => onSelectCategory('সর্বশেষ')}
                className="w-full py-1.5 px-3 bg-white hover:bg-amber-100 text-red-800 text-xs font-bold rounded flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <span>সব সর্বশেষ খবর দেখুন</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
