import React, { useState } from 'react';
import { Flame, Plus, Trash2, Edit, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useNews } from '../../context/NewsContext';
import { BreakingNewsItem } from '../../types';
import { toBengaliNumber } from '../../utils/bengali';

export const AdminBreakingNews: React.FC = () => {
  const {
    breakingNews,
    news,
    addBreakingNews,
    updateBreakingNews,
    deleteBreakingNews,
    toggleBreakingNewsActive
  } = useNews();

  const [text, setText] = useState('');
  const [selectedArticleId, setSelectedArticleId] = useState('');
  const [editingItem, setEditingItem] = useState<BreakingNewsItem | null>(null);
  const [editText, setEditText] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    addBreakingNews(text.trim(), selectedArticleId || undefined);
    setText('');
    setSelectedArticleId('');
  };

  const handleSaveEdit = () => {
    if (editingItem && editText.trim()) {
      updateBreakingNews(
        editingItem.id,
        editText.trim(),
        editingItem.isActive,
        editingItem.articleId
      );
      setEditingItem(null);
      setEditText('');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              ব্রেকিং নিউজ টিকার ব্যবস্থাপনা
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            সক্রিয় ব্রেকিং নিউজ সরাসরি ওয়েবসাইটের শীর্ষ টিকারে সম্প্রচারিত হয়
          </p>
        </div>
      </div>

      {/* Add Breaking News Form */}
      <form
        onSubmit={handleAdd}
        className="bg-red-50/60 border border-red-200 p-4 rounded-xl"
      >
        <h3 className="text-sm font-bold text-red-950 mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-red-700" />
          <span>নতুন ব্রেকিং নিউজ যুক্ত করুন</span>
        </h3>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              ব্রেকিং নিউজের বিবরণ (Text) *
            </label>
            <input
              type="text"
              required
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="ব্রেকিং নিউজ: জরুরি খবরটি এখানে লিখুন..."
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-600 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              সম্পর্কিত সংবাদের সাথে লিঙ্ক করুন (ঐচ্ছিক)
            </label>
            <select
              value={selectedArticleId}
              onChange={e => setSelectedArticleId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-red-600"
            >
              <option value="">কোনো সংবাদের সাথে লিঙ্ক ছাড়া (সাধারণ নোটিশ)</option>
              {news.map(n => (
                <option key={n.id} value={n.id}>
                  {n.title} ({n.category})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>টিকারে যুক্ত ও প্রচার করুন</span>
          </button>
        </div>
      </form>

      {/* Active & All Tickers List */}
      <div>
        <h3 className="text-sm font-bold text-gray-800 mb-3">
          সংরক্ষিত ব্রেকিং নিউজ তালিকা ({toBengaliNumber(breakingNews.length)} টি)
        </h3>

        <div className="space-y-3">
          {breakingNews.map(item => {
            const isEditing = editingItem?.id === item.id;
            const linkedArticle = news.find(n => n.id === item.articleId);

            return (
              <div
                key={item.id}
                className="p-4 bg-white rounded-lg border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-gray-300 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-red-500 rounded text-xs font-medium focus:outline-none"
                      />
                      <button
                        onClick={handleSaveEdit}
                        className="px-3 py-1.5 bg-emerald-700 text-white text-xs font-bold rounded cursor-pointer"
                      >
                        সংরক্ষণ
                      </button>
                      <button
                        onClick={() => setEditingItem(null)}
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-bold rounded cursor-pointer"
                      >
                        বাতিল
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-bold text-gray-900 leading-snug">
                        {item.text}
                      </p>
                      {linkedArticle && (
                        <p className="text-xs text-red-600 font-medium mt-1">
                          সংযুক্ত খবর: {linkedArticle.title}
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {/* Active / Inactive Toggle */}
                  <button
                    onClick={() => toggleBreakingNewsActive(item.id)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-full transition-colors cursor-pointer ${
                      item.isActive
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {item.isActive ? 'সক্রিয় (টিকারে চলছে)' : 'নিষ্ক্রিয় (বন্ধ)'}
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setEditText(item.text);
                    }}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                    title="সম্পাদনা"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => deleteBreakingNews(item.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {breakingNews.length === 0 && (
            <p className="text-center text-sm text-gray-500 py-6">
              বর্তমানে কোনো ব্রেকিং নিউজ সংরক্ষিত নেই।
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
