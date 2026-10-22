/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutUsSection } from './components/AboutUsSection';
import { LocationsSection } from './components/LocationsSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { DonationModal } from './components/DonationModal';
import { VolunteerModal } from './components/VolunteerModal';
import { AdminModal } from './components/AdminModal';

import {
  DEFAULT_SITE_SETTINGS,
  INITIAL_VOLUNTEER_APPLICATIONS,
  INITIAL_DONATIONS,
  PANTI_BRANCHES as DEFAULT_BRANCHES,
  CORE_VALUES as DEFAULT_CORE_VALUES,
  FAQS as DEFAULT_FAQS,
} from './data/mockData';
import {
  SiteSettings,
  VolunteerApplication,
  DonationRecord,
  PantiBranch,
  CoreValue,
  FaqItem,
} from './types';

const STORAGE_KEY_SETTINGS = 'rumah_bersinar_site_settings_v3';
const STORAGE_KEY_BRANCHES = 'rumah_bersinar_branches_v3';
const STORAGE_KEY_VALUES = 'rumah_bersinar_core_values_v3';
const STORAGE_KEY_FAQS = 'rumah_bersinar_faqs_v3';
const STORAGE_KEY_VOLUNTEERS = 'rumah_bersinar_volunteers_v3';
const STORAGE_KEY_DONATIONS = 'rumah_bersinar_donations_v3';

