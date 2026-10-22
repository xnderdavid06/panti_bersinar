import { createClient } from '@supabase/supabase-js';
import {
  SiteSettings,
  PantiBranch,
  CoreValue,
  FaqItem,
  VolunteerApplication,
  DonationRecord,
  Facility,
  Activity,
  Home,
  VisitBooking,
  WhatsAppPledge,
} from '../types';
import {
  DEFAULT_SITE_SETTINGS,
  PANTI_BRANCHES as DEFAULT_BRANCHES,
  CORE_VALUES as DEFAULT_CORE_VALUES,
  FAQS as DEFAULT_FAQS,
  INITIAL_VOLUNTEER_APPLICATIONS,
  INITIAL_DONATIONS,
  DEFAULT_FACILITIES,
  DEFAULT_ACTIVITIES,
  DEFAULT_HOMES,
  DEFAULT_VISITS,
  DEFAULT_WHATSAPP_PLEDGES,
} from '../data/mockData';

// Environment variables from Vite (prefixed with VITE_)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  supabaseAnonKey.length > 20
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

// ==========================================
// 1. SITE SETTINGS
// ==========================================
export async function getSiteSettings(): Promise<SiteSettings> {
  if (!supabase) return DEFAULT_SITE_SETTINGS;

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('settings')
      .eq('id', 'current')
      .single();

    if (error || !data?.settings) {
      // Seed default settings into Supabase
      await supabase
        .from('site_settings')
        .upsert({ id: 'current', settings: DEFAULT_SITE_SETTINGS });
      return DEFAULT_SITE_SETTINGS;
    }

    return data.settings as SiteSettings;
  } catch (e) {
    console.error('Error fetching site settings from Supabase:', e);
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function saveSiteSettings(settings: SiteSettings): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('site_settings').upsert({
      id: 'current',
      settings,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch (e) {
    console.error('Error saving site settings to Supabase:', e);
    return false;
  }
}

// ==========================================
// 2. BRANCHES
// ==========================================
export async function getBranches(): Promise<PantiBranch[]> {
  if (!supabase) return DEFAULT_BRANCHES;

  try {
    const { data, error } = await supabase
      .from('branches')
      .select('data')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      // Seed default branches
      const seedRows = DEFAULT_BRANCHES.map((b, idx) => ({
        id: b.id,
        data: b,
        sort_order: idx,
      }));
      await supabase.from('branches').upsert(seedRows);
      return DEFAULT_BRANCHES;
    }

    return data.map((row) => row.data as PantiBranch);
  } catch (e) {
    console.error('Error fetching branches from Supabase:', e);
    return DEFAULT_BRANCHES;
  }
}

export async function saveBranches(branches: PantiBranch[]): Promise<boolean> {
  if (!supabase) return false;

  try {
    const rows = branches.map((b, idx) => ({
      id: b.id,
      data: b,
      sort_order: idx,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from('branches').upsert(rows);
    return !error;
  } catch (e) {
    console.error('Error saving branches to Supabase:', e);
    return false;
  }
}

// ==========================================
// 3. CORE VALUES
// ==========================================
export async function getCoreValues(): Promise<CoreValue[]> {
  if (!supabase) return DEFAULT_CORE_VALUES;

  try {
    const { data, error } = await supabase
      .from('core_values')
      .select('data')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      const seedRows = DEFAULT_CORE_VALUES.map((cv, idx) => ({
        id: cv.number,
        data: cv,
        sort_order: idx,
      }));
      await supabase.from('core_values').upsert(seedRows);
      return DEFAULT_CORE_VALUES;
    }

    return data.map((row) => row.data as CoreValue);
  } catch (e) {
    console.error('Error fetching core values from Supabase:', e);
    return DEFAULT_CORE_VALUES;
  }
}

export async function saveCoreValues(values: CoreValue[]): Promise<boolean> {
  if (!supabase) return false;

  try {
    const rows = values.map((cv, idx) => ({
      id: cv.number,
      data: cv,
      sort_order: idx,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from('core_values').upsert(rows);
    return !error;
  } catch (e) {
    console.error('Error saving core values to Supabase:', e);
    return false;
  }
}

// ==========================================
// 4. FAQS
// ==========================================
export async function getFaqs(): Promise<FaqItem[]> {
  if (!supabase) return DEFAULT_FAQS;

  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('id, question, answer')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      const seedRows = DEFAULT_FAQS.map((f, idx) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        sort_order: idx,
      }));
      await supabase.from('faqs').upsert(seedRows);
      return DEFAULT_FAQS;
    }

    return data as FaqItem[];
  } catch (e) {
    console.error('Error fetching FAQs from Supabase:', e);
    return DEFAULT_FAQS;
  }
}

export async function saveFaqs(faqs: FaqItem[]): Promise<boolean> {
  if (!supabase) return false;

  try {
    const rows = faqs.map((f, idx) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
      sort_order: idx,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from('faqs').upsert(rows);
    return !error;
  } catch (e) {
    console.error('Error saving FAQs to Supabase:', e);
    return false;
  }
}

// ==========================================
// 5. VOLUNTEERS (Realtime Submissions)
// ==========================================
export async function getVolunteers(): Promise<VolunteerApplication[]> {
  if (!supabase) return INITIAL_VOLUNTEER_APPLICATIONS;

  try {
    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error || !data || data.length === 0) {
      // Seed initial volunteer samples if empty
      const seedRows = INITIAL_VOLUNTEER_APPLICATIONS.map((v) => ({
        id: v.id,
        full_name: v.fullName,
        email: v.email,
        phone: v.phone,
        institution: v.institution,
        preferred_branch_id: v.preferredBranchId,
        preferred_branch_name: v.preferredBranchName,
        role: v.role,
        availability: v.availability,
        motivation: v.motivation,
        submitted_at: v.submittedAt,
        status: v.status,
      }));
      await supabase.from('volunteers').upsert(seedRows);
      return INITIAL_VOLUNTEER_APPLICATIONS;
    }

    return data.map((v) => ({
      id: v.id,
      fullName: v.full_name,
      email: v.email,
      phone: v.phone,
      institution: v.institution,
      preferredBranchId: v.preferred_branch_id,
      preferredBranchName: v.preferred_branch_name,
      role: v.role,
      availability: v.availability,
      motivation: v.motivation,
      submittedAt: v.submitted_at,
      status: v.status,
    }));
  } catch (e) {
    console.error('Error fetching volunteers from Supabase:', e);
    return INITIAL_VOLUNTEER_APPLICATIONS;
  }
}

export async function insertVolunteer(app: VolunteerApplication): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('volunteers').insert([
      {
        id: app.id,
        full_name: app.fullName,
        email: app.email,
        phone: app.phone,
        institution: app.institution,
        preferred_branch_id: app.preferredBranchId,
        preferred_branch_name: app.preferredBranchName,
        role: app.role,
        availability: app.availability,
        motivation: app.motivation,
        submitted_at: app.submittedAt,
        status: app.status,
      },
    ]);
    return !error;
  } catch (e) {
    console.error('Error inserting volunteer in Supabase:', e);
    return false;
  }
}

