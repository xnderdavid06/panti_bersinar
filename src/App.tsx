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
  DEFAULT_FACILITIES,
  DEFAULT_ACTIVITIES,
  DEFAULT_HOMES,
  DEFAULT_VISITS,
  DEFAULT_WHATSAPP_PLEDGES,
} from './data/mockData';
import {
  SiteSettings,
  VolunteerApplication,
  DonationRecord,
  PantiBranch,
  CoreValue,
  FaqItem,
  Facility,
  Activity,
  Home,
  VisitBooking,
  WhatsAppPledge,
} from './types';
import {
  supabase,
  isSupabaseConfigured,
  getSiteSettings,
  getBranches,
  getCoreValues,
  getFaqs,
  getVolunteers,
  getDonations,
  insertVolunteer,
  insertDonation,
  getFacilities,
  saveFacilities,
  getActivities,
  saveActivities,
  getHomes,
  saveHomes,
  getVisits,
  insertVisit,
  getWhatsAppPledges,
  insertWhatsAppPledge,
} from './lib/supabase';

const STORAGE_KEY_SETTINGS = 'rumah_bersinar_site_settings_v3';
const STORAGE_KEY_BRANCHES = 'rumah_bersinar_branches_v3';
const STORAGE_KEY_VALUES = 'rumah_bersinar_core_values_v3';
const STORAGE_KEY_FAQS = 'rumah_bersinar_faqs_v3';
const STORAGE_KEY_VOLUNTEERS = 'rumah_bersinar_volunteers_v3';
const STORAGE_KEY_DONATIONS = 'rumah_bersinar_donations_v3';
const STORAGE_KEY_FACILITIES = 'rumah_bersinar_facilities_v1';
const STORAGE_KEY_ACTIVITIES = 'rumah_bersinar_activities_v1';
const STORAGE_KEY_HOMES = 'rumah_bersinar_homes_v1';
const STORAGE_KEY_VISITS = 'rumah_bersinar_visits_v1';
const STORAGE_KEY_PLEDGES = 'rumah_bersinar_pledges_v1';

