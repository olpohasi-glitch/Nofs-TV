import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle,
  Image as ImageIcon,
  Flame,
  Star,
  ArrowLeft,
  Calendar,
  Clock,
  Sparkles
} from 'lucide-react';
import { useNews } from '../../context/NewsContext';
import { NewsArticle } from '../../types';
import { getCurrentBengaliDate } from '../../utils/bengali';

interface AdminAddNewsProps {
  editingArticle?: NewsArticle | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminAddNews: React.FC<AdminAddNewsProps> = ({
  editingArticle,
  onSuccess,
  onCancel
}) => {
  const { categories, reporters, addNews, updateNews, media } = useNews();
  const bengaliDate = getCurrentBengaliDate();

  const [title, setTitle] = useState(editingArticle?.title || '');
  const [subtitle, setSubtitle] = useState(editingArticle?.subtitle || '');
  const [summary, setSummary] = useState(editingArticle?.summary || '');
  const [content, setContent] = useState(editingArticle?.content || '');
  const [category, setCategory] = useState(
    editingArticle?.category || (categories[0]?.name || 'জাতীয়')
  );
  const [reporterId, setReporterId] = useState(
    editingArticle?.reporterId || (reporters[0]?.id || '')
  );
  const [image, setImage] = useState(
    editingArticle?.image ||
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'
  );
  const [imageCaption, setImageCaption] = useState(
    editingArticle?.imageCaption || ''
  );
  const [publishDate, setPublishDate] = useState(
    editingArticle?.publishDate || bengaliDate.gregorianDate
  );
  const [publishTime, setPublishTime] = useState(
    editingArticle?.publishTime || 'দুপুর ১২:০০'
  );
  const [tagsInput, setTagsInput] = useState(
    editingArticle?.tags?.join(', ') || 'বাংলাদেশ, সংবাদ'
  );
  const [isBreaking, setIsBreaking] = useState(
    editingArticle?.isBreaking || false
  );
  const [isFeatured, setIsFeatured] = useState(
    editingArticle?.isFeatured || false
  );
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>(
    editingArticle?.status || 'published'
  );

  const [notification, setNotification] = useState('');

  // Selected reporter details
  const selectedReporter =
    reporters.find(r => r.id === reporterId) || reporters[0];

  const handleSubmit = (finalStatus: 'published' | 'draft') => {
    if (!title.trim() || !content.trim()) {
      alert('অনুগ্রহ করে সংবাদের শিরোনাম এবং বিস্তারিত খবর পূরণ করুন।');
      return;
    }

    const tagsArray = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const articleData = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      slug: title.trim().toLowerCase().replace(/\s+/g, '-'),
      summary: summary.trim() || title.trim(),
      content: content.trim(),
      category,
      reporterId: selectedReporter?.id || 'rep-1',
      reporterName: selectedReporter?.name || 'M. Ajmol Hussain Jakir',
      reporterRole: selectedReporter?.role || 'Founder & Administrator',
      image: image.trim(),
      imageCaption: imageCaption.trim(),
      publishDate,
      publishTime,
      tags: tagsArray,
      isBreaking,
      isFeatured,
      status: finalStatus
    };

    if (editingArticle) {
      updateNews(editingArticle.id, articleData);
      setNotification('সংবাদটি সফলভাবে আপডেট করা হয়েছে!');
    } else {
      addNews(articleData);
      setNotification('নতুন সংবাদ সফলভাবে তৈরি ও সংরক্ষণ করা হয়েছে!');
    }

    setTimeout(() => {
      onSuccess();
    }, 1000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {editingArticle ? 'সংবাদ সম্পাদনা করুন' : 'নতুন সংবাদ যুক্ত করুন'}
            </h1>
            <p className="text-xs text-gray-500">
              NOFS TV ডিজিটাল নিউজরুম কন্টেন্ট ম্যানেজমেন্ট
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            খসড়া সংরক্ষণ (Save Draft)
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('published')}
            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{editingArticle ? 'আপডেট করুন' : 'প্রকাশ করুন (Publish)'}</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Title, Subtitle, Summary, Content */}
        <div className="lg:col-span-8 space-y-5">
          {/* News Title */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              সংবাদের মূল শিরোনাম (News Title) *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="স্পষ্ট ও আকর্ষণীয় সংবাদ শিরোনাম লিখুন..."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-base font-semibold focus:outline-none focus:border-red-600 focus:bg-white"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              উপশিরোনাম (Subheadline)
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              placeholder="সংবাদের সারসংক্ষেপ বা দ্বিতীয় গুরুত্বপূর্ণ তথ্য..."
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-600 focus:bg-white"
            />
          </div>

          {/* Short Description / Summary */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              সংক্ষিপ্ত বিবরণ (Short Description / Excerpt) *
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="হোমপেজ ও সামাজিক মাধ্যমে প্রদর্শনের জন্য দুই লাইনের সংক্ষেপ..."
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-600 focus:bg-white"
            ></textarea>
          </div>

          {/* Full News Content */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-gray-800">
                বিস্তারিত সংবাদ (Full News Content) *
              </label>
              <span className="text-[11px] text-gray-400">
                প্যারাগ্রাফ আলাদা করতে জোড়া এন্টার (Double Enter) দিন
              </span>
            </div>
            <textarea
              rows={12}
              required
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="বিস্তারিত প্রতিবেদন লিখুন..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm font-serif leading-relaxed focus:outline-none focus:border-red-600 focus:bg-white"
            ></textarea>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              ট্যাগসমূহ (Tags - কমা দিয়ে পৃথক করুন)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="জাতীয়, অর্থনীতি, সিলেট, প্রযুক্তি"
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-600"
            />
          </div>
        </div>

        {/* Right Column (4 cols): Meta settings, Category, Reporter, Image, Toggles */}
        <div className="lg:col-span-4 space-y-5 bg-gray-50 p-4 rounded-xl border border-gray-200">
          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              ক্যাটাগরি (Category) *
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-600 font-medium"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reporter Dropdown */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              প্রতিবেদক (Reporter) *
            </label>
            <select
              value={reporterId}
              onChange={e => setReporterId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-600 font-medium"
            >
              {reporters.map(rep => (
                <option key={rep.id} value={rep.id}>
                  {rep.name} — ({rep.role})
                </option>
              ))}
            </select>
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              ফিচার্ড ইমেজ লিঙ্ক (Image URL) *
            </label>
            <div className="space-y-2">
              <input
                type="text"
                value={image}
                onChange={e => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-red-600"
              />
              {/* Media library presets quick select */}
              <div className="text-[11px] text-gray-500">
                <span>মিডিয়া লাইব্রেরি থেকে বাছাই করুন:</span>
                <div className="grid grid-cols-4 gap-1.5 mt-1.5">
                  {media.slice(0, 4).map(m => (
                    <img
                      key={m.id}
                      src={m.url}
                      alt={m.name}
                      onClick={() => setImage(m.url)}
                      className={`h-12 w-full object-cover rounded cursor-pointer border ${
                        image === m.url ? 'border-red-600 ring-2 ring-red-400' : 'border-gray-200'
                      }`}
                      title={m.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Image Caption */}
            <input
              type="text"
              value={imageCaption}
              onChange={e => setImageCaption(e.target.value)}
              placeholder="ছবির ক্যাপশন লিখুন..."
              className="w-full mt-2 px-3 py-1.5 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-red-600"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                প্রকাশ তারিখ
              </label>
              <input
                type="text"
                value={publishDate}
                onChange={e => setPublishDate(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                প্রকাশের সময়
              </label>
              <input
                type="text"
                value={publishTime}
                onChange={e => setPublishTime(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded text-xs"
              />
            </div>
          </div>

          {/* Toggles: Breaking & Featured */}
          <div className="space-y-3 pt-3 border-t border-gray-200">
            {/* Breaking News Toggle */}
            <label className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-red-300">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-600" />
                <span className="text-xs font-bold text-gray-800">
                  ব্রেকিং নিউজ টিকার
                </span>
              </div>
              <input
                type="checkbox"
                checked={isBreaking}
                onChange={e => setIsBreaking(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded cursor-pointer accent-red-600"
              />
            </label>

            {/* Featured News Toggle */}
            <label className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-amber-300">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-gray-800">
                  প্রধান ফিচার্ড সংবাদ
                </span>
              </div>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={e => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded cursor-pointer accent-red-600"
              />
            </label>
          </div>

          {/* Submit Actions */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleSubmit('published')}
              className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{editingArticle ? 'সংবাদ হালনাগাদ করুন' : 'সরাসরি প্রকাশ করুন'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
