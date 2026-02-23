import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/i18n/routing';
import { ProductCard } from '@/components/shop/product-card';
import { ProductInteractive } from '@/components/shop/product-interactive';
import { getProductBySlug, getRelatedProducts } from '@/lib/queries';
import { formatDzd, getDiscountPercent, getEffectivePriceDzd } from '@/lib/utils';
import { localizeProduct } from '@/lib/store';
import { TrackViewContent } from '@/components/tracking/track-view-content';

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  pants:   { en: 'Pants',    ar: 'سراويل',    fr: 'Pantalons' },
  tshirts: { en: 'T-Shirts', ar: 'قمصان',     fr: 'T-shirts'  },
  shoes:   { en: 'Shoes',    ar: 'أحذية',     fr: 'Chaussures' },
};

export default async function ProductPage({
  params,
}: {
  params: { locale: 'en' | 'ar'; slug: string };
}) {
  const { locale, slug } = params;
  const t = await getTranslations('product');
  const product = await getProductBySlug(slug);

  if (!product || !product.published) {
    notFound();
  }

  const related = await getRelatedProducts(product.id, product.category);
  const i18n = localizeProduct(product, locale);
  const effectivePrice = getEffectivePriceDzd(product.priceDzd, (product as any).salePriceDzd);
  const isOnSale = effectivePrice < product.priceDzd;
  const discount = getDiscountPercent(product.priceDzd, (product as any).salePriceDzd);

  // Build image list with colorHint from colorTag or alt text
  const images = product.images.map((img) => ({
    url: img.url,
    colorHint:
      (img as any).colorTag ??
      (locale === 'ar' ? img.altAr : img.altEn),
  }));

  return (
    <div className="pb-20">
      <TrackViewContent name={i18n.title} value={effectivePrice} />

      <div className="container-mobile">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 pt-4 pb-2 text-[11px] text-black/40" aria-label="Breadcrumb">
          <Link href={`/${locale}`} className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/${locale}/category/${product.category}`} className="hover:text-black transition-colors capitalize">
            {CATEGORY_LABELS[product.category]?.[locale] ?? product.category}
          </Link>
          <span>/</span>
          <span className="truncate max-w-[180px] text-black/60">{i18n.title}</span>
        </nav>

        {/* Title + price above the grid on mobile */}
        <div className="pt-6 pb-4 sm:hidden">
          <h1 className="text-xl font-medium leading-tight text-ink">{i18n.title}</h1>
          <p className="mt-1 text-[15px] text-black/50">
            {isOnSale ? (
              <>
                <span className="font-semibold text-red-600">{formatDzd(effectivePrice, locale)}</span>{' '}
                <span className="line-through text-black/35">{formatDzd(product.priceDzd, locale)}</span>{' '}
                <span className="text-red-600">(-{discount}%)</span>
              </>
            ) : (
              formatDzd(product.priceDzd, locale)
            )}
          </p>
        </div>

        {/* Gallery + Add-to-cart wired together via ProductInteractive */}
        <ProductInteractive
          productId={product.id}
          slug={product.slug}
          title={i18n.title}
          images={images}
          priceDzd={effectivePrice}
          variants={product.variants.map((v) => ({
            id: v.id,
            size: v.size,
            color: v.color,
            stock: v.stock,
          }))}
        />

        {/* Description + stock below the grid */}
        <div className="mt-8 space-y-4">
          <div className="h-px bg-black/10" />

          {/* Title + price — desktop only show here */}
          <div className="hidden sm:block">
            <h1 className="text-2xl font-medium leading-tight text-ink">{i18n.title}</h1>
            <p className="mt-1 text-[15px] text-black/50">
              {isOnSale ? (
                <>
                  <span className="font-semibold text-red-600">{formatDzd(effectivePrice, locale)}</span>{' '}
                  <span className="line-through text-black/35">{formatDzd(product.priceDzd, locale)}</span>{' '}
                  <span className="text-red-600">(-{discount}%)</span>
                </>
              ) : (
                formatDzd(product.priceDzd, locale)
              )}
            </p>
          </div>

          <p className="text-[13px] leading-7 text-black/60">{i18n.description}</p>

          {/* Stock */}
          <div>
            {product.variants.some((v) => v.stock > 0) ? (
              <p className="text-[12px] uppercase tracking-wider text-green-700">
                {t('inStock')}: {product.variants.reduce((acc, v) => acc + v.stock, 0)}
              </p>
            ) : (
              <p className="text-[12px] uppercase tracking-wider text-red-600">{t('outOfStock')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16 border-t border-black/10 pt-14">
          <div className="container-mobile">
            <h2 className="section-heading mb-8">{t('related')}</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-5 sm:gap-y-10">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
