import { links } from './site';

/** Shared app copy and destinations; page-specific artwork stays with each page. */
export const winvestApp = {
  name: 'WINVEST',
  description:
    'Manage your mutual fund investments directly from your smartphone or tablet with Winvest. Our free mobile app lets you invest, track and manage all your mutual funds anytime, anywhere. Check performance, access detailed reports, get real-time updates and make better investment decisions with Winvest.',
  apple: links.winvestApple,
  google: links.winvestGoogle,
} as const;
