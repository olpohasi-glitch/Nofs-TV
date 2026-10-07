import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowLeft, KeyRound, AlertCircle, CheckCircle } from 'lucide-react';
import { useNews } from '../../context/NewsContext';
import { NOFS_TV_LOGO_URL } from '../../types';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToSite
}) => {
  const { loginAdmin, settings } = useNews();
  const [username, setUsername] = useState('admin@nofstv.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = loginAdmin(username, password);
    if (success) {
      onLoginSuccess();
    } else {
      setError('ভুল ইমেইল/ইউজারনেম অথবা পাসওয়ার্ড। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
    }
  };

  const handleUseDemoCredentials = () => {
    setUsername('admin@nofstv.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-900/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Back to Public Portal Button */}
      <button
        onClick={onBackToSite}
        className="absolute top-6 left-6 text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>ওয়েবসাইটে ফিরে যান</span>
      </button>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <img
            src={settings.logoUrl || NOFS_TV_LOGO_URL}
            alt="NOFS TV"
            className="h-14 sm:h-16 w-auto max-w-[220px] object-contain mb-3 bg-white/5 p-1 rounded"
          />
          <h2 className="text-xl font-bold text-white tracking-tight">
            নিউজ কন্ট্রোল ও অ্যাডমিন প্যানেল
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            প্রতিষ্ঠাতা ও প্রকাশক: <strong className="text-slate-200">{settings.founderName}</strong>
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              ইমেইল / ইউজারনেম (Email / Username)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin@nofstv.com"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                পাসওয়ার্ড (Password)
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-700 hover:bg-red-800 text-white font-bold text-sm rounded-lg shadow-lg shadow-red-950 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <Shield className="w-4 h-4" />
            <span>লগইন করুন (Admin Login)</span>
          </button>
        </form>

        {/* Demo Fast Login Helper */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400 mb-2">
            ডেমো টেস্টিং ক্রেডেনশিয়াল:
          </p>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-300 font-mono mb-3">
            <div>ইমেইল: <strong className="text-amber-300">admin@nofstv.com</strong></div>
            <div>পাসওয়ার্ড: <strong className="text-amber-300">admin123</strong></div>
          </div>
          <button
            type="button"
            onClick={handleUseDemoCredentials}
            className="text-xs font-semibold text-red-400 hover:text-red-300 underline cursor-pointer"
          >
            ডেমো ক্রেডেনশিয়াল পূরণ করুন
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-sm w-full p-6 text-white text-center">
            <KeyRound className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold mb-2">পাসওয়ার্ড পুনরুদ্ধার</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              নিরাপত্তাজনিত কারণে পাসওয়ার্ড রিসেটের জন্য প্রধান প্রশাসক <strong className="text-amber-300">M. Ajmol Hussain Jakir</strong>-এর সরাসরি অনুমোদন আবশ্যক অথবা ডেমো পাসওয়ার্ড <strong className="text-white">admin123</strong> ব্যবহার করুন।
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded transition-colors cursor-pointer"
            >
              বুঝেছি / বন্ধ করুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
