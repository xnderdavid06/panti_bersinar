import {
  SiteSettings,
  PantiBranch,
  CoreValue,
  FaqItem,
  DonationProgram,
  VolunteerApplication,
  DonationRecord,
  BankAccount,
} from '../types';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  heroLabel: 'A PLACE TO BELONG',
  tagline: 'A home to grow. A community to belong.',
  subheadline: 'Every child deserves a place to learn, grow, and feel at home.',
  heroImageUrl: '/src/assets/images/hero_orphanage_hope_1790578628387.jpg',

  storyHeadline: 'A brighter future begins with belonging.',
  storyParagraph1:
    'Founded in 2019, Yayasan Rumah Bersinar is a social organization working to bring hope, care, and a better future to children in Indonesia.',
  storyParagraph2:
    'Its focus includes children facing disadvantage, children who have lost a parent, and families with limited means, particularly from Indonesia’s frontier, outermost, and underdeveloped regions. The foundation believes every child deserves care, education, and room to grow.',
  founderName: 'Dr. Andri Wisnu Jayakusuma',
  founderTitle: 'Founder & Chairman of Yayasan Rumah Bersinar',

  whatsappPhone: '+62 813-1700-0944',
  contactEmail: 'contact@rumahbersinar.org',
  headquartersAddress: 'Jl. Nginden Semolo 42, Surabaya, East Java, Indonesia',

  announcementText: '🌟 Open Volunteer Recruitment 2026 is now live! Join us in mentoring children across our 4 homes.',
  showAnnouncement: true,

  totalChildren: 86,
  activeCaregivers: 22,
  regionsAssisted: '14 Frontier (3T) Regions',
  networkBranches: 4,
};

export const FOUNDATION_INFO = {
  name: 'Yayasan Rumah Bersinar',
  shortName: 'Rumah Bersinar',
  establishedYear: 2019,
  founder: 'Dr. Andri Wisnu Jayakusuma',
  founderTitle: 'Founder & Chairman of Yayasan Rumah Bersinar',
  legalName: 'Yayasan Rumah Bersinar Indonesia',
  skKemenkumham: 'AHU-0019284.AH.01.04.Year 2019',
  izinDinsos: '460/214/Dinsos-LKS/JATIM/2020',
  accreditation: 'National Grade-A Accreditation · Ministry of Social Affairs RI',
  npwp: '91.824.112.5-604.000',
  visitingHours: 'Daily: 09:00 AM – 05:00 PM (By prior reservation)',
  philosophySummary:
    'We operate with a "Substitute Family" model: our homes are not mere dormitories, but warm, lifelong families where children have dedicated parental figures, character nurturing, spiritual guidance, and quality education.',
  belief:
    'Every child, regardless of origin or background, deserves unconditional compassion, high-quality education, and a nurturing environment to grow into a resilient and flourishing adult.',
  petraProjectNote:
    'Official digital platform initiated through a creative collaboration between Creative Media Communication students at Petra Christian University and Dr. Andri Wisnu Jayakusuma, Founder of Yayasan Rumah Bersinar.',
};

export const CORE_VALUES: CoreValue[] = [
  {
    number: '01',
    name: 'Compassion',
    indonesianName: 'Kasih',
    color: '#d92027',
    description: 'Meeting children with kindness, care, and attention.',
  },
  {
    number: '02',
    name: 'Family',
    indonesianName: 'Keluarga',
    color: '#ea580c',
    description: 'Creating a sense of home and belonging.',
  },
  {
    number: '03',
    name: 'Education',
    indonesianName: 'Pendidikan',
    color: '#1d4ed8',
    description: 'Opening pathways to learning and opportunity.',
  },
  {
    number: '04',
    name: 'Character',
    indonesianName: 'Karakter',
    color: '#16a34a',
    description: 'Nurturing confidence and responsibility.',
  },
  {
    number: '05',
    name: 'Faith',
    indonesianName: 'Iman',
    color: '#ca8a04',
    description: 'Supporting inner growth and spiritual life.',
  },
];

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: '1. Do donations have to be in the form of money?',
    answer:
      'No. While financial donations help us cover essential ongoing school tuition, electricity, and medical checkups, we warmly welcome non-monetary gifts such as staple food (rice, cooking oil, eggs), baby and toddler milk formula, school supplies, uniforms, children’s books, and daily hygiene essentials.',
  },
  {
    id: 'faq-2',
    question: '2. How can I donate goods or food?',
    answer:
      'You can deliver goods directly to our Surabaya headquarters (Jl. Nginden Semolo 42) or any of our 4 orphanage homes in Surabaya and Sidoarjo. If sending via courier, express service, or freight, please contact our team via WhatsApp beforehand so our staff can prepare to receive and log your contribution.',
  },
  {
    id: 'faq-3',
    question: '3. Can I visit?',
    answer:
      'Yes, visits are warmly welcomed! To safeguard the children’s study hours, rest schedules, and scheduled activities, we kindly ask all visitors to schedule a visit in advance via WhatsApp. Visiting hours are daily between 09:00 AM and 05:00 PM.',
  },
  {
    id: 'faq-4',
    question: '4. May I take or publish photos of the children?',
    answer:
      'To protect the privacy, psychological well-being, and legal safety of all children in accordance with Indonesian Child Protection regulations, photography and video recordings may only be conducted with prior approval from foundation management, and must preserve the dignity of the children.',
  },
  {
    id: 'faq-5',
    question: '5. Can the children at the orphanage be adopted?',
    answer:
      'Yes. Official legal adoption procedures are supported through the Ministry of Social Affairs (Kemensos RI) PIPA committee and District Court process. We strictly follow Indonesian child welfare laws and provide transparent, 100% free legal guidance with zero unofficial broker fees.',
  },
];

