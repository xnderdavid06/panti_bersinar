import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Building2,
  ExternalLink,
  HeartHandshake,
  Heart,
  Clock,
  Sparkles,
  Calendar,
  Users,
  CheckCircle2,
  X,
} from 'lucide-react';
import { PantiBranch, Facility, Activity, Home, VisitBooking, WhatsAppPledge } from '../types';

interface LocationsSectionProps {
  branches: PantiBranch[];
  homes: Home[];
  facilities: Facility[];
  activities: Activity[];
  onSelectVolunteerBranch: (branchId: string) => void;
  onOpenDonationForBranch: (branch: PantiBranch) => void;
  onBookVisit: (visit: VisitBooking) => void;
  onLogPledge: (pledge: WhatsAppPledge) => void;
}

export const LocationsSection: React.FC<LocationsSectionProps> = ({
  branches,
  homes,
  facilities,
  activities,
  onSelectVolunteerBranch,
  onOpenDonationForBranch,
  onBookVisit,
  onLogPledge,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'homes' | 'facilities' | 'activities'>('homes');

  // Visit Booking Modal state
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [visitorContact, setVisitorContact] = useState('');
  const [selectedHomeName, setSelectedHomeName] = useState(homes[0]?.name || 'Rumah Bersinar — Home 1');
  const [visitDate, setVisitDate] = useState('');
  const [visitorPeople, setVisitorPeople] = useState(1);
  const [visitNotes, setVisitNotes] = useState('');
  const [visitSuccess, setVisitSuccess] = useState(false);

  const handleVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVisit: VisitBooking = {
      id: `VIS-${Math.floor(10000 + Math.random() * 90000)}`,
      visitor: visitorName.trim(),
      contact: visitorContact.trim(),
      home: selectedHomeName,
      date: visitDate,
      people: visitorPeople,
      notes: visitNotes.trim(),
      received: new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }) + ' WIB',
    };

    onBookVisit(newVisit);
    setVisitSuccess(true);
    setTimeout(() => {
      setVisitSuccess(false);
      setVisitModalOpen(false);
      setVisitorName('');
      setVisitorContact('');
      setVisitNotes('');
    }, 2000);
  };

  const handleWhatsAppPledgeClick = () => {
    const pledge: WhatsAppPledge = {
      id: `wp-${Date.now()}`,
      amount: 100000,
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    onLogPledge(pledge);
  };

  return (
    <section id="locations" className="py-20 bg-stone-50/70 relative font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-[#352106] text-xs font-semibold mb-3">
            <Building2 className="w-3.5 h-3.5 text-[#f1b607]" />
            Network of Care · {homes.length} Orphanage Homes & Facilities
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#352106] tracking-tight mb-4">
            Homes, Facilities & Daily Activities
          </h2>
          <p className="text-base text-stone-600 leading-relaxed font-body">
            Explore our welcoming residences, nurturing facilities, and holistic daily activities for children across Surabaya & Sidoarjo.
          </p>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setActiveSubTab('homes')}
              className={`px-5 py-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
                activeSubTab === 'homes'
                  ? 'bg-[#352106] text-[#f1b607] shadow-sm'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              Our Homes ({homes.length})
            </button>
            <button
              onClick={() => setActiveSubTab('facilities')}
              className={`px-5 py-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
                activeSubTab === 'facilities'
                  ? 'bg-[#352106] text-[#f1b607] shadow-sm'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              Facilities ({facilities.length})
            </button>
            <button
              onClick={() => setActiveSubTab('activities')}
              className={`px-5 py-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
                activeSubTab === 'activities'
                  ? 'bg-[#352106] text-[#f1b607] shadow-sm'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              Daily Activities ({activities.length})
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* VIEW 1: HOMES (Configured via Staff Admin "Homes" Tab)              */}
        {/* =================================================================== */}
        {activeSubTab === 'homes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {homes.map((home) => (
              <div
                key={home.id}
                className="bg-white rounded-3xl p-7 border border-stone-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs"
              >
                <div>
                  {/* Photo & Logo Header */}
                  {home.photo && (
                    <div className="relative h-56 rounded-2xl overflow-hidden mb-6">
                      <img
                        src={home.photo}
                        alt={home.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {home.logo && (
                        <div className="absolute bottom-3 left-3 bg-white p-1 rounded-xl shadow-md">
                          <img
                            src={home.logo}
                            alt="Logo"
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                      )}
                      <div className="absolute bottom-3 right-3 bg-amber-400 text-stone-900 font-heading font-bold text-[11px] px-3 py-1 rounded-full shadow-xs">
                        Home #{home.order}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h3 className="text-2xl font-serif font-bold text-[#352106]">
                      {home.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {home.description}
                    </p>

                    <div className="pt-2 space-y-2 text-xs text-stone-700">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-[#ea580c] shrink-0 mt-0.5" />
                        <div>
                          <span>{home.location}</span>
                          {home.mapsLink && (
                            <a
                              href={home.mapsLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-amber-700 hover:underline inline-flex items-center gap-1 ml-2 font-semibold"
                            >
                              Maps <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-semibold text-stone-800">{home.contact}</span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>Visiting hours: <strong>{home.visitingHours}</strong></span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-[#f1b607] shrink-0" />
                        <span>Visit activities: {home.visitActivities}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      setSelectedHomeName(home.name);
                      setVisitModalOpen(true);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-amber-100 hover:bg-amber-200 text-[#352106] font-heading font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#ea580c]" />
                    <span>Book a Visit</span>
                  </button>

                  <a
                    href={`https://wa.me/${home.contact.replace(/[^0-9]/g, '')}?text=Halo%20Yayasan%20Rumah%20Bersinar,%20saya%20ingin%20berdonasi%20untuk%20${encodeURIComponent(home.name)}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={handleWhatsAppPledgeClick}
                    className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    <span>WhatsApp Pledge</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 2: FACILITIES (Configured via Staff Admin "Facilities" Tab)     */}
        {/* =================================================================== */}
        {activeSubTab === 'facilities' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {facilities.map((fac) => (
              <div
                key={fac.id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200 hover:shadow-lg transition-all duration-300 flex flex-col shadow-xs"
              >
                {fac.photo && (
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={fac.photo}
                      alt={fac.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-black/60 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                      Facility #{fac.order}
                    </div>
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xl font-serif font-bold text-[#352106] mb-2">
                      {fac.name}
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed font-body">
                      {fac.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-amber-700 font-semibold">
                    <span>Available across Surabaya & Sidoarjo</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 3: ACTIVITIES (Configured via Staff Admin "Activities" Tab)     */}
        {/* =================================================================== */}
        {activeSubTab === 'activities' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {activities.map((act) => (
              <div
                key={act.id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200 hover:shadow-lg transition-all duration-300 flex flex-col shadow-xs"
              >
                {act.photo && (
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={act.photo}
                      alt={act.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-3 left-3 bg-[#352106] text-[#f1b607] text-[11px] font-heading font-bold px-3 py-1 rounded-full shadow-xs">
                      {act.schedule}
                    </div>
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xl font-serif font-bold text-[#352106] mb-2">
                      {act.title}
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed font-body">
                      {act.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-medium">
                    <span>Schedule: {act.schedule}</span>
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#241708] to-[#40260e] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
              Want to visit our children in person or donate physical goods?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300">
              Schedule a visit with our team or pledge a transfer directly via WhatsApp.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setSelectedHomeName(homes[0]?.name || 'Rumah Bersinar');
                setVisitModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-white text-[#241708] font-heading font-bold text-xs hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Book Visit Form
            </button>
            <a
              href="https://wa.me/6281317000944?text=Halo%20Yayasan%20Rumah%20Bersinar,%20saya%20ingin%20konfirmasi%20kunjungan/donasi."
              target="_blank"
              rel="noreferrer"
              onClick={handleWhatsAppPledgeClick}
              className="px-5 py-2.5 rounded-xl bg-[#e8a70a] hover:bg-[#f1b607] text-[#241708] font-heading font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp Admin</span>
            </a>
          </div>
        </div>

      </div>

      {/* ===================================================================== */}
      {/* BOOK A VISIT MODAL (Saves to Staff Admin "Visits" Tab)               */}
      {/* ===================================================================== */}
      {visitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative animate-in zoom-in-95">
            <button
              onClick={() => setVisitModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-[#ea580c] flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-[#352106]">
                  Schedule a Visit
                </h3>
                <p className="text-[11px] text-stone-500">
                  Yayasan Rumah Bersinar
                </p>
              </div>
            </div>

            {visitSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-heading font-bold text-lg text-stone-800">
                  Visit Scheduled!
                </h4>
                <p className="text-xs text-stone-600">
                  Your visit has been logged into our Staff Admin. Our caregiver will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleVisitSubmit} className="space-y-3.5 text-xs text-left">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Tan"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#f1b607]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    WhatsApp / Phone Contact
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0812xxxxxxxx"
                    value={visitorContact}
                    onChange={(e) => setVisitorContact(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#f1b607]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Select Orphanage Home
                  </label>
                  <select
                    value={selectedHomeName}
                    onChange={(e) => setSelectedHomeName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                  >
                    {homes.map((h) => (
                      <option key={h.id} value={h.name}>
                        {h.name} ({h.location})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      required
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Number of People
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={visitorPeople}
                      onChange={(e) => setVisitorPeople(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Notes / Planned Activities (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Storytelling session, bringing snacks"
                    value={visitNotes}
                    onChange={(e) => setVisitNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 mt-2 rounded-xl bg-[#e8a70a] hover:bg-[#f1b607] text-[#241708] font-heading font-bold text-xs transition-colors cursor-pointer"
                >
                  Confirm & Submit Visit
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
