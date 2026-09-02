import { links } from './site';

export interface NavLink {
  label: string;
  href: string;
  newTab?: boolean;
}
export interface NavGroup {
  label: string;
  children: NavLink[];
}
export const primaryNavigation: NavLink[] = [
  { label: 'Home', href: links.home },
  { label: 'About Us', href: links.about },
  { label: 'Mutual Funds', href: links.mutualFunds },
  { label: 'Careers', href: links.careers },
  { label: 'Investors', href: links.investors },
];
export const accountNavigation: NavGroup = {
  label: 'Modify Account',
  children: [
    { label: 'Close/Freeze an Account', href: links.closeAccount },
    { label: 'Procedure for Closing an Account', href: links.closeProcedure },
    {
      label: 'Closing/ Modifications/ Reactivation',
      href: links.modifyAccount,
      newTab: true,
    },
  ],
};
export const utilityNavigation: (NavLink | NavGroup)[] = [
  { label: 'Blog', href: links.blog },
  { label: 'Fund Transfer', href: links.transfer, newTab: true },
  { label: 'MF Login', href: links.mfLogin, newTab: true },
  accountNavigation,
  { label: 'Software Downloads', href: links.downloads },
  { label: 'Raise Ticket - Complaint', href: links.complaint },
];
export const mobileAccountNavigation: NavLink[] = [
  { label: 'Back Office', href: links.login, newTab: true },
  { label: 'Trading Platform', href: links.winstockGoogle, newTab: true },
  { label: 'MF Back Office', href: links.mfBackOffice, newTab: true },
  { label: 'Fund Transfer', href: links.mobileTransfer, newTab: true },
];
export const regulatorNavigation: NavLink[] = [
  { label: 'SEBI', href: links.sebi },
  { label: 'NSE', href: links.nse },
  { label: 'BSE', href: links.bse },
  { label: 'RBI', href: links.rbi },
  { label: 'NCDEX', href: links.ncdex },
  { label: 'MCX', href: links.mcx },
];
export const legalNavigation: NavLink[] = [
  { label: 'Disclaimer', href: links.disclaimer },
  { label: 'RA Disclaimer', href: links.raDisclaimer },
  { label: 'Privacy Policy', href: links.privacy },
  { label: 'Terms of Use', href: links.terms },
  { label: 'Site Map', href: links.siteMap },
  { label: 'FAQ', href: links.faq },
  { label: 'Download Forms', href: links.downloadForms },
  { label: 'Blog', href: links.blog },
  { label: 'Investor Grievances matrix', href: links.grievances },
];
export const ventures: NavLink[] = [
  { label: 'Femto Green Hydrogen', href: links.femto },
  { label: 'Remigos', href: links.remigos },
  { label: 'Sky Space Offices', href: links.skyspace },
  { label: 'Kisha Lab Grown Diamond', href: links.kisha },
];