export const PANTI_BRANCHES: PantiBranch[] = [
  {
    id: 'branch-hq',
    name: 'Yayasan Rumah Bersinar HQ',
    subtitle: 'Headquarters & Youth Transition Residence',
    address: 'Jl. Nginden Semolo 42, Surabaya, East Java',
    city: 'Surabaya',
    postalCode: '60118',
    phone: '+62 813-1700-0944',
    capacityText: '30 Resident Children',
    focusArea: 'Program Coordination, Youth Development & University Prep',
    accentColor: '#f1b607',
    bgBadge: 'bg-amber-100 text-[#352106]',
    mapQuery: 'Jl.+Nginden+Semolo+42+Surabaya',
    imageUrl: '/src/assets/images/hero_orphanage_hope_1790578628387.jpg',
  },
  {
    id: 'branch-tuhan-baik',
    name: 'Panti Asuhan Tuhan Baik',
    subtitle: 'Nurturing Home & Spiritual Character Care',
    address: 'Jl. Bratang Binangun, RT 002, RW 008, Baratajaya, Gubeng, Surabaya',
    city: 'Surabaya',
    postalCode: '60284',
    phone: '+62 813-1700-0944',
    capacityText: '24 Resident Children',
    focusArea: 'Care for Children from 3T Regions & Character Mentorship',
    accentColor: '#1d4ed8',
    bgBadge: 'bg-blue-100 text-blue-900',
    mapQuery: 'Jl.+Bratang+Binangun+Gubeng+Surabaya',
    imageUrl: '/src/assets/images/adoption_family_love_1790578641380.jpg',
  },
  {
    id: 'branch-saluran-berkat',
    name: 'Panti Asuhan Saluran Berkat',
    subtitle: 'Surabaya Branch (Toddler & Early Childhood Dormitory)',
    address: 'Jl. Nginden VI B No: 19, RT 008, RW 4, Nginden Jangkungan, Sukolilo, Surabaya',
    city: 'Surabaya',
    postalCode: '60118',
    phone: '+62 31 598 1234',
    capacityText: '18 Resident Children',
    focusArea: 'Toddler Nutrition, Child Development & Early Childhood Education',
    accentColor: '#f35722',
    bgBadge: 'bg-rose-100 text-rose-900',
    mapQuery: 'Jl.+Nginden+VI+B+No+19+Sukolilo+Surabaya',
    imageUrl: '/src/assets/images/caregiver_nutrition_care_1790578667798.jpg',
  },
  {
    id: 'branch-saluran-kasih',
    name: 'Panti Asuhan Saluran Kasih',
    subtitle: 'Sidoarjo Branch (Vocational & Soft Skill Training Center)',
    address: 'Kerawean, Sumorame, Candi District, Sidoarjo Regency, East Java',
    city: 'Sidoarjo',
    postalCode: '61271',
    phone: '+62 31 892 4567',
    capacityText: '20 Resident Children',
    focusArea: 'Vocational Training, Digital Literacy, Sports & Talent Development',
    accentColor: '#16a34a',
    bgBadge: 'bg-emerald-100 text-emerald-900',
    mapQuery: 'Sumorame+Candi+Sidoarjo',
    imageUrl: '/src/assets/images/children_education_art_1790578654362.jpg',
  },
];

