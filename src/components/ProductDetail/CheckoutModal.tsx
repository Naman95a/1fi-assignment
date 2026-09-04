'use client';

import { useState } from 'react';
import { Product, ProductVariant, EmiPlan } from '@/types';
import { formatINR } from '@/lib/utils';
import { X, CheckCircle2, ShieldCheck, ArrowRight, Loader2, Sparkles } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  variant: ProductVariant;
  selectedPlan: EmiPlan | null;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  product,
  variant,
  selectedPlan,
}: CheckoutModalProps) {
  const [step, setStep] = useState<'review' | 'kyc' | 'success'>('review');
  const [formData, setFormData] = useState({
    name: 'Naman Sharma',
    phone: '9876543210',
    email: 'naman@example.com',
    pan: 'ABCDE1234F',
  });
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !selectedPlan) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emiPlanId: selectedPlan.id,
          variantId: variant.id,
          customerName: formData.name,
          customerPhone: formData.phone,
          customerEmail: formData.email,
          panNumber: formData.pan,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setOrderResult(data.data);
      setStep('success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setStep('review');
    setErrorMsg('');
    setOrderResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 relative">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-brand-600 flex items-center justify-center text-xs font-bold">
              ↑Fi
            </div>
            <h3 className="font-bold text-base">
              {step === 'success' ? 'Application Approved!' : 'Complete Your 1Fi Plan'}
            </h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'review' && (
            <div className="space-y-5">
              <div className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <img
                  src={variant.images[0]?.url || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569'}
                  alt={variant.name}
                  className="w-16 h-16 object-contain"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{product.name}</h4>
                  <p className="text-xs text-slate-500">
                    {variant.color} • {variant.storage}
                  </p>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {formatINR(variant.price)}
                  </div>
                </div>
              </div>

              {/* Selected Plan Details */}
              <div className="bg-brand-50/50 rounded-xl p-4 border border-brand-200/60 space-y-2.5">
                <div className="text-xs font-bold text-brand-900 uppercase tracking-wide">
                  Selected EMI Scheme
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Monthly Installment:</span>
                  <span className="font-bold text-slate-900 text-base">
                    {formatINR(selectedPlan.monthlyAmount)} / month
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Tenure:</span>
                  <span className="font-semibold text-slate-900">{selectedPlan.tenureMonths} Months</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Interest Rate:</span>
                  <span className="font-semibold text-emerald-700">{selectedPlan.interestRate}%</span>
                </div>
                {selectedPlan.cashbackAmount > 0 && (
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-brand-200/50">
                    <span className="text-slate-600">Guaranteed Cashback:</span>
                    <span className="font-bold text-emerald-700">
                      +{formatINR(selectedPlan.cashbackAmount)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Mutual Fund SIP linkage will be set up automatically.</span>
              </div>

              <button
                onClick={() => setStep('kyc')}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Continue to Instant KYC</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 'kyc' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name (as per PAN)
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  placeholder="Your full name"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    placeholder="9876543210"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    PAN Card
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pan}
                    onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    placeholder="ABCDE1234F"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  placeholder="you@domain.com"
                />
              </div>

              {errorMsg && (
                <div className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                  {errorMsg}
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('review')}
                  className="w-1/3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-xl text-sm"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying & Booking...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-bold text-slate-900">Congratulations, {formData.name}!</h4>
                <p className="text-xs text-slate-500">
                  Your mutual fund backed EMI plan has been approved instantly.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Application Reference:</span>
                  <span className="font-mono font-bold text-slate-800">{orderResult?.id || '1FI-ORD-9281'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Device:</span>
                  <span className="font-semibold text-slate-800">{product.name} ({variant.storage})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Monthly Installment:</span>
                  <span className="font-bold text-brand-700">{formatINR(selectedPlan.monthlyAmount)} / mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cashback Portfolio Credit:</span>
                  <span className="font-bold text-emerald-600">+{formatINR(selectedPlan.cashbackAmount)}</span>
                </div>
              </div>

              <button
                onClick={handleResetAndClose}
                className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3 px-4 rounded-xl text-sm"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
