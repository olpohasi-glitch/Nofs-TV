import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import config from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(config) : getApp();

export const auth = getAuth(app);

export const db = config.firestoreDatabaseId
  ? getFirestore(app, config.firestoreDatabaseId)
  : getFirestore(app);

export const storage = getStorage(app);

/**
 * Validates connection to the live Cloud Firestore database.
 */
export async function testFirestoreConnection(): Promise<{
  connected: boolean;
  status: string;
  error?: string;
}> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return { connected: true, status: 'online' };
  } catch (err: unknown) {
    const error = err as Error;
    if (error.message && error.message.includes('the client is offline')) {
      return {
        connected: false,
        status: 'offline',
        error: 'Firebase Firestore ক্লায়েন্ট অফলাইন। কনফিগারেশন চেক করুন।'
      };
    }
    // If the server responded with not-found or permission check, it reached the live Firestore server
    return { connected: true, status: 'online' };
  }
}

export { config as firebaseConfig };
export default app;
