import React, { useState } from 'react';
import {
  X,
  Lock,
  User,
  Image as ImageIcon,
  FileText,
  Sliders,
  Building2,
  HelpCircle,
  Phone,
  Users,
  DollarSign,
  CheckCircle2,
  Upload,
  RefreshCw,
  LogOut,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  Layers,
} from 'lucide-react';
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
  DONATION_PROGRAMS,
} from '../data/mockData';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteSettings: SiteSettings;
  onUpdateSettings: (newSettings: SiteSettings) => void;
  branches: PantiBranch[];
  onUpdateBranches: (newBranches: PantiBranch[]) => void;
  coreValues: CoreValue[];
  onUpdateCoreValues: (newValues: CoreValue[]) => void;
  faqs: FaqItem[];
  onUpdateFaqs: (newFaqs: FaqItem[]) => void;
  volunteers: VolunteerApplication[];
  onUpdateVolunteers: (apps: VolunteerApplication[]) => void;
  donations: DonationRecord[];
  onUpdateDonations: (donations: DonationRecord[]) => void;
}

const PHOTO_PRESETS = [
  { label: 'Children Study Table', url: '/src/assets/images/hero_orphanage_hope_1790578628387.jpg' },
  { label: 'Caregiver & Toddler Nutrition', url: '/src/assets/images/caregiver_nutrition_care_1790578667798.jpg' },
  { label: 'Children Arts & Education', url: '/src/assets/images/children_education_art_1790578654362.jpg' },
  { label: 'Foster Family & Love', url: '/src/assets/images/adoption_family_love_1790578641380.jpg' },
];

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  siteSettings,
  onUpdateSettings,
  branches,
  onUpdateBranches,
  coreValues,
  onUpdateCoreValues,
  faqs,
  onUpdateFaqs,
  volunteers,
  onUpdateVolunteers,
  donations,
  onUpdateDonations,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'photos' | 'content' | 'values' | 'branches' | 'faq' | 'contact' | 'volunteers' | 'donations'>('photos');

  // Local Editable States
  const [tempSettings, setTempSettings] = useState<SiteSettings>({ ...siteSettings });
  const [tempBranches, setTempBranches] = useState<PantiBranch[]>([...branches]);
  const [tempCoreValues, setTempCoreValues] = useState<CoreValue[]>([...coreValues]);
  const [tempFaqs, setTempFaqs] = useState<FaqItem[]>([...faqs]);

  // Toast / Notification
  const [saveToast, setSaveToast] = useState(false);

  // Volunteer & Donation Filters
  const [volunteerFilter, setVolunteerFilter] = useState<'All' | 'Pending' | 'Contacted' | 'Approved'>('All');

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = usernameInput.trim().toLowerCase();
    const pass = passwordInput.trim();

    // Accept flexible valid credentials
    if (
      (user === 'admin' || user === 'admin@rumahbersinar.org' || user === 'yayasan' || user === 'admin@gmail.com') &&
      (pass === 'admin123' || pass === 'admin' || pass === 'yayasan2019')
    ) {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleQuickDemoFill = () => {
    setUsernameInput('admin@rumahbersinar.org');
    setPasswordInput('admin123');
    setIsAuthenticated(true);
    setAuthError(false);
  };

  // Image Upload helper using FileReader to base64
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (base64Url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onSuccess(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save All Changes
  const handleSaveAll = () => {
    onUpdateSettings(tempSettings);
    onUpdateBranches(tempBranches);
    onUpdateCoreValues(tempCoreValues);
    onUpdateFaqs(tempFaqs);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  // Reset to Defaults
  const handleResetDefaults = () => {
    if (confirm('Reset all website text, photos, values, and FAQs to official defaults?')) {
      setTempSettings(DEFAULT_SITE_SETTINGS);
      setTempBranches(DEFAULT_BRANCHES);
      setTempCoreValues(DEFAULT_CORE_VALUES);
      setTempFaqs(DEFAULT_FAQS);
      onUpdateSettings(DEFAULT_SITE_SETTINGS);
      onUpdateBranches(DEFAULT_BRANCHES);
      onUpdateCoreValues(DEFAULT_CORE_VALUES);
      onUpdateFaqs(DEFAULT_FAQS);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3000);
    }
  };

  // FAQ helpers
  const handleAddFaq = () => {
    const newFaq: FaqItem = {
      id: `faq-${Date.now()}`,
      question: 'New Question Title',
      answer: 'Detailed explanation or answer for the visitors.',
    };
    setTempFaqs([...tempFaqs, newFaq]);
  };

  const handleDeleteFaq = (id: string) => {
    setTempFaqs(tempFaqs.filter((f) => f.id !== id));
  };

  const handleUpdateVolunteerStatus = (id: string, status: 'Pending' | 'Contacted' | 'Approved') => {
    const updated = volunteers.map((v) => (v.id === id ? { ...v, status } : v));
    onUpdateVolunteers(updated);
  };

  const handleDeleteVolunteer = (id: string) => {
    if (confirm('Delete this volunteer application?')) {
      onUpdateVolunteers(volunteers.filter((v) => v.id !== id));
    }
  };

  const handleToggleDonation = (txnId: string) => {
    const updated = donations.map((d) =>
      d.transactionId === txnId
        ? { ...d, status: (d.status === 'Verified' ? 'Pending' : 'Verified') as 'Verified' | 'Pending' }
        : d
    );
    onUpdateDonations(updated);
  };

  const filteredVolunteers = volunteers.filter((v) =>
    volunteerFilter === 'All' ? true : v.status === volunteerFilter
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-[#FFFDF9] rounded-2xl shadow-2xl max-w-5xl w-full max-h-[94vh] overflow-hidden flex flex-col border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Bar */}
        <div className="bg-[#241708] text-white px-5 py-3.5 flex items-center justify-between border-b border-amber-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e8a70a] to-[#ea580c] flex items-center justify-center text-[#241708] font-bold">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-heading font-bold text-white">
                  Foundation Admin CMS
                </h2>
                {isAuthenticated && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Logged in as Admin
                  </span>
                )}
              </div>
              <p className="text-[11px] text-amber-200/80">
                Yayasan Rumah Bersinar · Full Website Customizer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-xs text-stone-300 hover:text-white flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-stone-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Gateway */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto w-full">
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-[#ea580c] mx-auto mb-4 shadow-xs">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#352106] mb-1">
              Admin Login
            </h3>
            <p className="text-xs text-stone-600 mb-6">
              Enter your admin email or username and password to edit photos, descriptions, branches, and FAQs.
            </p>

            <form onSubmit={handleLogin} className="space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-semibold text-[#352106] mb-1">
                  Username or Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="admin@rumahbersinar.org or admin"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1b607] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#352106] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Enter password (e.g. admin123)"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1b607] bg-white"
                  />
                </div>
                {authError && (
                  <p className="text-xs text-rose-600 mt-1.5">
                    Invalid credentials. Tip: use <strong>admin@rumahbersinar.org</strong> & <strong>admin123</strong>, or click the quick demo button below.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg font-heading font-bold text-xs bg-[#e8a70a] hover:bg-[#f1b607] text-[#241708] shadow-sm transition-all cursor-pointer"
              >
                Sign In to Admin
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="text-xs text-[#814f34] hover:text-[#352106] font-semibold underline underline-offset-2 flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#f1b607]" />
                One-Click Quick Demo Login
              </button>
            </div>
          </div>
        ) : (
          /* Logged In Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Simple, Lightweight Tab Bar */}
            <div className="flex border-b border-stone-200 bg-stone-100/70 px-4 pt-2 overflow-x-auto gap-1 text-xs">
              <button
                onClick={() => setActiveTab('photos')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold transition-colors border-t border-x ${
                  activeTab === 'photos'
                    ? 'bg-[#FFFDF9] border-stone-200 text-[#352106] shadow-2xs'
                    : 'border-transparent text-stone-600 hover:text-[#352106]'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>Photos & Banners</span>
              </button>

              <button
                onClick={() => setActiveTab('content')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold transition-colors border-t border-x ${
                  activeTab === 'content'
                    ? 'bg-[#FFFDF9] border-stone-200 text-[#352106] shadow-2xs'
                    : 'border-transparent text-stone-600 hover:text-[#352106]'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-[#f1b607]" />
                <span>Headlines & Story</span>
              </button>

              <button
                onClick={() => setActiveTab('values')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold transition-colors border-t border-x ${
                  activeTab === 'values'
                    ? 'bg-[#FFFDF9] border-stone-200 text-[#352106] shadow-2xs'
                    : 'border-transparent text-stone-600 hover:text-[#352106]'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#16a34a]" />
                <span>5 Core Values</span>
              </button>

              <button
                onClick={() => setActiveTab('branches')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold transition-colors border-t border-x ${
                  activeTab === 'branches'
                    ? 'bg-[#FFFDF9] border-stone-200 text-[#352106] shadow-2xs'
                    : 'border-transparent text-stone-600 hover:text-[#352106]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>4 Homes</span>
              </button>

              <button
                onClick={() => setActiveTab('faq')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold transition-colors border-t border-x ${
                  activeTab === 'faq'
                    ? 'bg-[#FFFDF9] border-stone-200 text-[#352106] shadow-2xs'
                    : 'border-transparent text-stone-600 hover:text-[#352106]'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
                <span>FAQ</span>
              </button>

              <button
                onClick={() => setActiveTab('contact')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold transition-colors border-t border-x ${
                  activeTab === 'contact'
                    ? 'bg-[#FFFDF9] border-stone-200 text-[#352106] shadow-2xs'
                    : 'border-transparent text-stone-600 hover:text-[#352106]'
                }`}
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Contacts & Banner</span>
              </button>

              <button
                onClick={() => setActiveTab('volunteers')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold transition-colors border-t border-x ${
                  activeTab === 'volunteers'
                    ? 'bg-[#FFFDF9] border-stone-200 text-[#352106] shadow-2xs'
                    : 'border-transparent text-stone-600 hover:text-[#352106]'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>Volunteers ({volunteers.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('donations')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold transition-colors border-t border-x ${
                  activeTab === 'donations'
                    ? 'bg-[#FFFDF9] border-stone-200 text-[#352106] shadow-2xs'
                    : 'border-transparent text-stone-600 hover:text-[#352106]'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Donations ({donations.length})</span>
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 overflow-y-auto flex-1 space-y-5">
              
              {/* Notification Toast */}
              {saveToast && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Changes saved successfully! The live website is updated.</span>
                </div>
              )}

              {/* TAB 1: MERUBAH FOTO (PHOTOS & BANNERS) */}
              {activeTab === 'photos' && (
                <div className="space-y-6 max-w-3xl">
                  <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-4">
                    <div>
                      <h3 className="font-heading font-bold text-sm text-[#352106]">
                        Hero Background Photo (Main Homepage Banner)
                      </h3>
                      <p className="text-xs text-stone-500">
                        Choose a preset, upload your own photo, or enter a custom image URL.
                      </p>
                    </div>

                    {/* Preview */}
                    <div className="relative h-44 rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                      <img
                        src={tempSettings.heroImageUrl}
                        alt="Hero Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-medium">
                        Live Preview on Hero Banner
                      </div>
                    </div>

                    {/* Presets */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                        Quick Photo Presets:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {PHOTO_PRESETS.map((preset) => (
                          <button
                            key={preset.url}
                            type="button"
                            onClick={() =>
                              setTempSettings({ ...tempSettings, heroImageUrl: preset.url })
                            }
                            className={`p-2 rounded-lg border text-left text-[11px] transition-all cursor-pointer ${
                              tempSettings.heroImageUrl === preset.url
                                ? 'border-[#ea580c] bg-amber-50 font-bold text-[#352106] ring-1 ring-[#ea580c]'
                                : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                            }`}
                          >
                            <span className="block truncate">{preset.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Upload File from computer */}
                    <div className="pt-2">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Or Upload Photo from Your Device:
                      </label>
                      <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-300 rounded-lg text-xs font-medium text-[#352106] cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5 text-[#ea580c]" />
                        <span>Browse image file (JPG, PNG, WebP)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileUpload(e, (url) =>
                              setTempSettings({ ...tempSettings, heroImageUrl: url })
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Custom URL */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Image URL / File Path:
                      </label>
                      <input
                        type="text"
                        value={tempSettings.heroImageUrl}
                        onChange={(e) =>
                          setTempSettings({ ...tempSettings, heroImageUrl: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#f1b607] font-mono text-stone-700"
                      />
                    </div>
                  </div>

                  {/* Branch Photos */}
                  <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-3">
                    <h3 className="font-heading font-bold text-sm text-[#352106]">
                      The 4 Orphanage Branch Photos
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {tempBranches.map((branch, idx) => (
                        <div key={branch.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                          <span className="text-[11px] font-bold text-stone-700 block">
                            {branch.name}
                          </span>
                          <div className="h-28 rounded-lg overflow-hidden border border-stone-200 bg-stone-200">
                            <img
                              src={branch.imageUrl || tempSettings.heroImageUrl}
                              alt={branch.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <label className="inline-flex items-center gap-1.5 text-[11px] text-[#ea580c] font-semibold hover:underline cursor-pointer">
                            <Upload className="w-3 h-3" />
                            <span>Change this photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleFileUpload(e, (url) => {
                                  const updated = [...tempBranches];
                                  updated[idx] = { ...updated[idx], imageUrl: url };
                                  setTempBranches(updated);
                                })
                              }
                              className="hidden"
                            />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MERUBAH DESKRIPSI (HEADLINES & STORY) */}
              {activeTab === 'content' && (
                <div className="space-y-4 max-w-3xl">
                  <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-3">
                    <h3 className="font-heading font-bold text-sm text-[#352106]">
                      Hero Banner Typography (Screenshot 1)
                    </h3>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Top Kicker Label (e.g. A PLACE TO BELONG)
                      </label>
                      <input
                        type="text"
                        value={tempSettings.heroLabel}
                        onChange={(e) =>
                          setTempSettings({ ...tempSettings, heroLabel: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#f1b607]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Main Tagline Headline
                      </label>
                      <input
                        type="text"
                        value={tempSettings.tagline}
                        onChange={(e) =>
                          setTempSettings({ ...tempSettings, tagline: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#f1b607]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Subheadline Paragraph
                      </label>
                      <textarea
                        rows={2}
                        value={tempSettings.subheadline}
                        onChange={(e) =>
                          setTempSettings({ ...tempSettings, subheadline: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#f1b607]"
                      />
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-3">
                    <h3 className="font-heading font-bold text-sm text-[#352106]">
                      Our Story Section (Screenshot 2)
                    </h3>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Story Headline
                      </label>
                      <input
                        type="text"
                        value={tempSettings.storyHeadline}
                        onChange={(e) =>
                          setTempSettings({ ...tempSettings, storyHeadline: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#f1b607]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Paragraph 1 (Foundation background)
                      </label>
                      <textarea
                        rows={3}
                        value={tempSettings.storyParagraph1}
                        onChange={(e) =>
                          setTempSettings({ ...tempSettings, storyParagraph1: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#f1b607]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Paragraph 2 (3T region mission & care)
                      </label>
                      <textarea
                        rows={3}
                        value={tempSettings.storyParagraph2}
                        onChange={(e) =>
                          setTempSettings({ ...tempSettings, storyParagraph2: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#f1b607]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Founder Name
                        </label>
                        <input
                          type="text"
                          value={tempSettings.founderName}
                          onChange={(e) =>
                            setTempSettings({ ...tempSettings, founderName: e.target.value })
                          }
                          className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#f1b607]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Founder Title
                        </label>
                        <input
                          type="text"
                          value={tempSettings.founderTitle}
                          onChange={(e) =>
                            setTempSettings({ ...tempSettings, founderTitle: e.target.value })
                          }
                          className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#f1b607]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: 5 CORE VALUES (WHAT WE BELIEVE) */}
              {activeTab === 'values' && (
                <div className="space-y-4 max-w-3xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-sm text-[#352106]">
                        Edit the 5 Core Values (Screenshot 3)
                      </h3>
                      <p className="text-xs text-stone-500">
                        Customize names, descriptions, and color accents.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {tempCoreValues.map((val, idx) => (
                      <div
                        key={val.number}
                        className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-2.5"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-stone-500 w-6">
                            {val.number}
                          </span>
                          <input
                            type="text"
                            value={val.name}
                            onChange={(e) => {
                              const updated = [...tempCoreValues];
                              updated[idx] = { ...updated[idx], name: e.target.value };
                              setTempCoreValues(updated);
                            }}
                            className="font-serif font-bold text-sm text-[#352106] px-2 py-1 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#f1b607]"
                          />
                          <input
                            type="color"
                            value={val.color}
                            onChange={(e) => {
                              const updated = [...tempCoreValues];
                              updated[idx] = { ...updated[idx], color: e.target.value };
                              setTempCoreValues(updated);
                            }}
                            className="w-7 h-7 rounded border cursor-pointer shrink-0"
                            title="Choose color bar"
                          />
                          <span className="text-[11px] font-mono text-stone-500">{val.color}</span>
                        </div>

                        <div>
                          <input
                            type="text"
                            value={val.description}
                            onChange={(e) => {
                              const updated = [...tempCoreValues];
                              updated[idx] = { ...updated[idx], description: e.target.value };
                              setTempCoreValues(updated);
                            }}
                            className="w-full text-xs px-3 py-1.5 border border-stone-300 rounded-lg text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#f1b607]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: 4 HOMES BRANCHES */}
              {activeTab === 'branches' && (
                <div className="space-y-4 max-w-3xl">
                  <div>
                    <h3 className="font-heading font-bold text-sm text-[#352106]">
                      Orphanage Branches Information
                    </h3>
                    <p className="text-xs text-stone-500">
                      Edit address, capacity, phone number, and focus area.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {tempBranches.map((branch, idx) => (
                      <div
                        key={branch.id}
                        className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-3"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                              Branch Name
                            </label>
                            <input
                              type="text"
                              value={branch.name}
                              onChange={(e) => {
                                const updated = [...tempBranches];
                                updated[idx] = { ...updated[idx], name: e.target.value };
                                setTempBranches(updated);
                              }}
                              className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded-lg font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                              Subtitle / Role
                            </label>
                            <input
                              type="text"
                              value={branch.subtitle}
                              onChange={(e) => {
                                const updated = [...tempBranches];
                                updated[idx] = { ...updated[idx], subtitle: e.target.value };
                                setTempBranches(updated);
                              }}
                              className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded-lg"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                            Street Address
                          </label>
                          <input
                            type="text"
                            value={branch.address}
                            onChange={(e) => {
                              const updated = [...tempBranches];
                              updated[idx] = { ...updated[idx], address: e.target.value };
                              setTempBranches(updated);
                            }}
                            className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded-lg"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                              Phone / WhatsApp
                            </label>
                            <input
                              type="text"
                              value={branch.phone}
                              onChange={(e) => {
                                const updated = [...tempBranches];
                                updated[idx] = { ...updated[idx], phone: e.target.value };
                                setTempBranches(updated);
                              }}
                              className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                              Capacity Badge
                            </label>
                            <input
                              type="text"
                              value={branch.capacityText}
                              onChange={(e) => {
                                const updated = [...tempBranches];
                                updated[idx] = { ...updated[idx], capacityText: e.target.value };
                                setTempBranches(updated);
                              }}
                              className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                              Focus Area
                            </label>
                            <input
                              type="text"
                              value={branch.focusArea}
                              onChange={(e) => {
                                const updated = [...tempBranches];
                                updated[idx] = { ...updated[idx], focusArea: e.target.value };
                                setTempBranches(updated);
                              }}
                              className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: FAQ MANAGEMENT */}
              {activeTab === 'faq' && (
                <div className="space-y-4 max-w-3xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-sm text-[#352106]">
                        Frequently Asked Questions (Screenshot 4)
                      </h3>
                      <p className="text-xs text-stone-500">
                        Add, edit, or delete questions and answers shown in the FAQ accordion.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddFaq}
                      className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-[#352106] font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add FAQ Item
                    </button>
                  </div>

                  <div className="space-y-3">
                    {tempFaqs.map((faq, idx) => (
                      <div
                        key={faq.id}
                        className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-2 relative"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => {
                              const updated = [...tempFaqs];
                              updated[idx] = { ...updated[idx], question: e.target.value };
                              setTempFaqs(updated);
                            }}
                            className="font-heading font-semibold text-xs text-[#352106] w-full px-2.5 py-1.5 border border-stone-300 rounded-lg"
                            placeholder="Question"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteFaq(faq.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Delete FAQ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <textarea
                          rows={2}
                          value={faq.answer}
                          onChange={(e) => {
                            const updated = [...tempFaqs];
                            updated[idx] = { ...updated[idx], answer: e.target.value };
                            setTempFaqs(updated);
                          }}
                          className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded-lg text-stone-700"
                          placeholder="Answer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: CONTACTS & ANNOUNCEMENT */}
              {activeTab === 'contact' && (
                <div className="space-y-4 max-w-2xl">
                  <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-3">
                    <h3 className="font-heading font-bold text-sm text-[#352106]">
                      Contact Information (Footer & WhatsApp CTA)
                    </h3>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Primary WhatsApp Phone (Screenshot 5: +62 813-1700-0944)
                      </label>
                      <input
                        type="text"
                        value={tempSettings.whatsappPhone}
                        onChange={(e) =>
                          setTempSettings({ ...tempSettings, whatsappPhone: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={tempSettings.contactEmail}
                        onChange={(e) =>
                          setTempSettings({ ...tempSettings, contactEmail: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Headquarters Street Address
                      </label>
                      <input
                        type="text"
                        value={tempSettings.headquartersAddress}
                        onChange={(e) =>
                          setTempSettings({ ...tempSettings, headquartersAddress: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading font-bold text-sm text-[#352106]">
                        Top Announcement Ribbon
                      </h3>
                      <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tempSettings.showAnnouncement}
                          onChange={(e) =>
                            setTempSettings({ ...tempSettings, showAnnouncement: e.target.checked })
                          }
                          className="rounded text-[#e8a70a]"
                        />
                        <span>Visible on site</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={tempSettings.announcementText}
                      onChange={(e) =>
                        setTempSettings({ ...tempSettings, announcementText: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* TAB 7: VOLUNTEERS */}
              {activeTab === 'volunteers' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h3 className="font-heading font-bold text-sm text-[#352106]">
                      Volunteer Applicants ({filteredVolunteers.length})
                    </h3>
                    <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg text-xs">
                      {(['All', 'Pending', 'Contacted', 'Approved'] as const).map((filter) => (
                        <button
                          key={filter}
                          type="button"
                          onClick={() => setVolunteerFilter(filter)}
                          className={`px-2.5 py-1 rounded font-medium transition-colors ${
                            volunteerFilter === filter ? 'bg-white font-bold text-[#352106]' : 'text-stone-600'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {filteredVolunteers.map((app) => (
                      <div key={app.id} className="p-3 bg-white rounded-xl border border-stone-200 text-xs space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-[#352106] text-sm mr-2">{app.fullName}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 font-mono">{app.id}</span>
                            <span className="text-stone-500 ml-2">({app.institution})</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <select
                              value={app.status}
                              onChange={(e) => handleUpdateVolunteerStatus(app.id, e.target.value as any)}
                              className="text-[11px] border border-stone-300 rounded px-1.5 py-0.5 bg-stone-50"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Approved">Approved</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => handleDeleteVolunteer(app.id)}
                              className="text-stone-400 hover:text-rose-600 p-1"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="text-stone-600 text-[11px] flex flex-wrap gap-x-4">
                          <span>Role: <strong>{app.role}</strong></span>
                          <span>Branch: <strong>{app.preferredBranchName}</strong></span>
                          <span>Availability: <strong>{app.availability}</strong></span>
                          <span>Phone: <strong>{app.phone}</strong></span>
                        </div>
                        {app.motivation && (
                          <p className="italic text-stone-500 bg-stone-50 p-2 rounded text-[11px]">
                            "{app.motivation}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: DONATIONS */}
              {activeTab === 'donations' && (
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-stone-500 block text-[11px]">Total Donations:</span>
                      <span className="font-heading font-bold text-emerald-800 text-base">
                        Rp {donations.reduce((s, d) => s + (d.amount || 0), 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <span className="text-stone-600 font-medium">{donations.length} Contributions logged</span>
                  </div>

                  <div className="bg-white rounded-xl border border-stone-200 overflow-hidden text-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 text-[11px]">
                          <tr>
                            <th className="p-2.5">ID</th>
                            <th className="p-2.5">Donor</th>
                            <th className="p-2.5">Program</th>
                            <th className="p-2.5">Amount</th>
                            <th className="p-2.5">Method</th>
                            <th className="p-2.5">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {donations.map((d) => (
                            <tr key={d.transactionId} className="hover:bg-stone-50/50">
                              <td className="p-2.5 font-mono text-[10px] text-stone-500">{d.transactionId}</td>
                              <td className="p-2.5 font-semibold text-[#352106]">{d.isAnonymous ? 'Anonymous' : d.donorName}</td>
                              <td className="p-2.5 text-stone-600 truncate max-w-xs">{d.programTitle}</td>
                              <td className="p-2.5 font-bold text-emerald-700">Rp {d.amount.toLocaleString('id-ID')}</td>
                              <td className="p-2.5 text-stone-500 text-[11px]">{d.paymentMethod}</td>
                              <td className="p-2.5">
                                <button
                                  type="button"
                                  onClick={() => handleToggleDonation(d.transactionId)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                                    d.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
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
                </div>
              )}

            </div>

            {/* Bottom Actions Bar */}
            <div className="p-4 bg-white border-t border-stone-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-3.5 py-2 text-xs text-stone-600 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-stone-400" />
                <span>Reset to Default</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50 rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="px-5 py-2 bg-[#e8a70a] hover:bg-[#f1b607] text-[#241708] font-heading font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save All Changes</span>
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
