import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { FOUNDATION_INFO } from '../data/mockData';
import { SiteSettings, CoreValue } from '../types';

interface AboutUsSectionProps {
  siteSettings: SiteSettings;
  coreValues: CoreValue[];
  onOpenVolunteer: () => void;
  onOpenDonation: () => void;
}

export const AboutUsSection: React.FC<AboutUsSectionProps> = ({
  siteSettings,
  coreValues,
}) => {
  return (
    <div id="story" className="bg-[#FFFDF9]">
      {/* ---------------------------------------------------- */}
      {/* PART 1: OUR STORY (Matching Screenshot 2) */}
      {/* ---------------------------------------------------- */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-stone-200/80">
        <div className="max-w-4xl space-y-6">
          {/* Tag matching Screenshot 2: 01 / OUR STORY */}
          <div className="text-xs sm:text-sm font-heading tracking-widest uppercase font-bold text-[#ea580c]">
            01 / OUR STORY
          </div>

          {/* Headline matching Screenshot 2 in Display Serif */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#352106] tracking-tight leading-[1.12]">
            {siteSettings.storyHeadline || 'A brighter future begins with belonging.'}
          </h2>

          {/* Paragraphs matching Screenshot 2 */}
          <div className="space-y-5 text-base sm:text-lg text-stone-700 font-body leading-relaxed pt-2">
            <p>
              {siteSettings.storyParagraph1}
            </p>
            <p>
              {siteSettings.storyParagraph2}
            </p>
          </div>

          {/* Founder & Legal Badges */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#f1b607] to-[#ea580c] text-[#352106] flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                AW
              </div>
              <div>
                <div className="font-heading font-bold text-sm text-[#352106]">
                  {siteSettings.founderName || FOUNDATION_INFO.founder}
                </div>
                <div className="text-xs text-[#814f34]">
                  {siteSettings.founderTitle || FOUNDATION_INFO.founderTitle}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-3.5">
              <ShieldCheck className="w-8 h-8 text-[#16a34a] shrink-0" />
              <div>
                <div className="font-heading font-bold text-sm text-[#352106]">
                  {FOUNDATION_INFO.accreditation}
                </div>
                <div className="text-xs text-stone-500">
                  Kemenkumham: {FOUNDATION_INFO.skKemenkumham}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* PART 2: WHAT WE BELIEVE (Matching Screenshot 3) */}
      {/* ---------------------------------------------------- */}
      <section className="py-20 lg:py-24 bg-[#FBF7EE] border-b border-stone-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header matching Screenshot 3 */}
          <div className="mb-12">
            <div className="text-xs sm:text-sm font-heading tracking-widest uppercase font-bold text-[#ea580c] mb-3">
              WHAT WE BELIEVE
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#352106] tracking-tight">
              A home built on care.
            </h2>
          </div>

          {/* 5-Column Grid with Vertical Borders matching Screenshot 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 border border-stone-200/80 bg-white/60 divide-y md:divide-y-0 md:divide-x divide-stone-200/80 rounded-2xl overflow-hidden shadow-2xs">
            {coreValues.map((item) => (
              <div
                key={item.number}
                className="p-6 sm:p-7 flex flex-col justify-between hover:bg-white transition-colors duration-200"
              >
                <div>
                  {/* Top Colored Bar matching Screenshot 3 */}
                  <div
                    className="w-10 h-1.5 rounded-full mb-6"
                    style={{ backgroundColor: item.color }}
                  />

                  {/* Number matching Screenshot 3 */}
                  <div className="text-xs font-semibold text-stone-500 mb-2 font-mono">
                    {item.number}
                  </div>

                  {/* Title in Serif matching Screenshot 3 */}
                  <h3 className="text-2xl font-serif font-bold text-[#352106] mb-3">
                    {item.name}
                  </h3>

                  {/* Description matching Screenshot 3 */}
                  <p className="text-xs sm:text-sm text-stone-600 font-body leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
};
