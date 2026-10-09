import React from 'react';
import {
  Newspaper,
  Eye,
  MessageSquare,
  FolderTree,
  Flame,
  CheckCircle2,
  Clock,
  Plus,
  TrendingUp,
  Radio,
  Sparkles,
  Database,
  ShieldCheck,
  HardDrive
} from 'lucide-react';
import { useNews } from '../../context/NewsContext';
import { toBengaliNumber } from '../../utils/bengali';
import { NewsArticle } from '../../types';

interface AdminOverviewProps {
  onNavigateTab: (tab: any) => void;
  onEditArticle: (article: NewsArticle) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  onNavigateTab,
  onEditArticle
}) => {
  const { news, categories, comments, breakingNews, reporters, isFirestoreConnected, adminUser } = useNews();

  const totalNews = news.length;
  const publishedNews = news.filter(n => n.status === 'published').length;
  const draftNews = news.filter(n => n.status === 'draft').length;
  const totalViews = news.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalComments = comments.length;
  const totalCategories = categories.length;

  const recentNews = news.slice(0, 5);

  const stats = [
    {
      title: 'মোট সংবাদ (Total News)',
      value: toBengaliNumber(totalNews),
      sub: `${toBengaliNumber(publishedNews)} প্রকাশিত`,
      icon: Newspaper,
      color: 'bg-blue-500/10 text-blue-600 border-blue-200'
    },
    {
      title: 'প্রকাশিত সংবাদ (Published)',
      value: toBengaliNumber(publishedNews),
      sub: 'ওয়েবসাইটে লাইভ',
      icon: CheckCircle2,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200'
    },
    {
      title: 'খসড়া সংবাদ (Draft)',
      value: toBengaliNumber(draftNews),
      sub: 'অপ্রকাশিত খসড়া',
      icon: Clock,
      color: 'bg-amber-500/10 text-amber-600 border-amber-200'
    },
    {
      title: 'মোট ভিউজ (Total Views)',
      value: toBengaliNumber(totalViews),
      sub: 'পাঠক সংযোগ',
      icon: Eye,
      color: 'bg-purple-500/10 text-purple-600 border-purple-200'
    },
    {
      title: 'পাঠকের মন্তব্য (Comments)',
      value: toBengaliNumber(totalComments),
      sub: `${toBengaliNumber(comments.filter(c => c.status === 'approved').length)} অনুমোদিত`,
      icon: MessageSquare,
      color: 'bg-rose-500/10 text-rose-600 border-rose-200'
    },
    {
      title: 'ক্যাটাগরি (Categories)',
      value: toBengaliNumber(totalCategories),
      sub: 'নিউজ বিভাগসমূহ',
      icon: FolderTree,
      color: 'bg-indigo-500/10 text-indigo-600 border-indigo-200'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-red-800 to-slate-900 text-white rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-block px-2.5 py-0.5 bg-red-700 text-amber-300 text-xs font-bold rounded mb-2">
            NOFS TV নিউজ সেন্ট্রাল
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight">
            স্বাগতম, M. Ajmol Hussain Jakir
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            প্রতিষ্ঠাতা ও প্রধান প্রশাসক • NOFS TV ডিজিটাল সংবাদ পোর্টাল
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('add-news')}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন সংবাদ যুক্ত করুন</span>
          </button>
          <button
            onClick={() => onNavigateTab('breaking-news')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Flame className="w-4 h-4" />
            <span>ব্রেকিং নিউজ</span>
          </button>
        </div>
      </div>

      {/* Firebase Cloud Infrastructure Status Card */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-4 sm:p-5 shadow-xs border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-700/20 border border-red-500/30 rounded-xl text-amber-400 shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm text-white">Firebase পারসিস্টেন্ট ব্যাকএন্ড ও ক্লাউড ডেটাবেস</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {isFirestoreConnected ? 'Firestore লাইভ কানেক্টেড' : 'ক্লাউড সক্রিয়'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  Firebase Storage যুক্ত
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                প্রজেক্ট: <span className="font-mono text-amber-300">citric-fulcrum-fmn89</span> • অফিসিয়াল অ্যাডমিন: <span className="font-mono text-slate-100 font-semibold">{adminUser.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>রিয়েল অথেনটিকেশন সক্রিয়</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-extrabold text-gray-900 mt-1">
                  {stat.value}
                </h3>
                <span className="text-[11px] text-gray-400 mt-0.5 block">
                  {stat.sub}
                </span>
              </div>
              <div className={`p-3 rounded-xl border ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent News Management Quick Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-red-600" />
            <h2 className="text-base font-bold text-gray-900">
              সর্বশেষ প্রকাশিত সংবাদের তালিকা
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('all-news')}
            className="text-xs font-bold text-red-700 hover:text-red-900 cursor-pointer"
          >
            সকল সংবাদ দেখুন ({toBengaliNumber(totalNews)}) →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">সংবাদ শিরোনাম</th>
                <th className="py-3 px-4">ক্যাটাগরি</th>
                <th className="py-3 px-4">প্রতিবেদক</th>
                <th className="py-3 px-4">অবস্থা</th>
                <th className="py-3 px-4">ভিউ</th>
                <th className="py-3 px-4 text-right">পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentNews.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3 px-4 max-w-xs">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.image}
                        alt=""
                        className="w-10 h-8 rounded object-cover shrink-0"
                      />
                      <span className="font-semibold text-gray-900 line-clamp-1">
                        {item.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 text-xs font-medium rounded">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-600">
                    {item.reporterName}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold rounded-full ${
                        item.status === 'published'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.status === 'published' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                        }`}
                      ></span>
                      <span>{item.status === 'published' ? 'প্রকাশিত (Published)' : 'খসড়া (Draft)'}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs font-mono">
                    {toBengaliNumber(item.views || 0)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onEditArticle(item)}
                      className="px-2.5 py-1 text-xs font-semibold bg-gray-100 hover:bg-red-50 hover:text-red-700 text-gray-700 rounded transition-colors cursor-pointer"
                    >
                      সম্পাদনা
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Category & Ticker Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Breaking News */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-600" />
              <h3 className="text-sm font-bold text-gray-900">
                চলমান ব্রেকিং নিউজ ({toBengaliNumber(breakingNews.filter(b => b.isActive).length)})
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('breaking-news')}
              className="text-xs text-red-700 font-bold hover:underline cursor-pointer"
            >
              ব্যবস্থাপনা
            </button>
          </div>

          <div className="space-y-2">
            {breakingNews.slice(0, 3).map(b => (
              <div
                key={b.id}
                className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-xs flex items-center justify-between"
              >
                <span className="line-clamp-1 font-medium text-gray-800">
                  {b.text}
                </span>
                <span
                  className={`shrink-0 ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    b.isActive
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {b.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Reporters */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900">
              নিউজ ডেস্ক ও প্রতিবেদক দল
            </h3>
            <button
              onClick={() => onNavigateTab('reporters')}
              className="text-xs text-red-700 font-bold hover:underline cursor-pointer"
            >
              সকল প্রতিবেদক
            </button>
          </div>

          <div className="space-y-2.5">
            {reporters.slice(0, 3).map(rep => (
              <div
                key={rep.id}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={rep.avatar}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">
                      {rep.name}
                    </span>
                    <span className="text-[11px] text-gray-500 block">
                      {rep.role}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono text-gray-600">
                  {toBengaliNumber(news.filter(n => n.reporterName === rep.name).length)} সংবাদ
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
