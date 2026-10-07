import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  NewsArticle,
  Category,
  Reporter,
  BreakingNewsItem,
  Comment,
  MediaItem,
  SiteSettings
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_REPORTERS,
  INITIAL_NEWS,
  INITIAL_BREAKING_NEWS,
  INITIAL_COMMENTS,
  INITIAL_MEDIA
} from '../data/initialData';

interface NewsContextType {
  news: NewsArticle[];
  categories: Category[];
  reporters: Reporter[];
  breakingNews: BreakingNewsItem[];
  comments: Comment[];
  media: MediaItem[];
  settings: SiteSettings;
  isAdminLoggedIn: boolean;
  adminUser: { name: string; role: string; email: string };
  loginAdmin: (userOrEmail: string, pass: string) => boolean;
  logoutAdmin: () => void;
  // News operations
  addNews: (article: Omit<NewsArticle, 'id' | 'createdAt' | 'views'>) => string;
  updateNews: (id: string, article: Partial<NewsArticle>) => void;
  deleteNews: (id: string) => void;
  toggleBreakingStatus: (id: string) => void;
  toggleFeaturedStatus: (id: string) => void;
  togglePublishStatus: (id: string) => void;
  incrementViews: (id: string) => void;
  // Breaking news ticker operations
  addBreakingNews: (text: string, articleId?: string) => void;
  updateBreakingNews: (id: string, text: string, isActive: boolean, articleId?: string) => void;
  deleteBreakingNews: (id: string) => void;
  toggleBreakingNewsActive: (id: string) => void;
  // Category operations
  addCategory: (name: string, slug: string, description: string) => void;
  updateCategory: (id: string, name: string, slug: string, description: string) => void;
  deleteCategory: (id: string) => void;
  // Reporter operations
  addReporter: (reporter: Omit<Reporter, 'id' | 'articleCount'>) => void;
  updateReporter: (id: string, reporter: Partial<Reporter>) => void;
  deleteReporter: (id: string) => void;
  // Comments operations
  addComment: (articleId: string, articleTitle: string, authorName: string, email: string, content: string) => void;
  approveComment: (id: string) => void;
  hideComment: (id: string) => void;
  deleteComment: (id: string) => void;
  // Media library operations
  addMedia: (name: string, url: string, size?: string) => void;
  deleteMedia: (id: string) => void;
  // Settings operations
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  resetToDefaults: () => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

const STORAGE_KEYS = {
  NEWS: 'nofs_tv_news_v3',
  CATEGORIES: 'nofs_tv_categories_v3',
  REPORTERS: 'nofs_tv_reporters_v3',
  BREAKING: 'nofs_tv_breaking_v3',
  COMMENTS: 'nofs_tv_comments_v3',
  MEDIA: 'nofs_tv_media_v3',
  SETTINGS: 'nofs_tv_settings_v3',
  AUTH: 'nofs_tv_auth_v3',
};

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [news, setNews] = useState<NewsArticle[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NEWS);
    return saved ? JSON.parse(saved) : INITIAL_NEWS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [reporters, setReporters] = useState<Reporter[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REPORTERS);
    return saved ? JSON.parse(saved) : INITIAL_REPORTERS;
  });

  const [breakingNews, setBreakingNews] = useState<BreakingNewsItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BREAKING);
    return saved ? JSON.parse(saved) : INITIAL_BREAKING_NEWS;
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  const [media, setMedia] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEDIA);
    return saved ? JSON.parse(saved) : INITIAL_MEDIA;
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    return saved === 'true';
  });

  const adminUser = {
    name: settings.founderName || 'M. Ajmol Hussain Jakir',
    role: settings.founderRole || 'Founder & Administrator',
    email: settings.contactEmail || 'admin@nofstv.com'
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTERS, JSON.stringify(reporters));
  }, [reporters]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BREAKING, JSON.stringify(breakingNews));
  }, [breakingNews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(media));
  }, [media]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  // Auth
  const loginAdmin = (userOrEmail: string, pass: string): boolean => {
    // Allows standard admin credentials or quick demo access
    if (
      (userOrEmail.trim().toLowerCase() === 'admin@nofstv.com' ||
        userOrEmail.trim().toLowerCase() === 'admin' ||
        userOrEmail.trim().toLowerCase() === 'ajmol@nofstv.com' ||
        userOrEmail.trim().toLowerCase() === 'nofstv') &&
      (pass === 'admin123' || pass === 'admin' || pass === '123456')
    ) {
      setIsAdminLoggedIn(true);
      return true;
    }
    // Also accept any non-empty password in demo mode if requested
    if (userOrEmail.trim().length > 3 && pass.length >= 4) {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
  };

  // News Actions
  const addNews = (articleData: Omit<NewsArticle, 'id' | 'createdAt' | 'views'>): string => {
    const id = `news-${Date.now()}`;
    const newArticle: NewsArticle = {
      ...articleData,
      id,
      createdAt: new Date().toISOString(),
      views: 1
    };

    setNews(prev => [newArticle, ...prev]);

    // If marked as breaking, add to breaking ticker automatically
    if (newArticle.isBreaking) {
      addBreakingNews(newArticle.title, id);
    }

    return id;
  };

  const updateNews = (id: string, articleData: Partial<NewsArticle>) => {
    setNews(prev =>
      prev.map(item => (item.id === id ? { ...item, ...articleData } : item))
    );
  };

  const deleteNews = (id: string) => {
    setNews(prev => prev.filter(item => item.id !== id));
    setBreakingNews(prev => prev.filter(item => item.articleId !== id));
    setComments(prev => prev.filter(item => item.articleId !== id));
  };

  const toggleBreakingStatus = (id: string) => {
    setNews(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextState = !item.isBreaking;
          if (nextState) {
            addBreakingNews(item.title, item.id);
          } else {
            setBreakingNews(bList => bList.filter(b => b.articleId !== id));
          }
          return { ...item, isBreaking: nextState };
        }
        return item;
      })
    );
  };

  const toggleFeaturedStatus = (id: string) => {
    setNews(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isFeatured: !item.isFeatured } : item
      )
    );
  };

  const togglePublishStatus = (id: string) => {
    setNews(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              status: item.status === 'published' ? 'draft' : 'published'
            }
          : item
      )
    );
  };

  const incrementViews = (id: string) => {
    setNews(prev =>
      prev.map(item =>
        item.id === id ? { ...item, views: (item.views || 0) + 1 } : item
      )
    );
  };

  // Breaking News Ticker Actions
  const addBreakingNews = (text: string, articleId?: string) => {
    const newItem: BreakingNewsItem = {
      id: `brk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      text,
      articleId,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    setBreakingNews(prev => [newItem, ...prev]);
  };

  const updateBreakingNews = (
    id: string,
    text: string,
    isActive: boolean,
    articleId?: string
  ) => {
    setBreakingNews(prev =>
      prev.map(item =>
        item.id === id ? { ...item, text, isActive, articleId } : item
      )
    );
  };

  const deleteBreakingNews = (id: string) => {
    setBreakingNews(prev => prev.filter(item => item.id !== id));
  };

  const toggleBreakingNewsActive = (id: string) => {
    setBreakingNews(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  // Categories Actions
  const addCategory = (name: string, slug: string, description: string) => {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description,
      order: categories.length + 1
    };
    setCategories(prev => [...prev, newCat]);
  };

  const updateCategory = (id: string, name: string, slug: string, description: string) => {
    setCategories(prev =>
      prev.map(cat => (cat.id === id ? { ...cat, name, slug, description } : cat))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  // Reporter Actions
  const addReporter = (reporterData: Omit<Reporter, 'id' | 'articleCount'>) => {
    const newReporter: Reporter = {
      ...reporterData,
      id: `rep-${Date.now()}`,
      articleCount: 0
    };
    setReporters(prev => [...prev, newReporter]);
  };

  const updateReporter = (id: string, reporterData: Partial<Reporter>) => {
    setReporters(prev =>
      prev.map(rep => (rep.id === id ? { ...rep, ...reporterData } : rep))
    );
  };

  const deleteReporter = (id: string) => {
    setReporters(prev => prev.filter(rep => rep.id !== id));
  };

  // Comments Actions
  const addComment = (
    articleId: string,
    articleTitle: string,
    authorName: string,
    email: string,
    content: string
  ) => {
    const newComment: Comment = {
      id: `cmt-${Date.now()}`,
      articleId,
      articleTitle,
      authorName,
      email,
      content,
      createdAt: 'এখন মাত্র',
      status: 'approved' // Automatically approved for interactive demo experience
    };
    setComments(prev => [newComment, ...prev]);
  };

  const approveComment = (id: string) => {
    setComments(prev =>
      prev.map(cmt => (cmt.id === id ? { ...cmt, status: 'approved' } : cmt))
    );
  };

  const hideComment = (id: string) => {
    setComments(prev =>
      prev.map(cmt => (cmt.id === id ? { ...cmt, status: 'hidden' } : cmt))
    );
  };

  const deleteComment = (id: string) => {
    setComments(prev => prev.filter(cmt => cmt.id !== id));
  };

  // Media Actions
  const addMedia = (name: string, url: string, size = '1.5 MB') => {
    const newItem: MediaItem = {
      id: `med-${Date.now()}`,
      name,
      url,
      size,
      type: 'image/jpeg',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setMedia(prev => [newItem, ...prev]);
  };

  const deleteMedia = (id: string) => {
    setMedia(prev => prev.filter(item => item.id !== id));
  };

  // Settings Actions
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetToDefaults = () => {
    setNews(INITIAL_NEWS);
    setCategories(INITIAL_CATEGORIES);
    setReporters(INITIAL_REPORTERS);
    setBreakingNews(INITIAL_BREAKING_NEWS);
    setComments(INITIAL_COMMENTS);
    setMedia(INITIAL_MEDIA);
    setSettings(INITIAL_SETTINGS);
  };

  return (
    <NewsContext.Provider
      value={{
        news,
        categories,
        reporters,
        breakingNews,
        comments,
        media,
        settings,
        isAdminLoggedIn,
        adminUser,
        loginAdmin,
        logoutAdmin,
        addNews,
        updateNews,
        deleteNews,
        toggleBreakingStatus,
        toggleFeaturedStatus,
        togglePublishStatus,
        incrementViews,
        addBreakingNews,
        updateBreakingNews,
        deleteBreakingNews,
        toggleBreakingNewsActive,
        addCategory,
        updateCategory,
        deleteCategory,
        addReporter,
        updateReporter,
        deleteReporter,
        addComment,
        approveComment,
        hideComment,
        deleteComment,
        addMedia,
        deleteMedia,
        updateSettings,
        resetToDefaults
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};
