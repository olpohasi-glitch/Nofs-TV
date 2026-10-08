import React, { useState } from 'react';
import { Settings, Save, RotateCcw, CheckCircle, Shield } from 'lucide-react';
import { useNews } from '../../context/NewsContext';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, resetToDefaults } = useNews();
  const [formData, setFormData] = useState({ ...settings });
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleReset = () => {
    if (
      window.confirm(
        'আপনি কি নিশ্চিত যে সকল সংবাদ ও সেটিংস ডিফল্ট অবস্থায় ফিরিয়ে নিতে চান?'
      )
    ) {
      resetToDefaults();
      setFormData({ ...settings });
      alert('সফলভাবে ডিফল্ট ডেটায় ফিরিয়ে নেওয়া হয়েছে।');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-red-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              ওয়েবসাইট সেটিংস (Website Settings)
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            পোর্টালের ব্র্যান্ডিং, প্রতিষ্ঠাতা তথ্য, ব্যুরো ঠিকানা ও সামাজিক মাধ্যম
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>ডিফল্ট ডেটায় রিসেট</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>ওয়েবসাইট সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Brand Information */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-3">
            ব্র্যান্ড ও পরিচিতি (Brand Identity)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                ওয়েবসাইটের নাম (Website Name) *
              </label>
              <input
                type="text"
                disabled
                value={formData.siteName}
                className="w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded text-xs font-bold text-gray-800 cursor-not-allowed"
                title="ব্র্যান্ডের নাম অপরিবর্তনীয়: NOFS TV"
              />
              <span className="text-[10px] text-gray-500 mt-0.5 block">
                অফিসিয়াল ব্র্যান্ড নাম অপরিবর্তনীয়: <strong>NOFS TV</strong>
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                স্লোগান (Tagline) *
              </label>
              <input
                type="text"
                required
                value={formData.tagline}
                onChange={e =>
                  setFormData({ ...formData, tagline: e.target.value })
                }
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-red-600 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Founder & Admin Identity */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-3">
            প্রতিষ্ঠাতা ও প্রধান প্রশাসন (Admin & Founder Identity)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                প্রতিষ্ঠাতার নাম (Founder Name) *
              </label>
              <input
                type="text"
                required
                value={formData.founderName}
                onChange={e =>
                  setFormData({ ...formData, founderName: e.target.value })
                }
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-red-600 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                প্রশাসনিক পদবী (Role) *
              </label>
              <input
                type="text"
                required
                value={formData.founderRole}
                onChange={e =>
                  setFormData({ ...formData, founderRole: e.target.value })
                }
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-red-600 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Bureau Addresses & Contacts */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-3">
            ব্যুরো কার্যালয় ও যোগাযোগ (Addresses & Contact)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                প্রধান কার্যালয় (হেড অফিস)
              </label>
              <input
                type="text"
                value={formData.addressSylhet}
                onChange={e =>
                  setFormData({ ...formData, addressSylhet: e.target.value })
                }
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                ফোন নম্বর
              </label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={e =>
                  setFormData({ ...formData, contactPhone: e.target.value })
                }
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                ইমেইল ঠিকানা
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={e =>
                  setFormData({ ...formData, contactEmail: e.target.value })
                }
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-red-600"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-3">
            সামাজিক মাধ্যম লিংক (Social Media)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Facebook URL
              </label>
              <input
                type="text"
                value={formData.facebookUrl}
                onChange={e =>
                  setFormData({ ...formData, facebookUrl: e.target.value })
                }
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                YouTube URL
              </label>
              <input
                type="text"
                value={formData.youtubeUrl}
                onChange={e =>
                  setFormData({ ...formData, youtubeUrl: e.target.value })
                }
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                TikTok URL
              </label>
              <input
                type="text"
                value={formData.tiktokUrl}
                onChange={e =>
                  setFormData({ ...formData, tiktokUrl: e.target.value })
                }
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-red-600"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white font-bold text-sm rounded-lg shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>সেটিংস সংরক্ষণ করুন</span>
        </button>
      </form>
    </div>
  );
};
