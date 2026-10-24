import React from 'react';
import {
  Flame,
  TrendingUp,
  Clock,
  ArrowRight,
  Newspaper,
  MapPin,
  ChevronRight,
  Globe,
  Radio,
  BookOpen,
  Award,
  Sparkles,
  Eye
} from 'lucide-react';
import { NewsArticle } from '../types';
import { ArticleCard } from './ArticleCard';
import { toBengaliNumber } from '../utils/bengali';

interface HomePageProps {
  articles: NewsArticle[];
  onOpenArticle: (id: string) => void;
  onSelectCategory: (categoryName: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  articles,
  onOpenArticle,
  onSelectCategory
}) => {
  // If absolutely no published news exists in the entire database
  if (!articles || articles.length === 0) {
    return (
      <div className="py-16 bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 flex items-center justify-center shadow-xs">
            <Newspaper className="w-8 h-8" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 mb-3">
            <Radio className="w-3.5 h-3.5 animate-pulse text-red-600" />
            NOFS TV ডিজিটাল নিউজরুম
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
            এই মুহূর্তে কোনো প্রকাশিত সংবাদ নেই।
          </h2>

          <p className="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed mb-6">
            NOFS TV নিউজরুম থেকে সাংবাদিক ও সম্পাদকদের অনুমোদিত সংবাদ প্রকাশিত হলে তা সরাসরি এখানে আপডেট হবে। নির্ভরযোগ্য ও বস্তুনিষ্ঠ সংবাদের সাথে থাকুন।
          </p>

          <div className="pt-5 border-t border-gray-100 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-gray-500 font-semibold mr-1">বিভাগসমূহ:</span>
            {['সিলেট', 'জাতীয়', 'রাজনীতি', 'আন্তর্জাতিক', 'খেলাধুলা', 'বিনোদন', 'প্রযুক্তি', 'শিক্ষা', 'অর্থনীতি', 'লাইফস্টাইল'].map(cat => (
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
      </div>
    );
  }

  // 1. MAIN NEWS GRID: Lead / Featured Story + Supporting Stories
  // If an article is marked isFeatured, use it as lead.
  // Otherwise, fallback to the latest published news article so the lead area displays a news item with photo & headline from data.
  const featuredArticles = articles.filter(a => a.isFeatured);
  const leadFeatured = featuredArticles.length > 0 ? featuredArticles[0] : (articles.length > 0 ? articles[0] : null);
  const supportingFeatured = featuredArticles.length > 0
    ? featuredArticles.slice(1, 4)
    : articles.filter(a => a.id !== leadFeatured?.id).slice(0, 3);

  // 2. LATEST NEWS (সর্বশেষ সংবাদ): Sorted by newest date/time
  const latestArticles = [...articles]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  // 3. SYLHET NEWS (সিলেট সংবাদ - Prominent)
  const sylhetArticles = articles.filter(a => a.category === 'সিলেট');

  // 4. NATIONAL NEWS (জাতীয় সংবাদ)
  const nationalArticles = articles.filter(a => a.category === 'জাতীয়');

  // 5. POLITICS & INTERNATIONAL (রাজনীতি ও আন্তর্জাতিক)
  const politicsArticles = articles.filter(a => a.category === 'রাজনীতি');
  const internationalArticles = articles.filter(a => a.category === 'আন্তর্জাতিক');

  // 6. SPORTS & ENTERTAINMENT (খেলাধুলা ও বিনোদন)
  const sportsArticles = articles.filter(a => a.category === 'খেলাধুলা');
  const entertainmentArticles = articles.filter(a => a.category === 'বিনোদন');

  // 7. TECH, EDUCATION & ECONOMY (প্রযুক্তি, শিক্ষা ও অর্থনীতি)
  const techArticles = articles.filter(a => a.category === 'প্রযুক্তি');
  const educationArticles = articles.filter(a => a.category === 'শিক্ষা');
  const economyArticles = articles.filter(a => a.category === 'অর্থনীতি');

  // 8. MOST READ (সর্বাধিক পঠিত): Sorted by view count
  const popularArticles = [...articles]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 6);

  return (
    <div className="w-full pb-12">
      {/* ======================================================== */}
      {/* 5. MAIN NEWS GRID (Lead / Featured News)                */}
      {/* বাম: বড় Featured News | ডান: ২/৩টি গুরুত্বপূর্ণ News     */}
      {/* ======================================================== */}
      <section className="py-6 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between pb-2 mb-5 border-b-2 border-red-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 bg-red-700 inline-block"></span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                শীর্ষ ও প্রধান সংবাদ
              </h2>
            </div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              NOFS TV প্রধান ডেস্ক
            </span>
          </div>

          {leadFeatured ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* বাম: বড় Featured News (Lead Story) */}
              <div className={`${supportingFeatured.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
                <ArticleCard
                  article={leadFeatured}
                  variant="large"
                  onClick={() => onOpenArticle(leadFeatured.id)}
                  onSelectCategory={onSelectCategory}
                />
              </div>

              {/* ডান: ২/৩টি গুরুত্বপূর্ণ News */}
              {supportingFeatured.length > 0 && (
                <div className="lg:col-span-4 flex flex-col gap-4">
                  {supportingFeatured.map(item => (
                    <div
                      key={item.id}
                      onClick={() => onOpenArticle(item.id)}
                      className="group bg-white rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-md transition-all p-3 cursor-pointer flex gap-3"
                    >
                      <div className="w-28 sm:w-32 h-20 rounded overflow-hidden shrink-0 bg-gray-100">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-red-700 block mb-0.5">
                            {item.category}
                          </span>
                          <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-red-700 line-clamp-2 leading-snug">
                            {item.title}
                          </h3>
                        </div>
                        <span className="text-[11px] text-gray-500 font-bengali-num mt-1">
                          {item.publishDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Clean Empty State only if no news at all */
            <div className="p-8 rounded-lg bg-gray-50 border border-dashed border-gray-300 text-center">
              <Newspaper className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                এই মুহূর্তে কোনো শীর্ষ সংবাদ নির্বাচিত হয়নি।
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                অ্যাডমিন কর্তৃক কোনো সংবাদ প্রকাশিত হলে তা এখানে প্রধান সংবাদরূপে প্রদর্শিত হবে।
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. LATEST NEWS (সর্বশেষ সংবাদ)                           */}
      {/* ======================================================== */}
      <section className="py-6 border-b border-gray-200 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between pb-2 mb-5 border-b-2 border-red-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 bg-red-700 inline-block"></span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <span>সর্বশেষ সংবাদ</span>
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              </h2>
            </div>
            <button
              onClick={() => onSelectCategory('সর্বশেষ')}
              className="flex items-center gap-1 text-sm font-bold text-red-700 hover:text-red-900 transition-colors cursor-pointer group"
            >
              <span>সকল সর্বশেষ খবর</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {latestArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {latestArticles.map(article => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  variant="medium"
                  onClick={() => onOpenArticle(article.id)}
                  onSelectCategory={onSelectCategory}
                />
              ))}
            </div>
          ) : (
            <div className="p-6 bg-white rounded-lg border border-gray-200 text-center text-gray-500 text-sm">
              এই মুহূর্তে কোনো প্রকাশিত সংবাদ নেই।
            </div>
          )}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. SYLHET NEWS (সিলেট সংবাদ - Prominent)                */}
      {/* ======================================================== */}
      <section className="py-6 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between pb-2 mb-5 border-b-2 border-red-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 bg-red-700 inline-block"></span>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  সিলেট সংবাদ
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                  সুরমা-কুশিয়ারা ও প্রবাসী বার্তা
                </span>
              </div>
            </div>
            <button
              onClick={() => onSelectCategory('সিলেট')}
              className="flex items-center gap-1 text-sm font-bold text-red-700 hover:text-red-900 transition-colors cursor-pointer group"
            >
              <span>সিলেটের সব খবর</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {sylhetArticles.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Sylhet Lead (5 cols) */}
              <div className="lg:col-span-5">
                <ArticleCard
                  article={sylhetArticles[0]}
                  variant="large"
                  onClick={() => onOpenArticle(sylhetArticles[0].id)}
                  onSelectCategory={onSelectCategory}
                />
              </div>

              {/* Sylhet Supporting Stories (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-3">
                {sylhetArticles.slice(1, 5).map(item => (
                  <ArticleCard
                    key={item.id}
                    article={item}
                    variant="horizontal"
                    onClick={() => onOpenArticle(item.id)}
                  />
                ))}
                {sylhetArticles.length === 1 && (
                  <div className="p-8 bg-gray-50 rounded-lg text-center text-gray-500 text-sm border border-gray-200">
                    সিলেট বিভাগের আরও সংবাদ প্রকাশের অপেক্ষায় রয়েছে।
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center text-gray-500 text-sm">
              সিলেট বিভাগের কোনো প্রকাশিত সংবাদ এই মুহূর্তে নেই।
            </div>
          )}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. NATIONAL NEWS (জাতীয় সংবাদ)                          */}
      {/* ======================================================== */}
      <section className="py-6 border-b border-gray-200 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between pb-2 mb-5 border-b-2 border-red-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 bg-red-700 inline-block"></span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                জাতীয় সংবাদ
              </h2>
            </div>
            <button
              onClick={() => onSelectCategory('জাতীয়')}
              className="flex items-center gap-1 text-sm font-bold text-red-700 hover:text-red-900 transition-colors cursor-pointer group"
            >
              <span>জাতীয় সব খবর</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {nationalArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {nationalArticles.slice(0, 4).map(item => (
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
            <div className="p-8 bg-white rounded-lg border border-dashed border-gray-300 text-center text-gray-500 text-sm">
              জাতীয় বিভাগের কোনো প্রকাশিত সংবাদ এই মুহূর্তে নেই।
            </div>
          )}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. POLITICS / INTERNATIONAL (রাজনীতি ও আন্তর্জাতিক)      */}
      {/* ======================================================== */}
      <section className="py-6 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: রাজনীতি */}
            <div>
              <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-red-700">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-5 bg-red-700 inline-block"></span>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">রাজনীতি</h3>
                </div>
                <button
                  onClick={() => onSelectCategory('রাজনীতি')}
                  className="text-xs font-bold text-red-700 hover:underline cursor-pointer"
                >
                  সব খবর →
                </button>
              </div>

              {politicsArticles.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {/* Lead story */}
                  {politicsArticles[0] && (
                    <div
                      onClick={() => onOpenArticle(politicsArticles[0].id)}
                      className="group bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-red-300 transition-all cursor-pointer"
                    >
                      <div className="aspect-[16/9] rounded overflow-hidden mb-2 bg-gray-200">
                        <img
                          src={politicsArticles[0].image}
                          alt={politicsArticles[0].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h4 className="font-bold text-base text-gray-900 group-hover:text-red-700 line-clamp-2">
                        {politicsArticles[0].title}
                      </h4>
                      <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                        {politicsArticles[0].summary}
                      </p>
                    </div>
                  )}

                  {/* Supporting stories */}
                  {politicsArticles.slice(1, 4).map(story => (
                    <div
                      key={story.id}
                      onClick={() => onOpenArticle(story.id)}
                      className="group flex gap-3 p-2 rounded hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="w-20 h-14 rounded overflow-hidden shrink-0 bg-gray-100">
                        <img
                          src={story.image}
                          alt={story.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-red-700 line-clamp-2 leading-snug">
                          {story.title}
                        </h5>
                        <span className="text-[10px] text-gray-400 font-bengali-num mt-1 block">
                          {story.publishDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-gray-50 rounded text-center text-gray-400 text-xs">
                  রাজনীতি বিভাগের কোনো প্রকাশিত সংবাদ এই মুহূর্তে নেই।
                </div>
              )}
            </div>

            {/* Right: আন্তর্জাতিক */}
            <div>
              <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-red-700">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-5 bg-red-700 inline-block"></span>
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-red-600" />
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">আন্তর্জাতিক</h3>
                  </div>
                </div>
                <button
                  onClick={() => onSelectCategory('আন্তর্জাতিক')}
                  className="text-xs font-bold text-red-700 hover:underline cursor-pointer"
                >
                  সব খবর →
                </button>
              </div>

              {internationalArticles.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {/* Lead story */}
                  {internationalArticles[0] && (
                    <div
                      onClick={() => onOpenArticle(internationalArticles[0].id)}
                      className="group bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-red-300 transition-all cursor-pointer"
                    >
                      <div className="aspect-[16/9] rounded overflow-hidden mb-2 bg-gray-200">
                        <img
                          src={internationalArticles[0].image}
                          alt={internationalArticles[0].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h4 className="font-bold text-base text-gray-900 group-hover:text-red-700 line-clamp-2">
                        {internationalArticles[0].title}
                      </h4>
                      <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                        {internationalArticles[0].summary}
                      </p>
                    </div>
                  )}

                  {/* Supporting stories */}
                  {internationalArticles.slice(1, 4).map(story => (
                    <div
                      key={story.id}
                      onClick={() => onOpenArticle(story.id)}
                      className="group flex gap-3 p-2 rounded hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="w-20 h-14 rounded overflow-hidden shrink-0 bg-gray-100">
                        <img
                          src={story.image}
                          alt={story.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-red-700 line-clamp-2 leading-snug">
                          {story.title}
                        </h5>
                        <span className="text-[10px] text-gray-400 font-bengali-num mt-1 block">
                          {story.publishDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-gray-50 rounded text-center text-gray-400 text-xs">
                  আন্তর্জাতিক বিভাগের কোনো প্রকাশিত সংবাদ এই মুহূর্তে নেই।
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 10. SPORTS / ENTERTAINMENT (খেলাধুলা ও বিনোদন)            */}
      {/* ======================================================== */}
      <section className="py-6 border-b border-gray-200 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: খেলাধুলা */}
            <div>
              <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-red-700">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-5 bg-red-700 inline-block"></span>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-red-600" />
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">খেলাধুলা</h3>
                  </div>
                </div>
                <button
                  onClick={() => onSelectCategory('খেলাধুলা')}
                  className="text-xs font-bold text-red-700 hover:underline cursor-pointer"
                >
                  সব খবর →
                </button>
              </div>

              {sportsArticles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sportsArticles.slice(0, 4).map(story => (
                    <ArticleCard
                      key={story.id}
                      article={story}
                      variant="medium"
                      onClick={() => onOpenArticle(story.id)}
                      onSelectCategory={onSelectCategory}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-white rounded text-center text-gray-400 text-xs">
                  খেলাধুলা বিভাগের কোনো প্রকাশিত সংবাদ এই মুহূর্তে নেই।
                </div>
              )}
            </div>

            {/* Right: বিনোদন ও সংস্কৃতি */}
            <div>
              <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-red-700">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-5 bg-red-700 inline-block"></span>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">বিনোদন ও সংস্কৃতি</h3>
                  </div>
                </div>
                <button
                  onClick={() => onSelectCategory('বিনোদন')}
                  className="text-xs font-bold text-red-700 hover:underline cursor-pointer"
                >
                  সব খবর →
                </button>
              </div>

              {entertainmentArticles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {entertainmentArticles.slice(0, 4).map(story => (
                    <ArticleCard
                      key={story.id}
                      article={story}
                      variant="medium"
                      onClick={() => onOpenArticle(story.id)}
                      onSelectCategory={onSelectCategory}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-white rounded text-center text-gray-400 text-xs">
                  বিনোদন বিভাগের কোনো প্রকাশিত সংবাদ এই মুহূর্তে নেই।
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 11. TECH, EDUCATION & ECONOMY (প্রযুক্তি, শিক্ষা ও অর্থনীতি)*/}
      {/* ======================================================== */}
      <section className="py-6 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Col 1: প্রযুক্তি */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-red-700">
                <h4 className="font-bold text-base text-gray-900">তথ্যপ্রযুক্তি ও গ্যাজেট</h4>
                <button
                  onClick={() => onSelectCategory('প্রযুক্তি')}
                  className="text-[11px] font-semibold text-red-700 hover:underline cursor-pointer"
                >
                  আরও →
                </button>
              </div>
              {techArticles.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {techArticles.slice(0, 3).map(story => (
                    <div
                      key={story.id}
                      onClick={() => onOpenArticle(story.id)}
                      className="group cursor-pointer pb-2 border-b border-gray-200 last:border-b-0"
                    >
                      <h5 className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-red-700 line-clamp-2">
                        {story.title}
                      </h5>
                      <span className="text-[10px] text-gray-400 font-bengali-num mt-1 block">
                        {story.publishDate}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 text-center py-4">তথ্যপ্রযুক্তি বিভাগের সংবাদ শীঘ্রই আসছে।</p>
              )}
            </div>

            {/* Col 2: শিক্ষা ও ক্যাম্পাস */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-red-700">
                <h4 className="font-bold text-base text-gray-900">শিক্ষা ও ক্যারিয়ার</h4>
                <button
                  onClick={() => onSelectCategory('শিক্ষা')}
                  className="text-[11px] font-semibold text-red-700 hover:underline cursor-pointer"
                >
                  আরও →
                </button>
              </div>
              {educationArticles.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {educationArticles.slice(0, 3).map(story => (
                    <div
                      key={story.id}
                      onClick={() => onOpenArticle(story.id)}
                      className="group cursor-pointer pb-2 border-b border-gray-200 last:border-b-0"
                    >
                      <h5 className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-red-700 line-clamp-2">
                        {story.title}
                      </h5>
                      <span className="text-[10px] text-gray-400 font-bengali-num mt-1 block">
                        {story.publishDate}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 text-center py-4">শিক্ষা বিভাগের সংবাদ শীঘ্রই আসছে।</p>
              )}
            </div>

            {/* Col 3: অর্থনীতি ও বাণিজ্য */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-red-700">
                <h4 className="font-bold text-base text-gray-900">অর্থনীতি ও বাণিজ্য</h4>
                <button
                  onClick={() => onSelectCategory('অর্থনীতি')}
                  className="text-[11px] font-semibold text-red-700 hover:underline cursor-pointer"
                >
                  আরও →
                </button>
              </div>
              {economyArticles.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {economyArticles.slice(0, 3).map(story => (
                    <div
                      key={story.id}
                      onClick={() => onOpenArticle(story.id)}
                      className="group cursor-pointer pb-2 border-b border-gray-200 last:border-b-0"
                    >
                      <h5 className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-red-700 line-clamp-2">
                        {story.title}
                      </h5>
                      <span className="text-[10px] text-gray-400 font-bengali-num mt-1 block">
                        {story.publishDate}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 text-center py-4">অর্থনীতি বিভাগের সংবাদ শীঘ্রই আসছে।</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 12. MOST READ / POPULAR (সর্বাধিক পঠিত সংবাদ)             */}
      {/* ======================================================== */}
      <section className="py-6 border-b border-gray-200 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between pb-2 mb-5 border-b-2 border-red-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 bg-red-700 inline-block"></span>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-500" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  সর্বাধিক পঠিত সংবাদ
                </h2>
              </div>
            </div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              জনপ্রিয় সংবাদসমূহ
            </span>
          </div>

          {popularArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularArticles.map((article, index) => (
                <div
                  key={article.id}
                  onClick={() => onOpenArticle(article.id)}
                  className="group bg-white rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-md transition-all p-3.5 cursor-pointer flex gap-3 items-center relative overflow-hidden"
                >
                  {/* Number Badge (১, ২, ৩...) */}
                  <span className="text-2xl sm:text-3xl font-extrabold text-red-600 font-bengali-num w-8 text-center shrink-0">
                    {toBengaliNumber(index + 1)}
                  </span>

                  <div className="w-20 h-16 rounded overflow-hidden shrink-0 bg-gray-100">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-red-700 block mb-0.5">
                      {article.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-red-700 line-clamp-2 leading-snug">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-1 font-bengali-num">
                      <span>{article.publishDate}</span>
                      {article.views > 0 && (
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-gray-400" />
                          {toBengaliNumber(article.views)} পঠিত
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-white rounded-lg border border-gray-200 text-center text-gray-500 text-sm">
              শীঘ্রই সর্বাধিক পঠিত সংবাদ প্রদর্শিত হবে।
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