export default function App() {
  // 1. Site Settings State
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

  // 2. Orphanage Branches State
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

  // 3. Core Values
  const [coreValues, setCoreValues] = useState<CoreValue[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VALUES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_CORE_VALUES;
  });

  // 4. FAQs
  const [faqs, setFaqs] = useState<FaqItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAQS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_FAQS;
  });

  // 5. Volunteers
  const [volunteers, setVolunteers] = useState<VolunteerApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VOLUNTEERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_VOLUNTEER_APPLICATIONS;
  });

  // 6. Donations
  const [donations, setDonations] = useState<DonationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DONATIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_DONATIONS;
  });

  // 7. Facilities (Staff Admin Tab)
  const [facilities, setFacilities] = useState<Facility[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FACILITIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_FACILITIES;
  });

  // 8. Activities (Staff Admin Tab)
  const [activities, setActivities] = useState<Activity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_ACTIVITIES;
  });

  // 9. Homes (Staff Admin Tab)
  const [homes, setHomes] = useState<Home[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HOMES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_HOMES;
  });

  // 10. Visits (Staff Admin Tab)
  const [visits, setVisits] = useState<VisitBooking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VISITS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_VISITS;
  });

  // 11. WhatsApp Pledges (Staff Admin Tab)
  const [whatsappPledges, setWhatsAppPledges] = useState<WhatsAppPledge[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLEDGES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_WHATSAPP_PLEDGES;
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
      localStorage.setItem(STORAGE_KEY_BRANCHES, JSON.stringify(branches));
      localStorage.setItem(STORAGE_KEY_VALUES, JSON.stringify(coreValues));
      localStorage.setItem(STORAGE_KEY_FAQS, JSON.stringify(faqs));
      localStorage.setItem(STORAGE_KEY_VOLUNTEERS, JSON.stringify(volunteers));
      localStorage.setItem(STORAGE_KEY_DONATIONS, JSON.stringify(donations));
      localStorage.setItem(STORAGE_KEY_FACILITIES, JSON.stringify(facilities));
      localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(activities));
      localStorage.setItem(STORAGE_KEY_HOMES, JSON.stringify(homes));
      localStorage.setItem(STORAGE_KEY_VISITS, JSON.stringify(visits));
      localStorage.setItem(STORAGE_KEY_PLEDGES, JSON.stringify(whatsappPledges));
    } catch (e) {}
  }, [siteSettings, branches, coreValues, faqs, volunteers, donations, facilities, activities, homes, visits, whatsappPledges]);

  // Initial Supabase Data Fetch & Realtime Listeners
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    let isMounted = true;

    // Initial Load from Supabase Database
    getSiteSettings().then((s) => isMounted && setSiteSettings(s));
    getBranches().then((b) => isMounted && setBranches(b));
    getCoreValues().then((cv) => isMounted && setCoreValues(cv));
    getFaqs().then((f) => isMounted && setFaqs(f));
    getVolunteers().then((v) => isMounted && setVolunteers(v));
    getDonations().then((d) => isMounted && setDonations(d));
    getFacilities().then((f) => isMounted && setFacilities(f));
    getActivities().then((a) => isMounted && setActivities(a));
    getHomes().then((h) => isMounted && setHomes(h));
    getVisits().then((v) => isMounted && setVisits(v));
    getWhatsAppPledges().then((p) => isMounted && setWhatsAppPledges(p));

    // Realtime WebSocket Subscriptions across tables
    const channel = supabase
      .channel('public:full-realtime-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_settings' },
        (payload: any) => {
          if (payload.new?.settings) {
            setSiteSettings(payload.new.settings);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'branches' },
        () => {
          getBranches().then((b) => isMounted && setBranches(b));
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'core_values' },
        () => {
          getCoreValues().then((cv) => isMounted && setCoreValues(cv));
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'faqs' },
        () => {
          getFaqs().then((f) => isMounted && setFaqs(f));
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'volunteers' },
        () => {
          getVolunteers().then((v) => isMounted && setVolunteers(v));
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'donations' },
        () => {
          getDonations().then((d) => isMounted && setDonations(d));
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'facilities' },
        () => {
          getFacilities().then((f) => isMounted && setFacilities(f));
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'activities' },
        () => {
          getActivities().then((a) => isMounted && setActivities(a));
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'homes' },
        () => {
          getHomes().then((h) => isMounted && setHomes(h));
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'visits' },
        () => {
          getVisits().then((v) => isMounted && setVisits(v));
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'whatsapp_pledges' },
        () => {
          getWhatsAppPledges().then((p) => isMounted && setWhatsAppPledges(p));
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

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

  const handleVolunteerSubmitted = async (newApp: VolunteerApplication) => {
    setVolunteers((prev) => [newApp, ...prev]);
    if (isSupabaseConfigured) {
      await insertVolunteer(newApp);
    }
  };

  const handleDonationSuccess = async (record: DonationRecord) => {
    setDonations((prev) => [record, ...prev]);
    if (isSupabaseConfigured) {
      await insertDonation(record);
    }
  };

  const handleBookVisit = async (visit: VisitBooking) => {
    setVisits((prev) => [visit, ...prev]);
    if (isSupabaseConfigured) {
      await insertVisit(visit);
    }
  };

  const handleLogWhatsAppPledge = async (pledge: WhatsAppPledge) => {
    setWhatsAppPledges((prev) => [pledge, ...prev]);
    if (isSupabaseConfigured) {
      await insertWhatsAppPledge(pledge);
    }
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
        {/* Hero Section */}
        <Hero
          siteSettings={siteSettings}
          onOpenDonation={() => handleOpenDonation()}
          onOpenVolunteer={() => handleOpenVolunteer()}
          onScrollToStory={handleScrollToStory}
        />

        {/* Section 1: Our Story & What We Believe */}
        <AboutUsSection
          siteSettings={siteSettings}
          coreValues={coreValues}
          onOpenDonation={() => handleOpenDonation()}
          onOpenVolunteer={() => handleOpenVolunteer()}
        />

        {/* Section 2: Homes, Facilities & Daily Activities (Updated in real-time from Staff Admin) */}
        <LocationsSection
          branches={branches}
          homes={homes}
          facilities={facilities}
          activities={activities}
          onSelectVolunteerBranch={(branchId) => handleOpenVolunteer(branchId)}
          onOpenDonationForBranch={(branch: PantiBranch) => handleOpenDonation(undefined, 250000)}
          onBookVisit={handleBookVisit}
          onLogPledge={handleLogWhatsAppPledge}
        />

        {/* Section 3: Frequently Asked Questions */}
        <FaqSection
          faqs={faqs}
          whatsappPhone={siteSettings.whatsappPhone}
        />
      </main>

      {/* Footer */}
      <Footer
        siteSettings={siteSettings}
        onOpenDonation={() => handleOpenDonation()}
        onOpenVolunteer={() => handleOpenVolunteer()}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* Donation Modal */}
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

      {/* Staff Admin Dashboard Modal with exact Facilities, Activities, Homes, Visits, and WhatsApp Pledges tabs */}
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
        facilities={facilities}
        onUpdateFacilities={setFacilities}
        activities={activities}
        onUpdateActivities={setActivities}
        homes={homes}
        onUpdateHomes={setHomes}
        visits={visits}
        onUpdateVisits={setVisits}
        whatsappPledges={whatsappPledges}
        onUpdateWhatsAppPledges={setWhatsAppPledges}
      />
    </div>
  );
}