export const VISION_MISSION = {
  vision:
    'To actively participate in educating the nation, uplifting underprivileged communities, and fostering high-quality human resources—specifically focusing on vulnerable, orphaned, and prasejahtera children from Indonesia’s 3T (Frontier, Outermost, Underdeveloped) regions.',
  missions: [
    'Establish and manage nurturing homes founded on a loving "Substitute Family" system, providing holistic shelter, daily sustenance, and accredited education for children from remote 3T regions.',
    'Equip resident children with moral discipline, spiritual growth, emotional resilience, digital literacy, vocational soft skills, and talent incubation across diverse disciplines.',
  ],
};

export const DONATION_PROGRAMS: DonationProgram[] = [
  {
    id: 'prog-education',
    title: 'Scholarship & Educational Fund for 3T Children',
    category: 'education',
    targetAmount: 50000000,
    collectedAmount: 39500000,
    donorCount: 312,
    deadlineText: 'Ongoing Semester Support',
    shortDesc: 'Covers formal tuition fees, school uniforms, textbooks, tutoring sessions, and study materials for children from remote regions.',
    impactDescription: '$10 (Rp 150,000) provides 1 student with full textbook modules & school stationery for an entire semester.',
    defaultAmounts: [100000, 250000, 500000, 1000000],
    unitText: 'Students Supported',
  },
  {
    id: 'prog-nutrition',
    title: 'Daily Nutrition & Kitchen Staples across 4 Homes',
    category: 'nutrition',
    targetAmount: 42000000,
    collectedAmount: 34100000,
    donorCount: 356,
    deadlineText: 'Monthly Kitchen Supply',
    shortDesc: 'Wholesome, balanced meals (fresh meat, eggs, fish, toddler milk formula, vegetables, and fruit) supervised by dietary guidelines.',
    impactDescription: '$20 (Rp 300,000) supplies 3 wholesome daily meals plus milk for a child for one full week.',
    defaultAmounts: [50000, 150000, 300000, 600000],
    unitText: 'Nutritious Meals',
  },
  {
    id: 'prog-character',
    title: 'Character Mentoring & Vocational Soft Skills',
    category: 'character',
    targetAmount: 28000000,
    collectedAmount: 21300000,
    donorCount: 189,
    deadlineText: 'Weekend Workshop Series',
    shortDesc: 'Weekly discipline training, computer coding labs, foreign language classes, leadership retreats, and life-skills workshops.',
    impactDescription: '$35 (Rp 500,000) sponsors digital skills lab equipment and one-on-one mentoring modules for one teen.',
    defaultAmounts: [100000, 250000, 500000, 1000000],
    unitText: 'Workshops',
  },
  {
    id: 'prog-healthcare',
    title: 'Healthcare, Complete Vaccinations & Medical Fund',
    category: 'healthcare',
    targetAmount: 20000000,
    collectedAmount: 16800000,
    donorCount: 174,
    deadlineText: 'Continuous Health Shield',
    shortDesc: 'Regular pediatric checkups, vitamin supplementation, dental care, health insurance, and emergency medical preparedness.',
    impactDescription: '$15 (Rp 200,000) funds full pediatric checkups and seasonal vitamin bundles for two children.',
    defaultAmounts: [75000, 150000, 300000, 750000],
    unitText: 'Medical Checkups',
  },
];

export const BANK_ACCOUNTS: BankAccount[] = [
  {
    bankName: 'BCA (Bank Central Asia)',
    accountNumber: '822-091-7788',
    accountHolder: 'YAYASAN RUMAH BERSINAR INDONESIA',
    branch: 'KCP Nginden Semolo Surabaya',
    badge: 'General & 4-Homes Operational Fund',
  },
  {
    bankName: 'Bank Mandiri',
    accountNumber: '141-00-2288331-9',
    accountHolder: 'YAYASAN RUMAH BERSINAR INDONESIA',
    branch: 'KC Surabaya Gubeng',
    badge: 'Education Scholarships & 3T Children',
  },
  {
    bankName: 'BRI (Bank Rakyat Indonesia)',
    accountNumber: '0096-01-003841-50-2',
    accountHolder: 'YAYASAN RUMAH BERSINAR INDONESIA',
    branch: 'Unit Baratajaya Surabaya',
    badge: 'Food, Groceries & Kitchen Supplies',
  },
  {
    bankName: 'BSI (Bank Syariah Indonesia)',
    accountNumber: '722-119-9022',
    accountHolder: 'YAYASAN RUMAH BERSINAR INDONESIA',
    branch: 'KCP Surabaya Sukolilo',
    badge: 'Charity, Infaq & Humanitarian Relief',
  },
];

