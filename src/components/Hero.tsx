import React from 'react';
import { ArrowUpRight, Heart, HeartHandshake, Sparkles, ShieldCheck } from 'lucide-react';
import { FOUNDATION_INFO } from '../data/mockData';
import { SiteSettings } from '../types';

interface HeroProps {
  siteSettings: SiteSettings;
  onOpenDonation: () => void;
  onOpenVolunteer: () => void;
  onScrollToStory: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  siteSettings,
  onOpenDonation,
  onOpenVolunteer,
  onScrollToStory,
}) => {
  return (
    <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-start overflow-hidden bg-[#241708]">
      {/* Background Image with warm rich dark overlay matching Screenshot 1 */}
      <div className="absolute inset-0 z-0">
        <img
          src={siteSettings.heroImageUrl || '/src/assets/images/hero_orphanage_hope_1790578628387.jpg'}
          alt="Children studying attentively at wooden table in orphanage"
          className="w-full h-full object-cover object-center filter brightness-[0.55] contrast-[1.05]"
        />
        {/* Warm Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#241708]/95 via-[#241708]/75 to-[#241708]/40" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#241708]/40 to-[#241708]/90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="max-w-3xl space-y-7">
          
          {/* Top Label matching Screenshot 1: — A PLACE TO BELONG */}
          <div className="flex items-center gap-3">
            <span className="w-8 h-[2px] bg-[#f1b607]" />
            <span className="text-xs sm:text-sm font-heading tracking-widest uppercase font-semibold text-[#f1b607]">
              {siteSettings.heroLabel || 'A PLACE TO BELONG'}
            </span>
          </div>

          {/* Headline matching Screenshot 1 in Display Serif Typography */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-white tracking-tight leading-[1.08] text-balance drop-shadow-sm">
            {siteSettings.tagline === 'A home to grow. A community to belong.' ? (
              <>
                A home to grow.<br />
                A community to belong.
              </>
            ) : (
              siteSettings.tagline
            )}
          </h1>

          {/* Subtitle matching Screenshot 1 */}
          <p className="text-base sm:text-xl text-stone-200/95 font-body leading-relaxed max-w-2xl">
            {siteSettings.subheadline}
          </p>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            {/* Primary Gold CTA matching Screenshot 1: Discover our story ↗ */}
            <button
              onClick={onScrollToStory}
              className="px-7 py-3.5 bg-[#e8a70a] hover:bg-[#f1b607] text-[#241708] font-heading font-bold text-sm sm:text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 cursor-pointer group"
            >
              <span>Discover our story</span>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            {/* Donate CTA */}
            <button
              onClick={onOpenDonation}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-xs font-heading font-semibold text-sm sm:text-base rounded-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-[#f1b607] text-[#f1b607]" />
              <span>Donate Now</span>
            </button>

            {/* Volunteer CTA */}
            <button
              onClick={onOpenVolunteer}
              className="px-6 py-3.5 bg-transparent hover:bg-white/10 text-amber-200 font-heading font-semibold text-sm sm:text-base rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-[#f1b607]" />
              <span>Join as Volunteer</span>
            </button>
          </div>

          {/* Trust badges footer */}
          <div className="pt-8 border-t border-white/15 flex flex-wrap items-center gap-6 text-xs text-stone-300">
            <span className="flex items-center gap-2 text-white font-medium">
              <ShieldCheck className="w-4 h-4 text-[#f1b607]" />
              Est. 2019 · Founder Dr. Andri Wisnu Jayakusuma
            </span>
            <span className="text-white/30 hidden sm:inline">|</span>
            <span>Surabaya & Sidoarjo (4 Orphanage Homes)</span>
            <span className="text-white/30 hidden sm:inline">|</span>
            <span className="text-amber-300 font-medium">National Grade-A Accreditation</span>
          </div>

        </div>
      </div>
    </section>
  );
};
