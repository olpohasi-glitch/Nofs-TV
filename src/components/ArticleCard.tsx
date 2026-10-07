import React from 'react';
import { Clock, User } from 'lucide-react';
import { NewsArticle } from '../types';

interface ArticleCardProps {
  article: NewsArticle;
  variant?: 'large' | 'medium' | 'compact' | 'horizontal';
  onClick: () => void;
  onSelectCategory?: (category: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'medium',
  onClick,
  onSelectCategory
}) => {
  if (variant === 'large') {
    return (
      <div
        onClick={onClick}
        className="group relative bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span
              onClick={e => {
                if (onSelectCategory) {
                  e.stopPropagation();
                  onSelectCategory(article.category);
                }
              }}
              className="px-2.5 py-1 bg-red-700 text-white text-xs font-bold rounded shadow-sm hover:bg-red-800 transition-colors"
            >
              {article.category}
            </span>
            {article.isBreaking && (
              <span className="px-2 py-0.5 bg-amber-500 text-slate-900 text-xs font-extrabold rounded animate-pulse">
                ব্রেকিং
              </span>
            )}
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-red-700 transition-colors leading-snug line-clamp-2">
              {article.title}
            </h2>
            {article.subtitle && (
              <h3 className="text-sm font-semibold text-gray-600 mt-1.5 line-clamp-1">
                {article.subtitle}
              </h3>
            )}
            <p className="text-sm text-gray-600 mt-2.5 line-clamp-3 leading-relaxed">
              {article.summary}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 mt-4 pt-3 border-t border-gray-100">
            <span className="flex items-center gap-1 font-medium text-gray-700">
              <User className="w-3.5 h-3.5 text-red-600" />
              {article.reporterName}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              {article.publishDate}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div
        onClick={onClick}
        className="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-red-300 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col sm:flex-row gap-3 p-3"
      >
        <div className="relative sm:w-48 h-36 shrink-0 rounded-md overflow-hidden bg-gray-100">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-700 text-white text-[11px] font-bold rounded">
            {article.category}
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-red-700 transition-colors leading-snug line-clamp-2">
              {article.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2 leading-relaxed">
              {article.summary}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
            <span className="font-medium text-gray-700">
              {article.reporterName}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-gray-400" />
              {article.publishTime || article.publishDate}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        onClick={onClick}
        className="group py-2.5 border-b border-gray-100 last:border-b-0 cursor-pointer flex gap-3 items-start"
      >
        <div className="w-20 h-16 shrink-0 rounded overflow-hidden bg-gray-100 relative">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-gray-900 group-hover:text-red-700 transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h4>
          <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1">
            <span className="text-red-600 font-semibold">{article.category}</span>
            <span>•</span>
            <span>{article.publishTime || article.publishDate}</span>
          </div>
        </div>
      </div>
    );
  }

  // Medium (standard grid card)
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-red-300 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <span
          onClick={e => {
            if (onSelectCategory) {
              e.stopPropagation();
              onSelectCategory(article.category);
            }
          }}
          className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-red-700 text-white text-[11px] font-bold rounded hover:bg-red-800 transition-colors"
        >
          {article.category}
        </span>
      </div>

      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900 group-hover:text-red-700 transition-colors leading-snug line-clamp-2">
            {article.title}
          </h3>
          <p className="text-xs text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
            {article.summary}
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-gray-500 mt-3 pt-2 border-t border-gray-100">
          <span className="font-medium text-gray-700 line-clamp-1">
            {article.reporterName}
          </span>
          <span className="flex items-center gap-1 shrink-0">
            <Clock className="w-3 h-3 text-gray-400" />
            {article.publishTime || article.publishDate}
          </span>
        </div>
      </div>
    </div>
  );
};
