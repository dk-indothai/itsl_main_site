import type { ImageMetadata } from 'astro';
import equity from '../assets/images/service-1.png';
import commodities from '../assets/images/service-2.png';
import currency from '../assets/images/service-3.png';
import mutualFunds from '../assets/images/service-4.png';
import depository from '../assets/images/service-5.png';
import ipo from '../assets/images/service-6.png';
import algo from '../assets/images/service-7.png';
import wealth from '../assets/images/service-8.png';
import bonds from '../assets/images/service-9.png';
import kopal from '../assets/images/Kopal.jpg';
import gourav from '../assets/images/Gaurav.jpg';
import vivek from '../assets/images/vivek.jpg';
import piyush from '../assets/images/piyush.jpg';
import shraddha from '../assets/images/shraddha.jpg';
import sanjay from '../assets/images/sanjay.jpg';
import wealthIcon from '../assets/images/wealth.svg';
import clientsIcon from '../assets/images/clients.svg';
import employeesIcon from '../assets/images/employees.svg';
import winstock from '../assets/images/winstock.png';
import winvest from '../assets/images/winvest.png';
import { links } from './site';
import { winvestApp } from './apps';

interface Service {
  title: string;
  description: string;
  icon: ImageMetadata;
}
export const services: Service[] = [
  {
    title: 'Equity & Derivative Trading',
    description:
      'We provide live market rates, demat management, expert insights, and 24/7 support for all your trading needs.',
    icon: equity,
  },
  {
    title: 'Commodities Derivative Trading',
    description:
      'IndoThai provides easy online access to futures markets, supporting low-risk commodity trading and hedging.',
    icon: commodities,
  },
  {
    title: 'Currency Derivative Trading',
    description:
      'We offer currency trading for importers and exporters, ensuring risk management and cost efficiency.',
    icon: currency,
  },
  {
    title: 'Mutual Funds',
    description:
      'IndoThai provides expert mutual fund guidance, helping you select schemes, manage investments, and maximize returns.',
    icon: mutualFunds,
  },
  {
    title: 'Depository Services',
    description:
      'Experience secure, paperless investments with our depository services, including demat accounts, share dematerialization, and dedicated support.',
    icon: depository,
  },
  {
    title: 'IPO',
    description:
      'Unlock IPO potential with IndoThai. We provide expert guidance on promising IPOs, manage IPO fund books, and assist with applications and share sales.',
    icon: ipo,
  },
  {
    title: 'Algo Trading',
    description:
      'Our Algorithmic Trading automates forex, options, futures, and stocks with advanced models, ensuring fast, precise execution and higher efficiency.',
    icon: algo,
  },
  {
    title: 'Wealth Management',
    description:
      'Get personalized wealth management with tailored investment advice and strategies designed to meet your unique goals and maximize your wealth.',
    icon: wealth,
  },
  {
    title: 'Bonds /FD',
    description:
      'Get tailored advice to manage and grow your wealth - including services for family offices',
    icon: bonds,
  },
];
export const statistics = [
  {
    value: '10,000+ cr',
    label: 'Wealth Managed',
    icon: wealthIcon,
  },
  {
    value: '15,000+',
    label: 'Happy Clients',
    icon: clientsIcon,
  },
  {
    value: '75+',
    label: 'Experienced Employees',
    icon: employeesIcon,
  },
] as const;
export const accountSteps = [
  'Register with your Mobile Number',
  'Verify OTP',
  'Upload Documents (Aadhar, PAN)',
  'E-sign with Aadhar',
];
export const apps = [
  {
    name: 'WINSTOCK',
    image: winstock,
    alt: 'WINSTOCK login and market watch screens on two phones',
    // Preserve the source fragment pending editorial approval. See README.
    description:
      'At IndoThai, we offer a fast and secure online trading platform WinStock. Available on Play Store and App Store, our app lets you trade on the go. Access your account,check market movements and trade, analyze charts, stay updated, and plan strategies easily with WinStock. ard and Aadhaar card ready, take a photo or scan them, and upload them to us for quick processing. That’s it!',
    apple: links.winstockApple,
    google: links.winstockGoogle,
  },
  {
    ...winvestApp,
    image: winvest,
    alt: 'WINVEST login and mutual fund portfolio screens on two phones',
  },
];
interface Testimonial {
  name: string;
  role: string;
  quote: string;
  image: ImageMetadata;
}
export const testimonials: Testimonial[] = [
  {
    name: 'Kopal Mehta',
    role: 'MBA (E-Commerce)',
    image: kopal,
    quote:
      '"I\'ve never used a trading platform before Within an hour I had looked through the whole platform and understood all the features."',
  },
  {
    name: 'Gourav Jain',
    role: 'Financial Advisor',
    image: gourav,
    quote:
      '"My experience with Indo Thai has been very good. This is because of the seamless service offered by their support department."',
  },
  {
    name: 'Vivek Hingad',
    role: 'Business Man',
    image: vivek,
    quote:
      '"Was looking for user friendly, responsive and intuitive software that impacts both cost and value. I must say trading with Quick Trade has been a pleasure."',
  },
  {
    name: 'Piyush Khasgiwala',
    role: 'Banker',
    image: piyush,
    quote:
      '"Very easy to execute orders and trades. It wasn\'t difficult at all. It was so easy to complete market orders. Everything was just in one place."',
  },
  {
    name: 'Shraddha Surana',
    role: 'Dentist',
    image: shraddha,
    quote:
      '"I\'ve really enjoyed using the platform. This is fantastic for a beginner."',
  },
  {
    name: 'Sanjay Kathed',
    role: 'Civil Engineer',
    image: sanjay,
    quote:
      '"I am really impressed by the quality of services I receive from Indo Thai Securities ltd. A product of Indo Thai "Quick Trade" is a technology driven software that suits my trading style."',
  },
];
