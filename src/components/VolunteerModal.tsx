import React, { useState } from 'react';
import { X, HeartHandshake, CheckCircle2, Building2, User, Mail, Phone, GraduationCap, Calendar, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import { PANTI_BRANCHES, VOLUNTEER_ROLES } from '../data/mockData';
import { VolunteerApplication } from '../types';

interface VolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVolunteerSubmitted: (app: VolunteerApplication) => void;
  initialBranchId?: string;
}

export const VolunteerModal: React.FC<VolunteerModalProps> = ({
  isOpen,
  onClose,
  onVolunteerSubmitted,
  initialBranchId,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [institution, setInstitution] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState(initialBranchId || PANTI_BRANCHES[0].id);
  const [selectedRole, setSelectedRole] = useState(VOLUNTEER_ROLES[0]);
  const [availability, setAvailability] = useState<'Weekends' | 'Weekdays' | 'Flexible'>('Weekends');
  const [motivation, setMotivation] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) return;

    const chosenBranch = PANTI_BRANCHES.find((b) => b.id === selectedBranchId) || PANTI_BRANCHES[0];
    const newId = `VOL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newApplication: VolunteerApplication = {
      id: newId,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      institution: institution.trim() || 'Individual Volunteer',
      preferredBranchId: chosenBranch.id,
      preferredBranchName: chosenBranch.name,
      role: selectedRole,
      availability,
      motivation: motivation.trim() || 'Eager to support the children and share knowledge.',
      submittedAt: new Date().toISOString(),
      status: 'Pending',
    };

    onVolunteerSubmitted(newApplication);
    setApplicationId(newId);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFullName('');
    setEmail('');
    setPhone('');
    setInstitution('');
    setMotivation('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-amber-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#352106] via-[#5c3a1d] to-[#352106] text-white p-6 relative">
          <button
            onClick={handleReset}
            className="absolute top-5 right-5 text-amber-200 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f1b607] to-[#f7931d] flex items-center justify-center text-[#352106] shadow-md">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#f1b607] inline-block">
                Open Volunteer 2026
              </span>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-white">
                Join Our Family of Volunteers
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-amber-100/90 mt-2">
            Share your knowledge, warmth, and time with children across our 4 orphanage homes in Surabaya & Sidoarjo.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 text-[#352106]">
          {isSubmitted ? (
            <div className="text-center py-8 px-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="inline-block px-3 py-1 bg-amber-100 text-[#352106] text-xs font-semibold rounded-full mb-2">
                Application Code: {applicationId}
              </span>
              <h3 className="text-2xl font-heading font-bold text-[#352106] mb-2">
                Thank You, {fullName}!
              </h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto mb-6">
                Your volunteer application has been successfully submitted and registered in our foundation portal. Our volunteer coordinator will reach out to your WhatsApp number shortly.
              </p>

              <div className="bg-[#FFFDF9] border border-amber-200 rounded-xl p-4 max-w-md mx-auto text-left text-xs space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-stone-500">Selected Branch:</span>
                  <span className="font-semibold text-[#352106]">
                    {PANTI_BRANCHES.find((b) => b.id === selectedBranchId)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Role:</span>
                  <span className="font-semibold text-[#352106]">{selectedRole}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Availability:</span>
                  <span className="font-semibold text-[#352106]">{availability}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`https://wa.me/6281212120404?text=${encodeURIComponent(
                    `Hello Yayasan Rumah Bersinar, I have submitted my volunteer application with Code ${applicationId} for ${fullName}. I am excited to connect!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors shadow-xs"
                >
                  <Phone className="w-4 h-4" />
                  Connect via WhatsApp Coordinator
                </a>
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 font-medium text-sm transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-3.5 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#f7931d] shrink-0 mt-0.5" />
                <p className="text-xs text-stone-700 leading-relaxed">
                  Volunteers can assist in weekend classes, academic tutoring, computer skills, or creative arts. Even 2 hours a week can brighten a child's future!
                </p>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#352106] mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1b607] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#352106] mb-1">
                    WhatsApp / Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +62 812 3456 7890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1b607] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#352106] mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. sarah@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1b607] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#352106] mb-1">
                    University / Organization / Workplace
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Petra Christian University"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1b607] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#352106] mb-1">
                    Preferred Orphanage Branch *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <select
                      value={selectedBranchId}
                      onChange={(e) => setSelectedBranchId(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1b607] focus:border-transparent bg-white"
                    >
                      {PANTI_BRANCHES.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name} ({branch.city})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#352106] mb-1">
                    Volunteer Role Interest *
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1b607] focus:border-transparent bg-white"
                  >
                    {VOLUNTEER_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#352106] mb-1">
                  Availability Schedule *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Weekends', 'Weekdays', 'Flexible'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAvailability(opt)}
                      className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all flex items-center justify-center gap-1.5 ${
                        availability === opt
                          ? 'border-[#f1b607] bg-amber-50 text-[#352106] font-semibold ring-1 ring-[#f1b607]'
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#352106] mb-1">
                  Why do you wish to volunteer? (Motivation or Experience)
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <textarea
                    rows={3}
                    placeholder="Tell us a little about your passion, skills, or what you hope to share with the children..."
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1b607] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl font-heading font-semibold text-sm bg-gradient-to-r from-[#f1b607] to-[#f7931d] hover:from-[#fdc502] hover:to-[#f35722] text-[#352106] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  Submit Volunteer Application
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-center text-[11px] text-stone-500 mt-2">
                  No participation fees. Yayasan Rumah Bersinar will review and provide an official volunteer certificate upon program completion.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
