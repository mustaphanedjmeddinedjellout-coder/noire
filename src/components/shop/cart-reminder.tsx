'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Link } from '@/lib/i18n/routing';
import { useCart } from '@/components/shop/cart-provider';
import { formatDzd } from '@/lib/utils';

/* ─── Config ────────────────────────────────────────────────────────────────── */
const STORAGE_KEY = 'noire-cart-reminder-dismissed';
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours
const TRIGGER_DELAY = 60_000;             // 60 seconds idle on page

/* ─── Helpers ────────────────────────────────────────────────────────────────── */
function isDismissedRecently(): boolean {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (!val) return false;
    return Date.now() - Number(val) < COOLDOWN_MS;
  } catch {
    return false;
  }
}

function markDismissed(): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

/* ─── Component ──────────────────────────────────────────────────────────────── */
export function CartReminder() {
  const t = useTranslations('cartReminder');
  const locale = useLocale();
  const { items, count, subtotal } = useCart();
  const pathname = usePathname();

  const [rendered, setRendered] = useState(false);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pages where the reminder should never appear
  const isExcluded = /\/(cart|checkout|order-success|admin)(\/|$)/.test(pathname);

  const firstItem = items[0] ?? null;

  function show() {
    setRendered(true);
    // Double rAF ensures the element is in the DOM before we trigger the CSS transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
  }

  function dismiss() {
    setVisible(false);
    markDismissed();
    setTimeout(() => setRendered(false), 400);
  }

  // Re-arm the timer whenever the pathname changes or when the cart gains items.
  // This means each new page gives the user a fresh 60-second window.
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    // Hide & reset if no longer eligible
    if (count === 0 || isExcluded) {
      setVisible(false);
      setTimeout(() => setRendered(false), 400);
      return;
    }

    if (isDismissedRecently()) return;

    timerRef.current = setTimeout(() => {
      if (!isDismissedRecently() && count > 0 && !isExcluded) {
        show();
      }
    }, TRIGGER_DELAY);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, count, isExcluded]);

  if (!rendered || !firstItem) return null;

  const extraCount = count - firstItem.quantity;

  return (
    <div
      role="complementary"
      aria-label={t('ariaLabel')}
      className={[
        // Position: above mobile dock on small screens, bottom-right corner on desktop
        'fixed inset-x-0 bottom-[5.5rem] z-[90] mx-auto w-[calc(100%-2rem)] max-w-sm',
        'sm:bottom-6 sm:left-auto sm:right-6 sm:mx-0',
        // Animation
        'transition-all duration-[400ms] ease-out',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0 pointer-events-none',
      ].join(' ')}
    >
      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl shadow-black/[0.12]">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-black/[0.07] bg-[#faf9f8] px-4 py-2.5">
          <p className="flex items-center gap-2 text-[13px] font-semibold text-black/70">
            {/* Shopping bag icon */}
            <svg
              width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round"
              className="shrink-0 text-black/50"
            >
              <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {t('title', { count })}
          </p>

          <button
            onClick={dismiss}
            aria-label={t('dismiss')}
            className="flex h-6 w-6 items-center justify-center rounded-full text-black/35 transition-colors hover:bg-black/8 hover:text-black"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* ── Body ───────────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 py-3">
          {/* First item thumbnail */}
          {firstItem.image && (
            <div className="relative h-[52px] w-[42px] shrink-0 overflow-hidden rounded-xl bg-[#f0ede8]">
              <Image
                src={firstItem.image}
                alt={firstItem.title}
                fill
                className="object-cover"
                sizes="42px"
              />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-black leading-tight">
              {firstItem.title}
            </p>
            {extraCount > 0 && (
              <p className="text-[12px] text-black/45 leading-tight mt-0.5">
                {t('andMore', { count: extraCount })}
              </p>
            )}
            <p className="mt-1 text-[13px] font-semibold text-black">
              {formatDzd(subtotal, locale)}
            </p>
          </div>
        </div>

        {/* ── CTA ────────────────────────────────────────────────────────────── */}
        <div className="px-4 pb-4">
          <Link
            href="/cart"
            onClick={dismiss}
            className="flex w-full items-center justify-center rounded-xl bg-black py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-80 active:scale-[0.98]"
          >
            {t('cta')}
            <svg
              width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              className="ms-1.5 shrink-0"
            >
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