export default function App() {
  // 1. Site Settings State (Hero photo, Tagline, Story text, Contacts, Announcement)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        const parsed: SiteSettings = JSON.parse(saved);
        if (parsed.heroImageUrl) {
          parsed.heroImageUrl = parsed.heroImageUrl.replace(/^\/src\/assets\/images\//, '/images/');
        }
        return parsed;
      }
    } catch (e) {
      console.error('Error loading settings from localStorage', e);
    }
    return DEFAULT_SITE_SETTINGS;
  });

  // 2. Orphanage Branches State (Editable photos, addresses, capacities)
  const [branches, setBranches] = useState<PantiBranch[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BRANCHES);
      if (saved) {
        const parsed: PantiBranch[] = JSON.parse(saved);
        return parsed.map((b) => ({
          ...b,
          imageUrl: b.imageUrl ? b.imageUrl.replace(/^\/src\/assets\/images\//, '/images/') : b.imageUrl,
        }));
      }
    } catch (e) {
      console.error('Error loading branches from localStorage', e);
    }
    return DEFAULT_BRANCHES;
  });

  // 3. 5 Core Values State (Editable names, descriptions, colors)
  const [coreValues, setCoreValues] = useState<CoreValue[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VALUES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading core values from localStorage', e);
    }
    return DEFAULT_CORE_VALUES;
  });

  // 4. FAQs State (Editable questions and answers, add/delete)
  const [faqs, setFaqs] = useState<FaqItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAQS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading FAQs from localStorage', e);
    }
    return DEFAULT_FAQS;
  });

  // 5. Volunteer Applicants State
  const [volunteers, setVolunteers] = useState<VolunteerApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VOLUNTEERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading volunteers from localStorage', e);
    }
    return INITIAL_VOLUNTEER_APPLICATIONS;
  });

  // 6. Donations Ledger State
  const [donations, setDonations] = useState<DonationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DONATIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading donations from localStorage', e);
    }
    return INITIAL_DONATIONS;
  });

  // Modals state
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState<string | undefined>(undefined);
  const [selectedDonationAmount, setSelectedDonationAmount] = useState<number | undefined>(undefined);

  const [volunteerModalOpen, setVolunteerModalOpen] = useState(false);
  const [targetBranchIdForVolunteer, setTargetBranchIdForVolunteer] = useState<string | undefined>(undefined);

  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(siteSettings));
    } catch (e) {
      console.error('Error saving settings to localStorage', e);
    }
  }, [siteSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BRANCHES, JSON.stringify(branches));
    } catch (e) {
      console.error('Error saving branches to localStorage', e);
    }
  }, [branches]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VALUES, JSON.stringify(coreValues));
    } catch (e) {
      console.error('Error saving core values to localStorage', e);
    }
  }, [coreValues]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FAQS, JSON.stringify(faqs));
    } catch (e) {
      console.error('Error saving FAQs to localStorage', e);
    }
  }, [faqs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VOLUNTEERS, JSON.stringify(volunteers));
    } catch (e) {
      console.error('Error saving volunteers to localStorage', e);
    }
  }, [volunteers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DONATIONS, JSON.stringify(donations));
    } catch (e) {
      console.error('Error saving donations to localStorage', e);
    }
  }, [donations]);

  // Handlers
  const handleOpenDonation = (programId?: string, amount?: number) => {
    setSelectedProgramId(programId);
    setSelectedDonationAmount(amount);
    setDonationModalOpen(true);
  };

  const handleOpenVolunteer = (branchId?: string) => {
    setTargetBranchIdForVolunteer(branchId || (branches[0] ? branches[0].id : undefined));
    setVolunteerModalOpen(true);
  };

  const handleVolunteerSubmitted = (newApp: VolunteerApplication) => {
    setVolunteers((prev) => [newApp, ...prev]);
  };

  const handleDonationSuccess = (record: DonationRecord) => {
    setDonations((prev) => [record, ...prev]);
  };

  const handleScrollToStory = () => {
    const el = document.getElementById('story');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#352106] flex flex-col font-body antialiased selection:bg-[#fdc502] selection:text-[#352106]">
      {/* Header with Navigation, Open Volunteer, Donate & Admin triggers */}
      <Header
        siteSettings={siteSettings}
        onOpenDonation={() => handleOpenDonation()}
        onOpenVolunteer={() => handleOpenVolunteer()}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section matching Screenshot 1: Dynamic Photo, Tagline, & Discover our story */}
        <Hero
          siteSettings={siteSettings}
          onOpenDonation={() => handleOpenDonation()}
          onOpenVolunteer={() => handleOpenVolunteer()}
          onScrollToStory={handleScrollToStory}
        />

        {/* Section 1: Our Story (Screenshot 2) & What We Believe (Screenshot 3) */}
        <AboutUsSection
          siteSettings={siteSettings}
          coreValues={coreValues}
          onOpenDonation={() => handleOpenDonation()}
          onOpenVolunteer={() => handleOpenVolunteer()}
        />

        {/* Section 2: Facilities & The Orphanage Homes in Surabaya & Sidoarjo */}
        <LocationsSection
          branches={branches}
          onSelectVolunteerBranch={(branchId) => handleOpenVolunteer(branchId)}
          onOpenDonationForBranch={(branch: PantiBranch) => handleOpenDonation(undefined, 250000)}
        />

        {/* Section 3: Frequently Asked Questions matching Screenshot 4 with WhatsApp CTA */}
        <FaqSection
          faqs={faqs}
          whatsappPhone={siteSettings.whatsappPhone}
        />
      </main>

      {/* Footer matching Screenshot 5 with Explore & Contact Us columns */}
      <Footer
        siteSettings={siteSettings}
        onOpenDonation={() => handleOpenDonation()}
        onOpenVolunteer={() => handleOpenVolunteer()}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* Donation Modal with instant ledger logging */}
      <DonationModal
        isOpen={donationModalOpen}
        onClose={() => setDonationModalOpen(false)}
        initialProgramId={selectedProgramId}
        initialAmount={selectedDonationAmount}
        onDonationSuccess={handleDonationSuccess}
      />

      {/* Open Volunteer Application Modal */}
      <VolunteerModal
        isOpen={volunteerModalOpen}
        onClose={() => setVolunteerModalOpen(false)}
        onVolunteerSubmitted={handleVolunteerSubmitted}
        initialBranchId={targetBranchIdForVolunteer}
      />

      {/* Comprehensive Admin Dashboard Modal with Username/Password login and full content/photo editing */}
      <AdminModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        siteSettings={siteSettings}
        onUpdateSettings={setSiteSettings}
        branches={branches}
        onUpdateBranches={setBranches}
        coreValues={coreValues}
        onUpdateCoreValues={setCoreValues}
        faqs={faqs}
        onUpdateFaqs={setFaqs}
        volunteers={volunteers}
        onUpdateVolunteers={setVolunteers}
        donations={donations}
        onUpdateDonations={setDonations}
      />
    </div>
  );
}