export const VOLUNTEER_ROLES = [
  'English & Literacy Tutor',
  'STEM & Computer Literacy Mentor',
  'Creative Arts, Music & Crafts',
  'Sports & Character Building Coach',
  'Toddler Care & Storytelling',
  'Life Skills & Career Mentoring',
  'Event & Activity Organizer',
];

export const INITIAL_VOLUNTEER_APPLICATIONS: VolunteerApplication[] = [
  {
    id: 'VOL-2026-001',
    fullName: 'Clara Evelyn Wijaya',
    email: 'clara.evelyn@petra.ac.id',
    phone: '+62 813-1700-0944',
    institution: 'Petra Christian University',
    preferredBranchId: 'branch-tuhan-baik',
    preferredBranchName: 'Panti Asuhan Tuhan Baik (Surabaya)',
    role: 'English & Literacy Tutor',
    availability: 'Weekends',
    motivation: 'I want to help children from remote regions gain confidence speaking English and discovering the joy of reading books.',
    submittedAt: '2026-10-18T14:30:00Z',
    status: 'Approved',
  },
  {
    id: 'VOL-2026-002',
    fullName: 'Budi Santoso',
    email: 'budi.santoso@gmail.com',
    phone: '+62 812 8899 0011',
    institution: 'Institut Teknologi Sepuluh Nopember (ITS)',
    preferredBranchId: 'branch-saluran-kasih',
    preferredBranchName: 'Panti Asuhan Saluran Kasih (Sidoarjo)',
    role: 'STEM & Computer Literacy Mentor',
    availability: 'Weekends',
    motivation: 'Excited to teach digital skills, basic programming logic, and online research tools to teenagers in Sidoarjo.',
    submittedAt: '2026-10-20T10:15:00Z',
    status: 'Contacted',
  },
  {
    id: 'VOL-2026-003',
    fullName: 'Hannah Priscilla',
    email: 'hannah.priscilla@gmail.com',
    phone: '+62 878 5544 3322',
    institution: 'Universitas Airlangga',
    preferredBranchId: 'branch-saluran-berkat',
    preferredBranchName: 'Panti Asuhan Saluran Berkat (Surabaya)',
    role: 'Toddler Care & Storytelling',
    availability: 'Flexible',
    motivation: 'I love caring for toddlers and fostering early motor skills through music, drawing, and interactive storytelling.',
    submittedAt: '2026-10-21T09:40:00Z',
    status: 'Pending',
  },
];

export const INITIAL_DONATIONS: DonationRecord[] = [
  {
    transactionId: 'TXN-RB-9841',
    donorName: 'David Tanuwijaya',
    donorEmail: 'david.tan@example.com',
    donorPhone: '+62 812 3456 7890',
    amount: 500000,
    programId: 'prog-education',
    programTitle: 'Scholarship & Educational Fund for 3T Children',
    paymentMethod: 'BCA Virtual Account',
    prayerMessage: 'May these children grow strong, educated, and always full of hope!',
    isAnonymous: false,
    timestamp: '2026-10-21T16:20:00Z',
    status: 'Verified',
  },
  {
    transactionId: 'TXN-RB-9842',
    donorName: 'Anonymous Donor',
    donorEmail: 'anonymous@donor.org',
    donorPhone: '+62 811 0000 1111',
    amount: 1000000,
    programId: 'prog-nutrition',
    programTitle: 'Daily Nutrition & Kitchen Staples across 4 Homes',
    paymentMethod: 'QRIS Instant Pay',
    prayerMessage: 'For healthy food and milk for the children.',
    isAnonymous: true,
    timestamp: '2026-10-21T18:45:00Z',
    status: 'Verified',
  },
  {
    transactionId: 'TXN-RB-9843',
    donorName: 'Maria Veronica',
    donorEmail: 'maria.v@example.com',
    donorPhone: '+62 818 7766 5544',
    amount: 250000,
    programId: 'prog-character',
    programTitle: 'Character Mentoring & Vocational Soft Skills',
    paymentMethod: 'Bank Mandiri Transfer',
    prayerMessage: 'Blessings to all the caregivers and teachers.',
    isAnonymous: false,
    timestamp: '2026-10-22T07:15:00Z',
    status: 'Verified',
  },
];
