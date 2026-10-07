import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Copy,
  Check,
  Plus,
  ExternalLink
} from 'lucide-react';
import { useNews } from '../../context/NewsContext';
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

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    const mediaName = name.trim() || `image-${Date.now()}.jpg`;
    addMedia(mediaName, url.trim(), '1.8 MB');

    setName('');
    setUrl('');
  };

  const copyUrl = (id: string, imgUrl: string) => {
    navigator.clipboard.writeText(imgUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-red-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              মিডিয়া লাইব্রেরি (Media Library)
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            সংবাদের ফটো গ্যালারি, ব্যানার ও আপলোড ব্যবস্থাপনা
          </p>
        </div>
      </div>

      {/* Upload Box */}
      <form
        onSubmit={handleUpload}
        className="bg-gray-50 border border-gray-200 p-4 rounded-xl"
      >
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Upload className="w-4 h-4 text-red-700" />
          <span>নতুন ছবি আপলোড / যুক্ত করুন (Image URL)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              ছবির ফাইল নাম / শিরোনাম
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="যেমন: dhaka-metro-rail.jpg"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              ছবির ওয়েব লিঙ্ক (Direct Image URL) *
            </label>
            <input
              type="text"
              required
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-red-600"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>লাইব্রেরিতে যুক্ত করুন</span>
        </button>
      </form>

      {/* Media Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map(item => (
          <div
            key={item.id}
            className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-red-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
              <img
                src={item.url}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {onSelectImageForNews && (
                <button
                  onClick={() => onSelectImageForNews(item.url)}
                  className="absolute inset-0 bg-red-900/70 text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  সংবাদে নির্বাচন করুন
                </button>
              )}
            </div>

            <div className="p-3">
              <h4 className="text-xs font-bold text-gray-900 truncate" title={item.name}>
                {item.name}
              </h4>
              <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1">
                <span>{item.size}</span>
                <span>{item.createdAt}</span>
              </div>

              {/* Actions */}
              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => copyUrl(item.id, item.url)}
                  className="text-xs font-semibold text-gray-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                  title="URL কপি করুন"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">কপি হয়েছে</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>URL কপি</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    if (window.confirm('আপনি কি এই ছবিটি মুছে ফেলতে চান?')) {
                      deleteMedia(item.id);
                    }
                  }}
                  className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
