import React, { useState } from 'react';
import { Heart, HeartHandshake, MapPin, Phone, Menu, X, Settings } from 'lucide-react';
import { FOUNDATION_INFO } from '../data/mockData';
import { RumahBersinarLogo } from './RumahBersinarLogo';
import { SiteSettings } from '../types';

interface HeaderProps {
  siteSettings: SiteSettings;
  onOpenDonation: () => void;
  onOpenVolunteer: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  siteSettings,
  onOpenDonation,
  onOpenVolunteer,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Announcement Ribbon */}
      {siteSettings.showAnnouncement && siteSettings.announcementText && (
        <div className="bg-[#241708] text-amber-100 text-xs py-2 px-4 border-b border-amber-950">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <span className="font-medium text-white">
                {siteSettings.announcementText}
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-amber-200/80">
              <span className="hidden md:inline-flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#f1b607]" />
                Surabaya & Sidoarjo (4 Orphanage Homes)
              </span>
              <a
                href={`https://wa.me/6281317000944?text=Hello%20Yayasan%20Rumah%20Bersinar`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <Phone className="w-3 h-3 text-[#f1b607]" />
                <span>WhatsApp: <strong className="font-semibold text-white">+62 813-1700-0944</strong></span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="group flex items-center gap-3 cursor-pointer"
        >
          <RumahBersinarLogo variant="sekunder" size="md" />
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-subheading text-[#352106]">
          <button
            onClick={() => scrollTo('story')}
            className="hover:text-[#ea580c] transition-colors cursor-pointer font-medium"
          >
            Our Story
          </button>
          <button
            onClick={() => scrollTo('locations')}
            className="hover:text-[#ea580c] transition-colors cursor-pointer font-medium"
          >
            Facilities & 4 Homes
          </button>
          <button
            onClick={() => scrollTo('faq')}
            className="hover:text-[#ea580c] transition-colors cursor-pointer font-medium"
          >
            FAQ
          </button>
        </nav>

        {/* Action Controls */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Volunteer Button */}
          <button
            onClick={onOpenVolunteer}
            className="px-3.5 py-2 text-xs font-semibold text-[#352106] bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <HeartHandshake className="w-3.5 h-3.5 text-[#ea580c]" />
            <span>Open Volunteer</span>
          </button>

          {/* Donate Button */}
          <button
            onClick={onOpenDonation}
            className="px-4 py-2 text-xs font-heading font-bold text-[#241708] bg-[#e8a70a] hover:bg-[#f1b607] shadow-xs hover:shadow rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 fill-[#241708]" />
            <span>Donate Now</span>
          </button>

          {/* Admin Button */}
          <button
            onClick={onOpenAdmin}
            className="p-2 text-stone-500 hover:text-[#352106] hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            title="Admin Dashboard"
            aria-label="Admin Dashboard"
          >
            <Settings className="w-4 h-4 text-stone-600" />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenAdmin}
            className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg"
            title="Admin Portal"
            aria-label="Admin Portal"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#352106] hover:text-[#ea580c] rounded-lg focus:outline-none"
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#352106]" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-[#FFFDF9] px-4 pt-4 pb-6 space-y-3">
          <div className="flex flex-col space-y-2 text-[#352106] font-subheading text-sm">
            <button
              onClick={() => scrollTo('story')}
              className="text-left py-2.5 px-3 hover:bg-amber-50 rounded-lg font-medium"
            >
              Our Story (Foundation & 5 Core Values)
            </button>
            <button
              onClick={() => scrollTo('locations')}
              className="text-left py-2.5 px-3 hover:bg-amber-50 rounded-lg font-medium"
            >
              Facilities & 4 Homes (Surabaya & Sidoarjo)
            </button>
            <button
              onClick={() => scrollTo('faq')}
              className="text-left py-2.5 px-3 hover:bg-amber-50 rounded-lg font-medium"
            >
              Frequently Asked Questions (FAQ)
            </button>
          </div>

          <div className="pt-3 border-t border-stone-200 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenVolunteer();
              }}
              className="w-full py-2.5 px-4 text-center font-subheading font-semibold text-xs text-[#352106] bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl flex items-center justify-center gap-2"
            >
              <HeartHandshake className="w-4 h-4 text-[#ea580c]" />
              Open Volunteer Recruitment
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDonation();
              }}
              className="w-full py-2.5 px-4 text-center font-heading font-bold text-xs text-[#241708] bg-[#e8a70a] hover:bg-[#f1b607] rounded-xl shadow-xs flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-[#241708]" />
              Donate Now
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2 px-4 text-center font-medium text-xs text-stone-600 hover:bg-stone-100 rounded-xl flex items-center justify-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              Open Admin Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