export async function updateVolunteerStatus(
  id: string,
  status: VolunteerApplication['status']
): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('volunteers')
      .update({ status })
      .eq('id', id);
    return !error;
  } catch (e) {
    console.error('Error updating volunteer status:', e);
    return false;
  }
}

// ==========================================
// 6. DONATIONS (Realtime Ledger)
// ==========================================
export async function getDonations(): Promise<DonationRecord[]> {
  if (!supabase) return INITIAL_DONATIONS;

  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error || !data || data.length === 0) {
      const seedRows = INITIAL_DONATIONS.map((d) => ({
        transaction_id: d.transactionId,
        donor_name: d.donorName,
        donor_email: d.donorEmail,
        donor_phone: d.donorPhone,
        amount: d.amount,
        program_id: d.programId,
        program_title: d.programTitle,
        payment_method: d.paymentMethod,
        prayer_message: d.prayerMessage || '',
        is_anonymous: d.isAnonymous,
        timestamp: d.timestamp,
        status: d.status,
      }));
      await supabase.from('donations').upsert(seedRows);
      return INITIAL_DONATIONS;
    }

    return data.map((d) => ({
      transactionId: d.transaction_id,
      donorName: d.donor_name,
      donorEmail: d.donor_email,
      donorPhone: d.donor_phone,
      amount: Number(d.amount),
      programId: d.program_id,
      programTitle: d.program_title,
      paymentMethod: d.payment_method,
      prayerMessage: d.prayer_message,
      isAnonymous: d.is_anonymous,
      timestamp: d.timestamp,
      status: d.status,
    }));
  } catch (e) {
    console.error('Error fetching donations from Supabase:', e);
    return INITIAL_DONATIONS;
  }
}

export async function insertDonation(record: DonationRecord): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('donations').insert([
      {
        transaction_id: record.transactionId,
        donor_name: record.donorName,
        donor_email: record.donorEmail,
        donor_phone: record.donorPhone,
        amount: record.amount,
        program_id: record.programId,
        program_title: record.programTitle,
        payment_method: record.paymentMethod,
        prayer_message: record.prayerMessage || '',
        is_anonymous: record.isAnonymous,
        timestamp: record.timestamp,
        status: record.status,
      },
    ]);
    return !error;
  } catch (e) {
    console.error('Error inserting donation in Supabase:', e);
    return false;
  }
}

