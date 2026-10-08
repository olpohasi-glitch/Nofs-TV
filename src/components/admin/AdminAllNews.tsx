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
  ExternalLink
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
    togglePublishStatus,
    toggleBreakingStatus,
    toggleFeaturedStatus
  } = useNews();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<string>(
    defaultStatus === 'featured' ? 'all' : defaultStatus
  );
  const [filterFeaturedOnly] = useState<boolean>(defaultStatus === 'featured');
  const [deleteCandidate, setDeleteCandidate] = useState<NewsArticle | null>(
    null
  );

  const filteredNews = useMemo(() => {
    return news.filter(item => {
      if (filterFeaturedOnly && !item.isFeatured) {
        return false;
      }
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (selectedStatus !== 'all' && item.status !== selectedStatus) {
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
  }, [news, searchTerm, selectedCategory, selectedStatus, filterFeaturedOnly]);

  const confirmDelete = () => {
    if (deleteCandidate) {
      deleteNews(deleteCandidate.id);
      setDeleteCandidate(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            সকল সংবাদ ব্যবস্থাপনা (All News Management)
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            মোট সংবাদ সংখ্যা: <strong className="text-red-700">{toBengaliNumber(news.length)}</strong> টি
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

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="সংবাদ শিরোনাম বা প্রতিবেদক দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-red-600 focus:bg-white"
          />
        </div>

        {/* Category Filter */}
        <div>
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

        {/* Status Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-red-600"
          >
            <option value="all">সকল অবস্থা (All Status)</option>
            <option value="published">লাইভ / প্রকাশিত (Published)</option>
            <option value="draft">খসড়া (Draft)</option>
          </select>
        </div>
      </div>

      {/* News Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-left text-xs sm:text-sm text-gray-700">
          <thead className="bg-gray-50 text-xs text-gray-600 uppercase border-b border-gray-200">
            <tr>
              <th className="py-3 px-4">সংবাদ শিরোনাম</th>
              <th className="py-3 px-3">ক্যাটাগরি</th>
              <th className="py-3 px-3">প্রতিবেদক</th>
              <th className="py-3 px-3 text-center">ব্রেকিং</th>
              <th className="py-3 px-3 text-center">ফিচার্ড</th>
              <th className="py-3 px-3 text-center">স্ট্যাটাস</th>
              <th className="py-3 px-3 text-center">ভিউ</th>
              <th className="py-3 px-4 text-right">পদক্ষেপ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredNews.map(item => (
              <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                {/* Title & Thumbnail */}
                <td className="py-3 px-4 max-w-xs">
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
                      <span className="text-[11px] text-gray-400 block mt-0.5">
                        {item.publishDate}
                      </span>
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

                {/* Breaking Toggle */}
                <td className="py-3 px-3 text-center">
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
                <td className="py-3 px-3 text-center">
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

                {/* Status Toggle */}
                <td className="py-3 px-3 text-center">
                  <button
                    onClick={() => togglePublishStatus(item.id)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-full transition-colors cursor-pointer ${
                      item.status === 'published'
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }`}
                  >
                    {item.status === 'published' ? 'লাইভ' : 'খসড়া'}
                  </button>
                </td>

                {/* Views */}
                <td className="py-3 px-3 text-center text-xs font-mono text-gray-600">
                  {toBengaliNumber(item.views || 0)}
                </td>

                {/* Actions: Edit, Delete */}
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end space-x-1.5">
                    <button
                      onClick={() => onEditArticle(item)}
                      className="p-1.5 rounded text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      title="সম্পাদনা করুন"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteCandidate(item)}
                      className="p-1.5 rounded text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredNews.length === 0 && (
        <div className="py-12 text-center text-gray-500 text-sm">
          কোনো সংবাদ পাওয়া যায়নি।
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
              আপনি কি নিশ্চিত যে নিচের সংবাদটি স্থায়ীভাবে মুছে ফেলতে চান?
            </p>
            <div className="p-3 bg-red-50 rounded border border-red-200 text-xs font-semibold text-red-950 mb-5">
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
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
