import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  getDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  NewsArticle,
  Category,
  Reporter,
  MediaItem,
  Comment,
  SiteSettings
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_REPORTERS,
  INITIAL_NEWS
} from '../data/initialData';

// Collection references
const NEWS_COLLECTION = 'news';
const CATEGORIES_COLLECTION = 'categories';
const REPORTERS_COLLECTION = 'reporters';
const MEDIA_COLLECTION = 'media';
const COMMENTS_COLLECTION = 'comments';
const SETTINGS_COLLECTION = 'settings';
const SETTINGS_DOC_ID = 'global';

// ==========================================
// NEWS ARTICLES
// ==========================================

export function subscribeToNews(
  onUpdate: (articles: NewsArticle[]) => void,
  onError?: (err: Error) => void
) {
  const newsRef = collection(db, NEWS_COLLECTION);
  return onSnapshot(
    newsRef,
    snapshot => {
      const articles: NewsArticle[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        articles.push({
          id: docSnap.id,
          title: data.title || '',
          subtitle: data.subtitle || '',
          slug: data.slug || docSnap.id,
          shortDescription: data.shortDescription || data.summary || '',
          summary: data.summary || data.shortDescription || '',
          content: data.content || '',
          category: data.category || 'জাতীয়',
          reporter: data.reporter || data.reporterName || 'NOFS TV নিউজরুম',
          reporterId: data.reporterId || '',
          reporterName: data.reporterName || data.reporter || 'NOFS TV নিউজরুম',
          reporterRole: data.reporterRole || 'প্রতিবেদক',
          featuredImage:
            docSnap.id === 'news-1' && (!data.featuredImage || data.featuredImage.includes('photo-1540575467063'))
              ? 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'
              : data.featuredImage || data.image || '',
          image:
            docSnap.id === 'news-1' && (!data.image || data.image.includes('photo-1540575467063'))
              ? 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'
              : data.image || data.featuredImage || '',
          additionalImages: data.additionalImages || [],
          imageCaption: data.imageCaption || '',
          publishDate: data.publishDate || '',
          publishTime: data.publishTime || '',
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || '',
          isBreaking: Boolean(data.isBreaking),
          isFeatured: Boolean(data.isFeatured),
          status: (data.status as 'published' | 'draft' | 'archived') || 'published',
          views: data.views || 0,
          tags: data.tags || []
        });
      });
      // Sort latest first
      articles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(articles);
    },
    error => {
      console.warn('Firestore news listener error:', error);
      if (onError) onError(error);
    }
  );
}

export async function saveNewsToFirestore(article: NewsArticle): Promise<void> {
  const newsDocRef = doc(db, NEWS_COLLECTION, article.id);
  const now = new Date().toISOString();
  await setDoc(
    newsDocRef,
    {
      title: article.title,
      subtitle: article.subtitle || '',
      slug: article.slug || article.id,
      shortDescription: article.shortDescription || article.summary || '',
      summary: article.summary || article.shortDescription || '',
      content: article.content,
      category: article.category,
      reporter: article.reporter || article.reporterName,
      reporterName: article.reporterName || article.reporter,
      reporterId: article.reporterId || '',
      reporterRole: article.reporterRole || '',
      featuredImage: article.featuredImage || article.image,
      image: article.image || article.featuredImage,
      additionalImages: article.additionalImages || [],
      imageCaption: article.imageCaption || '',
      publishDate: article.publishDate,
      publishTime: article.publishTime || '',
      createdAt: article.createdAt || now,
      updatedAt: now,
      status: article.status || 'published',
      isBreaking: Boolean(article.isBreaking),
      isFeatured: Boolean(article.isFeatured),
      views: article.views || 0,
      tags: article.tags || []
    },
    { merge: true }
  );
}

export async function deleteNewsFromFirestore(id: string): Promise<void> {
  await deleteDoc(doc(db, NEWS_COLLECTION, id));
}

// ==========================================
// CATEGORIES
// ==========================================

export function subscribeToCategories(
  onUpdate: (categories: Category[]) => void,
  onError?: (err: Error) => void
) {
  const catRef = collection(db, CATEGORIES_COLLECTION);
  return onSnapshot(
    catRef,
    snapshot => {
      const items: Category[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          name: data.name || '',
          slug: data.slug || docSnap.id,
          description: data.description || '',
          order: data.order || 0
        });
      });
      items.sort((a, b) => a.order - b.order);
      onUpdate(items);
    },
    error => {
      if (onError) onError(error);
    }
  );
}

export async function saveCategoryToFirestore(category: Category): Promise<void> {
  await setDoc(
    doc(db, CATEGORIES_COLLECTION, category.id),
    {
      name: category.name,
      slug: category.slug,
      description: category.description,
      order: category.order
    },
    { merge: true }
  );
}

export async function deleteCategoryFromFirestore(id: string): Promise<void> {
  await deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
}

// ==========================================
// REPORTERS
// ==========================================

export function subscribeToReporters(
  onUpdate: (reporters: Reporter[]) => void,
  onError?: (err: Error) => void
) {
  const repRef = collection(db, REPORTERS_COLLECTION);
  return onSnapshot(
    repRef,
    snapshot => {
      const items: Reporter[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          name: data.name || '',
          role: data.role || '',
          email: data.email || '',
          phone: data.phone || '',
          bio: data.bio || '',
          avatar: data.avatar || '',
          articleCount: data.articleCount || 0
        });
      });
      onUpdate(items);
    },
    error => {
      if (onError) onError(error);
    }
  );
}

