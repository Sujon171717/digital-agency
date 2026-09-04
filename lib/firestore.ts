import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { getFirebaseApp } from "./firebase";
import type { Category, Project, Task } from "./types";

function requireDb() {
  const fb = getFirebaseApp();
  if (!fb) throw new Error("Firebase is not configured. Add keys to .env.local.");
  return fb.db;
}

function withId<T>(id: string, data: Omit<T, "id">): T {
  return { id, ...data } as T;
}

export async function listCategories(): Promise<Category[]> {
  const db = requireDb();
  const snap = await getDocs(query(collection(db, "categories"), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => withId<Category>(d.id, d.data() as Omit<Category, "id">));
}

export async function createCategory(data: Omit<Category, "id" | "createdAt">) {
  const db = requireDb();
  const ref = await addDoc(collection(db, "categories"), { ...data, createdAt: Date.now() });
  return ref.id;
}

export async function updateCategory(id: string, data: Partial<Omit<Category, "id">>) {
  const db = requireDb();
  await updateDoc(doc(db, "categories", id), data);
}

export async function deleteCategory(id: string) {
  const db = requireDb();
  await deleteDoc(doc(db, "categories", id));
}

export async function listProjects(): Promise<Project[]> {
  const db = requireDb();
  const snap = await getDocs(query(collection(db, "projects"), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => withId<Project>(d.id, d.data() as Omit<Project, "id">));
}

export async function getProject(id: string): Promise<Project | null> {
  const db = requireDb();
  const snap = await getDoc(doc(db, "projects", id));
  if (!snap.exists()) return null;
  return withId<Project>(snap.id, snap.data() as Omit<Project, "id">);
}

export async function createProject(data: Omit<Project, "id" | "createdAt">) {
  const db = requireDb();
  const ref = await addDoc(collection(db, "projects"), { ...data, createdAt: Date.now() });
  return ref.id;
}

export async function updateProject(id: string, data: Partial<Omit<Project, "id">>) {
  const db = requireDb();
  await updateDoc(doc(db, "projects", id), data);
}

export async function deleteProject(id: string) {
  const db = requireDb();
  await deleteDoc(doc(db, "projects", id));
}

export async function listTasks(): Promise<Task[]> {
  const db = requireDb();
  const snap = await getDocs(query(collection(db, "tasks"), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => withId<Task>(d.id, d.data() as Omit<Task, "id">));
}

export async function createTask(data: Omit<Task, "id" | "createdAt">) {
  const db = requireDb();
  const ref = await addDoc(collection(db, "tasks"), { ...data, createdAt: Date.now() });
  return ref.id;
}

export async function updateTask(id: string, data: Partial<Omit<Task, "id">>) {
  const db = requireDb();
  await updateDoc(doc(db, "tasks", id), data);
}

export async function deleteTask(id: string) {
  const db = requireDb();
  await deleteDoc(doc(db, "tasks", id));
}
