import {
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../lib/firebase';

export const OFFICIAL_ADMIN_EMAIL = 'nofstv.bd@gmail.com';

/**
 * Server-side & Backend authorized administrator email allowlist.
 * Only accounts explicitly approved by the system owner may access administrative capabilities.
 */
export const AUTHORIZED_ADMIN_EMAILS: readonly string[] = Object.freeze([
  'nofstv.bd@gmail.com'
]);

/**
 * Checks if a given email is in the authorized administrators allowlist.
 */
export function isAuthorizedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return AUTHORIZED_ADMIN_EMAILS.some(allowed => allowed.toLowerCase() === normalized);
}

/**
 * Signs in the administrator with Firebase Authentication and verifies explicit authorization.
 */
export async function adminSignIn(password: string, email: string = OFFICIAL_ADMIN_EMAIL): Promise<FirebaseUser> {
  const targetEmail = (email || OFFICIAL_ADMIN_EMAIL).trim().toLowerCase();

  // Strict check: reject non-allowlisted emails immediately
  if (!isAuthorizedAdminEmail(targetEmail)) {
    throw new Error('অননুমোদিত অ্যাকাউন্ট: এই ইমেইলটি NOFS TV অ্যাডমিন প্যানেলের অনুমোদিত তালিকায় নেই।');
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, targetEmail, password);
    
    // Strict post-authentication check
    if (!isAuthorizedAdminEmail(cred.user.email)) {
      await fbSignOut(auth);
      throw new Error('অননুমোদিত এক্সেস: আপনার অ্যাকাউন্টটি NOFS TV অ্যাডমিন হিসেবে অনুমোদিত নয়।');
    }

    return cred.user;
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    
    // Provide user-friendly guidance for common Firebase Auth states
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      throw new Error(
        'ইমেইল বা পাসওয়ার্ড সঠিক নয়। আপনি যদি প্রথমবারের মতো অ্যাডমিন অ্যাকাউন্ট তৈরি করতে চান, তবে নিচে "প্রথমবার অ্যাকাউন্ট সেটআপ" বোতামটি ব্যবহার করুন।'
      );
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('ভুল পাসওয়ার্ড প্রদান করা হয়েছে। পুনরায় চেষ্টা করুন।');
    } else if (error.code === 'auth/operation-not-allowed') {
      throw new Error(
        'Firebase Console-এ Email/Password অথেনটিকেশন সক্রিয় করা নেই। অনুগ্রহ করে Firebase Console > Authentication > Sign-in method-এ গিয়ে Email/Password প্রোভাইডার চালু (Enable) করুন।'
      );
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('অতিরিক্ত ভুলের কারণে সাময়িকভাবে বন্ধ। কিছুক্ষণ পর চেষ্টা করুন।');
    }
    throw new Error(error.message || 'লগইন ব্যর্থ হয়েছে।');
  }
}

/**
 * Initializes the official admin account in Firebase Authentication if not created yet.
 * STRICT: Only allows initializing the approved official admin email.
 */
export async function initializeAdminAccount(password: string): Promise<FirebaseUser> {
  const email = OFFICIAL_ADMIN_EMAIL;
  if (!password || password.length < 6) {
    throw new Error('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
  }
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    return cred.user;
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('অফিসিয়াল অ্যাডমিন অ্যাকাউন্ট ইতোমধ্যে তৈরি করা আছে। অনুগ্রহ করে সরাসরি লগইন করুন।');
    } else if (error.code === 'auth/operation-not-allowed') {
      throw new Error(
        'Firebase Console-এ Email/Password অথেনটিকেশন চালু করা নেই। অনুগ্রহ করে Firebase Console > Authentication > Sign-in method-এ গিয়ে Email/Password প্রোভাইডার চালু (Enable) করুন।'
      );
    }
    throw new Error(error.message || 'অ্যাকাউন্ট তৈরি করা সম্ভব হয়নি।');
  }
}

/**
 * Sends a password reset link to the official admin email.
 */
export async function resetAdminPassword(): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, OFFICIAL_ADMIN_EMAIL);
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    throw new Error(error.message || 'পাসওয়ার্ড রিসেট ইমেইল পাঠানো সম্ভব হয়নি।');
  }
}

/**
 * Signs out the current user.
 */
export async function adminSignOut(): Promise<void> {
  await fbSignOut(auth);
}

/**
 * Subscribes to real-time auth changes.
 */
export function subscribeToAuth(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
