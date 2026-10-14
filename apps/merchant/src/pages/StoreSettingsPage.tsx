import React, { useState } from 'react';
import { Card } from '../components/ui/Card.js';
import { Input } from '../components/ui/Input.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';
import { Store, ShieldCheck, MapPin, Landmark, Clock, Save, CheckCircle } from 'lucide-react';
import { useOnboardingStore } from '../stores/onboardingStore.js';

export const StoreSettingsPage: React.FC = () => {
  const { draft } = useOnboardingStore();
  const [saved, setSaved] = useState(false);

  const storeName = draft.step4?.storeDisplayName || 'Royal Footwear & Accessories';
  const category = draft.step5?.primaryCategory || 'Fashion & Footwear';
  const gstin = draft.step2?.gstin || '29ABCDE1234F1Z5';
  const pan = draft.step2?.pan || 'ABCDE1234F';
  const legalName = draft.step2?.legalBusinessName || 'Royal Retail Enterprises Pvt Ltd';
  const address = draft.step4?.address?.street || 'Shop 14, Commercial Street, Tasker Town, Bengaluru';
  const deliveryRadius = draft.step4?.deliveryRadiusKm || 4;
  const accountNumber = draft.step6?.accountNumber ? `•••• •••• ${draft.step6.accountNumber.slice(-4)}` : '•••• •••• 8912';
  const bankName = draft.step6?.bankName || 'HDFC Bank Ltd';
  const ifsc = draft.step6?.ifscCode || 'HDFC0001234';

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100">Store Profile & Configuration</h2>
        <p className="text-xs text-slate-400">View and adjust your storefront metadata, delivery zone, and tax profiles</p>
      </div>

      {/* Store Identity */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-brand-400" />
            <h3 className="text-sm font-bold text-slate-100">Storefront Information</h3>
          </div>
          <Badge variant="success" size="sm">Store Active & Discoverable</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Store Display Name" defaultValue={storeName} />
          <Input label="Primary Vertical" defaultValue={category} />
        </div>

        <Input
          label="Physical Street Address"
          defaultValue={address}
          leftIcon={<MapPin className="w-4 h-4" />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Hyperlocal Radius (km)" type="number" defaultValue={deliveryRadius} />
          <Input label="Pincode Service Area" defaultValue="560001" />
        </div>
      </Card>

      {/* Legal & GST Details */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100">Tax & Compliance Record</h3>
          </div>
          <Badge variant="success" size="sm">Verified Under GST</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="GSTIN" defaultValue={gstin} disabled />
          <Input label="PAN" defaultValue={pan} disabled />
          <Input label="Legal Business Name" defaultValue={legalName} disabled />
        </div>
      </Card>

      {/* Bank Account */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold text-slate-100">Settlement Account</h3>
          </div>
          <Badge variant="info" size="sm">Active for Daily Payouts</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="Bank Name" defaultValue={bankName} disabled />
          <Input label="Account Number" defaultValue={accountNumber} disabled />
          <Input label="IFSC Code" defaultValue={ifsc} disabled />
        </div>
      </Card>

      <div className="flex items-center justify-between pt-2">
        {saved ? (
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>Store profile updated successfully!</span>
          </div>
        ) : <div />}
        <Button
          onClick={() => {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
          }}
        >
          <Save className="w-4 h-4 mr-2" />
          <span>Save Changes</span>
        </Button>
      </div>
    </div>
  );
};
