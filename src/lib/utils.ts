import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDzd(amount: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'DZD',
    maximumFractionDigits: 0
  }).format(amount);
}

export function getEffectivePriceDzd(priceDzd: number, salePriceDzd?: number | null) {
  if (!salePriceDzd) return priceDzd;
  if (salePriceDzd <= 0 || salePriceDzd >= priceDzd) return priceDzd;
  return salePriceDzd;
}

export function getDiscountPercent(priceDzd: number, salePriceDzd?: number | null) {
  const effective = getEffectivePriceDzd(priceDzd, salePriceDzd);
  if (effective >= priceDzd) return 0;
  return Math.round(((priceDzd - effective) / priceDzd) * 100);
}

export function truncate(text: string, max = 120) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}...`;
}
