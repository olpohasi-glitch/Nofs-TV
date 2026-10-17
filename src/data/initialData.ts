import { NewsArticle, Category, Reporter, BreakingNewsItem, Comment, MediaItem, SiteSettings, NOFS_TV_LOGO_URL } from '../types';

export const INITIAL_SETTINGS: SiteSettings = {
  siteName: 'NOFS TV',
  tagline: 'সত্যের সন্ধানে, মানুষের পাশে',
  founderName: 'M. Ajmol Hussain Jakir',
  founderRole: 'প্রতিষ্ঠাতা ও প্রকাশক (Founder & Publisher)',
  contactEmail: 'nofstv.bd@gmail.com',
  contactPhone: '',
  addressDhaka: '',
  addressSylhet: 'প্রধান কার্যালয়: সিলেট, বাংলাদেশ',
  facebookUrl: 'https://facebook.com',
  youtubeUrl: 'https://youtube.com',
  aboutText: 'NOFS TV (নফস টিভি) একটি পেশাদার বাংলা অনলাইন নিউজ পোর্টাল। “সত্যের সন্ধানে, মানুষের পাশে” স্লোগানে উদ্বুদ্ধ হয়ে সিলেট, জাতীয় ও আন্তর্জাতিক সংবাদ সততা ও বস্তুনিষ্ঠতার সঙ্গে পরিবেশন করাই আমাদের অঙ্গীকার।',
  logoUrl: NOFS_TV_LOGO_URL
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'জাতীয়', slug: 'national', description: 'দেশজুড়ে গুরুত্বপূর্ণ সব জাতীয় সংবাদ', order: 1 },
  { id: 'cat-2', name: 'রাজনীতি', slug: 'politics', description: 'দেশ ও দলের রাজনৈতিক খবরাখবর ও বিশ্লেষণ', order: 2 },
  { id: 'cat-3', name: 'সিলেট', slug: 'sylhet', description: 'সিলেট বিভাগ, সুরমা তীর ও প্রবাসীদের বিশেষ সংবাদ', order: 3 },
  { id: 'cat-4', name: 'আন্তর্জাতিক', slug: 'international', description: 'বিশ্বের আনাচে-কানাচে ঘটে যাওয়া প্রধান ঘটনা', order: 4 },
  { id: 'cat-5', name: 'খেলাধুলা', slug: 'sports', description: 'ক্রিকেট, ফুটবল এবং বিশ্ব ক্রীড়াঙ্গনের খবর', order: 5 },
  { id: 'cat-6', name: 'বিনোদন', slug: 'entertainment', description: 'চলচ্চিত্র, নাটক, সঙ্গীত ও সংস্কৃতি', order: 6 },
  { id: 'cat-7', name: 'প্রযুক্তি', slug: 'technology', description: 'বিজ্ঞান, তথ্যপ্রযুক্তি, এআই ও গ্যাজেট', order: 7 },
  { id: 'cat-8', name: 'শিক্ষা', slug: 'education', description: 'বিশ্ববিদ্যালয়, এইচএসসি, বৃত্তি ও পরীক্ষা', order: 8 },
  { id: 'cat-9', name: 'অর্থনীতি', slug: 'economy', description: 'ব্যবসা-বাণিজ্য, শেয়ারবাজার ও রেমিট্যান্স', order: 9 },
  { id: 'cat-10', name: 'লাইফস্টাইল', slug: 'lifestyle', description: 'স্বাস্থ্য, খাদ্য, ফ্যাশন ও ভ্রমণ', order: 10 },
];

export const INITIAL_REPORTERS: Reporter[] = [
  {
    id: 'rep-1',
    name: 'M. Ajmol Hussain Jakir',
    role: 'প্রতিষ্ঠাতা ও প্রকাশক',
    email: 'nofstv.bd@gmail.com',
    phone: '',
    bio: 'প্রতিষ্ঠাতা ও প্রকাশক, NOFS TV। নির্ভীক সাংবাদিকতা ও আধুনিক ডিজিটাল গণমাধ্যমের রূপকার।',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    articleCount: 0
  },
  {
    id: 'rep-2',
    name: 'মাহমুদুল হাসান চৌধুরী',
    role: 'প্রধান বার্তা সম্পাদক',
    email: 'nofstv.bd@gmail.com',
    phone: '',
    bio: 'জাতীয় ও আন্তর্জাতিক বিষয়ে দায়িত্বশীল সাংবাদিকতা।',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    articleCount: 0
  },
  {
    id: 'rep-3',
    name: 'তানজিলা ইসলাম প্রীতি',
    role: 'বিশেষ প্রতিনিধি',
    email: 'nofstv.bd@gmail.com',
    phone: '',
    bio: 'অনুসন্ধানী প্রতিবেদন ও বিশেষ সংবাদ পরিবেশন।',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    articleCount: 0
  },
  {
    id: 'rep-4',
    name: 'সৈয়দ রাসেল আহমদ',
    role: 'সিলেট ব্যুরো প্রধান',
    email: 'nofstv.bd@gmail.com',
    phone: '',
    bio: 'সিলেট বিভাগীয় ব্যুরো ও সুরমা অববাহিকার সংবাদ প্রতিনিধি।',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    articleCount: 0
  }
];

/**
 * Known legacy demo article IDs to exclude from public portal.
 * Real news articles created and published by the administrator will have IDs like 'news-{timestamp}'.
 */
export const DEMO_ARTICLE_IDS = new Set<string>([
  'news-1', 'news-2', 'news-3', 'news-4', 'news-5',
  'news-6', 'news-7', 'news-8', 'news-9', 'news-10',
  'news-11', 'news-12', 'news-13', 'news-14'
]);

/**
 * Helper to identify and eliminate legacy demo/fictional news articles.
 * Strictly ensures NO demo content ever leaks into the public website.
 */
export function isDemoArticle(article?: { id?: string; title?: string } | null): boolean {
  if (!article) return false;
  if (article.id && DEMO_ARTICLE_IDS.has(article.id)) return true;
  if (article.title && (
    article.title.includes('ডিজিটাল রূপান্তরের নতুন দিগন্ত') ||
    article.title.includes('নির্বাচনী সংস্কার ও জাতীয় সংলাপ') ||
    article.title.includes('সুরমা ও কুশিয়ারার ড্রেজিং') ||
    article.title.includes('মিরপুরে রুদ্ধশ্বাস টি-টোয়েন্টি') ||
    article.title.includes('তাহসান খান') ||
    article.title.includes('খুদে বিজ্ঞানীদের বিস্ময়কর সাফল্য') ||
    article.title.includes('সাদাপাথরে পর্যটকদের ঢল') ||
    article.title.includes('৬ লেনের নতুন এক্সপ্রেসওয়ে')
  )) {
    return true;
  }
  return false;
}

/**
 * Real News System Rule: Never invent fake demo news.
 * News is 100% driven by real Administrator-published articles from Firestore.
 */
export const INITIAL_NEWS: NewsArticle[] = [];

/**
 * Real Breaking News Rule: Breaking news is derived strictly from real published articles.
 */
export const INITIAL_BREAKING_NEWS: BreakingNewsItem[] = [];

/**
 * Comments from real readers.
 */
export const INITIAL_COMMENTS: Comment[] = [];

export const INITIAL_MEDIA: MediaItem[] = [];
