// frontend/src/config/categories.ts

export const PRODUCT_CATEGORIES = [
  'T-Shirts',
  'Dresses',
  'Jeans',
  'Jackets',
  'Shoes',
  'Accessories',
  'Bags',
  'Jewelry',
  'Hats',
  'Scarves',
  'Belts',
  'Sunglasses',
  'Watches',
  'Suits',
  'Shorts',
  'Skirts',
  'Sweaters',
  'Coats',
  'Sneakers',
  'Boots',
  'Sandals',
  'Handbags',
  'Men\'s Fashion',
  'Women\'s Fashion',
  'Activewear',
  'Swimwear',
  'Vintage',
  'Designer',
  'Other'
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];