
export type ActivePost = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  likes_count: number;
  replies_count: number;
  category: {
    name: string;
    color: string;
  };
  author: {
    display_name: string;
    is_anonymous: boolean;
  };
};

export type ForumFilter = 'recent' | 'popular' | 'trending';
