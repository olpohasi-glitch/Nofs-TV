import React, { useState } from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Edit,
  FolderTree,
  Flame,
  Star,
  Users,
  MessageSquare,
  Image as ImageIcon,
  Settings,
  User,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  Bell
} from 'lucide-react';
import { useNews } from '../../context/NewsContext';
import { AdminTab, NewsArticle, NOFS_TV_LOGO_URL } from '../../types';
import { AdminOverview } from './AdminOverview';
import { AdminAddNews } from './AdminAddNews';
import { AdminAllNews } from './AdminAllNews';
import { AdminCategories } from './AdminCategories';
import { AdminBreakingNews } from './AdminBreakingNews';
import { AdminReporters } from './AdminReporters';
import { AdminComments } from './AdminComments';
import { AdminMediaLibrary } from './AdminMediaLibrary';
import { AdminSettings } from './AdminSettings';
import { AdminProfile } from './AdminProfile';
import { toBengaliNumber } from '../../utils/bengali';

interface AdminDashboardLayoutProps {
  onBackToSite: () => void;
}

export const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({
  onBackToSite
}) => {
  const {
    adminUser,
    settings,
    logoutAdmin,
    news,
    comments,
    breakingNews
  } = useNews();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleEditArticle = (article: NewsArticle) => {
    setEditingArticle(article);
    setActiveTab('edit-news');
  };

  const handleAddNew = () => {
    setEditingArticle(null);
    setActiveTab('add-news');
  };

  const handleLogout = () => {
    logoutAdmin();
    onBackToSite();
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'ড্যাশবোর্ড (Dashboard)',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'add-news',
      label: 'সংবাদ যুক্ত করুন (Add News)',
      icon: PlusCircle,
      badge: null
    },
    {
      id: 'all-news',
      label: 'সকল সংবাদ (All News)',
      icon: FileText,
      badge: toBengaliNumber(news.length)
    },
    {
      id: 'edit-news',
      label: 'সংবাদ সম্পাদনা (Edit News)',
      icon: Edit,
      badge: editingArticle ? '১' : null
    },
    {
      id: 'categories',
      label: 'ক্যাটাগরি (Categories)',
      icon: FolderTree,
      badge: null
    },
    {
      id: 'breaking-news',
      label: 'ব্রেকিং নিউজ (Breaking News)',
      icon: Flame,
      badge: toBengaliNumber(breakingNews.filter(b => b.isActive).length)
    },
    {
      id: 'featured-news',
      label: 'ফিচার্ড সংবাদ (Featured News)',
      icon: Star,
      badge: toBengaliNumber(news.filter(n => n.isFeatured).length)
    },
    {
      id: 'reporters',
      label: 'প্রতিবেদক (Reporters)',
      icon: Users,
      badge: null
    },
    {
      id: 'comments',
      label: 'মন্তব্য (Comments)',
      icon: MessageSquare,
      badge: toBengaliNumber(comments.length)
    },
    {
      id: 'media',
      label: 'মিডিয়া লাইব্রেরি (Media Library)',
      icon: ImageIcon,
      badge: null
    },
    {
      id: 'settings',
      label: 'ওয়েবসাইট সেটিংস (Settings)',
      icon: Settings,
      badge: null
    },
    {
      id: 'profile',
      label: 'অ্যাডমিন প্রোফাইল (Admin Profile)',
      icon: User,
      badge: null
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Admin Header Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-1.5 rounded-md hover:bg-slate-800 text-slate-300"
            >
              {mobileSidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Official Logo */}
            <div className="flex items-center gap-2">
              <img
                src={settings.logoUrl || NOFS_TV_LOGO_URL}
                alt="NOFS TV"
                className="h-8 sm:h-9 w-auto object-contain bg-white/10 px-1 py-0.5 rounded"
              />
              <span className="text-xs text-slate-400 hidden sm:inline border-l border-slate-700 pl-2">
                অ্যাডমিন ও নিউজরুম কন্ট্রোল
              </span>
            </div>
          </div>

          {/* Right Header items */}
          <div className="flex items-center space-x-3">
            {/* View live public portal */}
            <button
              onClick={onBackToSite}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
            >
              <ExternalLink className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">লাইভ ওয়েবসাইট দেখুন</span>
              <span className="sm:hidden">ওয়েবসাইট</span>
            </button>

            {/* Admin identity badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-red-700 flex items-center justify-center font-bold text-white text-xs">
                JH
              </div>
              <div className="hidden md:block text-left text-xs">
                <span className="font-bold text-slate-100 block">
                  {settings.founderName}
                </span>
                <span className="text-[10px] text-amber-400 block">
                  {settings.founderRole}
                </span>
              </div>
            </div>

            {/* Logout shortcut */}
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title="লগআউট"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-20 w-64 bg-slate-950 text-slate-300 flex flex-col justify-between shrink-0 transition-transform duration-300 border-r border-slate-800 ${
            mobileSidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full lg:translate-x-0'
          }`}
          style={{ top: '57px' }}
        >
          {/* Scrollable menu */}
          <div className="p-3 space-y-1 overflow-y-auto flex-1">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              নিউজ কন্ট্রোল মেনু
            </div>

            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as AdminTab);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-red-700 text-white shadow-xs'
                      : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-white' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-red-900 text-white'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Logout button */}
            <div className="pt-3 mt-3 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>লগআউট (Logout)</span>
              </button>
            </div>
          </div>

          {/* Sidebar Footer info */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400">
            <span className="block font-semibold text-slate-200">
              NOFS TV v2.4
            </span>
            <span>প্রশাসক: {settings.founderName}</span>
          </div>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <AdminOverview
              onNavigateTab={tab => setActiveTab(tab)}
              onEditArticle={handleEditArticle}
            />
          )}

          {activeTab === 'add-news' && (
            <AdminAddNews
              onSuccess={() => setActiveTab('all-news')}
              onCancel={() => setActiveTab('dashboard')}
            />
          )}

          {activeTab === 'edit-news' && (
            <AdminAddNews
              editingArticle={editingArticle}
              onSuccess={() => {
                setEditingArticle(null);
                setActiveTab('all-news');
              }}
              onCancel={() => {
                setEditingArticle(null);
                setActiveTab('all-news');
              }}
            />
          )}

          {activeTab === 'all-news' && (
            <AdminAllNews
              onAddNew={handleAddNew}
              onEditArticle={handleEditArticle}
            />
          )}

          {activeTab === 'featured-news' && (
            <AdminAllNews
              onAddNew={handleAddNew}
              onEditArticle={handleEditArticle}
            />
          )}

          {activeTab === 'categories' && <AdminCategories />}

          {activeTab === 'breaking-news' && <AdminBreakingNews />}

          {activeTab === 'reporters' && <AdminReporters />}

          {activeTab === 'comments' && <AdminComments />}

          {activeTab === 'media' && <AdminMediaLibrary />}

          {activeTab === 'settings' && <AdminSettings />}

          {activeTab === 'profile' && <AdminProfile />}
        </main>
      </div>
    </div>
  );
};
