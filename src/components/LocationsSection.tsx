import React, { useState } from 'react';
import { MapPin, Phone, Building2, ExternalLink, HeartHandshake, Heart, Clock, Navigation } from 'lucide-react';
import { PantiBranch } from '../types';

interface LocationsSectionProps {
  branches: PantiBranch[];
  onSelectVolunteerBranch: (branchId: string) => void;
  onOpenDonationForBranch: (branch: PantiBranch) => void;
}

export const LocationsSection: React.FC<LocationsSectionProps> = ({
  branches,
  onSelectVolunteerBranch,
  onOpenDonationForBranch,
}) => {
  const [selectedBranchTab, setSelectedBranchTab] = useState<string>('all');

  const filteredBranches =
    selectedBranchTab === 'all'
      ? branches
      : branches.filter((b) => b.city.toLowerCase() === selectedBranchTab.toLowerCase());

  return (
    <section id="locations" className="py-20 bg-stone-50/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-[#352106] text-xs font-semibold mb-3">
            <Building2 className="w-3.5 h-3.5 text-[#f1b607]" />
            Network of Care · {branches.length} Orphanage Homes
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#352106] tracking-tight mb-4">
            Our Locations & Facilities in Surabaya & Sidoarjo
          </h2>
          <p className="text-base text-stone-600 leading-relaxed font-body">
            Yayasan Rumah Bersinar operates specialized residences across East Java, each tailored to specific age cohorts, early childhood nutrition, or adolescent vocational development.
          </p>

          {/* City Tabs */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setSelectedBranchTab('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedBranchTab === 'all'
                  ? 'bg-[#352106] text-[#f1b607] shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              All Homes ({branches.length})
            </button>
            <button
              onClick={() => setSelectedBranchTab('surabaya')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedBranchTab === 'surabaya'
                  ? 'bg-[#352106] text-[#f1b607] shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              Surabaya ({branches.filter((b) => b.city.toLowerCase() === 'surabaya').length})
            </button>
            <button
              onClick={() => setSelectedBranchTab('sidoarjo')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedBranchTab === 'sidoarjo'
                  ? 'bg-[#352106] text-[#f1b607] shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              Sidoarjo ({branches.filter((b) => b.city.toLowerCase() === 'sidoarjo').length})
            </button>
          </div>
        </div>

        {/* Location Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {filteredBranches.map((branch, index) => (
            <div
              key={branch.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden"
            >
              <div className="space-y-4">
                {/* Branch Photo if available */}
                {branch.imageUrl && (
                  <div className="relative h-44 rounded-2xl overflow-hidden mb-4 border border-stone-100">
                    <img
                      src={branch.imageUrl}
                      alt={branch.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#352106]/80 text-[#f1b607] backdrop-blur-xs">
                      Branch 0{index + 1}
                    </div>
                  </div>
                )}

                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {!branch.imageUrl && (
                      <span className="text-[11px] font-bold tracking-wider uppercase text-amber-700 block mb-1">
                        Branch 0{index + 1} · {branch.city}
                      </span>
                    )}
                    <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#352106] group-hover:text-[#814f34] transition-colors">
                      {branch.name}
                    </h3>
                    <p className="text-xs text-[#814f34] font-medium mt-0.5">
                      {branch.subtitle}
                    </p>
                  </div>

                  <span className={`text-xs px-3 py-1 rounded-full font-semibold shrink-0 ${branch.bgBadge}`}>
                    {branch.capacityText}
                  </span>
                </div>

                {/* Focus Area Pill */}
                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100/70">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                    Specialized Focus
                  </span>
                  <span className="text-xs font-semibold text-[#352106]">
                    {branch.focusArea}
                  </span>
                </div>

                {/* Address & Contact */}
                <div className="space-y-2.5 text-xs text-stone-600">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="leading-relaxed text-stone-700">
                        {branch.address}
                      </p>
                      {branch.postalCode && (
                        <p className="text-stone-400 text-[11px]">Postal Code: {branch.postalCode}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                    <a
                      href={`tel:${branch.phone.replace(/[^0-9+]/g, '')}`}
                      className="font-medium text-[#352106] hover:underline"
                    >
                      {branch.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-2.5 text-[11px] text-stone-500">
                    <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                    <span>Visiting Hours: 09:00 AM – 05:00 PM (Reservation Required)</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-6 mt-6 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2.5">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(branch.mapQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#814f34] hover:text-[#352106] py-1.5 px-3 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#f1b607]" />
                  Open in Google Maps
                  <ExternalLink className="w-3 h-3 text-stone-400" />
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectVolunteerBranch(branch.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-[#352106] font-semibold text-xs border border-amber-200 transition-colors"
                  >
                    <HeartHandshake className="w-3.5 h-3.5 text-[#ea580c]" />
                    Volunteer Here
                  </button>
                  <button
                    onClick={() => onOpenDonationForBranch(branch)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#e8a70a] hover:bg-[#f1b607] text-[#241708] font-semibold text-xs shadow-2xs transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 fill-[#241708]/20" />
                    Donate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Visiting & Physical Drop-off Notice */}
        <div className="p-6 rounded-2xl bg-white border border-stone-200 text-stone-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#352106] flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-[#ea580c]" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-[#352106]">
                Planning to visit or deliver physical donations (groceries, books, formula)?
              </h4>
              <p className="text-xs text-stone-500">
                Please notify our secretariat in advance so our caregivers can prepare a warm welcome for your visit.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/6281317000944?text=Hello%20Yayasan%20Rumah%20Bersinar,%20I%20would%20like%20to%20schedule%20a%20visit%20to%20one%20of%20your%20orphanage%20branches."
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            Schedule Visit via WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};
