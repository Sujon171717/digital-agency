export type CategoryType = "project" | "task" | "both";

export type TaskStatus = "planned" | "in_progress" | "done";

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: CategoryType;
  createdAt: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  liveUrl: string;
  imageUrl?: string;
  featured: boolean;
  completed?: boolean;
  createdAt: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  status: TaskStatus;
  createdAt: number;
}

export interface VideoEntry {
  id: string;
  videoUrl: string;
  completed?: boolean;
  createdAt: number;
}

export interface Review {
  id: string;
  imageUrl: string;
  createdAt: number;
}
