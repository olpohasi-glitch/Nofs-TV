import React, { useState, useEffect } from 'react';
import {
  Clock,
  User,
  Share2,
  Copy,
  Check,
  MessageSquare,
  Bookmark,
  Printer,
  ChevronRight,
  Send,
  Volume2,
  Calendar,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { ArticleCard } from './ArticleCard';
import { calculateReadingTime, toBengaliNumber } from '../utils/bengali';

interface ArticleDetailPageProps {
  articleId: string;
  onOpenArticle: (id: string) => void;
  onSelectCategory: (category: string) => void;
  onNavigateHome: () => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  articleId,
  onOpenArticle,
  onSelectCategory,
  onNavigateHome
}) => {
  const { news, comments, addComment, incrementViews, isAdminLoggedIn } = useNews();
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Comment Form state
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);

  const rawArticle = news.find(a => a.id === articleId);
  const article = (rawArticle && (rawArticle.status === 'published' || isAdminLoggedIn)) ? rawArticle : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (article) {
      incrementViews(article.id);
    }
  }, [articleId]);

  if (!article) {
    return (
      <div className="py-24 text-center max-w-lg mx-auto px-4">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Share2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">সংবাদটি খুঁজে পাওয়া যায়নি</h2>
        <p className="text-sm text-gray-500 mb-6">
          অনুরোধকৃত সংবাদটি এখনো প্রকাশিত হয়নি, অপ্রকাশিত খসড়া বা সরিয়ে নেওয়া হয়েছে।
        </p>
        <button
          onClick={onNavigateHome}
          className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-sm"
        >
          হোমপেজে ফিরে যান
        </button>
      </div>
    );
  }

  const relatedArticles = news
    .filter(a => a.category === article.category && a.id !== article.id)
    .slice(0, 3);

  const latestSidebarArticles = news
    .filter(a => a.id !== article.id)
    .slice(0, 5);

  const articleComments = comments.filter(
    c => c.articleId === article.id && c.status === 'approved'
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    addComment(
      article.id,
      article.title,
      commentName.trim(),
      commentEmail.trim(),
      commentText.trim()
    );

    setCommentName('');
    setCommentEmail('');
    setCommentText('');
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 4000);
  };

  const readingTime = calculateReadingTime(article.content);

  const fontSizeClass =
    fontSize === 'xlarge'
      ? 'text-xl leading-relaxed'
      : fontSize === 'large'
      ? 'text-lg leading-relaxed'
      : 'text-base leading-relaxed';

  return (
    <article className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 mb-6 flex-wrap">
          <button
            onClick={onNavigateHome}
            className="hover:text-red-700 cursor-pointer"
          >
            হোম
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button
            onClick={() => onSelectCategory(article.category)}
            className="hover:text-red-700 font-semibold text-red-700 cursor-pointer"
          >
            {article.category}
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-400 truncate max-w-xs sm:max-w-md">
            {article.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article Content Column (8 cols) */}
          <div className="lg:col-span-8 bg-white p-5 sm:p-8 rounded-xl border border-gray-200 shadow-xs">
            {/* Category Pill */}
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-red-700 text-white text-xs font-bold rounded-sm">
                {article.category}
              </span>
              {article.isBreaking && (
                <span className="px-2.5 py-1 bg-amber-500 text-slate-900 text-xs font-extrabold rounded-sm animate-pulse">
                  ব্রেকিং নিউজ
                </span>
              )}
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-950 leading-tight tracking-tight">
              {article.title}
            </h1>

            {/* Subheadline */}
            {article.subtitle && (
              <h2 className="text-base sm:text-xl font-medium text-gray-600 mt-2.5 leading-snug">
                {article.subtitle}
              </h2>
            )}

            {/* Reporter Meta & Publishing Timestamps */}
            <div className="flex flex-wrap items-center justify-between gap-3 py-4 my-5 border-y border-gray-200 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-red-700 font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-gray-900 block text-sm">
                    {article.reporterName}
                  </span>
                  <span className="text-xs text-gray-500 block">
                    {article.reporterRole || 'বিশেষ প্রতিবেদক'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:items-end text-xs text-gray-500">
                <div className="flex items-center gap-1.5 font-medium text-gray-700">
                  <Calendar className="w-3.5 h-3.5 text-red-600" />
                  <span>প্রকাশ: {article.publishDate}</span>
                  {article.publishTime && <span>({article.publishTime})</span>}
                </div>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-500">
                  <span>{readingTime}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{toBengaliNumber(article.views || 1)} বার পঠিত</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Article Toolbar: Font Size, Audio, Share, Print */}
            <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg mb-6 text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-700">ফন্ট সাইজ:</span>
                <button
                  onClick={() => setFontSize('normal')}
                  className={`px-2 py-1 rounded cursor-pointer ${
                    fontSize === 'normal'
                      ? 'bg-red-700 text-white font-bold'
                      : 'bg-white hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  আ
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`px-2 py-1 rounded cursor-pointer ${
                    fontSize === 'large'
                      ? 'bg-red-700 text-white font-bold'
                      : 'bg-white hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  আ+
                </button>
                <button
                  onClick={() => setFontSize('xlarge')}
                  className={`px-2 py-1 rounded cursor-pointer ${
                    fontSize === 'xlarge'
                      ? 'bg-red-700 text-white font-bold'
                      : 'bg-white hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  আ++
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded border cursor-pointer transition-colors ${
                    isPlayingAudio
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-200'
                  }`}
                  title="সংবাদ শুনুন"
                >
                  <Volume2 className="w-3.5 h-3.5 text-red-600" />
                  <span>{isPlayingAudio ? 'থামুন' : 'শুনুন'}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 cursor-pointer"
                  title="প্রিন্ট করুন"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট</span>
                </button>
              </div>
            </div>

            {/* Featured Image */}
            <div className="mb-6 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
              <img
                src={article.image}
                alt={article.title}
                className="w-full max-h-[500px] object-cover"
              />
              {article.imageCaption && (
                <p className="p-3 text-xs text-gray-600 bg-gray-50 border-t border-gray-200 italic">
                  ছবি: {article.imageCaption}
                </p>
              )}
            </div>

            {/* Summary Lead Block */}
            <div className="p-4 bg-red-50/70 border-l-4 border-red-700 rounded-r-lg mb-6">
              <p className="text-base sm:text-lg font-semibold text-gray-900 leading-relaxed">
                {article.summary}
              </p>
            </div>

            {/* Main Article Body */}
            <div
              className={`prose prose-slate max-w-none font-serif text-gray-800 space-y-5 ${fontSizeClass}`}
            >
              {article.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="leading-relaxed text-justify">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 pt-4 border-t border-gray-200 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  ট্যাগসমূহ:
                </span>
                {article.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-gray-100 hover:bg-red-50 hover:text-red-700 text-gray-700 text-xs rounded transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Social Share Bar */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-red-600" />
                <span>সংবাদটি শেয়ার করুন:</span>
              </span>

              <div className="flex items-center space-x-2">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    window.location.href
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Facebook</span>
                </a>

                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    article.title + ' ' + window.location.href
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>WhatsApp</span>
                </a>

                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>লিঙ্ক কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>লিঙ্ক কপি করুন</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <section className="mt-10 pt-8 border-t-2 border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-red-600" />
                  <span>পাঠকের মন্তব্য ({toBengaliNumber(articleComments.length)})</span>
                </h3>
              </div>

              {/* Add Comment Form */}
              <form
                onSubmit={handleCommentSubmit}
                className="bg-gray-50 p-5 rounded-xl border border-gray-200 mb-8"
              >
                <h4 className="text-sm font-bold text-gray-800 mb-3">
                  আপনার মতামত দিন:
                </h4>

                {commentSuccess && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>আপনার মন্তব্য সফলভাবে প্রকাশিত হয়েছে। ধন্যবাদ!</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      আপনার নাম *
                    </label>
                    <input
                      type="text"
                      required
                      value={commentName}
                      onChange={e => setCommentName(e.target.value)}
                      placeholder="নাম লিখুন"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      ইমেইল (ঐচ্ছিক)
                    </label>
                    <input
                      type="email"
                      value={commentEmail}
                      onChange={e => setCommentEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    মন্তব্য *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="আপনার শালীন ও গঠনমূলক মতামত লিখুন..."
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:border-red-600"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-sm rounded shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>মন্তব্য পাঠান</span>
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {articleComments.length > 0 ? (
                  articleComments.map(cmt => (
                    <div
                      key={cmt.id}
                      className="p-4 bg-white rounded-lg border border-gray-200 shadow-xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-red-700">
                            {cmt.authorName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-sm text-gray-900 block">
                              {cmt.authorName}
                            </span>
                            <span className="text-[11px] text-gray-400 block">
                              {cmt.createdAt}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed pl-10">
                        {cmt.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-gray-500 py-4">
                    এখনও কোনো মন্তব্য করা হয়নি। আপনার মতামত দিয়ে আলোচনা শুরু করুন!
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Right Sidebar (4 cols): Related News & Latest Stream */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Related News Box */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
              <div className="flex items-center gap-2 pb-2 mb-3 border-b-2 border-red-700">
                <span className="w-2 h-4 bg-red-700 inline-block"></span>
                <h3 className="text-base font-bold text-gray-900">
                  সম্পর্কিত খবর ({article.category})
                </h3>
              </div>

              <div className="flex flex-col gap-3">
                {relatedArticles.map(rel => (
                  <ArticleCard
                    key={rel.id}
                    article={rel}
                    variant="compact"
                    onClick={() => onOpenArticle(rel.id)}
                  />
                ))}

                {relatedArticles.length === 0 && (
                  <p className="text-xs text-gray-500 py-2">
                    এই ক্যাটাগরিতে সম্পর্কিত আরও সংবাদ শীঘ্রই আসছে।
                  </p>
                )}
              </div>
            </div>

            {/* Latest Sidebar News */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
              <div className="flex items-center gap-2 pb-2 mb-3 border-b-2 border-slate-900">
                <span className="w-2 h-4 bg-slate-900 inline-block"></span>
                <h3 className="text-base font-bold text-gray-900">
                  সর্বশেষ সংবাদ
                </h3>
              </div>

              <div className="flex flex-col gap-3">
                {latestSidebarArticles.map(side => (
                  <ArticleCard
                    key={side.id}
                    article={side}
                    variant="compact"
                    onClick={() => onOpenArticle(side.id)}
                  />
                ))}
              </div>
            </div>

            {/* Editorial Board Card */}
            <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl shadow-xs">
              <h4 className="text-sm font-bold text-amber-300 mb-1">
                NOFS TV সম্পাদকীয় নীতি
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                সকল সংবাদ শতভাগ তথ্য যাচাই, নিরপেক্ষতা এবং পেশাদারিত্ব বজায় রেখে পরিবেশন করা হয়।
              </p>
              <div className="pt-2 border-t border-slate-700 text-[11px] text-slate-400">
                প্রধান বার্তা কক্ষ • সিলেট, বাংলাদেশ
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
