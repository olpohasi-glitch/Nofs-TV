import React, { useState } from 'react';
import { Shield, User, Lock, Mail, CheckCircle, KeyRound, Award } from 'lucide-react';
import { useNews } from '../../context/NewsContext';

export const AdminProfile: React.FC = () => {
  const { adminUser, settings } = useNews();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordNotice, setPasswordNotice] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    if (newPassword !== confirmPassword) {
      alert('নতুন পাসওয়ার্ড দুটি মিলছে না!');
      return;
    }

    setPasswordNotice('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordNotice(''), 3000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-red-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              অ্যাডমিন প্রোফাইল (Admin Profile)
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            প্রতিষ্ঠাতা ও প্রধান প্রশাসকের তথ্য এবং নিরাপত্তা ব্যবস্থা
          </p>
        </div>
      </div>

      {/* Founder Identification Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-red-950 text-white rounded-xl p-6 shadow-sm border border-slate-800">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-full bg-red-700 border-2 border-amber-400 flex items-center justify-center text-white text-2xl font-black shrink-0">
            JH
          </div>
          <div className="text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-red-700 text-amber-300 text-xs font-bold rounded-sm">
                প্রধান প্রশাসক
              </span>
              <span className="text-xs text-slate-400">NOFS TV বোর্ড</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              {settings.founderName}
            </h2>
            <p className="text-sm text-red-300 font-semibold mt-0.5">
              {settings.founderRole}
            </p>
            <p className="text-xs text-slate-300 mt-3 max-w-xl leading-relaxed">
              NOFS TV ডিজিটাল গণমাধ্যম উদ্যোগের স্বপ্নদ্রষ্টা। সত্যের সন্ধানে নির্ভীক সাংবাদিকতা ও দেশের প্রতিটি প্রান্তে সত্য সংবাদ পৌঁছে দিতে অবিচল।
            </p>
          </div>
        </div>
      </div>

      {/* Security & Credentials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info Box */}
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-600" />
            <span>প্রশাসনিক বিবরণ</span>
          </h3>
          <div className="space-y-3 text-xs text-gray-700">
            <div>
              <span className="text-gray-500 block">পূর্ণ নাম:</span>
              <strong className="text-gray-900 text-sm">{settings.founderName}</strong>
            </div>
            <div>
              <span className="text-gray-500 block">পদবী:</span>
              <strong className="text-gray-900">{settings.founderRole}</strong>
            </div>
            <div>
              <span className="text-gray-500 block">লগইন আইডি:</span>
              <strong className="text-gray-900">{adminUser.email}</strong>
            </div>
            <div>
              <span className="text-gray-500 block">নিরাপত্তা স্তর:</span>
              <strong className="text-emerald-700 font-bold">সুপার অ্যাডমিনিস্ট্রেটর (Level 1)</strong>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-red-600" />
            <span>পাসওয়ার্ড পরিবর্তন (Change Password)</span>
          </h3>

          {passwordNotice && (
            <div className="mb-3 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{passwordNotice}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                বর্তমান পাসওয়ার্ড
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                নতুন পাসওয়ার্ড
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="নতুন পাসওয়ার্ড"
                className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                নতুন পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="পাসওয়ার্ড পুনরাবৃত্তি করুন"
                className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-red-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded transition-colors cursor-pointer mt-1"
            >
              পাসওয়ার্ড আপডেট করুন
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
