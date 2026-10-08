import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Shield,
  ArrowUp,
  Radio,
  ExternalLink
} from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { NOFS_TV_LOGO_URL } from '../types';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  onNavigateHome: () => void;
  onOpenAdminLogin: () => void;
  onOpenEPaper: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onNavigateHome,
  onOpenAdminLogin,
  onOpenEPaper
}) => {
  const { settings, categories } = useNews();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: 'হোম', action: onNavigateHome },
    { name: 'সর্বশেষ', action: () => onSelectCategory('সর্বশেষ') },
    { name: 'জাতীয়', action: () => onSelectCategory('জাতীয়') },
    { name: 'রাজনীতি', action: () => onSelectCategory('রাজনীতি') },
    { name: 'সিলেট', action: () => onSelectCategory('সিলেট') },
    { name: 'আন্তর্জাতিক', action: () => onSelectCategory('আন্তর্জাতিক') },
    { name: 'খেলাধুলা', action: () => onSelectCategory('খেলাধুলা') },
    { name: 'বিনোদন', action: () => onSelectCategory('বিনোদন') },
    { name: 'প্রযুক্তি', action: () => onSelectCategory('প্রযুক্তি') },
    { name: 'শিক্ষা', action: () => onSelectCategory('শিক্ষা') },
    { name: 'অর্থনীতি', action: () => onSelectCategory('অর্থনীতি') },
    { name: 'লাইফস্টাইল', action: () => onSelectCategory('লাইফস্টাইল') },
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-8 border-t-4 border-red-700">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main 4-column footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: Brand & Founder Information */}
          <div className="space-y-4">
            <div
              onClick={onNavigateHome}
              className="cursor-pointer inline-block group"
            >
              <img
                src={settings.logoUrl || NOFS_TV_LOGO_URL}
                alt="NOFS TV"
                className="h-12 sm:h-14 w-auto max-w-[220px] object-contain transition-transform group-hover:scale-105"
              />
              <p className="text-xs text-slate-300 font-bold tracking-wide mt-2">
                বাংলা অনলাইন নিউজ পোর্টাল
              </p>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide mt-0.5">
                “{settings.tagline}”
              </p>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {settings.aboutText}
            </p>

            {/* Founder Box */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <span className="text-red-400 font-semibold block mb-0.5">
                প্রতিষ্ঠাতা ও প্রকাশক:
              </span>
              <span className="text-slate-100 font-bold text-sm block">
                {settings.founderName}
              </span>
              <span className="text-slate-400 text-[11px] block mt-0.5">
                {settings.founderRole}
              </span>
            </div>

            {/* Social Channels */}
            <div className="pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                সামাজিক মাধ্যমে NOFS TV
              </span>
              <div className="flex items-center space-x-2.5">
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded bg-slate-900 hover:bg-blue-600 text-white transition-colors text-xs font-semibold flex items-center gap-1.5 border border-slate-800"
                >
                  <span>Facebook</span>
                </a>
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded bg-slate-900 hover:bg-red-600 text-white transition-colors text-xs font-semibold flex items-center gap-1.5 border border-slate-800"
                >
                  <span>YouTube</span>
                </a>
                <a
                  href={settings.tiktokUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded bg-slate-900 hover:bg-neutral-800 text-white transition-colors text-xs font-semibold flex items-center gap-1.5 border border-slate-800"
                >
                  <span>TikTok</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b-2 border-red-600 pb-2 mb-4 inline-block">
              গুরুত্বপূর্ণ বিভাগ
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {quickLinks.map((link, idx) => (
                <button
                  key={idx}
                  onClick={link.action}
                  className="text-left text-slate-400 hover:text-white hover:translate-x-1 transition-all py-1 cursor-pointer flex items-center gap-1"
                >
                  <span className="text-red-500 text-xs">›</span>
                  <span>{link.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Col 3: Special Services & Bureaus */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b-2 border-red-600 pb-2 mb-4 inline-block">
              কার্যালয় ও যোগাযোগ
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">প্রধান কার্যালয়:</strong>
                  <span>সিলেট, বাংলাদেশ</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Official Email:</strong>
                  <a
                    href="mailto:nofstv.bd@gmail.com"
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    nofstv.bd@gmail.com
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenEPaper}
                  className="w-full py-2 px-3 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>আজকের ই-পেপার সংস্করণ</span>
                  <ExternalLink className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Col 4: Digital TV & Editorial Policy */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b-2 border-red-600 pb-2 mb-4 inline-block">
              ডিজিটাল সম্প্রচার
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              NOFS TV ডিজিটাল প্ল্যাটফর্মে ২৪ ঘণ্টা সংবাদ, বিশেষ টকশো, মাঠপর্যায়ের অনুসন্ধানী প্রতিবেদন ও আন্তর্জাতিক খবর পরিবেশন করে থাকে।
            </p>

            <div className="p-3 rounded-lg bg-red-950/40 border border-red-900/50 mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-red-400 mb-1">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>লাইভ ব্রডকাস্ট সার্ভার</span>
              </div>
              <p className="text-[11px] text-slate-300">
                হাই-ডেফিনিশন মাল্টিমিডিয়া লাইভ স্ট্রিমিং ও অন-ডিমান্ড সংবাদ বুলেটিন।
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAdminLogin}
                className="w-full py-2 px-3 rounded bg-red-900/60 hover:bg-red-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-red-700/50"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>নিউজ ডিরেক্টর ও অ্যাডমিন অ্যাক্সেস</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>
            © 2026 <strong className="text-slate-300">NOFS TV</strong>. All Rights Reserved.
          </p>

          <p className="text-slate-400 text-center sm:text-right">
            প্রতিষ্ঠাতা ও প্রকাশক: <span className="text-slate-200 font-semibold">{settings.founderName}</span> | প্রধান কার্যালয়: সিলেট, বাংলাদেশ
          </p>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-full bg-slate-900 hover:bg-red-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="উপরে যান"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
