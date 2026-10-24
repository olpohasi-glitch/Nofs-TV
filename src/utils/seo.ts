import { NewsArticle } from '../types';

export const SITE_SEO_DEFAULTS = {
  siteName: 'NOFS TV',
  title: 'NOFS TV — বাংলা অনলাইন নিউজ পোর্টাল',
  description: 'সত্যের সন্ধানে, মানুষের পাশে। সিলেটসহ দেশ-বিদেশের সর্বশেষ সংবাদ জানতে ভিজিট করুন NOFS TV।',
  url: 'https://nofstv.netlify.app/',
  image: 'https://res.cloudinary.com/aumtqxwm/image/upload/f_auto,q_auto/file_00000000b0f4820881a29eda7e4e58c4_1',
  location: 'সিলেট, বাংলাদেশ',
  type: 'website'
};

function setOrUpdateMeta(attr: 'name' | 'property', key: string, content: string | undefined | null) {
  if (!content) return;
  let tag = document.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function removeMeta(attr: 'name' | 'property', key: string) {
  const tag = document.querySelector(`meta[${attr}="${key}"]`);
  if (tag) tag.remove();
}

function setCanonicalUrl(url: string) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

/**
 * Dynamically updates social media preview metadata (Open Graph, Twitter Card, Schema.org)
 * for an individual news article.
 */
export function updateArticleSEO(article: NewsArticle) {
  const title = `${article.title} — NOFS TV`;
  const description =
    article.summary?.trim() ||
    article.shortDescription?.trim() ||
    article.content?.slice(0, 150).replace(/<[^>]*>/g, '').trim() ||
    article.title;

  const siteUrl = 'https://nofstv.netlify.app/';
  const articleUrl = `${siteUrl}#article/${article.id}`;
  const image = article.image || article.featuredImage || SITE_SEO_DEFAULTS.image;

  // Page title
  document.title = title;

  // Standard Meta Description
  setOrUpdateMeta('name', 'description', description);

  // Open Graph Tags (Facebook, WhatsApp, Messenger, LinkedIn, Telegram)
  setOrUpdateMeta('property', 'og:site_name', SITE_SEO_DEFAULTS.siteName);
  setOrUpdateMeta('property', 'og:title', article.title);
  setOrUpdateMeta('property', 'og:description', description);
  setOrUpdateMeta('property', 'og:url', articleUrl);
  setOrUpdateMeta('property', 'og:type', 'article');
  setOrUpdateMeta('property', 'og:image', image);
  setOrUpdateMeta('property', 'og:image:secure_url', image);
  setOrUpdateMeta('property', 'og:image:alt', article.title);
  setOrUpdateMeta('property', 'og:image:width', '1200');
  setOrUpdateMeta('property', 'og:image:height', '630');
  setOrUpdateMeta('property', 'og:locale', 'bn_BD');

  // Article Specific Tags
  if (article.createdAt || article.publishDate) {
    setOrUpdateMeta('property', 'article:published_time', article.createdAt || article.publishDate);
  }
  if (article.category) {
    setOrUpdateMeta('property', 'article:section', article.category);
  }
  if (article.reporterName) {
    setOrUpdateMeta('property', 'article:author', article.reporterName);
  }

  // Twitter / X Card
  setOrUpdateMeta('name', 'twitter:card', 'summary_large_image');
  setOrUpdateMeta('name', 'twitter:title', article.title);
  setOrUpdateMeta('name', 'twitter:description', description);
  setOrUpdateMeta('name', 'twitter:image', image);
  setOrUpdateMeta('name', 'twitter:image:alt', article.title);

  // Canonical Link
  setCanonicalUrl(articleUrl);

  // Article Schema.org JSON-LD
  let schemaScript = document.getElementById('news-article-schema');
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'news-article-schema';
    schemaScript.setAttribute('type', 'application/ld+json');
    document.head.appendChild(schemaScript);
  }
  schemaScript.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': articleUrl
    },
    'headline': article.title,
    'description': description,
    'image': [image],
    'datePublished': article.createdAt || article.publishDate,
    'dateModified': article.updatedAt || article.createdAt || article.publishDate,
    'author': [{
      '@type': 'Person',
      'name': article.reporterName || 'NOFS TV প্রতিনিধি'
    }],
    'publisher': {
      '@type': 'NewsMediaOrganization',
      'name': 'NOFS TV',
      'url': siteUrl,
      'logo': {
        '@type': 'ImageObject',
        'url': SITE_SEO_DEFAULTS.image
      }
    },
    'articleSection': article.category
  });
}

/**
 * Restores the default NOFS TV homepage social metadata and title.
 */
export function restoreDefaultSEO() {
  document.title = SITE_SEO_DEFAULTS.title;
  setOrUpdateMeta('name', 'description', SITE_SEO_DEFAULTS.description);

  setOrUpdateMeta('property', 'og:site_name', SITE_SEO_DEFAULTS.siteName);
  setOrUpdateMeta('property', 'og:title', SITE_SEO_DEFAULTS.title);
  setOrUpdateMeta('property', 'og:description', SITE_SEO_DEFAULTS.description);
  setOrUpdateMeta('property', 'og:url', SITE_SEO_DEFAULTS.url);
  setOrUpdateMeta('property', 'og:type', SITE_SEO_DEFAULTS.type);
  setOrUpdateMeta('property', 'og:image', SITE_SEO_DEFAULTS.image);
  setOrUpdateMeta('property', 'og:image:secure_url', SITE_SEO_DEFAULTS.image);
  setOrUpdateMeta('property', 'og:image:alt', SITE_SEO_DEFAULTS.title);
  setOrUpdateMeta('property', 'og:image:width', '1200');
  setOrUpdateMeta('property', 'og:image:height', '630');
  setOrUpdateMeta('property', 'og:locale', 'bn_BD');

  removeMeta('property', 'article:published_time');
  removeMeta('property', 'article:section');
  removeMeta('property', 'article:author');

  setOrUpdateMeta('name', 'twitter:card', 'summary_large_image');
  setOrUpdateMeta('name', 'twitter:title', SITE_SEO_DEFAULTS.title);
  setOrUpdateMeta('name', 'twitter:description', SITE_SEO_DEFAULTS.description);
  setOrUpdateMeta('name', 'twitter:image', SITE_SEO_DEFAULTS.image);
  setOrUpdateMeta('name', 'twitter:image:alt', SITE_SEO_DEFAULTS.title);

  setCanonicalUrl(SITE_SEO_DEFAULTS.url);

  const schemaScript = document.getElementById('news-article-schema');
  if (schemaScript) {
    schemaScript.remove();
  }
}
