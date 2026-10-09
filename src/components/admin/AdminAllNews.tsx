import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Flame,
  Star,
  Eye,
  CheckCircle,
  XCircle,
  Plus,
  AlertTriangle,
  ExternalLink,
  Globe,
  EyeOff,
  FileText,
  Clock,
  Sparkles,
  Layers,
  Check
} from 'lucide-react';
import { useNews } from '../../context/NewsContext';
import { NewsArticle } from '../../types';
import { toBengaliNumber } from '../../utils/bengali';

interface AdminAllNewsProps {
  onAddNew: () => void;
  onEditArticle: (article: NewsArticle) => void;
  onViewPublicArticle?: (id: string) => void;
  defaultStatus?: 'all' | 'published' | 'draft' | 'featured';
}

export const AdminAllNews: React.FC<AdminAllNewsProps> = ({
  onAddNew,
  onEditArticle,
  onViewPublicArticle,
  defaultStatus = 'all'
}) => {
  const {
    news,
    categories,
    deleteNews,
    publishNews,
    unpublishNews,
    toggleBreakingStatus,
    toggleFeaturedStatus
  } = useNews();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<string>(defaultStatus);
  const [deleteCandidate, setDeleteCandidate] = useState<NewsArticle | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Live Counts for Status Metrics
  const countTotal = news.length;
  const countPublished = news.filter(n => n.status === 'published').length;
  const countDraft = news.filter(n => n.status === 'draft').length;
  const countBreaking = news.filter(n => n.isBreaking).length;
  const countFeatured = news.filter(n => n.isFeatured).length;

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const handlePublish = async (article: NewsArticle) => {
    try {
      setProcessingId(article.id);
      await publishNews(article.id);
      showToast(`"${article.title}" সফলভাবে প্রকাশিত (Published) হয়েছে! এটি এখন পাবলিক পোর্টালে লাইভ।`, 'success');
    } catch (err: unknown) {
      const error = err as Error;
      showToast(`প্রকাশনা ব্যর্থ: ${error.message}`, 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleUnpublish = async (article: NewsArticle) => {
    try {
      setProcessingId(article.id);
      await unpublishNews(article.id);
      showToast(`"${article.title}" অপ্রকাশিত / খসড়া (Draft) হিসেবে নেওয়া হয়েছে। পাবলিক ওয়েবসাইট থেকে সরিয়ে নেওয়া হয়েছে।`, 'info');
    } catch (err: unknown) {
      const error = err as Error;
      showToast(`অপ্রকাশিত করতে ব্যর্থ: ${error.message}`, 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const confirmDelete = async () => {
    if (deleteCandidate) {
      try {
        setProcessingId(deleteCandidate.id);
        await deleteNews(deleteCandidate.id);
        showToast(`"${deleteCandidate.title}" সংবাদটি ডেটাবেস থেকে স্থায়ীভাবে মুছে ফেলা হয়েছে।`, 'success');
        setDeleteCandidate(null);
      } catch (err: unknown) {
        const error = err as Error;
        showToast(`সংবাদ মুছতে সমস্যা: ${error.message}`, 'error');
      } finally {
        setProcessingId(null);
      }
    }
  };

  const filteredNews = useMemo(() => {
    return news.filter(item => {
      if (selectedStatus === 'published' && item.status !== 'published') {
        return false;
      }
      if (selectedStatus === 'draft' && item.status !== 'draft') {
        return false;
      }
      if (selectedStatus === 'featured' && !item.isFeatured) {
        return false;
      }
      if (selectedStatus === 'breaking' && !item.isBreaking) {
        return false;
      }
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (
        searchTerm &&
        !item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.reporterName.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [news, searchTerm, selectedCategory, selectedStatus]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              সকল সংবাদ ব্যবস্থাপনা (All News Management)
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
              Firestore পারসিস্টেন্ট
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            মোট সংবাদ: <strong className="text-gray-900">{toBengaliNumber(countTotal)}</strong> টি • 
            প্রকাশিত: <strong className="text-emerald-700">{toBengaliNumber(countPublished)}</strong> টি • 
            খসড়া: <strong className="text-amber-700">{toBengaliNumber(countDraft)}</strong> টি
          </p>
        </div>

        <button
          onClick={onAddNew}
          className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন সংবাদ লিখুন</span>
        </button>
      </div>

      {/* Notification Toast Alert */}
      {notification && (
        <div
          className={`p-3.5 rounded-lg text-xs font-semibold flex items-center justify-between gap-3 border transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : notification.type === 'error'
              ? 'bg-red-50 text-red-900 border-red-200'
              : 'bg-amber-50 text-amber-900 border-amber-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : notification.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            ) : (
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-gray-400 hover:text-gray-700 text-xs cursor-pointer font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          onClick={() => setSelectedStatus('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            selectedStatus === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>সকল সংবাদ</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
            {toBengaliNumber(countTotal)}
          </span>
        </button>

        <button
          onClick={() => setSelectedStatus('published')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            selectedStatus === 'published'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>প্রকাশিত সংবাদ (Published)</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-black/10">
            {toBengaliNumber(countPublished)}
          </span>
        </button>

        <button
          onClick={() => setSelectedStatus('draft')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            selectedStatus === 'draft'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>খসড়া সংবাদ (Draft)</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-black/10">
            {toBengaliNumber(countDraft)}
          </span>
        </button>

        <button
          onClick={() => setSelectedStatus('breaking')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            selectedStatus === 'breaking'
              ? 'bg-red-700 text-white shadow-xs'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-red-600" />
          <span>ব্রেকিং</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-black/10">
            {toBengaliNumber(countBreaking)}
          </span>
        </button>

        <button
          onClick={() => setSelectedStatus('featured')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            selectedStatus === 'featured'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          <Star className="w-3.5 h-3.5 text-amber-500" />
          <span>ফিচার্ড</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-black/10">
            {toBengaliNumber(countFeatured)}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
        {/* Search Input (6 cols) */}
        <div className="relative sm:col-span-6">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="সংবাদ শিরোনাম বা প্রতিবেদক দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-red-600 focus:bg-white"
          />
        </div>

        {/* Category Filter (3 cols) */}
        <div className="sm:col-span-3">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-red-600"
          >
            <option value="all">সকল ক্যাটাগরি</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Dropdown Filter (3 cols) */}
        <div className="sm:col-span-3">
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-red-600"
          >
            <option value="all">সকল অবস্থা (All Status)</option>
            <option value="published">শুধুমাত্র প্রকাশিত (Published)</option>
            <option value="draft">শুধুমাত্র খসড়া (Draft)</option>
            <option value="breaking">ব্রেকিং নিউজ</option>
            <option value="featured">ফিচার্ড নিউজ</option>
          </select>
        </div>
      </div>

      {/* News Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="w-full text-left text-xs sm:text-sm text-gray-700">
          <thead className="bg-gray-50 text-xs text-gray-600 uppercase border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 font-bold">সংবাদ শিরোনাম</th>
              <th className="py-3 px-3 font-bold">ক্যাটাগরি</th>
              <th className="py-3 px-3 font-bold">প্রতিবেদক</th>
              <th className="py-3 px-3 text-center font-bold">অবস্থা (Status)</th>
              <th className="py-3 px-2 text-center font-bold">ব্রেকিং</th>
              <th className="py-3 px-2 text-center font-bold">ফিচার্ড</th>
              <th className="py-3 px-3 text-center font-bold">ভিউ</th>
              <th className="py-3 px-4 text-right font-bold">পদক্ষেপ (Actions)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredNews.map(item => {
              const isPublished = item.status === 'published';
              const isBusy = processingId === item.id;

              return (
                <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                  {/* Title & Thumbnail */}
                  <td className="py-3 px-4 max-w-xs sm:max-w-sm">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt=""
                        className="w-12 h-9 rounded object-cover shrink-0 border border-gray-200"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-gray-900 line-clamp-1 block text-sm">
                          {item.title}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-400">
                          <span>{item.publishDate}</span>
                          <span>•</span>
                          <span className="font-mono text-[10px] text-gray-400">
                            ID: {item.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs font-semibold rounded">
                      {item.category}
                    </span>
                  </td>

                  {/* Reporter */}
                  <td className="py-3 px-3 text-xs text-gray-600">
                    {item.reporterName}
                  </td>

                  {/* Status Badge (Requirement 6: Clear Status labels) */}
                  <td className="py-3 px-3 text-center">
                    {isPublished ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                        <span>প্রকাশিত</span>
                        <span className="text-[10px] text-emerald-600 font-normal hidden sm:inline">(Published)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        <span>খসড়া</span>
                        <span className="text-[10px] text-amber-600 font-normal hidden sm:inline">(Draft)</span>
                      </span>
                    )}
                  </td>

                  {/* Breaking Toggle */}
                  <td className="py-3 px-2 text-center">
                    <button
                      onClick={() => toggleBreakingStatus(item.id)}
                      className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                        item.isBreaking
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                      title={item.isBreaking ? 'ব্রেকিং নিউজ সক্রিয়' : 'ব্রেকিং নিউজ হিসেবে সেট করুন'}
                    >
                      <Flame className="w-4 h-4" />
                    </button>
                  </td>

                  {/* Featured Toggle */}
                  <td className="py-3 px-2 text-center">
                    <button
                      onClick={() => toggleFeaturedStatus(item.id)}
                      className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                        item.isFeatured
                          ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                      title={item.isFeatured ? 'ফিচার্ড সক্রিয়' : 'ফিচার্ড হিসেবে সেট করুন'}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  </td>

                  {/* Views */}
                  <td className="py-3 px-3 text-center text-xs font-mono text-gray-600">
                    {toBengaliNumber(item.views || 0)}
                  </td>

                  {/* Actions (Requirement 7 & Fix: Publish, Unpublish, Edit, and Delete actions) */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5 shrink-0">
                      {/* Publish / Unpublish Action Button */}
                      {isPublished ? (
                        <button
                          type="button"
                          onClick={() => handleUnpublish(item)}
                          disabled={isBusy}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                          title="সংবাদটি অপ্রকাশিত / খসড়া করুন (Unpublish to Draft)"
                        >
                          <EyeOff className="w-3.5 h-3.5 text-amber-700" />
                          <span className="hidden lg:inline">আনপাবলিশ</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handlePublish(item)}
                          disabled={isBusy}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                          title="সংবাদটি অবিলম্বে ওয়েবসাইটে প্রকাশ করুন (Publish Live)"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span className="hidden lg:inline">পাবলিশ</span>
                        </button>
                      )}

                      {/* Public Preview Button (if published) */}
                      {isPublished && onViewPublicArticle && (
                        <button
                          type="button"
                          onClick={() => onViewPublicArticle(item.id)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
                          title="পাবলিক পেজে সরাসরি দেখুন"
                          aria-label="পাবলিক ভিউ"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      )}

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => onEditArticle(item)}
                        className="inline-flex items-center gap-1 p-1.5 sm:px-2 sm:py-1.5 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer shrink-0"
                        title="সংবাদ সম্পাদনা করুন (Edit)"
                        aria-label="সম্পাদনা"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="text-xs font-semibold hidden xl:inline">এডিট</span>
                      </button>

                      {/* Delete Button (Restored, Highly visible with Red styling & Confirmation) */}
                      <button
                        type="button"
                        onClick={() => setDeleteCandidate(item)}
                        className="inline-flex items-center gap-1 p-1.5 sm:px-2 sm:py-1.5 rounded-lg text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer shrink-0"
                        title="সংবাদটি স্থায়ীভাবে মুছে ফেলুন (Delete)"
                        aria-label="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                        <span className="text-xs font-semibold hidden xl:inline">ডিলিট</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredNews.length === 0 && (
        <div className="py-12 text-center text-gray-500 text-sm">
          {selectedStatus === 'draft'
            ? 'বর্তমানে কোনো খসড়া সংবাদ নেই।'
            : selectedStatus === 'published'
            ? 'কোনো প্রকাশিত সংবাদ পাওয়া যায়নি।'
            : 'কোনো সংবাদ পাওয়া যায়নি।'}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-gray-900">
                সংবাদ মুছে ফেলার নিশ্চিতকরণ
              </h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              আপনি কি নিশ্চিত যে নিচের সংবাদটি Firebase ডেটাবেস থেকে স্থায়ীভাবে মুছে ফেলতে চান? এটি আর পুনরুদ্ধার করা যাবে না।
            </p>
            <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-xs font-semibold text-red-950 mb-5">
              "{deleteCandidate.title}"
            </div>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                onClick={confirmDelete}
                disabled={processingId === deleteCandidate.id}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {processingId === deleteCandidate.id ? 'মুছে ফেলা হচ্ছে...' : 'হ্যাঁ, মুছে ফেলুন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
