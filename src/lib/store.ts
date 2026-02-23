import {Product, ProductImage, ProductCategory, ShippingWilaya} from '@prisma/client';

export type Locale = 'en' | 'ar';

export type ProductWithMedia = Product & {
  images: ProductImage[];
};

export function localizeProduct(product: Product, locale: Locale) {
  if (locale === 'ar') {
    return {
      title: product.titleAr,
      description: product.descriptionAr
    };
  }

  return {
    title: product.titleEn,
    description: product.descriptionEn
  };
}

export function localizeWilaya(wilaya: ShippingWilaya, locale: Locale) {
  if (locale === 'ar') return wilaya.nameAr;
  return wilaya.nameEn;
}

export function categoryLabel(category: ProductCategory, locale: Locale) {
  const labels = {
    en: {pants: 'Pants', tshirts: 'T-Shirts', shoes: 'Shoes'},
    ar: {pants: '??????', tshirts: '?????', shoes: '?????'}
  };

  return labels[locale][category];
}
