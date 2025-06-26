
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const prepareCategoryData = (formData: any) => {
  return {
    name: formData.name,
    description: formData.description || '',
    slug: generateSlug(formData.name),
    color: formData.color || '#3B82F6',
    icon: formData.icon || 'MessageSquare',
    sort_order: formData.sort_order || 0,
    is_active: true
  };
};
