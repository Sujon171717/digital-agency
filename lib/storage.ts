import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirebaseApp } from "./firebase";

export async function uploadImage(file: File, folder: string) {
  const fb = getFirebaseApp();
  if (!fb) throw new Error("Firebase is not configured.");
  const safeName = file.name.replace(/[^\w.\-]+/g, "-");
  const path = `${folder}/${Date.now()}-${safeName}`;
  const storageRef = ref(fb.storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
