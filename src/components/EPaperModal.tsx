import React, { useState } from 'react';
import { X, Calendar, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Newspaper } from 'lucide-react';
import { getCurrentBengaliDate, toBengaliNumber } from '../utils/bengali';
import { NOFS_TV_LOGO_URL } from '../types';

interface EPaperModalProps {
  onClose: () => void;
}

export const EPaperModal: React.FC<EPaperModalProps> = ({ onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 8;
  const bengaliDate = getCurrentBengaliDate();

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col justify-between p-2 sm:p-4 backdrop-blur-xs">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white rounded-t-lg p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={NOFS_TV_LOGO_URL}
            alt="NOFS TV"
            className="h-8 w-auto object-contain bg-white/10 px-1 py-0.5 rounded"
          />
          <span className="font-bold text-sm hidden sm:inline">
            ডিজিটাল ই-পেপার সংস্করণ
          </span>
          <span className="text-xs text-slate-400">
            {bengaliDate.gregorianDate}
          </span>
        </div>

        {/* Page navigation controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded bg-slate-800 disabled:opacity-40 text-white hover:bg-slate-700 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-200 font-semibold px-2">
            পৃষ্ঠা {toBengaliNumber(currentPage)} / {toBengaliNumber(totalPages)}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded bg-slate-800 disabled:opacity-40 text-white hover:bg-slate-700 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 ml-3 rounded-full bg-slate-800 hover:bg-red-600 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main E-paper Newspaper Canvas Simulation */}
      <div className="flex-1 overflow-auto bg-slate-800/60 p-4 flex items-center justify-center">
        <div className="max-w-4xl w-full bg-white text-slate-900 rounded-lg shadow-2xl p-6 sm:p-10 border border-slate-300">
          {/* Newspaper Masthead */}
          <div className="border-b-4 border-slate-900 pb-4 mb-6 text-center">
            <div className="flex items-center justify-between text-xs text-gray-600 border-b border-gray-200 pb-2 mb-3">
              <span>বর্ষ ২ • সংখ্যা ৩৪১</span>
              <span className="font-bold">{bengaliDate.fullDateString}</span>
              <span>মূল্য: ৫.০০ টাকা</span>
            </div>

            <div className="flex items-center justify-center py-2">
              <img
                src={NOFS_TV_LOGO_URL}
                alt="NOFS TV"
                className="h-16 sm:h-20 w-auto max-w-[280px] object-contain"
              />
            </div>
            <p className="text-sm font-bold text-gray-900 mt-1">
              বাংলা অনলাইন নিউজ পোর্টাল
            </p>
            <p className="text-xs font-semibold text-gray-600 mt-0.5">
              “সত্যের সন্ধানে, মানুষের পাশে”
            </p>
            <div className="mt-2 text-xs text-gray-500 font-medium">
              প্রতিষ্ঠাতা ও প্রকাশক: M. Ajmol Hussain Jakir | পৃষ্ঠা নং: {toBengaliNumber(currentPage)}
            </div>
          </div>

          {/* Newspaper Columns Simulation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-justify">
            <div className="md:col-span-2 border-r border-gray-200 pr-6">
              <h2 className="text-2xl font-black text-gray-950 mb-2 leading-tight">
                জাতীয় অগ্রযাত্রায় ডিজিটাল প্রযুক্তির নতুন মাইলফলক: ঢাকায় বিজ্ঞানীদের সম্মেলন
              </h2>
              <div className="aspect-[16/9] bg-gray-100 rounded overflow-hidden mb-3">
                <img
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"
                  alt="News"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs leading-relaxed text-gray-700 mb-3">
                রাজধানীর সম্মেলন কেন্দ্রে অনুষ্ঠিত উচ্চপর্যায়ের প্রযুক্তি সম্মেলনে দেশের শীর্ষ নীতি-নির্ধারক ও প্রযুক্তিবিদরা অংশ নেন। এতে উদ্ভাবনী প্রযুক্তির মাধ্যমে কর্মসংস্থান সৃষ্টির আহ্বান জানানো হয়।
              </p>
              <p className="text-xs leading-relaxed text-gray-700">
                বিশেষজ্ঞদের মতে, চতুর্থ শিল্প বিপ্লবের চ্যালেঞ্জ মোকাবিলায় স্থানীয় প্রযুক্তি সক্ষমতা বৃদ্ধি অত্যন্ত জরুরি। কৃত্রিম বুদ্ধিমত্তা ও ক্লাউড কম্পিউটিংয়ে নতুন দক্ষ মানবসম্পদ তৈরিতে বিশেষ বিনিয়োগের প্রস্তাব দেওয়া হয়।
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-red-50 border-l-2 border-red-700">
                <h3 className="text-sm font-bold text-red-950 mb-1">
                  সিলেটের সুরমা ড্রেজিং প্রকল্পে ব্যাপক অগ্রগতি
                </h3>
                <p className="text-[11px] text-gray-600 leading-normal">
                  ওসমানী বিমানবন্দরের নতুন টার্মিনাল চালুর পর প্রবাসী সেবায় নতুন দিগন্ত উন্মোচিত হতে যাচ্ছে।
                </p>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  প্রবাসী আয়ে নতুন রেকর্ড
                </h3>
                <p className="text-[11px] text-gray-600 leading-normal">
                  সদ্য সমাপ্ত মাসে আড়াই বিলিয়ন ডলারের রেমিট্যান্স অর্জন করেছে বাংলাদেশ ব্যাংক।
                </p>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  মিরপুরে টাইগারদের সিরিজ জয়
                </h3>
                <p className="text-[11px] text-gray-600 leading-normal">
                  শ্বাসরুদ্ধকর শেষ ওভারে ৫ রানের নাটকীয় জয়ে সিরিজে শুভ সূচনা।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer controls */}
      <div className="bg-slate-900 text-white rounded-b-lg p-2.5 flex items-center justify-between text-xs">
        <span className="text-slate-400">
          © 2026 NOFS TV ই-পেপার আর্কাইভ
        </span>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-700 hover:bg-red-800 text-white font-bold cursor-pointer transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>পৃষ্ঠা ডাউনলোড / প্রিন্ট</span>
        </button>
      </div>
    </div>
  );
};
