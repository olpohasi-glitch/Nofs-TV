import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import {
  NewsArticle,
  Category,
  Reporter,
  BreakingNewsItem,
  Comment,
  MediaItem,
  SiteSettings,
  NOFS_TV_LOGO_URL
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
import {
  adminSignIn,
  adminSignOut,
  subscribeToAuth,
  initializeAdminAccount,
  OFFICIAL_ADMIN_EMAIL
} from '../services/firebaseAuth';
import {
  subscribeToNews,
  saveNewsToFirestore,
  deleteNewsFromFirestore,
  subscribeToCategories,
  saveCategoryToFirestore,
  deleteCategoryFromFirestore,
  subscribeToReporters,
  saveReporterToFirestore,
  deleteReporterFromFirestore,
  subscribeToMedia,
  saveMediaItemToFirestore,
  deleteMediaItemFromFirestore,
  subscribeToComments,
  addCommentToFirestore,
  updateCommentStatusInFirestore,
  deleteCommentFromFirestore,
  subscribeToSettings,
  saveSettingsToFirestore,
  seedInitialFirestoreData
} from '../services/firestoreService';
import { testFirestoreConnection } from '../lib/firebase';

interface NewsContextType {
  news: NewsArticle[];
  categories: Category[];
  reporters: Reporter[];
  breakingNews: BreakingNewsItem[];
  comments: Comment[];
  media: MediaItem[];
  settings: SiteSettings;
  // Firebase Auth State
  firebaseUser: FirebaseUser | null;
  isAdminLoggedIn: boolean;
  isAuthLoading: boolean;
  adminUser: { name: string; role: string; email: string };
  loginAdmin: (password: string) => Promise<void>;
  setupAdminAccount: (password: string) => Promise<void>;
  logoutAdmin: () => Promise<void>;
  // Firestore Connection State
  isFirestoreConnected: boolean;
  seedFirestore: () => Promise<{ seeded: boolean; message: string }>;
  // News operations (Persistent to Firestore)
  addNews: (article: Omit<NewsArticle, 'id' | 'createdAt' | 'views'>) => Promise<string>;
  updateNews: (id: string, article: Partial<NewsArticle>) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  toggleBreakingStatus: (id: string) => Promise<void>;
  toggleFeaturedStatus: (id: string) => Promise<void>;
  togglePublishStatus: (id: string) => Promise<void>;
  publishNews: (id: string) => Promise<void>;
  unpublishNews: (id: string) => Promise<void>;
  incrementViews: (id: string) => void;
  // Breaking news ticker
  addBreakingNews: (text: string, articleId?: string) => void;
  updateBreakingNews: (id: string, text: string, isActive: boolean, articleId?: string) => void;
  deleteBreakingNews: (id: string) => void;
  toggleBreakingNewsActive: (id: string) => void;
  // Category operations
  addCategory: (name: string, slug: string, description: string) => Promise<void>;
  updateCategory: (id: string, name: string, slug: string, description: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  // Reporter operations
  addReporter: (reporter: Omit<Reporter, 'id' | 'articleCount'>) => Promise<void>;
  updateReporter: (id: string, reporter: Partial<Reporter>) => Promise<void>;
  deleteReporter: (id: string) => Promise<void>;
  // Comments operations
  addComment: (articleId: string, articleTitle: string, authorName: string, email: string, content: string) => Promise<void>;
  approveComment: (id: string) => Promise<void>;
  hideComment: (id: string) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  // Media library operations
  addMedia: (name: string, url: string, size?: string) => Promise<void>;
  deleteMedia: (id: string) => Promise<void>;
  // Settings operations
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Database States (synced with Cloud Firestore)
  const [news, setNews] = useState<NewsArticle[]>(INITIAL_NEWS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [reporters, setReporters] = useState<Reporter[]>(INITIAL_REPORTERS);
  const [breakingNews, setBreakingNews] = useState<BreakingNewsItem[]>(INITIAL_BREAKING_NEWS);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [media, setMedia] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);

  // Auth and Firestore Connection States
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(false);

  // 1. Subscribe to Firebase Auth
  useEffect(() => {
    const unsubscribe = subscribeToAuth(user => {
      setFirebaseUser(user);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isAdminLoggedIn = Boolean(
    firebaseUser && firebaseUser.email && firebaseUser.email.toLowerCase() === OFFICIAL_ADMIN_EMAIL.toLowerCase()
  );

  // 2. Test Firestore connection and subscribe to real-time general collections
  useEffect(() => {
    testFirestoreConnection().then(res => {
      setIsFirestoreConnected(res.connected);
    });

    const unsubCategories = subscribeToCategories(firestoreCategories => {
      if (firestoreCategories.length > 0) {
        setCategories(firestoreCategories);
      }
    });

    const unsubReporters = subscribeToReporters(firestoreReporters => {
      if (firestoreReporters.length > 0) {
        setReporters(firestoreReporters);
      }
    });

    const unsubComments = subscribeToComments(firestoreComments => {
      if (firestoreComments.length > 0) {
        setComments(firestoreComments);
      }
    });

    const unsubMedia = subscribeToMedia(firestoreMedia => {
      if (firestoreMedia.length > 0) {
        setMedia(firestoreMedia);
      }
    });

    const unsubSettings = subscribeToSettings(firestoreSettings => {
      setSettings(firestoreSettings);
    });

    return () => {
      unsubCategories();
      unsubReporters();
      unsubComments();
      unsubMedia();
      unsubSettings();
    };
  }, []);

  // 3. News subscription with backend query security:
  // - Public visitors: Query strictly where('status', '==', 'published') (Drafts NEVER exposed)
  // - Authorized Administrator: Query all news (drafts + published)
  const hasLoadedNewsOnce = useRef(false);

  useEffect(() => {
    let autoSeedingStarted = false;

    const unsubNews = subscribeToNews(
      async firestoreArticles => {
        if (firestoreArticles.length > 0) {
          hasLoadedNewsOnce.current = true;
          setNews(firestoreArticles);
        } else if (isAdminLoggedIn && !hasLoadedNewsOnce.current && !autoSeedingStarted) {
          // If Firestore news collection is empty upon authorized admin login, auto-seed initial database documents
          autoSeedingStarted = true;
          try {
            const res = await seedInitialFirestoreData();
            if (res.seeded) {
              hasLoadedNewsOnce.current = true;
            }
          } catch (err) {
            console.warn('Auto-seed note:', err);
          }
        } else if (hasLoadedNewsOnce.current) {
          // All articles were deleted by admin
          setNews([]);
        }
      },
      err => {
        console.warn('News subscription notice:', err);
      },
      isAdminLoggedIn
    );

    return () => unsubNews();
  }, [isAdminLoggedIn]);

  const adminUser = {
    name: settings.founderName || 'M. Ajmol Hussain Jakir',
    role: settings.founderRole || 'প্রতিষ্ঠাতা ও প্রকাশক',
    email: OFFICIAL_ADMIN_EMAIL
  };

  // Auth Actions
  const loginAdmin = async (password: string) => {
    await adminSignIn(password);
  };

  const setupAdminAccount = async (password: string) => {
    await initializeAdminAccount(password);
  };

  const logoutAdmin = async () => {
    await adminSignOut();
  };

  const seedFirestore = async () => {
    const result = await seedInitialFirestoreData();
    return result;
  };

  // ==========================================
  // NEWS OPERATIONS (FIRESTORE)
  // ==========================================

  const addNews = async (articleData: Omit<NewsArticle, 'id' | 'createdAt' | 'views'>): Promise<string> => {
    const newId = `news-${Date.now()}`;
    const newArticle: NewsArticle = {
      ...articleData,
      id: newId,
      createdAt: new Date().toISOString(),
      views: 0,
      shortDescription: articleData.shortDescription || articleData.summary || '',
      featuredImage: articleData.featuredImage || articleData.image || '',
      reporter: articleData.reporter || articleData.reporterName || 'NOFS TV নিউজরুম',
      additionalImages: articleData.additionalImages || []
    };

    hasLoadedNewsOnce.current = true;
    // Optimistic UI update
    setNews(prev => [newArticle, ...prev]);

    // Persist to Cloud Firestore
    await saveNewsToFirestore(newArticle);
    return newId;
  };

  const updateNews = async (id: string, updatedFields: Partial<NewsArticle>) => {
    const target = news.find(n => n.id === id);
    if (!target) return;
    const merged: NewsArticle = {
      ...target,
      ...updatedFields,
      updatedAt: new Date().toISOString()
    };
    hasLoadedNewsOnce.current = true;
    setNews(prev => prev.map(item => (item.id === id ? merged : item)));
    await saveNewsToFirestore(merged);
  };

  const deleteNews = async (id: string) => {
    hasLoadedNewsOnce.current = true;
    setNews(prev => prev.filter(item => item.id !== id));
    await deleteNewsFromFirestore(id);
  };

  const toggleBreakingStatus = async (id: string) => {
    const target = news.find(n => n.id === id);
    if (!target) return;
    const updated: NewsArticle = { ...target, isBreaking: !target.isBreaking };
    hasLoadedNewsOnce.current = true;
    setNews(prev => prev.map(item => (item.id === id ? updated : item)));
    await saveNewsToFirestore(updated);
  };

  const toggleFeaturedStatus = async (id: string) => {
    const target = news.find(n => n.id === id);
    if (!target) return;
    const updated: NewsArticle = { ...target, isFeatured: !target.isFeatured };
    hasLoadedNewsOnce.current = true;
    setNews(prev => prev.map(item => (item.id === id ? updated : item)));
    await saveNewsToFirestore(updated);
  };

  const togglePublishStatus = async (id: string) => {
    const target = news.find(n => n.id === id);
    if (!target) return;
    const nextStatus = target.status === 'published' ? 'draft' : 'published';
    const updated: NewsArticle = { ...target, status: nextStatus, updatedAt: new Date().toISOString() };
    hasLoadedNewsOnce.current = true;
    setNews(prev => prev.map(item => (item.id === id ? updated : item)));
    await saveNewsToFirestore(updated);
  };

  const publishNews = async (id: string) => {
    const target = news.find(n => n.id === id);
    if (!target) return;
    const updated: NewsArticle = { ...target, status: 'published', updatedAt: new Date().toISOString() };
    hasLoadedNewsOnce.current = true;
    setNews(prev => prev.map(item => (item.id === id ? updated : item)));
    await saveNewsToFirestore(updated);
  };

  const unpublishNews = async (id: string) => {
    const target = news.find(n => n.id === id);
    if (!target) return;
    const updated: NewsArticle = { ...target, status: 'draft', updatedAt: new Date().toISOString() };
    hasLoadedNewsOnce.current = true;
    setNews(prev => prev.map(item => (item.id === id ? updated : item)));
    await saveNewsToFirestore(updated);
  };

  const incrementViews = (id: string) => {
    setNews(prev =>
      prev.map(item => (item.id === id ? { ...item, views: (item.views || 0) + 1 } : item))
    );
  };

  // Breaking News ticker
  const addBreakingNews = (text: string, articleId?: string) => {
    const newItem: BreakingNewsItem = {
      id: `break-${Date.now()}`,
      text,
      createdAt: new Date().toISOString(),
      isActive: true,
      articleId
    };
    setBreakingNews(prev => [newItem, ...prev]);
  };

  const updateBreakingNews = (id: string, text: string, isActive: boolean, articleId?: string) => {
    setBreakingNews(prev =>
      prev.map(item => (item.id === id ? { ...item, text, isActive, articleId } : item))
    );
  };

  const deleteBreakingNews = (id: string) => {
    setBreakingNews(prev => prev.filter(item => item.id !== id));
  };

  const toggleBreakingNewsActive = (id: string) => {
    setBreakingNews(prev =>
      prev.map(item => (item.id === id ? { ...item, isActive: !item.isActive } : item))
    );
  };

  // Category Operations
  const addCategory = async (name: string, slug: string, description: string) => {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      description,
      order: categories.length + 1
    };
    setCategories(prev => [...prev, newCat]);
    await saveCategoryToFirestore(newCat);
  };

  const updateCategory = async (id: string, name: string, slug: string, description: string) => {
    const updated = categories.map(c =>
      c.id === id ? { ...c, name, slug, description } : c
    );
    setCategories(updated);
    const cat = updated.find(c => c.id === id);
    if (cat) await saveCategoryToFirestore(cat);
  };

  const deleteCategory = async (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    await deleteCategoryFromFirestore(id);
  };

  // Reporter Operations
  const addReporter = async (reporterData: Omit<Reporter, 'id' | 'articleCount'>) => {
    const newRep: Reporter = {
      ...reporterData,
      id: `rep-${Date.now()}`,
      articleCount: 0
    };
    setReporters(prev => [...prev, newRep]);
    await saveReporterToFirestore(newRep);
  };

  const updateReporter = async (id: string, reporterData: Partial<Reporter>) => {
    const updated = reporters.map(r =>
      r.id === id ? { ...r, ...reporterData } : r
    );
    setReporters(updated);
    const rep = updated.find(r => r.id === id);
    if (rep) await saveReporterToFirestore(rep);
  };

  const deleteReporter = async (id: string) => {
    setReporters(prev => prev.filter(r => r.id !== id));
    await deleteReporterFromFirestore(id);
  };

  // Comments Operations
  const addComment = async (
    articleId: string,
    articleTitle: string,
    authorName: string,
    email: string,
    content: string
  ) => {
    const commentId = await addCommentToFirestore({
      articleId,
      authorName,
      email,
      content
    });
    setComments(prev => [
      {
        id: commentId,
        articleId,
        articleTitle,
        authorName,
        email,
        content,
        createdAt: new Date().toISOString(),
        status: 'pending'
      },
      ...prev
    ]);
  };

  const approveComment = async (id: string) => {
    setComments(prev =>
      prev.map(c => (c.id === id ? { ...c, status: 'approved' } : c))
    );
    await updateCommentStatusInFirestore(id, 'approved');
  };

  const hideComment = async (id: string) => {
    setComments(prev =>
      prev.map(c => (c.id === id ? { ...c, status: 'hidden' } : c))
    );
    await updateCommentStatusInFirestore(id, 'hidden');
  };

  const deleteComment = async (id: string) => {
    setComments(prev => prev.filter(c => c.id !== id));
    await deleteCommentFromFirestore(id);
  };

  // Media Operations
  const addMedia = async (name: string, url: string, size: string = '1.2 MB') => {
    const newItem: MediaItem = {
      id: `med-${Date.now()}`,
      name,
      url,
      size,
      type: 'image/jpeg',
      createdAt: new Date().toISOString()
    };
    setMedia(prev => [newItem, ...prev]);
    await saveMediaItemToFirestore(newItem);
  };

  const deleteMedia = async (id: string) => {
    setMedia(prev => prev.filter(m => m.id !== id));
    await deleteMediaItemFromFirestore(id);
  };

  // Settings Operations
  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const merged: SiteSettings = {
      ...settings,
      ...newSettings,
      siteName: 'NOFS TV',
      contactEmail: 'nofstv.bd@gmail.com',
      founderName: 'M. Ajmol Hussain Jakir',
      addressSylhet: 'প্রধান কার্যালয়: সিলেট, বাংলাদেশ',
      logoUrl: NOFS_TV_LOGO_URL
    };
    setSettings(merged);
    await saveSettingsToFirestore(merged);
  };

  const resetToDefaults = async () => {
    setSettings(INITIAL_SETTINGS);
    await saveSettingsToFirestore(INITIAL_SETTINGS);
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
        firebaseUser,
        isAdminLoggedIn,
        isAuthLoading,
        adminUser,
        loginAdmin,
        setupAdminAccount,
        logoutAdmin,
        isFirestoreConnected,
        seedFirestore,
        addNews,
        updateNews,
        deleteNews,
        toggleBreakingStatus,
        toggleFeaturedStatus,
        togglePublishStatus,
        publishNews,
        unpublishNews,
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

export const useNews = (): NewsContextType => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};
