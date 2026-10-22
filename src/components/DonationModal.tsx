import React, { useState } from 'react';
import { X, Heart, ShieldCheck, Copy, Check, QrCode, ArrowRight, Download, CreditCard, Building, Sparkles } from 'lucide-react';
import { DONATION_PROGRAMS, BANK_ACCOUNTS, FOUNDATION_INFO } from '../data/mockData';
import { DonationRecord } from '../types';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProgramId?: string;
  initialAmount?: number;
  onDonationSuccess?: (record: DonationRecord) => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  initialProgramId,
  initialAmount,
  onDonationSuccess,
}) => {
  const [selectedProgramId, setSelectedProgramId] = useState<string>(
    initialProgramId || DONATION_PROGRAMS[0].id
  );
  const [amount, setAmount] = useState<number>(initialAmount || 250000);
  const [customAmountStr, setCustomAmountStr] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [prayerMessage, setPrayerMessage] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bca' | 'mandiri' | 'bri' | 'card'>('qris');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<DonationRecord | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentProgram =
    DONATION_PROGRAMS.find((p) => p.id === selectedProgramId) || DONATION_PROGRAMS[0];

  const handleAmountClick = (val: number) => {
    setAmount(val);
    setCustomAmountStr('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setCustomAmountStr(raw);
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setAmount(parsed);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedReceipt: DonationRecord = {
        transactionId: `TXN-RB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        donorName: isAnonymous ? 'Kind Benefactor (Anonymous)' : (donorName.trim() || 'Supporter of Hope'),
        donorEmail: donorEmail.trim() || 'donor@example.com',
        donorPhone: donorPhone.trim() || '+62 812-xxxx-xxxx',
        amount: amount,
        programId: currentProgram.id,
        programTitle: currentProgram.title,
        paymentMethod:
          paymentMethod === 'qris'
            ? 'QRIS Instant Payment'
            : paymentMethod === 'bca'
            ? 'BCA Virtual Account'
            : paymentMethod === 'mandiri'
            ? 'Bank Mandiri Transfer'
            : paymentMethod === 'bri'
            ? 'BRI Transfer'
            : 'Credit Card / Visa-Mastercard',
        prayerMessage: prayerMessage.trim() || 'Blessings and bright futures for the children.',
        isAnonymous: isAnonymous,
        timestamp: new Date().toISOString(),
        status: 'Verified',
      };

      setReceipt(generatedReceipt);
      if (onDonationSuccess) {
        onDonationSuccess(generatedReceipt);
      }
      setIsSubmitting(false);
    }, 600);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleReset = () => {
    setReceipt(null);
    setCustomAmountStr('');
    setDonorName('');
    setDonorEmail('');
    setDonorPhone('');
    setPrayerMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-amber-200 relative animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#352106] text-white z-10 px-6 py-4 flex items-center justify-between border-b border-amber-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f1b607] to-[#f7931d] text-[#352106] flex items-center justify-center shadow-xs">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-base sm:text-lg">
                Make a Gift of Hope
              </h3>
              <p className="text-[11px] text-amber-200/80">
                Yayasan Rumah Bersinar · National Grade-A Accredited
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="p-1.5 text-amber-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-[#352106]">
          {receipt ? (
            /* Official Receipt View */
            <div className="space-y-5 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-emerald-800 block">
                  Donation Confirmed & Logged
                </span>
                <h4 className="text-2xl font-heading font-bold text-[#352106] mt-0.5">
                  Thank You, {receipt.donorName}!
                </h4>
                <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto">
                  Your generous gift has been recorded in the foundation ledger. Every contribution directly empowers our resident children.
                </p>
              </div>

              {/* Digital Receipt Card */}
              <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-amber-200 text-left space-y-3 relative overflow-hidden">
                <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-mono tracking-wider text-amber-800 font-semibold">
                      OFFICIAL ELECTRONIC RECEIPT
                    </div>
                    <div className="font-mono text-xs font-bold text-[#352106]">
                      {receipt.transactionId}
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-stone-500">
                    {new Date(receipt.timestamp).toLocaleString()}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-stone-400 block text-[11px]">Donor Name:</span>
                    <span className="font-semibold text-[#352106]">{receipt.donorName}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">Payment Method:</span>
                    <span className="font-semibold text-[#352106]">{receipt.paymentMethod}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-stone-400 block text-[11px]">Designated Program:</span>
                    <span className="font-semibold text-[#352106]">{receipt.programTitle}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-baseline justify-between">
                  <span className="text-xs text-stone-500 font-medium">Donation Amount:</span>
                  <div className="text-right">
                    <span className="text-lg font-bold text-emerald-700 font-heading tabular-nums">
                      Rp {receipt.amount.toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs text-stone-400 block">
                      ≈ ${(receipt.amount / 15500).toFixed(2)} USD
                    </span>
                  </div>
                </div>

                {receipt.prayerMessage && (
                  <div className="mt-2 pt-2 border-t border-stone-200 text-xs italic text-stone-600 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                    "{receipt.prayerMessage}"
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => {
                    alert('Official receipt has been prepared for printing.');
                    window.print();
                  }}
                  className="flex-1 py-2.5 bg-[#352106] hover:bg-[#4a2e16] text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print / Save Receipt</span>
                </button>

                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Donation Input Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Program Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#352106] mb-1">
                  Select Cause / Program:
                </label>
                <select
                  value={selectedProgramId}
                  onChange={(e) => setSelectedProgramId(e.target.value)}
                  className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-[#352106] focus:outline-none focus:ring-2 focus:ring-[#f1b607]"
                >
                  {DONATION_PROGRAMS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-stone-500 mt-1">
                  💡 {currentProgram.impactDescription}
                </p>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#352106] mb-1.5">
                  Select Gift Amount:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[100000, 250000, 500000, 1000000, 2000000, 5000000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleAmountClick(amt)}
                      className={`p-2.5 text-xs rounded-xl border text-center transition-all ${
                        amount === amt && !customAmountStr
                          ? 'bg-[#352106] text-[#f1b607] border-[#352106] shadow-xs font-bold'
                          : 'bg-white text-stone-800 border-stone-200 hover:bg-amber-50'
                      }`}
                    >
                      <div className="font-semibold">Rp {amt.toLocaleString('id-ID')}</div>
                      <div className="text-[10px] opacity-75">≈ ${(amt / 15500).toFixed(0)} USD</div>
                    </button>
                  ))}
                </div>

                {/* Custom Amount Input */}
                <div className="mt-2.5 relative">
                  <span className="absolute left-3 top-2.5 text-xs text-stone-400 font-semibold">Rp</span>
                  <input
                    type="text"
                    placeholder="Or enter custom amount in IDR (e.g. 750,000)"
                    value={customAmountStr ? parseInt(customAmountStr, 10).toLocaleString('id-ID') : ''}
                    onChange={handleCustomAmountChange}
                    className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-[#352106] focus:outline-none focus:ring-2 focus:ring-[#f1b607]"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-semibold text-[#352106] mb-1.5">
                  Payment Method:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('qris')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      paymentMethod === 'qris'
                        ? 'border-[#f1b607] bg-amber-50 text-[#352106] font-bold ring-1 ring-[#f1b607]'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <QrCode className="w-4 h-4 mx-auto mb-1 text-stone-700" />
                    <span>QRIS / E-Wallet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bca')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      paymentMethod === 'bca'
                        ? 'border-[#f1b607] bg-amber-50 text-[#352106] font-bold ring-1 ring-[#f1b607]'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span className="font-bold block text-blue-700 text-xs mb-0.5">BCA</span>
                    <span>Bank Transfer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mandiri')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      paymentMethod === 'mandiri'
                        ? 'border-[#f1b607] bg-amber-50 text-[#352106] font-bold ring-1 ring-[#f1b607]'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span className="font-bold block text-amber-700 text-xs mb-0.5">Mandiri</span>
                    <span>Bank Transfer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#f1b607] bg-amber-50 text-[#352106] font-bold ring-1 ring-[#f1b607]'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mx-auto mb-1 text-stone-700" />
                    <span>Credit Card</span>
                  </button>
                </div>
              </div>

              {/* Payment Details Box */}
              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs space-y-2">
                {paymentMethod === 'qris' ? (
                  <div className="flex items-center gap-3">
                    <QrCode className="w-9 h-9 text-[#352106] shrink-0" />
                    <div>
                      <div className="font-semibold text-[#352106]">QRIS National Payment Standard</div>
                      <div className="text-[11px] text-stone-600">
                        Scan with any Indonesian e-wallet or banking app (GoPay, OVO, ShopeePay, DANA, Livin, BCA).
                      </div>
                    </div>
                  </div>
                ) : paymentMethod === 'card' ? (
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-8 h-8 text-[#352106] shrink-0" />
                    <div>
                      <div className="font-semibold text-[#352106]">Visa / Mastercard / JCB</div>
                      <div className="text-[11px] text-stone-600">
                        Instant 256-bit SSL encrypted international card processing.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-stone-500 block">Foundation Account:</span>
                      <span className="font-mono text-sm font-bold text-[#352106]">
                        {paymentMethod === 'bca' ? '822-091-7788' : '141-00-2288331-9'}
                      </span>
                      <span className="text-[10px] text-stone-500 block">
                        a.n. YAYASAN RUMAH BERSINAR INDONESIA
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          paymentMethod === 'bca' ? '8220917788' : '1410022883319',
                          'acc'
                        )
                      }
                      className="px-3 py-1.5 text-xs bg-white border border-stone-300 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      {copiedText === 'acc' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Account</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Donor Details */}
              <div className="space-y-3 pt-1 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#352106]">
                    Donor Information:
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded text-[#f1b607] focus:ring-[#f1b607]"
                    />
                    <span>Make my gift anonymous</span>
                  </label>
                </div>

                {!isAnonymous && (
                  <div>
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-[#352106] focus:outline-none focus:ring-2 focus:ring-[#f1b607]"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="email"
                    placeholder="Email (for official e-receipt)"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-[#352106] focus:outline-none focus:ring-2 focus:ring-[#f1b607]"
                  />
                  <input
                    type="tel"
                    placeholder="WhatsApp / Phone (optional)"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-[#352106] focus:outline-none focus:ring-2 focus:ring-[#f1b607]"
                  />
                </div>

                <div>
                  <textarea
                    rows={2}
                    placeholder="Dedication note or prayer message for the children..."
                    value={prayerMessage}
                    onChange={(e) => setPrayerMessage(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-[#352106] focus:outline-none focus:ring-2 focus:ring-[#f1b607] resize-none"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || amount <= 0}
                  className="w-full py-3 bg-gradient-to-r from-[#f1b607] to-[#f7931d] hover:from-[#fdc502] hover:to-[#f35722] disabled:bg-stone-300 text-[#352106] font-heading font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>
                    {isSubmitting
                      ? 'Processing Donation...'
                      : `Confirm Gift of Rp ${amount.toLocaleString('id-ID')} (≈ $${(amount / 15500).toFixed(0)} USD)`}
                  </span>
                </button>
                <div className="text-center text-[11px] text-stone-500 mt-2 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% transparent · Recorded in foundation ledger · Audited annually</span>
                </div>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
