import type { ImageMetadata } from 'astro';
import step1 from '../assets/images/mutual-funds/fund-step1.svg';
import step2 from '../assets/images/mutual-funds/fund-step2.svg';
import step3 from '../assets/images/mutual-funds/fund-step3.svg';
import step4 from '../assets/images/mutual-funds/fund-step4.svg';
import step5 from '../assets/images/mutual-funds/fund-step5.svg';
import benefit1 from '../assets/images/mutual-funds/icon-1.svg';
import benefit2 from '../assets/images/mutual-funds/icon-2.svg';
import benefit3 from '../assets/images/mutual-funds/icon-3.svg';
import benefit4 from '../assets/images/mutual-funds/icon-4.svg';
import benefit5 from '../assets/images/mutual-funds/icon-5.svg';
import benefit6 from '../assets/images/mutual-funds/icon-6.svg';

export const mutualFundsMeta = {
  title: 'Mutual Funds - IndoThai',
  description:
    'Learn about mutual funds with IndoThai, explore the investment process, discover WINVEST and find information about support for NRI investors.',
};
export const financialGoals =
  'We recognize and value your financial goals and provide you with comprehensive solutions to all your financial needs. Let us serve you better by making the most knowledgeable investment decisions for you.';
export const introduction: string[] = [
  'Mutual funds are investment vehicles that enable everyone to invest their money in a diversified portfolio built on a specific theme managed by professional managers with great talent, insights and knowledge.',
  'We at Indo Thai assist our investors to identify and apply for good mutual fund schemes backed by strong research. We provide different services, dedicated Mutual Fund advisors to understand your needs and help you to build a tailor made portfolio, transacting and executing on your behalf.',
  financialGoals,
];
interface IllustratedItem {
  title: string;
  icon: ImageMetadata;
}
export const investmentSteps: IllustratedItem[] = [
  { title: 'Build a goal and risk profile', icon: step1 },
  { title: 'Fund selection to help you achive your goal', icon: step2 },
  { title: 'Onboarding and Investment', icon: step3 },
  { title: 'Tracking of Performance and Goals', icon: step4 },
  { title: 'Rebalancing and Review', icon: step5 },
];
export const benefits: IllustratedItem[] = [
  { title: 'Diversification of Portfolio', icon: benefit1 },
  { title: 'Advantages of High Liquidity', icon: benefit2 },
  { title: 'The Benefit of Transparency', icon: benefit3 },
  { title: 'Expert Fund Management', icon: benefit4 },
  { title: 'Tailored Investment Solutions', icon: benefit5 },
  { title: 'Specialized Support for NRIs', icon: benefit6 },
];
export const nriBenefits: { title: string; description: string }[] = [
  {
    title: 'Simplify Regulations',
    description:
      'Indothai simplifies the process, reducing paperwork and regulatory complexities for NRIs.',
  },
  {
    title: 'Tailored Investment Solutions',
    description:
      'We offer personalized solutions tailored to your financial goals and investment preferences.',
  },
  {
    title: 'Tax and Regulation Expertise',
    description:
      'Get expert help navigating NRI tax laws and regulations to avoid any complications.',
  },
  {
    title: 'Secure Repatriation',
    description:
      'Indothai ensures safe and easy transfer of your investment funds back to your home country.',
  },
  {
    title: 'Currency Risk Protection',
    description:
      'We help manage currency risks, protecting your returns from exchange rate fluctuations.',
  },
  {
    title: 'Strong Security & Transparency',
    description:
      'Your investments are safe with us, thanks to advanced security protocols and full transparency.',
  },
];
