import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  User,
  Image as ImageIcon,
  LogOut,
  Plus,
  Trash2,
  ExternalLink,
  Save,
  ArrowLeft,
  CheckCircle2,
  Phone,
  Calendar,
  Clock,
  Heart,
  Building2,
  DollarSign,
  MessageCircle,
} from 'lucide-react';
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
  DEFAULT_FACILITIES,
  DEFAULT_ACTIVITIES,
  DEFAULT_HOMES,
  DEFAULT_VISITS,
  DEFAULT_WHATSAPP_PLEDGES,
} from '../data/mockData';
import {
  supabase,
  isSupabaseConfigured,
  saveFacilities,
  saveActivities,
  saveHomes,
  deleteVisit,
  insertVisit,
  updateVolunteerStatus,
  updateDonationStatus,
} from '../lib/supabase';
import { RumahBersinarLogo } from './RumahBersinarLogo';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteSettings: SiteSettings;
  onUpdateSettings: (newSettings: SiteSettings) => void;
  branches: PantiBranch[];
  onUpdateBranches: (branches: PantiBranch[]) => void;
  coreValues: CoreValue[];
  onUpdateCoreValues: (values: CoreValue[]) => void;
  faqs: FaqItem[];
  onUpdateFaqs: (newFaqs: FaqItem[]) => void;
  volunteers: VolunteerApplication[];
  onUpdateVolunteers: (apps: VolunteerApplication[]) => void;
  donations: DonationRecord[];
  onUpdateDonations: (donations: DonationRecord[]) => void;

  // New CMS Collections matching Screenshots
  facilities: Facility[];
  onUpdateFacilities: (facilities: Facility[]) => void;
  activities: Activity[];
  onUpdateActivities: (activities: Activity[]) => void;
  homes: Home[];
  onUpdateHomes: (homes: Home[]) => void;
  visits: VisitBooking[];
  onUpdateVisits: (visits: VisitBooking[]) => void;
  whatsappPledges: WhatsAppPledge[];
  onUpdateWhatsAppPledges: (pledges: WhatsAppPledge[]) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  siteSettings,
  onUpdateSettings,
  volunteers,
  onUpdateVolunteers,
  donations,
  onUpdateDonations,
  facilities,
  onUpdateFacilities,
  activities,
  onUpdateActivities,
  homes,
  onUpdateHomes,
  visits,
  onUpdateVisits,
  whatsappPledges,
  onUpdateWhatsAppPledges,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_auth') === 'true';
  });
  const [usernameInput, setUsernameInput] = useState('h15250042@john.petra.ac.id');
  const [passwordInput, setPasswordInput] = useState('Reinard05.');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('admin_email') || (localStorage.getItem('admin_auth') === 'true' ? 'h15250042@john.petra.ac.id' : null);
  });

  // Tabs matching Screenshot:
  // Facilities | Activities | Volunteers | Donations | Homes | Visits | Old WhatsApp pledges
  const [activeTab, setActiveTab] = useState<
    'facilities' | 'activities' | 'volunteers' | 'donations' | 'homes' | 'visits' | 'pledges'
  >('facilities');

  // Local draft states for editable lists
  const [localFacilities, setLocalFacilities] = useState<Facility[]>(facilities);
  const [localActivities, setLocalActivities] = useState<Activity[]>(activities);
  const [localHomes, setLocalHomes] = useState<Home[]>(homes);

  // Sync props to local draft states
  useEffect(() => {
    setLocalFacilities(facilities);
  }, [facilities]);

  useEffect(() => {
    setLocalActivities(activities);
  }, [activities]);

  useEffect(() => {
    setLocalHomes(homes);
  }, [homes]);

  // Toast / feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Volunteer status filter
  const [volunteerFilter, setVolunteerFilter] = useState<'All' | 'Pending' | 'Contacted' | 'Approved'>('All');

  // Check Supabase session on mount
  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsAuthenticated(true);
        const email = session.user.email || 'h15250042@john.petra.ac.id';
        setCurrentUserEmail(email);
        localStorage.setItem('admin_auth', 'true');
        localStorage.setItem('admin_email', email);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        const email = session.user.email || 'h15250042@john.petra.ac.id';
        setCurrentUserEmail(email);
        localStorage.setItem('admin_auth', 'true');
        localStorage.setItem('admin_email', email);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Login
  // Explicitly accepts:
  // Email: h15250042@john.petra.ac.id
  // Password: Reinard05.
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const email = usernameInput.trim();
    const pass = passwordInput.trim();

    // 1. Direct hardcoded credential check for designated user
    if (
      (email.toLowerCase() === 'h15250042@john.petra.ac.id' && pass === 'Reinard05.') ||
      (email.toLowerCase() === 'admin@rumahbersinar.org' && pass === 'admin123') ||
      (email.toLowerCase() === 'admin' && pass === 'admin123')
    ) {
      const activeEmail = email.toLowerCase() === 'admin' ? 'admin@rumahbersinar.org' : email;
      setIsAuthenticated(true);
      setCurrentUserEmail(activeEmail);
      localStorage.setItem('admin_auth', 'true');
      localStorage.setItem('admin_email', activeEmail);

      // Also try signing in or registering with Supabase in background if configured
      if (isSupabaseConfigured && supabase) {
        supabase.auth.signInWithPassword({
          email,
          password: pass,
        }).then(({ error: signInErr }) => {
          if (signInErr) {
            return supabase.auth.signUp({
              email,
              password: pass,
            });
          }
        }).catch((e) => {
          console.log('Background Supabase auth sync completed', e);
        });
      }
      return;
    }

    // 2. If Supabase is configured, authenticate with Supabase Auth
    if (isSupabaseConfigured && supabase) {
      setAuthLoading(true);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: pass,
        });

        if (error) {
          setAuthError(error.message || 'Email atau password salah.');
        } else if (data.user) {
          setIsAuthenticated(true);
          const userEmail = data.user.email || email;
          setCurrentUserEmail(userEmail);
          localStorage.setItem('admin_auth', 'true');
          localStorage.setItem('admin_email', userEmail);
        }
      } catch (err: any) {
        setAuthError(err?.message || 'Terjadi kesalahan login.');
      } finally {
        setAuthLoading(false);
      }
    } else {
      setAuthError('Email atau password tidak sesuai.');
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
    localStorage.removeItem('admin_auth');
    localStorage.removeItem('admin_email');
    setIsAuthenticated(false);
    setCurrentUserEmail(null);
  };

  // Helper for image upload -> base64
  const handlePhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onComplete: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onComplete(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // =========================================================================
  // FACILITIES ACTIONS
  // =========================================================================
  const handleSaveFacility = async (index: number) => {
    const updated = [...localFacilities];
    onUpdateFacilities(updated);
    if (isSupabaseConfigured) {
      await saveFacilities(updated);
    }
    showToast(`Saved facility "${updated[index].name}"`);
  };

  const handleDeleteFacility = async (id: string) => {
    if (confirm('Delete this facility?')) {
      const updated = localFacilities.filter((f) => f.id !== id);
      setLocalFacilities(updated);
      onUpdateFacilities(updated);
      if (isSupabaseConfigured) {
        await saveFacilities(updated);
      }
      showToast('Facility deleted');
    }
  };

  const handleAddFacility = () => {
    const newFacility: Facility = {
      id: `fac-${Date.now()}`,
      name: 'New Facility',
      photo: '/images/hero_orphanage_hope_1790578628387.jpg',
      description: 'Describe this facility and how children use it with care.',
      order: localFacilities.length,
    };
    const updated = [...localFacilities, newFacility];
    setLocalFacilities(updated);
    onUpdateFacilities(updated);
    if (isSupabaseConfigured) {
      saveFacilities(updated);
    }
    showToast('New facility added');
  };

  // =========================================================================
  // ACTIVITIES ACTIONS
  // =========================================================================
  const handleSaveActivity = async (index: number) => {
    const updated = [...localActivities];
    onUpdateActivities(updated);
    if (isSupabaseConfigured) {
      await saveActivities(updated);
    }
    showToast(`Saved activity "${updated[index].title}"`);
  };

  const handleDeleteActivity = async (id: string) => {
    if (confirm('Delete this activity?')) {
      const updated = localActivities.filter((a) => a.id !== id);
      setLocalActivities(updated);
      onUpdateActivities(updated);
      if (isSupabaseConfigured) {
        await saveActivities(updated);
      }
      showToast('Activity deleted');
    }
  };

  const handleAddActivity = () => {
    const newAct: Activity = {
      id: `act-${Date.now()}`,
      title: 'New Activity',
      schedule: 'Mon - Fri, 16:00 WIB',
      photo: '/images/children_education_art_1790578654362.jpg',
      description: 'Activity details and schedule for children.',
      order: localActivities.length,
    };
    const updated = [...localActivities, newAct];
    setLocalActivities(updated);
    onUpdateActivities(updated);
    if (isSupabaseConfigured) {
      saveActivities(updated);
    }
    showToast('New activity added');
  };

  // =========================================================================
  // HOMES ACTIONS
  // =========================================================================
  const handleSaveHome = async (index: number) => {
    const updated = [...localHomes];
    updated[index].isSample = false; // Remove sample label on save
    setLocalHomes(updated);
    onUpdateHomes(updated);
    if (isSupabaseConfigured) {
      await saveHomes(updated);
    }
    showToast(`Saved home "${updated[index].name}"`);
  };

  const handleDeleteHome = async (id: string) => {
    if (confirm('Delete this home?')) {
      const updated = localHomes.filter((h) => h.id !== id);
      setLocalHomes(updated);
      onUpdateHomes(updated);
      if (isSupabaseConfigured) {
        await saveHomes(updated);
      }
      showToast('Home deleted');
    }
  };

  const handleAddHome = () => {
    const newHome: Home = {
      id: `home-${Date.now()}`,
      name: 'Rumah Bersinar — New Home',
      contact: '+62 813-1700-0944',
      location: 'Surabaya, East Java',
      mapsLink: 'https://maps.google.com/',
      visitActivities: 'Reading together, games, shared meals',
      visitingHours: 'Saturday, 10:00 – 15:00 WIB',
      description: 'Describe this home and its specialized care for children.',
      photo: '/images/hero_orphanage_hope_1790578628387.jpg',
      logo: '/images/caregiver_nutrition_care_1790578667798.jpg',
      order: localHomes.length + 1,
      isSample: false,
    };
    const updated = [...localHomes, newHome];
    setLocalHomes(updated);
    onUpdateHomes(updated);
    if (isSupabaseConfigured) {
      saveHomes(updated);
    }
    showToast('New home added');
  };

  // =========================================================================
  // VISITS ACTIONS
  // =========================================================================
  const handleDeleteVisit = async (id: string) => {
    if (confirm('Delete this visit record?')) {
      const updated = visits.filter((v) => v.id !== id);
      onUpdateVisits(updated);
      if (isSupabaseConfigured) {
        await deleteVisit(id);
      }
      showToast('Visit record deleted');
    }
  };

  // Total Pledged calculation
  const totalPledged = whatsappPledges.reduce((acc, p) => acc + (p.amount || 0), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#FBF7F0] flex flex-col font-body">
      {/* ===================================================================== */}
      {/* 1. TOP HEADER (Matches Screenshots: STAFF ADMIN + View site + Sign out) */}
      {/* ===================================================================== */}
      <header className="sticky top-0 z-20 bg-white border-b border-stone-200 px-6 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <RumahBersinarLogo variant="logogram" size="sm" />
          <div className="flex items-center gap-2">
            <span className="font-heading font-black tracking-wider text-base text-[#352106]">
              STAFF ADMIN
            </span>
            {isAuthenticated && (
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                {currentUserEmail || 'h15250042@john.petra.ac.id'}
              </span>
            )}
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
              isSupabaseConfigured ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {isSupabaseConfigured ? 'Realtime DB' : 'Local Storage'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View site</span>
          </button>

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          )}
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#f1b607]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. AUTH SCREEN IF NOT LOGGED IN */}
      {/* ===================================================================== */}
      {!isAuthenticated ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-2xl shadow-xl max-w-md w-full p-8 text-center animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 bg-amber-100 text-[#ea580c] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#352106] mb-1">
              Admin Portal
            </h2>
            <p className="text-xs text-stone-600 mb-6">
              Enter your credentials to customize facilities, activities, homes, and view donor records.
            </p>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="h15250042@john.petra.ac.id"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1b607] bg-white text-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1b607] bg-white text-stone-800"
                  />
                </div>
              </div>

              {authError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 rounded-lg font-heading font-bold text-xs bg-[#e8a70a] hover:bg-[#f1b607] text-[#241708] shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {authLoading ? 'Signing in...' : 'Sign In to Staff Admin'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* =================================================================== */
        /* 3. LOGGED IN CMS DASHBOARD (Matches Exact Screenshots 1 to 5)       */
        /* =================================================================== */
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Horizontal Navigation Tabs matching Screenshots */}
          {/* Facilities | Activities | Volunteers | Donations | Homes | Visits | Old WhatsApp pledges */}
          <div className="flex items-center gap-1 overflow-x-auto pb-4 mb-6 text-sm border-b border-stone-200/80">
            <button
              onClick={() => setActiveTab('facilities')}
              className={`px-4 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'facilities'
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              Facilities
            </button>

            <button
              onClick={() => setActiveTab('activities')}
              className={`px-4 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'activities'
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              Activities
            </button>

            <button
              onClick={() => setActiveTab('volunteers')}
              className={`px-4 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'volunteers'
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              Volunteers ({volunteers.length})
            </button>

            <button
              onClick={() => setActiveTab('donations')}
              className={`px-4 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'donations'
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              Donations ({donations.length})
            </button>

            <button
              onClick={() => setActiveTab('homes')}
              className={`px-4 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'homes'
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              Homes
            </button>

            <button
              onClick={() => setActiveTab('visits')}
              className={`px-4 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'visits'
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              Visits ({visits.length})
            </button>

            <button
              onClick={() => setActiveTab('pledges')}
              className={`px-4 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'pledges'
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              Old WhatsApp pledges
            </button>
          </div>

          {/* ================================================================= */}
          {/* TAB 1: FACILITIES (Screenshot 1)                                   */}
          {/* ================================================================= */}
          {activeTab === 'facilities' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-600">
                  Manage foundation facilities shown on the homepage (study rooms, dorms, halls).
                </p>
                <button
                  onClick={handleAddFacility}
                  className="px-3.5 py-1.5 bg-stone-800 hover:bg-black text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Facility</span>
                </button>
              </div>

              {localFacilities.map((fac, idx) => (
                <div
                  key={fac.id}
                  className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4"
                >
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={fac.name}
                      onChange={(e) => {
                        const copy = [...localFacilities];
                        copy[idx].name = e.target.value;
                        setLocalFacilities(copy);
                      }}
                      className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1b607]"
                    />
                  </div>

                  {/* Photo with Thumbnail + Choose File + Remove photo */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Photo
                    </label>
                    <div className="flex flex-wrap items-center gap-4">
                      {fac.photo && (
                        <img
                          src={fac.photo}
                          alt={fac.name}
                          className="w-24 h-18 object-cover rounded-lg border border-stone-200 shadow-2xs"
                        />
                      )}
                      <div className="flex items-center gap-3">
                        <label className="px-3 py-1.5 border border-stone-300 hover:border-stone-400 bg-white text-stone-700 text-xs rounded-lg cursor-pointer transition-colors shadow-2xs">
                          <span>Choose File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handlePhotoUpload(e, (url) => {
                                const copy = [...localFacilities];
                                copy[idx].photo = url;
                                setLocalFacilities(copy);
                              })
                            }
                          />
                        </label>
                        {fac.photo && (
                          <button
                            type="button"
                            onClick={() => {
                              const copy = [...localFacilities];
                              copy[idx].photo = '';
                              setLocalFacilities(copy);
                            }}
                            className="text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
                          >
                            Remove photo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={fac.description}
                      onChange={(e) => {
                        const copy = [...localFacilities];
                        copy[idx].description = e.target.value;
                        setLocalFacilities(copy);
                      }}
                      className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1b607]"
                    />
                  </div>

                  {/* Order & Buttons */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="w-28">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Order
                      </label>
                      <input
                        type="number"
                        value={fac.order ?? 0}
                        onChange={(e) => {
                          const copy = [...localFacilities];
                          copy[idx].order = parseInt(e.target.value) || 0;
                          setLocalFacilities(copy);
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteFacility(fac.id)}
                        className="px-3.5 py-2 border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveFacility(idx)}
                        className="px-4 py-2 bg-[#e8a70a] hover:bg-[#f1b607] text-[#241708] text-xs font-heading font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: ACTIVITIES (Screenshot 2)                                   */}
          {/* ================================================================= */}
          {activeTab === 'activities' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-600">
                  Manage weekly and daily routines of children across homes (devotion, study, arts).
                </p>
                <button
                  onClick={handleAddActivity}
                  className="px-3.5 py-1.5 bg-stone-800 hover:bg-black text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Activity</span>
                </button>
              </div>

              {localActivities.map((act, idx) => (
                <div
                  key={act.id}
                  className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4"
                >
                  {/* Title & Schedule in 2 columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={act.title}
                        onChange={(e) => {
                          const copy = [...localActivities];
                          copy[idx].title = e.target.value;
                          setLocalActivities(copy);
                        }}
                        className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1b607]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Schedule
                      </label>
                      <input
                        type="text"
                        value={act.schedule}
                        onChange={(e) => {
                          const copy = [...localActivities];
                          copy[idx].schedule = e.target.value;
                          setLocalActivities(copy);
                        }}
                        className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1b607]"
                      />
                    </div>
                  </div>

                  {/* Photo */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Photo
                    </label>
                    <div className="flex flex-wrap items-center gap-4">
                      {act.photo && (
                        <img
                          src={act.photo}
                          alt={act.title}
                          className="w-24 h-18 object-cover rounded-lg border border-stone-200 shadow-2xs"
                        />
                      )}
                      <div className="flex items-center gap-3">
                        <label className="px-3 py-1.5 border border-stone-300 hover:border-stone-400 bg-white text-stone-700 text-xs rounded-lg cursor-pointer transition-colors shadow-2xs">
                          <span>Choose File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handlePhotoUpload(e, (url) => {
                                const copy = [...localActivities];
                                copy[idx].photo = url;
                                setLocalActivities(copy);
                              })
                            }
                          />
                        </label>
                        {act.photo && (
                          <button
                            type="button"
                            onClick={() => {
                              const copy = [...localActivities];
                              copy[idx].photo = '';
                              setLocalActivities(copy);
                            }}
                            className="text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
                          >
                            Remove photo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={act.description}
                      onChange={(e) => {
                        const copy = [...localActivities];
                        copy[idx].description = e.target.value;
                        setLocalActivities(copy);
                      }}
                      className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1b607]"
                    />
                  </div>

                  {/* Order & Buttons */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="w-28">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Order
                      </label>
                      <input
                        type="number"
                        value={act.order ?? 0}
                        onChange={(e) => {
                          const copy = [...localActivities];
                          copy[idx].order = parseInt(e.target.value) || 0;
                          setLocalActivities(copy);
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteActivity(act.id)}
                        className="px-3.5 py-2 border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveActivity(idx)}
                        className="px-4 py-2 bg-[#e8a70a] hover:bg-[#f1b607] text-[#241708] text-xs font-heading font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: HOMES (Screenshot 3)                                       */}
          {/* ================================================================= */}
          {activeTab === 'homes' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-500 italic">
                  Homes marked &quot;Sample&quot; are templates — replace their details and save to remove the sample label.
                </p>
                <button
                  onClick={handleAddHome}
                  className="px-3.5 py-1.5 bg-stone-800 hover:bg-black text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Home</span>
                </button>
              </div>

              {localHomes.map((home, idx) => (
                <div
                  key={home.id}
                  className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4"
                >
                  {/* Name & Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Name {home.isSample && <span className="text-amber-600 font-normal">(Sample)</span>}
                      </label>
                      <input
                        type="text"
                        value={home.name}
                        onChange={(e) => {
                          const copy = [...localHomes];
                          copy[idx].name = e.target.value;
                          setLocalHomes(copy);
                        }}
                        className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1b607]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Contact
                      </label>
                      <input
                        type="text"
                        value={home.contact}
                        onChange={(e) => {
                          const copy = [...localHomes];
                          copy[idx].contact = e.target.value;
                          setLocalHomes(copy);
                        }}
                        className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1b607]"
                      />
                    </div>
                  </div>

                  {/* Location & Google Maps link */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Location / address
                      </label>
                      <input
                        type="text"
                        value={home.location}
                        onChange={(e) => {
                          const copy = [...localHomes];
                          copy[idx].location = e.target.value;
                          setLocalHomes(copy);
                        }}
                        className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1b607]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Google Maps link (optional)
                      </label>
                      <input
                        type="text"
                        value={home.mapsLink || ''}
                        placeholder="https://maps.google.com/..."
                        onChange={(e) => {
                          const copy = [...localHomes];
                          copy[idx].mapsLink = e.target.value;
                          setLocalHomes(copy);
                        }}
                        className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1b607]"
                      />
                    </div>
                  </div>

                  {/* Visit activities & Visiting hours */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Visit activities
                      </label>
                      <input
                        type="text"
                        value={home.visitActivities}
                        onChange={(e) => {
                          const copy = [...localHomes];
                          copy[idx].visitActivities = e.target.value;
                          setLocalHomes(copy);
                        }}
                        className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1b607]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Visiting hours
                      </label>
                      <input
                        type="text"
                        value={home.visitingHours}
                        onChange={(e) => {
                          const copy = [...localHomes];
                          copy[idx].visitingHours = e.target.value;
                          setLocalHomes(copy);
                        }}
                        className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1b607]"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      value={home.description}
                      onChange={(e) => {
                        const copy = [...localHomes];
                        copy[idx].description = e.target.value;
                        setLocalHomes(copy);
                      }}
                      className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1b607]"
                    />
                  </div>

                  {/* Logo & Photo */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Logo
                      </label>
                      <div className="flex items-center gap-3">
                        {home.logo && (
                          <img
                            src={home.logo}
                            alt="Logo"
                            className="w-16 h-16 object-contain border border-stone-200 rounded-lg p-1 bg-white"
                          />
                        )}
                        <label className="px-3 py-1.5 border border-stone-300 hover:border-stone-400 bg-white text-stone-700 text-xs rounded-lg cursor-pointer">
                          <span>Choose File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handlePhotoUpload(e, (url) => {
                                const copy = [...localHomes];
                                copy[idx].logo = url;
                                setLocalHomes(copy);
                              })
                            }
                          />
                        </label>
                        {home.logo && (
                          <button
                            type="button"
                            onClick={() => {
                              const copy = [...localHomes];
                              copy[idx].logo = '';
                              setLocalHomes(copy);
                            }}
                            className="text-xs text-stone-500 hover:text-stone-800"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Photo
                      </label>
                      <div className="flex items-center gap-3">
                        {home.photo && (
                          <img
                            src={home.photo}
                            alt="Photo"
                            className="w-20 h-16 object-cover border border-stone-200 rounded-lg"
                          />
                        )}
                        <label className="px-3 py-1.5 border border-stone-300 hover:border-stone-400 bg-white text-stone-700 text-xs rounded-lg cursor-pointer">
                          <span>Choose File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handlePhotoUpload(e, (url) => {
                                const copy = [...localHomes];
                                copy[idx].photo = url;
                                setLocalHomes(copy);
                              })
                            }
                          />
                        </label>
                        {home.photo && (
                          <button
                            type="button"
                            onClick={() => {
                              const copy = [...localHomes];
                              copy[idx].photo = '';
                              setLocalHomes(copy);
                            }}
                            className="text-xs text-stone-500 hover:text-stone-800"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order & Buttons */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="w-28">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Order
                      </label>
                      <input
                        type="number"
                        value={home.order ?? 1}
                        onChange={(e) => {
                          const copy = [...localHomes];
                          copy[idx].order = parseInt(e.target.value) || 1;
                          setLocalHomes(copy);
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteHome(home.id)}
                        className="px-3.5 py-2 border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveHome(idx)}
                        className="px-4 py-2 bg-[#e8a70a] hover:bg-[#f1b607] text-[#241708] text-xs font-heading font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: OLD WHATSAPP PLEDGES (Screenshot 4)                        */}
          {/* ================================================================= */}
          {activeTab === 'pledges' && (
            <div className="space-y-6">
              <p className="text-xs text-stone-600">
                These are amounts people chose before opening WhatsApp. Please confirm actual transfers in WhatsApp or your bank.
              </p>

              {/* Total Pledged Card */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
                <span className="text-xs text-stone-500 font-medium">
                  Total pledged ({whatsappPledges.length})
                </span>
                <div className="text-4xl font-extrabold text-[#352106] mt-1 font-heading">
                  Rp {totalPledged.toLocaleString('id-ID')}
                </div>
              </div>

              {/* Pledges Table */}
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] border-b border-stone-200 text-stone-700 font-semibold">
                    <tr>
                      <th className="px-6 py-3.5">Amount</th>
                      <th className="px-6 py-3.5">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {whatsappPledges.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="px-6 py-8 text-center text-stone-500 italic">
                          No WhatsApp pledges recorded yet.
                        </td>
                      </tr>
                    ) : (
                      whatsappPledges.map((p) => (
                        <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                          <td className="px-6 py-4 font-bold text-[#352106]">
                            Rp {p.amount.toLocaleString('id-ID')}
                          </td>
                          <td className="px-6 py-4 text-stone-600">{p.date}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: VISITS (Screenshot 5)                                      */}
          {/* ================================================================= */}
          {activeTab === 'visits' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-600">
                  Track scheduled visits from donors, volunteers, and benefactors visiting the homes.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead className="bg-[#FAF7F2] border-b border-stone-200 text-stone-700 font-semibold">
                    <tr>
                      <th className="px-4 py-3.5">ID</th>
                      <th className="px-4 py-3.5">Visitor</th>
                      <th className="px-4 py-3.5">Contact</th>
                      <th className="px-4 py-3.5">Home</th>
                      <th className="px-4 py-3.5">Date</th>
                      <th className="px-4 py-3.5">People</th>
                      <th className="px-4 py-3.5">Notes</th>
                      <th className="px-4 py-3.5">Received</th>
                      <th className="px-4 py-3.5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {visits.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-8 text-center text-stone-500 italic">
                          No visits booked yet.
                        </td>
                      </tr>
                    ) : (
                      visits.map((v) => (
                        <tr key={v.id} className="hover:bg-stone-50/60 transition-colors">
                          <td className="px-4 py-3 font-mono text-[11px] text-stone-500">{v.id}</td>
                          <td className="px-4 py-3 font-bold text-[#352106]">{v.visitor}</td>
                          <td className="px-4 py-3 text-stone-600">{v.contact}</td>
                          <td className="px-4 py-3 text-stone-800 font-medium">{v.home}</td>
                          <td className="px-4 py-3 text-stone-600">{v.date}</td>
                          <td className="px-4 py-3 text-center text-stone-700">{v.people}</td>
                          <td className="px-4 py-3 text-stone-500 italic">{v.notes || '-'}</td>
                          <td className="px-4 py-3 text-[11px] text-stone-500">{v.received}</td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleDeleteVisit(v.id)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete visit"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 6: VOLUNTEERS                                                 */}
          {/* ================================================================= */}
          {activeTab === 'volunteers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <p className="text-xs text-stone-600">
                  Applicants registered via the public volunteer form.
                </p>
                <div className="flex items-center gap-1.5">
                  {(['All', 'Pending', 'Contacted', 'Approved'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setVolunteerFilter(filter)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        volunteerFilter === filter
                          ? 'bg-[#352106] text-[#f1b607]'
                          : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead className="bg-[#FAF7F2] border-b border-stone-200 text-stone-700 font-semibold">
                    <tr>
                      <th className="px-4 py-3.5">Name</th>
                      <th className="px-4 py-3.5">Phone / Email</th>
                      <th className="px-4 py-3.5">Branch</th>
                      <th className="px-4 py-3.5">Role</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {volunteers
                      .filter((v) => volunteerFilter === 'All' || v.status === volunteerFilter)
                      .map((v) => (
                        <tr key={v.id} className="hover:bg-stone-50/60 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-bold text-[#352106]">{v.fullName}</div>
                            <div className="text-[11px] text-stone-500">{v.institution}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-stone-800">{v.phone}</div>
                            <div className="text-[11px] text-stone-500">{v.email}</div>
                          </td>
                          <td className="px-4 py-3 text-stone-700">{v.preferredBranchName}</td>
                          <td className="px-4 py-3 text-stone-700 font-medium">{v.role}</td>
                          <td className="px-4 py-3">
                            <select
                              value={v.status}
                              onChange={async (e) => {
                                const newStat = e.target.value as any;
                                const updated = volunteers.map((x) =>
                                  x.id === v.id ? { ...x, status: newStat } : x
                                );
                                onUpdateVolunteers(updated);
                                if (isSupabaseConfigured) {
                                  await updateVolunteerStatus(v.id, newStat);
                                }
                                showToast(`Volunteer status updated to ${newStat}`);
                              }}
                              className="text-[11px] font-semibold px-2.5 py-1 rounded-md border border-stone-300 bg-white"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Approved">Approved</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <a
                              href={`https://wa.me/${v.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg inline-flex items-center"
                              title="Chat WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 7: DONATIONS                                                  */}
          {/* ================================================================= */}
          {activeTab === 'donations' && (
            <div className="space-y-6">
              <p className="text-xs text-stone-600">
                Official donations recorded through online QRIS and Bank Transfers.
              </p>

              <div className="bg-white rounded-2xl border border-stone-200 overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead className="bg-[#FAF7F2] border-b border-stone-200 text-stone-700 font-semibold">
                    <tr>
                      <th className="px-4 py-3.5">Transaction ID</th>
                      <th className="px-4 py-3.5">Donor</th>
                      <th className="px-4 py-3.5">Program</th>
                      <th className="px-4 py-3.5">Amount</th>
                      <th className="px-4 py-3.5">Payment</th>
                      <th className="px-4 py-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {donations.map((d) => (
                      <tr key={d.transactionId} className="hover:bg-stone-50/60 transition-colors">
                        <td className="px-4 py-3 font-mono text-[11px] text-stone-500">{d.transactionId}</td>
                        <td className="px-4 py-3 font-bold text-[#352106]">{d.donorName}</td>
                        <td className="px-4 py-3 text-stone-700">{d.programTitle}</td>
                        <td className="px-4 py-3 font-bold text-amber-700">Rp {d.amount.toLocaleString('id-ID')}</td>
                        <td className="px-4 py-3 text-stone-600">{d.paymentMethod}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={async () => {
                              const newStat: 'Verified' | 'Pending' = d.status === 'Verified' ? 'Pending' : 'Verified';
                              const updated = donations.map((x) =>
                                x.transactionId === d.transactionId ? { ...x, status: newStat } : x
                              );
                              onUpdateDonations(updated);
                              if (isSupabaseConfigured) {
                                await updateDonationStatus(d.transactionId, newStat);
                              }
                              showToast(`Donation marked as ${newStat}`);
                            }}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer ${
                              d.status === 'Verified'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {d.status}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
