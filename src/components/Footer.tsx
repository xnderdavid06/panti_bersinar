import React from 'react';
import { Phone, ArrowUpRight, Settings, ShieldCheck, Heart } from 'lucide-react';
import { FOUNDATION_INFO } from '../data/mockData';
import { RumahBersinarLogo } from './RumahBersinarLogo';
import { SiteSettings } from '../types';

interface FooterProps {
  siteSettings: SiteSettings;
  onOpenDonation: () => void;
  onOpenVolunteer: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  siteSettings,
  onOpenDonation,
  onOpenVolunteer,
  onOpenAdmin,
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappUrl = `https://wa.me/6281317000944?text=${encodeURIComponent(
    'Hello Yayasan Rumah Bersinar, I would like to inquire about your programs and homes.'
  )}`;

  return (
    <footer className="bg-[#FAF4E8] text-[#352106] pt-16 pb-12 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 3-Column Layout matching Screenshot 5 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 pb-14 border-b border-stone-300/70">
          
          {/* Column 1: Logo, Brand & Tagline matching Screenshot 5 */}
          <div className="md:col-span-5 lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <RumahBersinarLogo variant="logogram" size="md" />
              <div>
                <span className="text-xs uppercase font-heading tracking-widest text-[#814f34] font-bold block">
                  YAYASAN
                </span>
                <span className="text-lg sm:text-xl font-heading font-extrabold text-[#352106] tracking-tight block">
                  RUMAH BERSINAR
                </span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-stone-600 font-body leading-relaxed max-w-sm">
              {siteSettings.tagline}
            </p>
          </div>

          {/* Column 2: EXPLORE Links matching Screenshot 5 */}
          <div className="md:col-span-3 lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase font-heading tracking-widest text-[#ea580c] font-bold">
              EXPLORE
            </h4>
            <ul className="space-y-2.5 text-sm font-subheading text-stone-800">
              <li>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-[#ea580c] transition-colors cursor-pointer text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('locations')}
                  className="hover:text-[#ea580c] transition-colors cursor-pointer text-left"
                >
                  Facilities & Activities
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenVolunteer}
                  className="hover:text-[#ea580c] transition-colors cursor-pointer text-left"
                >
                  Get Involved
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDonation}
                  className="hover:text-[#ea580c] transition-colors cursor-pointer text-left"
                >
                  Donations
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('locations')}
                  className="hover:text-[#ea580c] transition-colors cursor-pointer text-left"
                >
                  Visits
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: CONTACT US matching Screenshot 5 */}
          <div className="md:col-span-4 lg:col-span-4 space-y-3">
            <h4 className="text-xs uppercase font-heading tracking-widest text-[#ea580c] font-bold">
              CONTACT US
            </h4>

            <p className="text-sm text-stone-600 font-body">
              Call or message us on WhatsApp:
            </p>

            {/* Phone Number in Large Bold matching Screenshot 5 */}
            <div className="flex items-center gap-2 pt-1">
              <Phone className="w-5 h-5 text-[#352106] shrink-0" />
              <a
                href="tel:+6281317000944"
                className="text-xl sm:text-2xl font-heading font-extrabold text-[#352106] tracking-tight hover:text-[#ea580c] transition-colors"
              >
                +62 813-1700-0944
              </a>
            </div>

            {/* Chat on WhatsApp ↗ matching Screenshot 5 with gold underline bar */}
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm sm:text-base font-heading font-bold text-[#352106] group cursor-pointer"
              >
                <span className="border-b-2 border-[#e8a70a] pb-0.5 group-hover:text-[#ea580c] group-hover:border-[#ea580c] transition-colors">
                  Chat on WhatsApp
                </span>
                <ArrowUpRight className="w-4 h-4 text-[#352106] group-hover:text-[#ea580c] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Accreditation, Admin Access & Credits */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-3">
            <span>
              © {new Date().getFullYear()} {FOUNDATION_INFO.legalName} · Est. 2019
            </span>
            <span>·</span>
            <span className="text-[#814f34] font-medium">
              National Grade-A Accredited
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-stone-400 text-[11px]">
              Collaboration with Petra Christian University (Kelompok 6)
            </span>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1 text-stone-400 hover:text-[#352106] transition-colors p-1"
              title="Admin Portal"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
