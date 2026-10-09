/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NewsProvider, useNews } from './context/NewsContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { CategorySection } from './components/CategorySection';
import { VideoSection } from './components/VideoSection';
import { ArticleDetailPage } from './components/ArticleDetailPage';
import { SearchSystem } from './components/SearchSystem';
import { CategoryArchivePage } from './components/CategoryArchivePage';
import { EPaperModal } from './components/EPaperModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboardLayout } from './components/admin/AdminDashboardLayout';
import { PublicView } from './types';

function parseHashRoute(): {
  view: PublicView | 'admin-dashboard';
  articleId: string | null;
  category: string | null;
} {
  const hash = window.location.hash.replace(/^#/, '');
  if (hash === 'admin' || hash === 'admin-dashboard') {
    return { view: 'admin-dashboard', articleId: null, category: null };
  }
  if (hash === 'admin-login') {
    return { view: 'admin-login', articleId: null, category: null };
  }
  if (hash.startsWith('article/')) {
    const id = hash.replace('article/', '');
    return { view: 'article', articleId: id, category: null };
  }
  if (hash.startsWith('category/')) {
    const cat = decodeURIComponent(hash.replace('category/', ''));
    return { view: 'category', articleId: null, category: cat };
  }
  if (hash === 'search') {
    return { view: 'search', articleId: null, category: null };
  }
  return { view: 'home', articleId: null, category: null };
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
    if (catName === 'হোম') {
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

  // Filter published news for the public view
  const publishedNews = news.filter(n => n.status === 'published');

  // Specific Category helper filters
  const nationalArticles = publishedNews.filter(n => n.category === 'জাতীয়');
  const politicsArticles = publishedNews.filter(n => n.category === 'রাজনীতি');
  const sylhetArticles = publishedNews.filter(n => n.category === 'সিলেট');
  const internationalArticles = publishedNews.filter(n => n.category === 'আন্তর্জাতিক');
  const sportsArticles = publishedNews.filter(n => n.category === 'খেলাধুলা');
  const entertainmentArticles = publishedNews.filter(n => n.category === 'বিনোদন');
  const technologyArticles = publishedNews.filter(n => n.category === 'প্রযুক্তি');
  const educationArticles = publishedNews.filter(n => n.category === 'শিক্ষা');
  const economyArticles = publishedNews.filter(n => n.category === 'অর্থনীতি');
  const lifestyleArticles = publishedNews.filter(n => n.category === 'লাইফস্টাইল');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 selection:bg-red-700 selection:text-white">
      {/* Header */}
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
        {/* HOMEPAGE VIEW */}
        {currentView === 'home' && (
          <>
            {/* Hero News Section */}
            <HeroSection
              articles={publishedNews}
              onOpenArticle={handleOpenArticle}
              onSelectCategory={handleSelectCategory}
            />

            {/* জাতীয় সংবাদ */}
            <CategorySection
              categoryTitle="জাতীয় সংবাদ"
              categorySlug="national"
              articles={nationalArticles}
              onOpenArticle={handleOpenArticle}
              onViewAllCategory={() => handleSelectCategory('জাতীয়')}
            />

            {/* রাজনীতি */}
            <CategorySection
              categoryTitle="রাজনীতি"
              categorySlug="politics"
              articles={politicsArticles}
              onOpenArticle={handleOpenArticle}
              onViewAllCategory={() => handleSelectCategory('রাজনীতি')}
            />

            {/* সিলেট সংবাদ */}
            <CategorySection
              categoryTitle="সিলেট সংবাদ"
              categorySlug="sylhet"
              articles={sylhetArticles}
              onOpenArticle={handleOpenArticle}
              onViewAllCategory={() => handleSelectCategory('সিলেট')}
            />

            {/* আন্তর্জাতিক */}
            <CategorySection
              categoryTitle="আন্তর্জাতিক"
              categorySlug="international"
              articles={internationalArticles}
              onOpenArticle={handleOpenArticle}
              onViewAllCategory={() => handleSelectCategory('আন্তর্জাতিক')}
            />

            {/* Multimedia Video Broadcast Section */}
            <VideoSection />

            {/* খেলাধুলা */}
            <CategorySection
              categoryTitle="খেলাধুলা"
              categorySlug="sports"
              articles={sportsArticles}
              onOpenArticle={handleOpenArticle}
              onViewAllCategory={() => handleSelectCategory('খেলাধুলা')}
            />

            {/* অর্থনীতি */}
            <CategorySection
              categoryTitle="অর্থনীতি"
              categorySlug="economy"
              articles={economyArticles}
              onOpenArticle={handleOpenArticle}
              onViewAllCategory={() => handleSelectCategory('অর্থনীতি')}
            />

            {/* প্রযুক্তি */}
            <CategorySection
              categoryTitle="তথ্যপ্রযুক্তি ও গ্যাজেট"
              categorySlug="technology"
              articles={technologyArticles}
              onOpenArticle={handleOpenArticle}
              onViewAllCategory={() => handleSelectCategory('প্রযুক্তি')}
            />

            {/* শিক্ষা */}
            <CategorySection
              categoryTitle="শিক্ষা ও ক্যাম্পাস"
              categorySlug="education"
              articles={educationArticles}
              onOpenArticle={handleOpenArticle}
              onViewAllCategory={() => handleSelectCategory('শিক্ষা')}
            />

            {/* বিনোদন */}
            <CategorySection
              categoryTitle="বিনোদন ও সংস্কৃতি"
              categorySlug="entertainment"
              articles={entertainmentArticles}
              onOpenArticle={handleOpenArticle}
              onViewAllCategory={() => handleSelectCategory('বিনোদন')}
            />

            {/* লাইফস্টাইল */}
            <CategorySection
              categoryTitle="লাইফস্টাইল ও স্বাস্থ্য"
              categorySlug="lifestyle"
              articles={lifestyleArticles}
              onOpenArticle={handleOpenArticle}
              onViewAllCategory={() => handleSelectCategory('লাইফস্টাইল')}
            />
          </>
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
