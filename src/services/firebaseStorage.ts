import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage, auth } from '../lib/firebase';
import { OFFICIAL_ADMIN_EMAIL } from './firebaseAuth';

/**
 * Validates that current user is an authorized NOFS TV administrator.
 */
function assertAdminAuthorized() {
  const user = auth.currentUser;
  if (!user || !user.email || user.email.toLowerCase() !== OFFICIAL_ADMIN_EMAIL.toLowerCase()) {
    throw new Error('অননুমোদিত এক্সেস: শুধুমাত্র NOFS TV এর অনুমোদিত অ্যাডমিন (nofstv.bd@gmail.com) ইমেজ আপলোড বা ডিলিট করতে পারবেন।');
  }
}

/**
 * Uploads a file (e.g. image for news article or reporter) to Firebase Storage.
 */
export async function uploadMediaFile(
  file: File,
  folder: 'news' | 'reporters' | 'general' = 'news'
): Promise<{ url: string; name: string; size: string; type: string }> {
  assertAdminAuthorized();
  try {
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `uploads/${folder}/${timestamp}_${sanitizedName}`;
    const storageRef = ref(storage, storagePath);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    const sizeInKb = (file.size / 1024).toFixed(1);
    const sizeStr = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${sizeInKb} KB`;

    return {
      url: downloadUrl,
      name: file.name,
      size: sizeStr,
      type: file.type || 'image/jpeg'
    };
  } catch (err: unknown) {
    const error = err as Error;
    throw new Error(`Firebase Storage আপলোড ব্যর্থ হয়েছে: ${error.message}`);
  }
}

/**
 * Deletes a file from Firebase Storage given its full download URL or path.
 */
export async function deleteMediaFile(pathOrUrl: string): Promise<void> {
  assertAdminAuthorized();
  try {
    const storageRef = ref(storage, pathOrUrl);
    await deleteObject(storageRef);
  } catch (err: unknown) {
    const error = err as Error;
    console.warn(`Could not delete storage item: ${error.message}`);
  }
}
