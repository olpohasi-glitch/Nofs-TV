export interface Reporter {
  id: string;
  name: string;
  role: string; // e.g. "প্রধান বার্তা সম্পাদক", "স্টাফ রিপোর্টার, ঢাকা", "সিলেট ব্যুরো প্রধান"
  email: string;
  phone: string;
  bio: string;
  avatar: string;
  articleCount?: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  reporterId: string;
  reporterName: string;
  reporterRole: string;
  image: string;
  imageCaption?: string;
  publishDate: string; // Bengali or formatted date e.g. "৭ অক্টোবর ২০২৬"
  publishTime: string; // e.g. "দুপুর ২:১৫"
  createdAt: string;
  isBreaking: boolean;
  isFeatured: boolean;
  status: 'published' | 'draft';
  views: number;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
}

export interface BreakingNewsItem {
  id: string;
  text: string;
  articleId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  articleId: string;
  articleTitle: string;
  authorName: string;
  email: string;
  content: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'hidden';
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  founderName: string;
  founderRole: string;
  contactEmail: string;
  contactPhone: string;
  addressDhaka: string;
  addressSylhet: string;
  facebookUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  aboutText: string;
  logoUrl?: string;
}

export const NOFS_TV_LOGO_URL =
  'https://res.cloudinary.com/aumtqxwm/image/upload/f_auto,q_auto/file_00000000b0f4820881a29eda7e4e58c4_1';

export type PublicView = 'home' | 'article' | 'category' | 'search' | 'admin-login' | 'reporters' | 'epaper';

export type AdminTab =
  | 'dashboard'
  | 'add-news'
  | 'all-news'
  | 'edit-news'
  | 'categories'
  | 'breaking-news'
  | 'featured-news'
  | 'reporters'
  | 'comments'
  | 'media'
  | 'settings'
  | 'profile';