export async function saveReporterToFirestore(reporter: Reporter): Promise<void> {
  await setDoc(
    doc(db, REPORTERS_COLLECTION, reporter.id),
    {
      name: reporter.name,
      role: reporter.role,
      email: reporter.email,
      phone: reporter.phone || '',
      bio: reporter.bio || '',
      avatar: reporter.avatar,
      articleCount: reporter.articleCount || 0
    },
    { merge: true }
  );
}

export async function deleteReporterFromFirestore(id: string): Promise<void> {
  await deleteDoc(doc(db, REPORTERS_COLLECTION, id));
}

// ==========================================
// MEDIA LIBRARY
// ==========================================

export function subscribeToMedia(
  onUpdate: (media: MediaItem[]) => void,
  onError?: (err: Error) => void
) {
  const mediaRef = collection(db, MEDIA_COLLECTION);
  return onSnapshot(
    mediaRef,
    snapshot => {
      const items: MediaItem[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          name: data.name || '',
          url: data.url || '',
          size: data.size || '',
          type: data.type || '',
          createdAt: data.createdAt || ''
        });
      });
      onUpdate(items);
    },
    error => {
      if (onError) onError(error);
    }
  );
}

export async function saveMediaItemToFirestore(item: MediaItem): Promise<void> {
  await setDoc(doc(db, MEDIA_COLLECTION, item.id), item, { merge: true });
}

export async function deleteMediaItemFromFirestore(id: string): Promise<void> {
  await deleteDoc(doc(db, MEDIA_COLLECTION, id));
}

// ==========================================
// COMMENTS
// ==========================================

export function subscribeToComments(
  onUpdate: (comments: Comment[]) => void,
  onError?: (err: Error) => void
) {
  const commentsRef = collection(db, COMMENTS_COLLECTION);
  return onSnapshot(
    commentsRef,
    snapshot => {
      const items: Comment[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          articleId: data.articleId || '',
          articleTitle: data.articleTitle || '',
          authorName: data.authorName || '',
          email: data.email || '',
          content: data.content || '',
          createdAt: data.createdAt || '',
          status: (data.status as 'approved' | 'pending' | 'hidden') || 'pending'
        });
      });
      onUpdate(items);
    },
    error => {
      if (onError) onError(error);
    }
  );
}

export async function addCommentToFirestore(
  comment: Omit<Comment, 'id' | 'createdAt' | 'status'>
): Promise<string> {
  const newId = `comment-${Date.now()}`;
  await setDoc(doc(db, COMMENTS_COLLECTION, newId), {
    ...comment,
    createdAt: new Date().toISOString(),
    status: 'pending'
  });
  return newId;
}

export async function updateCommentStatusInFirestore(
  id: string,
  status: 'approved' | 'pending' | 'hidden'
): Promise<void> {
  await setDoc(doc(db, COMMENTS_COLLECTION, id), { status }, { merge: true });
}

export async function deleteCommentFromFirestore(id: string): Promise<void> {
  await deleteDoc(doc(db, COMMENTS_COLLECTION, id));
}

// ==========================================
// SETTINGS
// ==========================================

export function subscribeToSettings(
  onUpdate: (settings: SiteSettings) => void,
  onError?: (err: Error) => void
) {
  const settingsDocRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
  return onSnapshot(
    settingsDocRef,
    docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Partial<SiteSettings>;
        onUpdate({
          ...INITIAL_SETTINGS,
          ...data,
          siteName: 'NOFS TV',
          contactEmail: data.contactEmail || 'nofstv.bd@gmail.com',
          founderName: data.founderName || 'M. Ajmol Hussain Jakir',
          addressSylhet: data.addressSylhet || 'প্রধান কার্যালয়: সিলেট, বাংলাদেশ'
        });
      } else {
        onUpdate(INITIAL_SETTINGS);
      }
    },
    error => {
      if (onError) onError(error);
    }
  );
}

export async function saveSettingsToFirestore(settings: SiteSettings): Promise<void> {
  const settingsDocRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
  await setDoc(settingsDocRef, settings, { merge: true });
}

// ==========================================
// SEEDING HELPER
// ==========================================

/**
 * Seeds initial database documents into Firestore if collections are empty.
 */
export async function seedInitialFirestoreData(): Promise<{
  seeded: boolean;
  message: string;
}> {
  try {
    const newsSnapshot = await getDocs(collection(db, NEWS_COLLECTION));
    if (!newsSnapshot.empty) {
      return { seeded: false, message: 'Firestore ডেটাবেসে ইতোমধ্যে ডেটা সংরক্ষিত রয়েছে।' };
    }

    const batch = writeBatch(db);

    // Seed Settings
    const settingsRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    batch.set(settingsRef, INITIAL_SETTINGS);

    // Seed Categories
    for (const cat of INITIAL_CATEGORIES) {
      const catRef = doc(db, CATEGORIES_COLLECTION, cat.id);
      batch.set(catRef, cat);
    }

    // Seed Reporters
    for (const rep of INITIAL_REPORTERS) {
      const repRef = doc(db, REPORTERS_COLLECTION, rep.id);
      batch.set(repRef, rep);
    }

    // Seed Initial News Articles
    for (const item of INITIAL_NEWS) {
      const itemRef = doc(db, NEWS_COLLECTION, item.id);
      batch.set(itemRef, {
        ...item,
        shortDescription: item.summary,
        featuredImage: item.image,
        additionalImages: []
      });
    }

    await batch.commit();
    return { seeded: true, message: 'সফলভাবে Firestore-এ প্রাথমিক ডেটাবেস কাঠামো সংরক্ষিত হয়েছে!' };
  } catch (err: unknown) {
    const error = err as Error;
    throw new Error(`Firestore সিডিং ত্রুটি: ${error.message}`);
  }
}
