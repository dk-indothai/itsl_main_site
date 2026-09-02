import type { ImageMetadata } from 'astro';
import parasmal from '../assets/images/about-us/t1.jpg';
import dhanpal from '../assets/images/about-us/t2.png';
import rajendra from '../assets/images/about-us/t3.png';
import dharmendra from '../assets/images/about-us/dharmendra-jain.png';
import amber from '../assets/images/about-us/amber-chourasia.jpeg';
import sweta from '../assets/images/about-us/sweta-sharma-pastaria.jpg';
import honesty from '../assets/images/about-us/icon-1.svg';
import trust from '../assets/images/about-us/icon-2.svg';
import teamwork from '../assets/images/about-us/icon-3.svg';
import skyspace from '../assets/images/about-us/cmpny1.png';
import femto from '../assets/images/about-us/cmpny2.png';
import kisha from '../assets/images/about-us/cmpny3.png';
import remigos from '../assets/images/about-us/cmpny4.png';
import gallery1 from '../assets/images/about-us/gallery1.png';
import gallery2 from '../assets/images/about-us/gallery2.png';
import gallery3 from '../assets/images/about-us/gallery3.png';
import gallery4 from '../assets/images/about-us/gallery4.png';
import gallery5 from '../assets/images/about-us/gallery5.png';
import { links } from './site';

export const aboutMeta = {
  title: 'About Us - IndoThai',
  description:
    'Explore IndoThai’s company story, leadership, milestones, vision, values and group of companies, serving investors since 1995.',
};
export const aboutIntroduction =
  'IndoThai—leading the way with investment strategies designed for success-driven HNIs and corporations.';
export const companyStory: string[] = [
  'Every company has a story, and ours began with a clear need: priority investment services for high-net-worth individuals. In India, many brokers provide the same standard services, regardless of how much you invest, which can be frustrating and affect your financial future.',
  'Imagine if there were a broker that offered personalized services designed specifically for your goals. That vision gave rise to IndoThai. Established in 1995, we have grown into one of India’s leading and most trusted full-service brokers, offering a wide range of financial services tailored for high-net-worth clients and corporations. With over 30 years of experience, we have built a strong community of more than 15,000 satisfied clients and managed wealth exceeding ₹10,000 crore.',
  'As part of a group of 16 companies, we not only provide brokerage services but also engage in real estate, green technology through Femto, and financial services within the IFSC. At IndoThai, we don’t just offer services; we create opportunities. Our clients are our top priority, and we are dedicated to providing you with valuable research and resources.',
];
interface Director {
  name: string;
  role: string;
  image: ImageMetadata;
}
export const directors: Director[] = [
  { name: 'Parasmal Doshi', role: 'Chairman', image: parasmal },
  { name: 'Dhanpal Doshi', role: 'Managing Director', image: dhanpal },
  { name: 'Rajendra Bandi', role: 'Whole-time Director', image: rajendra },
  { name: 'Dharmendra Jain', role: 'Independent Director', image: dharmendra },
  { name: 'Amber Chourasia', role: 'Independent Director', image: amber },
  { name: 'Sweta Sharma Pastaria', role: 'Independent Director', image: sweta },
];
// Transcribed from the original timeline artwork, not inferred company history.
export const milestones: { year: number; event: string }[] = [
  { year: 1995, event: 'Launched Cash segment' },
  { year: 2000, event: 'Launched Future and Option' },
  { year: 2003, event: 'Launched MCX commodity' },
  { year: 2004, event: 'Took Clearing membership.' },
  { year: 2006, event: 'Launched Mutual Fund' },
  { year: 2007, event: 'Launched DP services' },
  { year: 2008, event: 'Launched Currency' },
  { year: 2010, event: 'Highest Volume in Commodity in Central India' },
  { year: 2011, event: 'Listed on NSE/BSE' },
  { year: 2015, event: 'Shifted to a corporate office' },
  { year: 2024, event: 'Raised 155cr for growth' },
];
// The source mobile artwork disagrees with desktop. Preserve, do not reconcile
// company history without owner approval; see README's source anomalies.
export const mobileMilestones = milestones.map((item) => ({
  year: item.year === 2008 ? 2006 : item.year,
  event: item.year === 2024 ? 'Raised 160cr for growth' : item.event,
}));
export const vision =
  '“Our vision is to enhance the investment experience for everyone We Serve, driving a stronger, more prosperous Future For The Nation. At the heart of this mission is our commitment to delivering steady, sustainable returns for All Our Stakeholders.”';