export async function updateDonationStatus(
  transactionId: string,
  status: DonationRecord['status']
): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('donations')
      .update({ status })
      .eq('transaction_id', transactionId);
    return !error;
  } catch (e) {
    console.error('Error updating donation status:', e);
    return false;
  }
}

// ==========================================
// 7. FACILITIES
// ==========================================
export async function getFacilities(): Promise<Facility[]> {
  if (!supabase) return DEFAULT_FACILITIES;

  try {
    const { data, error } = await supabase
      .from('facilities')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      const seedRows = DEFAULT_FACILITIES.map((f, idx) => ({
        id: f.id,
        name: f.name,
        photo: f.photo,
        description: f.description,
        sort_order: f.order ?? idx,
      }));
      await supabase.from('facilities').upsert(seedRows);
      return DEFAULT_FACILITIES;
    }

    return data.map((f) => ({
      id: f.id,
      name: f.name,
      photo: f.photo,
      description: f.description,
      order: f.sort_order ?? 0,
    }));
  } catch (e) {
    console.error('Error fetching facilities from Supabase:', e);
    return DEFAULT_FACILITIES;
  }
}

export async function saveFacilities(facilities: Facility[]): Promise<boolean> {
  if (!supabase) return false;

  try {
    const rows = facilities.map((f, idx) => ({
      id: f.id,
      name: f.name,
      photo: f.photo,
      description: f.description,
      sort_order: f.order ?? idx,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from('facilities').upsert(rows);
    return !error;
  } catch (e) {
    console.error('Error saving facilities to Supabase:', e);
    return false;
  }
}

// ==========================================
// 8. ACTIVITIES
// ==========================================
export async function getActivities(): Promise<Activity[]> {
  if (!supabase) return DEFAULT_ACTIVITIES;

  try {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      const seedRows = DEFAULT_ACTIVITIES.map((a, idx) => ({
        id: a.id,
        title: a.title,
        schedule: a.schedule,
        photo: a.photo,
        description: a.description,
        sort_order: a.order ?? idx,
      }));
      await supabase.from('activities').upsert(seedRows);
      return DEFAULT_ACTIVITIES;
    }

    return data.map((a) => ({
      id: a.id,
      title: a.title,
      schedule: a.schedule,
      photo: a.photo,
      description: a.description,
      order: a.sort_order ?? 0,
    }));
  } catch (e) {
    console.error('Error fetching activities from Supabase:', e);
    return DEFAULT_ACTIVITIES;
  }
}

export async function saveActivities(activities: Activity[]): Promise<boolean> {
  if (!supabase) return false;

  try {
    const rows = activities.map((a, idx) => ({
      id: a.id,
      title: a.title,
      schedule: a.schedule,
      photo: a.photo,
      description: a.description,
      sort_order: a.order ?? idx,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from('activities').upsert(rows);
    return !error;
  } catch (e) {
    console.error('Error saving activities to Supabase:', e);
    return false;
  }
}

// ==========================================
// 9. HOMES
// ==========================================
export async function getHomes(): Promise<Home[]> {
  if (!supabase) return DEFAULT_HOMES;

  try {
    const { data, error } = await supabase
      .from('homes')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      const seedRows = DEFAULT_HOMES.map((h, idx) => ({
        id: h.id,
        name: h.name,
        contact: h.contact,
        location: h.location,
        maps_link: h.mapsLink || '',
        visit_activities: h.visitActivities,
        visiting_hours: h.visitingHours,
        description: h.description,
        logo: h.logo || '',
        photo: h.photo || '',
        sort_order: h.order ?? idx,
        is_sample: h.isSample || false,
      }));
      await supabase.from('homes').upsert(seedRows);
      return DEFAULT_HOMES;
    }

    // Auto-seed missing homes or upgrade old template data to the 4 real homes
    const needsMigration = data.length < DEFAULT_HOMES.length || data.some((d: any) => d.name === 'Panti Asuhan Saluran Kasih');
    if (needsMigration) {
      const seedRows = DEFAULT_HOMES.map((h, idx) => ({
        id: h.id,
        name: h.name,
        contact: h.contact,
        location: h.location,
        maps_link: h.mapsLink || '',
        visit_activities: h.visitActivities,
        visiting_hours: h.visitingHours,
        description: h.description,
        logo: h.logo || '',
        photo: h.photo || '',
        sort_order: h.order ?? idx,
        is_sample: h.isSample || false,
      }));
      await supabase.from('homes').upsert(seedRows);

      const { data: refreshed } = await supabase
        .from('homes')
        .select('*')
        .order('sort_order', { ascending: true });
      if (refreshed && refreshed.length > 0) {
        return refreshed.map((h) => ({
          id: h.id,
          name: h.name,
          contact: h.contact,
          location: h.location,
          mapsLink: h.maps_link,
          visitActivities: h.visit_activities,
          visitingHours: h.visiting_hours,
          description: h.description,
          logo: h.logo,
          photo: h.photo,
          order: h.sort_order ?? 0,
          isSample: h.is_sample,
        }));
      }
    }

    return data.map((h) => ({
      id: h.id,
      name: h.name,
      contact: h.contact,
      location: h.location,
      mapsLink: h.maps_link,
      visitActivities: h.visit_activities,
      visitingHours: h.visiting_hours,
      description: h.description,
      logo: h.logo,
      photo: h.photo,
      order: h.sort_order ?? 0,
      isSample: h.is_sample,
    }));
  } catch (e) {
    console.error('Error fetching homes from Supabase:', e);
    return DEFAULT_HOMES;
  }
}

export async function saveHomes(homes: Home[]): Promise<boolean> {
  if (!supabase) return false;

  try {
    const rows = homes.map((h, idx) => ({
      id: h.id,
      name: h.name,
      contact: h.contact,
      location: h.location,
      maps_link: h.mapsLink || '',
      visit_activities: h.visitActivities,
      visiting_hours: h.visitingHours,
      description: h.description,
      logo: h.logo || '',
      photo: h.photo || '',
      sort_order: h.order ?? idx,
      is_sample: h.isSample || false,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from('homes').upsert(rows);
    return !error;
  } catch (e) {
    console.error('Error saving homes to Supabase:', e);
    return false;
  }
}

export async function deleteHome(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('homes').delete().eq('id', id);
    return !error;
  } catch (e) {
    console.error('Error deleting home in Supabase:', e);
    return false;
  }
}

// ==========================================
// 10. VISITS
// ==========================================
export async function getVisits(): Promise<VisitBooking[]> {
  if (!supabase) return DEFAULT_VISITS;

  try {
    const { data, error } = await supabase
      .from('visits')
      .select('*')
      .order('received', { ascending: false });

    if (error || !data || data.length === 0) {
      const seedRows = DEFAULT_VISITS.map((v) => ({
        id: v.id,
        visitor: v.visitor,
        contact: v.contact,
        home: v.home,
        date: v.date,
        people: v.people,
        notes: v.notes || '',
        received: v.received,
      }));
      await supabase.from('visits').upsert(seedRows);
      return DEFAULT_VISITS;
    }

    return data.map((v) => ({
      id: v.id,
      visitor: v.visitor,
      contact: v.contact,
      home: v.home,
      date: v.date,
      people: v.people,
      notes: v.notes,
      received: v.received,
    }));
  } catch (e) {
    console.error('Error fetching visits from Supabase:', e);
    return DEFAULT_VISITS;
  }
}

export async function insertVisit(visit: VisitBooking): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('visits').insert([
      {
        id: visit.id,
        visitor: visit.visitor,
        contact: visit.contact,
        home: visit.home,
        date: visit.date,
        people: visit.people,
        notes: visit.notes || '',
        received: visit.received,
      },
    ]);
    return !error;
  } catch (e) {
    console.error('Error inserting visit in Supabase:', e);
    return false;
  }
}

export async function deleteVisit(id: string): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('visits').delete().eq('id', id);
    return !error;
  } catch (e) {
    console.error('Error deleting visit in Supabase:', e);
    return false;
  }
}

// ==========================================
// 11. WHATSAPP PLEDGES
// ==========================================
export async function getWhatsAppPledges(): Promise<WhatsAppPledge[]> {
  if (!supabase) return DEFAULT_WHATSAPP_PLEDGES;

  try {
    const { data, error } = await supabase
      .from('whatsapp_pledges')
      .select('*')
      .order('date', { ascending: false });

    if (error || !data || data.length === 0) {
      const seedRows = DEFAULT_WHATSAPP_PLEDGES.map((p) => ({
        id: p.id,
        amount: p.amount,
        date: p.date,
      }));
      await supabase.from('whatsapp_pledges').upsert(seedRows);
      return DEFAULT_WHATSAPP_PLEDGES;
    }

    return data.map((p) => ({
      id: p.id,
      amount: Number(p.amount),
      date: p.date,
    }));
  } catch (e) {
    console.error('Error fetching WhatsApp pledges from Supabase:', e);
    return DEFAULT_WHATSAPP_PLEDGES;
  }
}

export async function insertWhatsAppPledge(pledge: WhatsAppPledge): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('whatsapp_pledges').insert([
      {
        id: pledge.id,
        amount: pledge.amount,
        date: pledge.date,
      },
    ]);
    return !error;
  } catch (e) {
    console.error('Error inserting WhatsApp pledge in Supabase:', e);
    return false;
  }
}
