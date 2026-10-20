/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NewsProvider, useNews } from './context/NewsContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { ArticleDetailPage } from './components/ArticleDetailPage';
import { SearchSystem } from './components/SearchSystem';
import { CategoryArchivePage } from './components/CategoryArchivePage';
import { EPaperModal } from './components/EPaperModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboardLayout } from './components/admin/AdminDashboardLayout';
import { PublicView } from './types';
import { isDemoArticle } from './data/initialData';
import { ErrorBoundary } from './components/ErrorBoundary';

function safeClearHash() {
  try {
    if (window.location.hash && window.location.hash !== '' && window.location.hash !== '#') {
      window.location.hash = '';
    }
  } catch (err) {
    console.warn('Could not clear hash:', err);
  }
}

function parseHashRoute(): {
  view: PublicView | 'admin-dashboard';
  articleId: string | null;
  category: string | null;
} {
  try {
    const rawHash = window.location.hash || '';
    const hash = rawHash.replace(/^#\/?/, '').trim();
    if (!hash) {
      return { view: 'home', articleId: null, category: null };
    }
    if (hash === 'admin' || hash === 'admin-dashboard') {
      return { view: 'admin-dashboard', articleId: null, category: null };
    }
    if (hash === 'admin-login') {
      return { view: 'admin-login', articleId: null, category: null };
    }
    if (hash.startsWith('article/')) {
      const id = hash.replace('article/', '').trim();
      return { view: id ? 'article' : 'home', articleId: id || null, category: null };
    }
    if (hash.startsWith('category/')) {
      const cat = decodeURIComponent(hash.replace('category/', '')).trim();
      return { view: cat ? 'category' : 'home', articleId: null, category: cat || null };
    }
    if (hash === 'search') {
      return { view: 'search', articleId: null, category: null };
    }
    return { view: 'home', articleId: null, category: null };
  } catch {
    return { view: 'home', articleId: null, category: null };
  }
}

function MainNewsApp() {
  const { news, isAdminLoggedIn, isAuthLoading } = useNews();
  const initialRoute = React.useMemo(() => parseHashRoute(), []);
  const [currentView, setCurrentView] = useState<PublicView | 'admin-dashboard'>(initialRoute.view);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(initialRoute.articleId);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialRoute.category);
  const [showEPaper, setShowEPaper] = useState(false);

  React.useEffect(() => {
    const onHashChange = () => {
      const route = parseHashRoute();
      setCurrentView(route.view);
      setSelectedArticleId(route.articleId);
      setSelectedCategory(route.category);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Global secret shortcut: Ctrl+Shift+A or Cmd+Shift+A to toggle Admin Login
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        handleOpenAdminLogin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminLoggedIn]);

  // Navigation handlers
  const handleNavigateHome = () => {
    setSelectedArticleId(null);
    setSelectedCategory(null);
    setCurrentView('home');
    if (window.location.hash) {
      history.pushState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (catName: string) => {
    if (catName === 'হোম' || catName === 'শীর্ষ সংবাদ') {
      handleNavigateHome();
      return;
    }
    setSelectedCategory(catName);
    setSelectedArticleId(null);
    setCurrentView('category');
    window.location.hash = `category/${encodeURIComponent(catName)}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenArticle = (id: string) => {
    setSelectedArticleId(id);
    setCurrentView('article');
    window.location.hash = `article/${id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSearch = () => {
    setCurrentView('search');
    window.location.hash = 'search';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdminLogin = () => {
    if (isAdminLoggedIn) {
      setCurrentView('admin-dashboard');
      window.location.hash = 'admin';
    } else {
      setCurrentView('admin-login');
      window.location.hash = 'admin-login';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If Admin is in the Dashboard view (Protected by Firebase Auth)
  if (currentView === 'admin-dashboard') {
    if (isAuthLoading) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            Firebase নিরাপত্তা ও অ্যাডমিন সেশন যাচাই করা হচ্ছে...
          </p>
        </div>
      );
    }

    if (!isAdminLoggedIn) {
      return (
        <AdminLogin
          onLoginSuccess={() => {
            setCurrentView('admin-dashboard');
            window.location.hash = 'admin';
          }}
          onBackToSite={() => {
            setCurrentView('home');
            history.pushState(null, '', window.location.pathname);
          }}
        />
      );
    }

    return (
      <AdminDashboardLayout
        onBackToSite={() => {
          setCurrentView('home');
          history.pushState(null, '', window.location.pathname);
        }}
        onLogout={() => {
          setCurrentView('home');
          history.pushState(null, '', window.location.pathname);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onViewPublicArticle={id => {
          setSelectedArticleId(id);
          setCurrentView('article');
          window.location.hash = `article/${id}`;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  // If Admin Login page is active
  if (currentView === 'admin-login') {
    if (isAdminLoggedIn) {
      return (
        <AdminDashboardLayout
          onBackToSite={() => {
            setCurrentView('home');
            history.pushState(null, '', window.location.pathname);
          }}
          onLogout={() => {
            setCurrentView('home');
            history.pushState(null, '', window.location.pathname);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onViewPublicArticle={id => {
            setSelectedArticleId(id);
            setCurrentView('article');
            window.location.hash = `article/${id}`;
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      );
    }
    return (
      <AdminLogin
        onLoginSuccess={() => {
          setCurrentView('admin-dashboard');
          window.location.hash = 'admin';
        }}
        onBackToSite={() => {
          setCurrentView('home');
          history.pushState(null, '', window.location.pathname);
        }}
      />
    );
  }

  // Filter published news for the public view (Never show demo or draft news)
  const publishedNews = news.filter(n => n.status === 'published' && !isDemoArticle(n));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 selection:bg-red-700 selection:text-white">
      {/* Header: Top Bar -> Main Header -> Category Nav -> Breaking News */}
      <Header
        currentView={currentView as PublicView}
        selectedCategory={selectedCategory}
        onNavigateHome={handleNavigateHome}
        onSelectCategory={handleSelectCategory}
        onOpenSearch={handleOpenSearch}
        onOpenArticle={handleOpenArticle}
        onOpenAdminLogin={handleOpenAdminLogin}
        onOpenEPaper={() => setShowEPaper(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* HOMEPAGE VIEW: Exact Bangladeshi News Portal Hierarchy */}
        {currentView === 'home' && (
          <HomePage
            articles={publishedNews}
            onOpenArticle={handleOpenArticle}
            onSelectCategory={handleSelectCategory}
          />
        )}

        {/* ARTICLE DETAIL VIEW */}
        {currentView === 'article' && selectedArticleId && (
          <ArticleDetailPage
            articleId={selectedArticleId}
            onOpenArticle={handleOpenArticle}
            onSelectCategory={handleSelectCategory}
            onNavigateHome={handleNavigateHome}
          />
        )}

        {/* CATEGORY ARCHIVE VIEW */}
        {currentView === 'category' && selectedCategory && (
          <CategoryArchivePage
            categoryName={selectedCategory}
            onOpenArticle={handleOpenArticle}
            onNavigateHome={handleNavigateHome}
            onSelectCategory={handleSelectCategory}
          />
        )}

        {/* SEARCH VIEW */}
        {currentView === 'search' && (
          <SearchSystem
            onOpenArticle={handleOpenArticle}
            onClose={handleNavigateHome}
            onSelectCategory={handleSelectCategory}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigateHome={handleNavigateHome}
        onSelectCategory={handleSelectCategory}
        onOpenAdminLogin={handleOpenAdminLogin}
        onOpenEPaper={() => setShowEPaper(true)}
      />

      {/* E-Paper Modal */}
      {showEPaper && <EPaperModal onClose={() => setShowEPaper(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <NewsProvider>
      <MainNewsApp />
    </NewsProvider>
  );
}
