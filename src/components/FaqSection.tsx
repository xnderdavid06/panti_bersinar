import React, { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { FaqItem } from '../types';

interface FaqSectionProps {
  faqs: FaqItem[];
  whatsappPhone?: string;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  faqs,
  whatsappPhone = '+62 813-1700-0944',
}) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const cleanPhone = whatsappPhone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone || '6281317000944'}?text=${encodeURIComponent(
    'Hello Yayasan Rumah Bersinar, I have a question regarding visits, donations, or volunteering.'
  )}`;

  return (
    <section id="faq" className="py-20 lg:py-28 bg-[#FFFDF9] border-b border-stone-200/90">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title matching Screenshot 4 in Display Serif */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#352106] tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ Accordion List matching Screenshot 4 */}
        <div className="border-t border-stone-200/80 divide-y divide-stone-200/80 mb-14">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className="py-5 sm:py-6 transition-colors">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between text-left gap-4 group cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-heading font-semibold text-[#352106] group-hover:text-[#ea580c] transition-colors leading-snug">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-stone-400 group-hover:text-[#ea580c] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#ea580c]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="mt-3 text-sm sm:text-base text-stone-600 font-body leading-relaxed pr-8 animate-in fade-in slide-in-from-top-1 duration-150">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp prompt & button matching Screenshot 4 */}
        <div className="text-center space-y-4">
          <p className="text-base sm:text-lg text-stone-700 font-body">
            Any other questions? Click{' '}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ea580c] font-semibold underline underline-offset-4 hover:text-[#c2410c] transition-colors"
            >
              here
            </a>{' '}
            to ask us via WhatsApp.
          </p>

          <div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-heading font-semibold text-sm sm:text-base shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
