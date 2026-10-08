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
 * Signs in the administrator with Firebase Authentication.
 */
export async function adminSignIn(password: string): Promise<FirebaseUser> {
  const email = OFFICIAL_ADMIN_EMAIL;
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
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
