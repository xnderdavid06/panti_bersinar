export interface SiteSettings {
  // Hero & Tagline
  heroLabel: string;
  tagline: string;
  subheadline: string;
  heroImageUrl: string;

  // Story & History
  storyHeadline: string;
  storyParagraph1: string;
  storyParagraph2: string;
  founderName: string;
  founderTitle: string;

  // Contact Info
  whatsappPhone: string;
  contactEmail: string;
  headquartersAddress: string;

  // Announcement Ribbon
  announcementText: string;
  showAnnouncement: boolean;

  // Metrics
  totalChildren: number;
  activeCaregivers: number;
  regionsAssisted: string;
  networkBranches: number;
}

export interface PantiBranch {
  id: string;
  name: string;
  subtitle: string;
  address: string;
  city: string;
  postalCode?: string;
  phone: string;
  capacityText: string;
  focusArea: string;
  accentColor: string;
  bgBadge: string;
  mapQuery: string;
  imageUrl?: string;
}

export interface CoreValue {
  number: string;
  name: string;
  indonesianName: string;
  color: string;
  description: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface DonationProgram {
  id: string;
  title: string;
  category: 'education' | 'nutrition' | 'character' | 'healthcare';
  targetAmount: number;
  collectedAmount: number;
  donorCount: number;
  deadlineText: string;
  shortDesc: string;
  impactDescription: string;
  defaultAmounts: number[];
  unitText: string;
}

export interface VolunteerApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  preferredBranchId: string;
  preferredBranchName: string;
  role: string;
  availability: 'Weekends' | 'Weekdays' | 'Flexible';
  motivation: string;
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Contacted';
}

export interface DonationRecord {
  transactionId: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  amount: number;
  programId: string;
  programTitle: string;
  paymentMethod: string;
  prayerMessage?: string;
  isAnonymous: boolean;
  timestamp: string;
  status: 'Verified' | 'Pending';
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  branch: string;
  badge: string;
}

export interface Facility {
  id: string;
  name: string;
  photo: string;
  description: string;
  order: number;
}

export interface Activity {
  id: string;
  title: string;
  schedule: string;
  photo: string;
  description: string;
  order: number;
}

export interface Home {
  id: string;
  name: string;
  contact: string;
  location: string;
  mapsLink?: string;
  visitActivities: string;
  visitingHours: string;
  description: string;
  logo?: string;
  photo?: string;
  order: number;
  isSample?: boolean;
}

export interface VisitBooking {
  id: string;
  visitor: string;
  contact: string;
  home: string;
  date: string;
  people: number;
  notes?: string;
  received: string;
}

export interface WhatsAppPledge {
  id: string;
  amount: number;
  date: string;
}
