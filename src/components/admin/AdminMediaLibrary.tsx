import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Copy,
  Check,
  Plus,
  ExternalLink,
  HardDrive,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useNews } from '../../context/NewsContext';
import { uploadMediaFile } from '../../services/firebaseStorage';
import { MediaItem } from '../../types';

interface AdminMediaLibraryProps {
  onSelectImageForNews?: (imageUrl: string) => void;
}

export const AdminMediaLibrary: React.FC<AdminMediaLibraryProps> = ({
  onSelectImageForNews
}) => {
  const { media, addMedia, deleteMedia } = useNews();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Direct File Upload to Firebase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const result = await uploadMediaFile(file, 'news');
      await addMedia(result.name, result.url, result.size);
      setUploadSuccess(`"${result.name}" Firebase Storage-এ সফলভাবে আপলোড হয়েছে!`);
      setTimeout(() => setUploadSuccess(null), 4000);
    } catch (err: unknown) {
      const error = err as Error;
      setUploadError(error.message || 'Firebase Storage আপলোড ব্যর্থ হয়েছে।');
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleManualAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    const mediaName = name.trim() || `image-${Date.now()}.jpg`;
    addMedia(mediaName, url.trim(), '1.8 MB');

    setName('');
    setUrl('');
    setUploadSuccess('মিডিয়া সফলভাবে তালিকায় যুক্ত করা হয়েছে!');
    setTimeout(() => setUploadSuccess(null), 3000);
  };

  const copyUrl = (id: string, imgUrl: string) => {
    navigator.clipboard.writeText(imgUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-red-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              মিডিয়া লাইব্রেরি (Media Library)
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Cloud Firestore এবং Firebase Storage-এ ছবির ব্যবস্থাপনা ও সিঙ্ক
          </p>
        </div>

        {/* Firebase Storage badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs">
          <HardDrive className="w-4 h-4 text-amber-400" />
          <span>Firebase Storage সক্রিয়</span>
        </div>
      </div>

      {uploadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {uploadError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Upload Options: Direct File Upload to Firebase Storage OR Image URL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Firebase Storage Direct File Upload */}
        <div className="bg-slate-50 border-2 border-dashed border-gray-300 p-5 rounded-xl flex flex-col justify-center items-center text-center">
          <Upload className="w-8 h-8 text-red-600 mb-2" />
          <h3 className="text-sm font-bold text-gray-900 mb-1">
            সরাসরি ফাইল আপলোড (Firebase Storage)
          </h3>
          <p className="text-xs text-gray-500 mb-3 max-w-xs">
            কম্পিউটার বা মোবাইল থেকে JPG, PNG বা WEBP ছবি নির্বাচন করুন
          </p>

          <label className="relative">
            <input
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={handleFileUpload}
              className="hidden"
            />
            <span
              className={`px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-colors ${
                isUploading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Storage-এ আপলোড হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>ডিভাইস থেকে ছবি আপলোড</span>
                </>
              )}
            </span>
          </label>
        </div>

        {/* Web Image URL addition */}
        <form
          onSubmit={handleManualAddUrl}
          className="bg-gray-50 border border-gray-200 p-5 rounded-xl flex flex-col justify-between"
        >
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Plus className="w-4 h-4 text-red-700" />
              <span>ওয়েব ইমেজ লিঙ্ক (Direct URL) যোগ করুন</span>
            </h3>

            <div className="space-y-2 mb-3">
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="ছবির বিবরণ / ক্যাপশন (ঐচ্ছিক)"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://... (ইমেজ লিঙ্ক)"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-red-600"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-fit px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>লাইব্রেরিতে লিঙ্ক যুক্ত করুন</span>
          </button>
        </form>
      </div>

      {/* Media Gallery Grid */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">
          সংরক্ষিত মিডিয়া সমূহ ({media.length} টি)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map(item => (
            <div
              key={item.id}
              className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Image Preview */}
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={e => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=400&q=80';
                  }}
                />
                <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 p-1 rounded-md backdrop-blur-xs">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 text-white hover:text-amber-300"
                    title="নতুন ট্যাবে দেখুন"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => deleteMedia(item.id)}
                    className="p-1 text-white hover:text-red-400 cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Media Info */}
              <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h4
                    className="text-xs font-bold text-gray-800 truncate"
                    title={item.name}
                  >
                    {item.name}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1">
                    <span>{item.size || '1.5 MB'}</span>
                    <span>{item.createdAt.slice(0, 10)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                  <button
                    onClick={() => copyUrl(item.id, item.url)}
                    className="flex-1 py-1.5 px-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700 text-[11px]">কপি হয়েছে</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="text-[11px]">URL কপি</span>
                      </>
                    )}
                  </button>

                  {onSelectImageForNews && (
                    <button
                      onClick={() => onSelectImageForNews(item.url)}
                      className="py-1.5 px-2.5 bg-red-700 hover:bg-red-800 text-white text-[11px] font-bold rounded cursor-pointer"
                    >
                      ব্যবহার করুন
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
