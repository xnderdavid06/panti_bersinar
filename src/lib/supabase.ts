import { createClient } from '@supabase/supabase-js';
import {
  SiteSettings,
  PantiBranch,
  CoreValue,
  FaqItem,
  VolunteerApplication,
  DonationRecord,
} from '../types';
import {
  DEFAULT_SITE_SETTINGS,
  PANTI_BRANCHES as DEFAULT_BRANCHES,
  CORE_VALUES as DEFAULT_CORE_VALUES,
  FAQS as DEFAULT_FAQS,
  INITIAL_VOLUNTEER_APPLICATIONS,
  INITIAL_DONATIONS,
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
