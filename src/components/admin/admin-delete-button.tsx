'use client';

import { useTransition } from 'react';

interface AdminDeleteButtonProps {
  action: (formData: FormData) => Promise<void>;
  productId: string;
  label?: string;
}

export function AdminDeleteButton({ action, productId, label = 'Delete product' }: AdminDeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!confirm('Delete this product? This cannot be undone.')) return;
    const fd = new FormData();
    fd.append('id', productId);
    startTransition(() => action(fd));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="id" value={productId} />
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-1.5 text-[12px] text-red-500/70 transition-colors hover:text-red-600 disabled:opacity-50"
      >
        {isPending ? (
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-red-300 border-t-red-600" />
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
          </svg>
        )}
        {label}
      </button>
    </form>
  );
}
