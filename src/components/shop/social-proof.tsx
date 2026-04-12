'use client';

import { useTranslations } from 'next-intl';

/**
 * Subtle social proof with star rating shown near product title.
 * Boosts credibility with order count and visible rating.
 */
export function SocialProof() {
  const t = useTranslations('product');

  return (
    <div className="social-proof" aria-label="Product rating">
      <span className="social-proof__stars" aria-hidden="true">★★★★★</span>
      <span className="social-proof__text">{t('socialProof')}</span>
    </div>
  );
}
