import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X, AlertCircle } from 'lucide-react';
import { NewsArticle } from '../../types';

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  article: NewsArticle | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  article,
  isDeleting,
  onConfirm,
  onClose
}) => {
  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleting) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !article) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      {/* Backdrop click dismiss */}
      <div
        className="fixed inset-0"
        onClick={!isDeleting ? onClose : undefined}
      />

      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-red-100 overflow-hidden transform transition-all animate-in zoom-in-95 duration-150">
        {/* Accent Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-rose-600 to-red-700" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          aria-label="বন্ধ করুন"
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0 shadow-inner">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <div className="pr-6">
            <h3
              id="delete-modal-title"
              className="text-lg sm:text-xl font-bold text-gray-900 leading-snug"
            >
              সংবাদ স্থায়ীভাবে মুছে ফেলার নিশ্চিতকরণ
            </h3>
            <p className="text-xs text-red-600 font-semibold mt-0.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>সাবধানতা: এই কাজটি পূর্বাবস্থায় ফিরিয়ে আনা যাবে না</span>
            </p>
          </div>
        </div>

        {/* Body Description */}
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          আপনি কি নিশ্চিত যে নিচের সংবাদটি NOFS TV ডাটাবেজ থেকে স্থায়ীভাবে মুছে ফেলতে চান? মুছে ফেলার পর ওয়েবসাইট বা অ্যাডমিন প্যানেল থেকে এই সংবাদের আর কোনো তথ্য পুনরুদ্ধার করা সম্ভব হবে না।
        </p>

        {/* Article Summary Box */}
        <div className="p-3.5 bg-gradient-to-br from-red-50/70 to-orange-50/40 rounded-xl border border-red-200/80 mb-6 space-y-2">
          <div className="flex items-center gap-3">
            {article.image && (
              <img
                src={article.image}
                alt=""
                className="w-14 h-11 rounded-lg object-cover border border-red-200 shrink-0 bg-gray-200"
              />
            )}
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-gray-900 line-clamp-2 leading-tight">
                {article.title}
              </span>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-gray-500">
                <span className="px-1.5 py-0.5 rounded bg-white text-gray-700 font-medium border border-gray-200">
                  {article.category}
                </span>
                <span>•</span>
                <span>{article.reporterName}</span>
                <span>•</span>
                <span className={`font-semibold ${article.status === 'published' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {article.status === 'published' ? 'প্রকাশিত (Live)' : 'খসড়া (Draft)'}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-gray-400 font-mono pt-1 border-t border-red-100/60 flex items-center justify-between">
            <span>ID: {article.id}</span>
            <span>প্রকাশকাল: {article.publishDate}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            বাতিল করুন (Cancel)
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full sm:w-auto px-5 py-2.5 bg-red-700 hover:bg-red-800 active:bg-red-900 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-red-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>মুছে ফেলা হচ্ছে...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>হ্যাঁ, স্থায়ীভাবে মুছে ফেলুন</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
