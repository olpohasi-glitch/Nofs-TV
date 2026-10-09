import React, { useState } from 'react';
import {
  Save,
  CheckCircle,
  Image as ImageIcon,
  Flame,
  Star,
  ArrowLeft,
  Calendar,
  Clock,
  Globe,
  FileText,
  AlertTriangle,
  Eye,
  EyeOff
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
  const [selectedStatus, setSelectedStatus] = useState<'published' | 'draft'>(
    editingArticle?.status === 'draft' ? 'draft' : 'published'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Selected reporter details
  const selectedReporter =
    reporters.find(r => r.id === reporterId) || reporters[0];

  const handleSubmit = async (finalStatus: 'published' | 'draft') => {
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
      reporterRole: selectedReporter?.role || 'প্রতিষ্ঠাতা ও প্রকাশক',
      image: image.trim(),
      imageCaption: imageCaption.trim(),
      publishDate,
      publishTime,
      tags: tagsArray,
      isBreaking,
      isFeatured,
      status: finalStatus
    };

    setIsSubmitting(true);
    try {
      if (editingArticle) {
        await updateNews(editingArticle.id, articleData);
        setNotification({
          type: 'success',
          message:
            finalStatus === 'draft'
              ? 'সংবাদটি সফলভাবে খসড়া (Draft) হিসেবে আপডেট ও সংরক্ষণ করা হয়েছে!'
              : 'সংবাদটি সফলভাবে প্রকাশিত (Published) হয়েছে এবং পাবলিক পোর্টালে লাইভ!'
        });
      } else {
        await addNews(articleData);
        setNotification({
          type: 'success',
          message:
            finalStatus === 'draft'
              ? 'নতুন সংবাদটি খসড়া (Draft) হিসেবে নিরাপদে সংরক্ষণ করা হয়েছে! (পাবলিক সাইটে গোপন)'
              : 'নতুন সংবাদটি সফলভাবে প্রকাশিত (Published) হয়েছে!'
        });
      }

      setTimeout(() => {
        onSuccess();
      }, 1200);
    } catch (err: unknown) {
      const error = err as Error;
      setNotification({
        type: 'error',
        message: `অপারেশন ব্যর্থ হয়েছে: ${error.message}`
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
            title="ফিরে যান"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {editingArticle ? 'সংবাদ সম্পাদনা করুন (Edit News)' : 'নতুন সংবাদ লিখুন (Add News)'}
              </h1>
              {editingArticle && (
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    editingArticle.status === 'published'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {editingArticle.status === 'published' ? 'লাইভ প্রকাশিত' : 'খসড়া'}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              NOFS TV ডিজিটাল নিউজরুম • ক্লাউড ফায়ারস্টোর পারসিস্টেন্ট সংরক্ষণ
            </p>
          </div>
        </div>

        {/* Action Buttons at Top (Requirement 3: Save as Draft option) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit('draft')}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            title="খসড়া হিসেবে সেভ করুন (পাবলিক সাইটে প্রদর্শিত হবে না)"
          >
            <FileText className="w-4 h-4 text-amber-700" />
            <span>খসড়া সংরক্ষণ (Save Draft)</span>
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit('published')}
            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="ওয়েবসাইটে অবিলম্বে প্রকাশ করুন"
          >
            <Globe className="w-4 h-4" />
            <span>{editingArticle ? 'আপডেট ও প্রকাশ করুন' : 'সরাসরি প্রকাশ (Publish)'}</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3.5 rounded-lg text-xs font-semibold flex items-center gap-2 border ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Current Draft / Published Notice Banner */}
      {editingArticle && (
        <div
          className={`p-3 rounded-lg text-xs flex items-center justify-between border ${
            editingArticle.status === 'published'
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
              : 'bg-amber-50/70 border-amber-200 text-amber-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {editingArticle.status === 'published' ? (
              <Globe className="w-4 h-4 text-emerald-600" />
            ) : (
              <Clock className="w-4 h-4 text-amber-600" />
            )}
            <span>
              {editingArticle.status === 'published'
                ? 'এই সংবাদটি বর্তমানে পাবলিক ওয়েবসাইটে সরাসরি প্রকাশিত (Published) অবস্থায় রয়েছে।'
                : 'এই সংবাদটি বর্তমানে খসড়া (Draft) অবস্থায় রয়েছে। সাধারণ দর্শকরা এটি দেখতে পাবেন না।'}
            </span>
          </div>
          <span className="font-mono text-[11px] text-gray-500">
            ID: {editingArticle.id}
          </span>
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

        {/* Right Column (4 cols): Meta settings, Category, Reporter, Image, Status, Toggles */}
        <div className="lg:col-span-4 space-y-5 bg-gray-50 p-4 rounded-xl border border-gray-200">
          {/* Publication Status Card (Requirement 2 & 3: Clear Publish / Unpublish status) */}
          <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-2xs">
            <label className="block text-xs font-bold text-gray-800 mb-2">
              প্রকাশনা অবস্থা (Publication Status)
            </label>
            <div className="space-y-2">
              <label
                className={`flex items-start gap-2.5 p-2 rounded-lg border cursor-pointer transition-colors ${
                  selectedStatus === 'published'
                    ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="newsStatus"
                  value="published"
                  checked={selectedStatus === 'published'}
                  onChange={() => setSelectedStatus('published')}
                  className="mt-0.5 text-emerald-600 accent-emerald-600 cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-1 font-bold text-xs">
                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                    <span>প্রকাশিত (Published)</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">
                    সংবাদটি তাৎক্ষণিক পাবলিক ওয়েবসাইট ও ক্যাটাগরিতে লাইভ প্রদর্শিত হবে।
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-2.5 p-2 rounded-lg border cursor-pointer transition-colors ${
                  selectedStatus === 'draft'
                    ? 'bg-amber-50/60 border-amber-300 text-amber-950'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="newsStatus"
                  value="draft"
                  checked={selectedStatus === 'draft'}
                  onChange={() => setSelectedStatus('draft')}
                  className="mt-0.5 text-amber-600 accent-amber-600 cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-1 font-bold text-xs">
                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                    <span>খসড়া (Save as Draft)</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">
                    কেবলমাত্র অ্যাডমিন প্যানেলে ব্যক্তিগত থাকবে, পাবলিক সাইটে গোপন থাকবে।
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              সংবাদ ক্যাটাগরি (Category) *
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium focus:outline-none focus:border-red-600"
            >
              {categories.map(c => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reporter Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              প্রতিবেদক (Reporter) *
            </label>
            <select
              value={reporterId}
              onChange={e => setReporterId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium focus:outline-none focus:border-red-600"
            >
              {reporters.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.role})
                </option>
              ))}
            </select>
          </div>

          {/* Featured Image URL */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              ফিচার্ড ইমেজ URL (Featured Image) *
            </label>
            <input
              type="url"
              required
              value={image}
              onChange={e => setImage(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-red-600"
            />
            {image && (
              <div className="mt-2 relative rounded overflow-hidden border border-gray-200 aspect-video bg-gray-100">
                <img
                  src={image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={e => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
              </div>
            )}
          </div>

          {/* Image Caption */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              ছবির ক্যাপশন (Image Caption)
            </label>
            <input
              type="text"
              value={imageCaption}
              onChange={e => setImageCaption(e.target.value)}
              placeholder="ছবির বিবরণ বা আলোকচিত্রীর নাম..."
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-red-600"
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
                className="w-4 h-4 text-amber-600 rounded cursor-pointer accent-amber-600"
              />
            </label>
          </div>

          {/* Submit Actions at Bottom (Both Save Draft and Publish options) */}
          <div className="pt-3 border-t border-gray-200 space-y-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit('published')}
              className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
            >
              <Globe className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'সংরক্ষণ হচ্ছে...'
                  : editingArticle
                  ? 'সংবাদ হালনাগাদ ও প্রকাশ করুন'
                  : 'সরাসরি প্রকাশ করুন (Publish)'}
              </span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit('draft')}
              className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
            >
              <FileText className="w-4 h-4 text-amber-700" />
              <span>খসড়া হিসেবে সংরক্ষণ (Save as Draft)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
