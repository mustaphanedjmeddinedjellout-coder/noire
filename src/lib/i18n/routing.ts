import {defineRouting} from 'next-intl/routing';
import Link from 'next/link';

export const routing = defineRouting({
  locales: ['en', 'ar'],
  defaultLocale: 'en'
});

export {Link};
