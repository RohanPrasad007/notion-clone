export interface Document {
  _id: string;
  title: string;
  userId: string;
  isArchived: boolean;
  parentDocument?: string | null;
  content?: string;
  coverImage?: string;
  icon?: string;
  isPublished: boolean;
}