export const values: { title: string; icon: ImageMetadata }[] = [
  { title: 'Honesty and Transparency', icon: honesty },
  { title: 'Trust and Openness', icon: trust },
  { title: 'Teamwork and Innovation', icon: teamwork },
];
export const businessIntroduction =
  'At IndoThai, we don’t just provide financial services; we partner with our clients on their journey toward success. As a group of 16 companies, our flagship, Indo Thai Securities Limited (ITSL), has been shaping the financial landscape since 1995. From our roots in Indore, we’ve grown to offer a wide range of services across 60+ locations in India, driven by a deep belief in trust, transparency, and accountability.';
export const businessSections: { title: string; text: string }[] = [
  {
    title: 'A Strong Foundation of Trust',
    text: 'We understand that financial markets can feel overwhelming, but at IndoThai, we’ve spent the last two decades simplifying it for our clients—corporate entities, HNIs and retail investors alike. Our dedication to clear communication, personalized service, and a commitment to ethical practices have earned us a reputation as the leading broking firm in Central India. We don’t just talk numbers; we build relationships that last.',
  },
  {
    title: 'Services that Adapt to Your Needs',
    text: 'We know every client is different, and our aim is to offer a smooth trading experience that fits your needs. For corporate clients, we provide personal attention and access to the best industry practices. For sub-brokers, we ensure quick account openings, a dedicated risk manager, and easy access to funds for Margin Trading Facility (MTF). Whatever your needs, we’re here to meet them with care and efficiency. From mutual funds investment and Algo trading to wealth management, we make sure our clients make informed decisions, no matter the market condition. With multiple branches and authorized representatives across Madhya Pradesh, Chhattisgarh, Rajasthan, Maharashtra, Gujarat, and more, we’ve expanded our reach to offer accessible and personalized services to a wider audience Every service we provide stems from a simple idea: we succeed when our clients succeed. That’s why we focus on giving them the best tools, the best advice, and a personalized experience that grows with them.',
  },
  {
    title: 'Our Commitment to You',
    text: 'Whether you’re an investor, a partner, or a business associate, we’re committed to helping you make the most of every opportunity. With IndoThai, you get more than a financial service provider. You get a partner that listens, understands, and supports you every step of the way. Together, we grow. Together, we succeed.',
  },
];
export const groupCompanies: {
  name: string;
  image: ImageMetadata;
  href: string;
}[] = [
  { name: 'Sky Space Offices', image: skyspace, href: links.skyspace },
  { name: 'Femto Green Hydrogen', image: femto, href: links.femtoAbout },
  { name: 'Kisha Lab Grown Diamond', image: kisha, href: links.kisha },
  { name: 'Remigos', image: remigos, href: links.remigos },
];
export const gallery: { image: ImageMetadata; alt: string }[] = [
  {
    image: gallery1,
    alt: 'Executive office with a desk, meeting chairs and a sofa',
  },
  {
    image: gallery2,
    alt: 'Glass office entrance beside a ceremonial brass lamp',
  },
  {
    image: gallery3,
    alt: 'Rows of workstations in the IndoThai office',
  },
  { image: gallery4, alt: 'Office dining area with tables and red chairs' },
  {
    image: gallery5,
    alt: 'Wide view of the executive office and its seating area',
  },
];
