import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  ArrowLeft,
  KeyRound,
  AlertCircle,
  CheckCircle,
  Database,
  Server,
  Loader2,
  Info
} from 'lucide-react';
import { useNews } from '../../context/NewsContext';
import { resetAdminPassword, OFFICIAL_ADMIN_EMAIL } from '../../services/firebaseAuth';
import { NOFS_TV_LOGO_URL } from '../../types';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToSite
}) => {
  const { loginAdmin, setupAdminAccount, settings, isFirestoreConnected } = useNews();
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessNotice('');
    setIsSubmitting(true);

    try {
      if (isSetupMode) {
        await setupAdminAccount(password);
        setSuccessNotice('অ্যাডমিন অ্যাকাউন্ট সফলভাবে সক্রিয় করা হয়েছে! এখন লগইন সম্পন্ন হচ্ছে...');
        setTimeout(() => {
          onLoginSuccess();
        }, 1000);
      } else {
        await loginAdmin(password);
        onLoginSuccess();
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'লগইন ব্যর্থ হয়েছে।';
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    setError('');
    try {
      await resetAdminPassword();
      setResetSuccess(true);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে।';
      setError(errorMsg);
    }
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
        <div className="text-center mb-6 flex flex-col items-center">
          <img
            src={settings.logoUrl || NOFS_TV_LOGO_URL}
            alt="NOFS TV"
            className="h-14 sm:h-16 w-auto max-w-[220px] object-contain mb-3 bg-white/5 p-1 rounded"
          />
          <h2 className="text-xl font-bold text-white tracking-tight">
            অ্যাডমিন ও নিউজরুম পোর্টাল
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            প্রতিষ্ঠাতা ও প্রকাশক: <strong className="text-slate-200">{settings.founderName}</strong>
          </p>

          {/* Real Backend Status Badge */}
          <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px]">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Firebase Firestore:</span>
            <span
              className={`font-semibold flex items-center gap-1 ${
                isFirestoreConnected ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isFirestoreConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              ></span>
              {isFirestoreConnected ? 'সংযুক্ত (Connected)' : 'অনলাইন প্রস্তুতি'}
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Success Notice */}
        {successNotice && (
          <div className="mb-5 p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-start gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Real Firebase Auth Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              অফিশিয়াল অ্যাডমিন ইমেইল (Official Admin Email)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                disabled
                value={OFFICIAL_ADMIN_EMAIL}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-950/60 border border-slate-700 rounded-lg text-sm text-slate-300 font-mono cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              * নিরাপত্তা বিধিমালার কারণে শুধুমাত্র অফিসিয়াল অ্যাকাউন্টে প্রবেশাধিকার সংরক্ষিত।
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                {isSetupMode ? 'নতুন পাসওয়ার্ড নির্ধারণ করুন' : 'অ্যাডমিন পাসওয়ার্ড (Password)'}
              </label>
              {!isSetupMode && (
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={isSetupMode ? 'কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড' : 'আপনার পাসওয়ার্ড লিখুন'}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-red-700 hover:bg-red-800 disabled:bg-red-900 text-white font-bold text-sm rounded-lg shadow-lg shadow-red-950 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>যাচাই করা হচ্ছে...</span>
              </>
            ) : isSetupMode ? (
              <>
                <Shield className="w-4 h-4" />
                <span>Firebase-এ অ্যাকাউন্ট সক্রিয় করুন</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Firebase অ্যাডমিন লগইন</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle between Login and First-Time Setup */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400 mb-2">
            {isSetupMode
              ? 'ইতিমধ্যে অ্যাকাউন্ট সক্রিয় করা আছে?'
              : 'প্রথমবারের মতো অ্যাডমিন অ্যাকাউন্ট সেটআপ করতে চান?'}
          </p>
          <button
            type="button"
            onClick={() => {
              setIsSetupMode(!isSetupMode);
              setError('');
              setSuccessNotice('');
            }}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline cursor-pointer"
          >
            {isSetupMode
              ? 'লগইন ফর্মে ফিরে যান'
              : 'প্রথমবার অ্যাডমিন পাসওয়ার্ড সক্রিয় / তৈরি করুন'}
          </button>
        </div>

        {/* Firebase Config Notice */}
        <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <span>
            প্রজেক্ট: <code className="text-slate-300">citric-fulcrum-fmn89</code> | Firebase Auth ও Firestore ব্যাকএন্ডের মাধ্যমে ডেটা সুরক্ষিত।
          </span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-sm w-full p-6 text-white text-center">
            <KeyRound className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold mb-2">পাসওয়ার্ড রিসেট</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              <strong className="text-amber-300">{OFFICIAL_ADMIN_EMAIL}</strong>-এ Firebase-এর মাধ্যমে নিরাপদ পাসওয়ার্ড রিসেট লিঙ্ক পাঠানো হবে।
            </p>

            {resetSuccess ? (
              <div className="mb-4 p-2.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs">
                ইমেইল সফলভাবে পাঠানো হয়েছে! আপনার ইনবক্স চেক করুন।
              </div>
            ) : (
              <button
                onClick={handlePasswordReset}
                className="w-full mb-3 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded transition-colors cursor-pointer"
              >
                রিসেট ইমেইল পাঠান
              </button>
            )}

            <button
              onClick={() => {
                setShowForgotModal(false);
                setResetSuccess(false);
              }}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded transition-colors cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
