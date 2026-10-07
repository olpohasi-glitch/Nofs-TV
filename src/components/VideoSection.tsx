import React, { useState } from 'react';
import { Play, Radio, Eye, Clock } from 'lucide-react';
import { toBengaliNumber } from '../utils/bengali';

interface VideoItem {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  views: number;
  time: string;
}

export const VideoSection: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  const videoList: VideoItem[] = [
    {
      id: 'vid-1',
      title: 'NOFS TV বিশেষ বুলেটিন: ঢাকায় অনুষ্ঠিত আন্তর্জাতিক প্রযুক্তি সম্মেলনের সারসংক্ষেপ',
      duration: '০৫:৪০',
      thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
      views: 14200,
      time: '২ ঘণ্টা আগে'
    },
    {
      id: 'vid-2',
      title: 'সুরমা নদী খনন ও সিলেটের নতুন বিমানবন্দর টার্মিনাল প্রকল্প নিয়ে বিশেষ গ্রাউন্ড রিপোর্ট',
      duration: '০৮:১৫',
      thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      views: 18900,
      time: '৪ ঘণ্টা আগে'
    },
    {
      id: 'vid-3',
      title: 'মিরপুর স্টেডিয়াম থেকে সরাসরি: রুদ্ধশ্বাস ম্যাচ জয়ের পর বাংলাদেশ অধিনায়কের প্রতিক্রিয়া',
      duration: '০৪:২২',
      thumbnail: 'https://images.unsplash.com/photo-1531415074868-036b107e775a?auto=format&fit=crop&w=800&q=80',
      views: 29400,
      time: 'গতকাল'
    },
    {
      id: 'vid-4',
      title: 'শ্রীমঙ্গলের চা বাগানে রেকর্ড উৎপাদন: আন্তর্জাতিক বাজারে অর্গানিক চায়ের নতুন চাহিদা',
      duration: '০৬:১০',
      thumbnail: 'https://images.unsplash.com/photo-1587893142907-72e4b4946f1e?auto=format&fit=crop&w=800&q=80',
      views: 8650,
      time: '২ দিন আগে'
    }
  ];

  const mainVideo = activeVideo || videoList[0];

  return (
    <section className="py-8 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-red-600 inline-block"></span>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                ভিডিও ও ডিজিটাল সম্প্রচার
              </h2>
              <span className="flex items-center gap-1 text-[11px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full uppercase">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>NOFS TV LIVE</span>
              </span>
            </div>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            ২৪ ঘণ্টা ডিজিটাল ভিডিও বুলেটিন
          </span>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Big Player Preview */}
          <div className="lg:col-span-8 bg-black rounded-xl overflow-hidden border border-slate-800 relative group">
            <div className="relative aspect-[16/9] w-full">
              <img
                src={mainVideo.thumbnail}
                alt={mainVideo.title}
                className="w-full h-full object-cover opacity-85 group-hover:opacity-75 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

              {/* Play Button Simulation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-red-600 transition-all cursor-pointer">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-center gap-3 text-xs text-amber-300 font-bold mb-2">
                  <span className="bg-red-600 text-white px-2 py-0.5 rounded">
                    বিশেষ প্রতিবেদন
                  </span>
                  <span>দৈর্ঘ্য: {mainVideo.duration}</span>
                  <span>•</span>
                  <span>{mainVideo.time}</span>
                </div>
                <h3 className="text-lg sm:text-2xl font-bold text-white leading-snug">
                  {mainVideo.title}
                </h3>
              </div>
            </div>
          </div>

          {/* Side Playlist */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              আরও ভিডিও প্রতিবেদন:
            </span>
            {videoList.map(item => (
              <div
                key={item.id}
                onClick={() => setActiveVideo(item)}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer flex gap-3 ${
                  mainVideo.id === item.id
                    ? 'bg-slate-800 border-red-600'
                    : 'bg-slate-850 hover:bg-slate-800 border-slate-800'
                }`}
              >
                <div className="relative w-28 h-18 shrink-0 rounded overflow-hidden bg-slate-900">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] text-white px-1 rounded font-mono">
                    {item.duration}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="w-5 h-5 text-white/90 fill-white" />
                  </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <h4 className="text-xs font-bold text-slate-100 line-clamp-2 leading-snug hover:text-red-400 transition-colors">
                    {item.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>{item.time}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{toBengaliNumber(item.views)}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
