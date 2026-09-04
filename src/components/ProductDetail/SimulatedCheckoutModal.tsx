'use client';

import { useState } from 'react';
import { Product, ProductVariant, EmiPlan } from '@/types';
import { formatINR } from '@/lib/utils';
import { X, CheckCircle2, ShieldCheck, ArrowRight, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface SimulatedCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  variant: ProductVariant;
  selectedPlan: EmiPlan | null;
}

export default function SimulatedCheckoutModal({
  isOpen,
  onClose,
  product,
  variant,
  selectedPlan,
}: SimulatedCheckoutModalProps) {
  const [step, setStep] = useState<'review' | 'details' | 'confirmed'>('review');
  const [formData, setFormData] = useState({
    name: 'Naman Sharma',
    phone: '9876543210',
    email: 'naman@example.com',
    pan: 'ABCDE1234F',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  if (!isOpen || !selectedPlan) return null;

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId: variant.id,
          emiPlanId: selectedPlan.id,
          customerName: formData.name.trim(),
          customerPhone: formData.phone.trim(),
          customerEmail: formData.email.trim(),
          panNumber: formData.pan?.trim() ? formData.pan.trim().toUpperCase() : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit simulated application.');
      }

      setConfirmedOrder(data.data);
      setStep('confirmed');
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('review');
    setErrorMessage('');
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 relative">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-xs font-black">
              ↑Fi
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                {step === 'confirmed' ? 'Application Confirmed' : 'Proceed with Selected Plan'}
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">
                Simulated 1Fi Mutual Fund EMI Checkout
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {step === 'review' && (
            <div className="space-y-5">
              {/* Product Summary */}
              <div className="flex gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 items-center">
                <div className="w-16 h-16 shrink-0 bg-white rounded-lg p-1 border border-slate-200 flex items-center justify-center">
                  <img
                    src={variant.images?.[0]?.url || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569'}
                    alt={variant.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{product.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>{variant.storage}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block border border-slate-300"
                        style={{ backgroundColor: variant.colorHex }}
                      />
                      {variant.color}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {formatINR(variant.price)}
                  </div>
                </div>
              </div>

              {/* Selected Plan Details matching reference */}
              <div className="bg-brand-50/60 rounded-xl p-4 border border-brand-200/70 space-y-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Monthly Installment:</span>
                  <span className="font-bold text-slate-900 text-base">
                    {formatINR(selectedPlan.monthlyAmount)} × {selectedPlan.tenureMonths} mos
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Interest Rate:</span>
                  <span className="font-semibold text-emerald-700">
                    {selectedPlan.interestRate}% interest
                  </span>
                </div>
                {selectedPlan.cashbackAmount > 0 && (
                  <div className="flex items-center justify-between pt-2 border-t border-brand-200/50">
                    <span className="text-slate-600">Guaranteed MF Cashback:</span>
                    <span className="font-bold text-emerald-700">
                      +{formatINR(selectedPlan.cashbackAmount)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  This is a <strong>secure digital application</strong>. Submitting will register your plan request directly into the system with instant approval status.
                </span>
              </div>

              <button
                type="button"
                onClick={() => setStep('details')}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-brand-500/20 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <span>Continue to Customer Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 'details' && (
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div className="text-xs text-slate-500 font-medium">
                Please enter applicant details to submit your simulated application:
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all bg-slate-50 focus:bg-white placeholder:text-slate-400"
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all bg-slate-50 focus:bg-white placeholder:text-slate-400"
                    placeholder="9876543210"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    PAN Card (Optional)
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={formData.pan}
                    onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all bg-slate-50 focus:bg-white placeholder:text-slate-400"
                    placeholder="ABCDE1234F"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all bg-slate-50 focus:bg-white placeholder:text-slate-400"
                  placeholder="john@example.com"
                />
              </div>

              {errorMessage && (
                <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('review')}
                  className="w-1/3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-xl text-sm transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Order...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Submit</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 'confirmed' && (
            <div className="text-center py-3 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-bold text-slate-900">Application Confirmed!</h4>
                <p className="text-xs text-slate-500">
                  Your simulated mutual fund EMI order has been created in the database.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Order ID:</span>
                  <span className="font-mono font-bold text-slate-900">{confirmedOrder?.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Device:</span>
                  <span className="font-semibold text-slate-900">{confirmedOrder?.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Monthly EMI:</span>
                  <span className="font-bold text-brand-700">
                    {formatINR(confirmedOrder?.monthlyAmount)} × {confirmedOrder?.tenureMonths} months
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Applicant:</span>
                  <span className="font-medium text-slate-900">{confirmedOrder?.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {confirmedOrder?.status || 'CONFIRMED'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-colors"
              >
                Close Window
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
