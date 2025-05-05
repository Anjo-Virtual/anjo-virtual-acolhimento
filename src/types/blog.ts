
export interface BlogPost {
  id?: string;
  title: string;
  description: string;
  content: string;
  category: string;
  published: boolean;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
  author_id?: string;
  date?: string;
}
