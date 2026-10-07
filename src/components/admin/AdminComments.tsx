import React, { useState } from 'react';
import {
  MessageSquare,
  CheckCircle,
  EyeOff,
  Trash2,
  ExternalLink,
  Clock,
  User,
  Mail
} from 'lucide-react';
import { useNews } from '../../context/NewsContext';
import { toBengaliNumber } from '../../utils/bengali';

interface AdminCommentsProps {
  onOpenArticle?: (id: string) => void;
}

export const AdminComments: React.FC<AdminCommentsProps> = ({
  onOpenArticle
}) => {
  const { comments, approveComment, hideComment, deleteComment } = useNews();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredComments = comments.filter(c => {
    if (filterStatus === 'all') return true;
    return c.status === filterStatus;
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-red-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              মন্তব্য মডারেশন (Comments Management)
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            পাঠকদের মন্তব্যের অনুমোদন, স্থগিতকরণ ও সংরক্ষণ
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${
              filterStatus === 'all'
                ? 'bg-red-700 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            সব ({toBengaliNumber(comments.length)})
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${
              filterStatus === 'approved'
                ? 'bg-emerald-700 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            অনুমোদিত ({toBengaliNumber(comments.filter(c => c.status === 'approved').length)})
          </button>
          <button
            onClick={() => setFilterStatus('hidden')}
            className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${
              filterStatus === 'hidden'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            লুকানো ({toBengaliNumber(comments.filter(c => c.status === 'hidden').length)})
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments.map(comment => (
          <div
            key={comment.id}
            className="p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-colors shadow-2xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center text-xs">
                  {comment.authorName.charAt(0)}
                </div>
                <div>
                  <span className="font-bold text-sm text-gray-900 block">
                    {comment.authorName}
                  </span>
                  {comment.email && (
                    <span className="text-[11px] text-gray-500 block">
                      {comment.email}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-400">{comment.createdAt}</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    comment.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {comment.status === 'approved' ? 'অনুমোদিত' : 'লুকানো'}
                </span>
              </div>
            </div>

            {/* Comment Body */}
            <p className="text-sm text-gray-800 leading-relaxed mb-3">
              "{comment.content}"
            </p>

            {/* Target Article Reference */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs">
              <span className="text-gray-500 line-clamp-1">
                সংবাদ:{' '}
                <strong className="text-gray-800">
                  {comment.articleTitle}
                </strong>
              </span>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 shrink-0">
                {comment.status !== 'approved' && (
                  <button
                    onClick={() => approveComment(comment.id)}
                    className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>অনুমোদন দিন</span>
                  </button>
                )}

                {comment.status === 'approved' && (
                  <button
                    onClick={() => hideComment(comment.id)}
                    className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>লুকিয়ে রাখুন</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    if (window.confirm('আপনি কি এই মন্তব্যটি স্থায়ীভাবে মুছে ফেলতে চান?')) {
                      deleteComment(comment.id);
                    }
                  }}
                  className="p-1 rounded text-red-600 hover:bg-red-50 cursor-pointer"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredComments.length === 0 && (
          <div className="py-12 text-center text-gray-500 text-sm">
            এই ফিল্টারে কোনো মন্তব্য পাওয়া যায়নি।
          </div>
        )}
      </div>
    </div>
  );
};
