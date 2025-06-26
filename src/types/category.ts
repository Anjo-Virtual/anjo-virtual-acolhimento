
export type ForumCategory = {
  id: string;
  name: string;
  description: string;
  slug: string;
  color: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
};

export type CategoryFormData = Omit<ForumCategory, 'id'>;
