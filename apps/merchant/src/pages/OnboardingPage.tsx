import React, { useState } from 'react';
import { SellerNavbar } from '../components/layout/SellerNavbar.js';
import { OnboardingSidebar, OnboardingMainStep } from '../components/onboarding/OnboardingSidebar.js';
import { Step1MobileEmail } from '../components/onboarding/Step1MobileEmail.js';
import { Step2IdVerification } from '../components/onboarding/Step2IdVerification.js';
import { Step2Signature } from '../components/onboarding/Step2Signature.js';
import { Step3StoreDetails } from '../components/onboarding/Step3StoreDetails.js';
import { Step3BusinessInfo } from '../components/onboarding/Step3BusinessInfo.js';
import { Step4BankAccount } from '../components/onboarding/Step4BankAccount.js';
import { ReviewWaitingRoom } from '../components/onboarding/ReviewWaitingRoom.js';
import { useOnboardingStore } from '../stores/onboardingStore.js';
import { branding } from '../lib/branding.js';

interface OnboardingPageProps {
  onEnterDashboard: () => void;
  onGoToLogin: () => void;
  onGoToHome?: () => void;
}

export type SubStepKey = '1_account' | '2_id' | '2_signature' | '3_store' | '3_business' | '4_bank';

export const OnboardingPage: React.FC<OnboardingPageProps> = ({
  onEnterDashboard,
  onGoToLogin,
  onGoToHome,
}) => {
  const { isUnderReview, setIsUnderReview } = useOnboardingStore();
  const [subStep, setSubStep] = useState<SubStepKey>('1_account');

  // Derive active main step (1, 2, 3, 4) for the sidebar indicator
  const getActiveMainStep = (): OnboardingMainStep => {
    if (subStep.startsWith('1_')) return 1;
    if (subStep.startsWith('2_')) return 2;
    if (subStep.startsWith('3_')) return 3;
    return 4;
  };

  const activeMainStep = getActiveMainStep();

  if (isUnderReview) {
    return (
      <div className="min-h-screen bg-[#f3f6fc] flex flex-col justify-between font-sans selection:bg-[#0038ed] selection:text-white">
        <SellerNavbar
          onGoToLogin={onGoToLogin}
          onGoToSignup={() => {
            setIsUnderReview(false);
            setSubStep('1_account');
          }}
          onGoToHome={onGoToHome}
        />
        <div className="flex-1 py-10 px-4 sm:px-6 flex items-center justify-center">
          <ReviewWaitingRoom
            onEnterDashboard={onEnterDashboard}
            onEditDraft={() => {
              setIsUnderReview(false);
              setSubStep('4_bank');
            }}
          />
        </div>
        <footer className="py-6 border-t border-slate-200 text-center text-xs text-slate-500 bg-white">
          &copy; {new Date().getFullYear()} {branding.appName}. Hyperlocal Retail Commerce Infrastructure.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f6fc] flex flex-col justify-between font-sans selection:bg-[#0038ed] selection:text-white">
      {/* Top Seller Navigation Bar */}
      <SellerNavbar
        onGoToLogin={onGoToLogin}
        onGoToSignup={() => setSubStep('1_account')}
        onGoToHome={onGoToHome}
      />

      {/* Main Split-Screen Onboarding Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Progress Sidebar & Trust Badges (Screen 3.png left) */}
          <div className="lg:col-span-5">
            <OnboardingSidebar
              activeMainStep={activeMainStep}
              onSelectStep={(step) => {
                if (step === 1) setSubStep('1_account');
                if (step === 2) setSubStep('2_id');
                if (step === 3) setSubStep('3_store');
                if (step === 4) setSubStep('4_bank');
              }}
            />
          </div>

          {/* Right Column: Step Form Content */}
          <div className="lg:col-span-7">
            {subStep === '1_account' && (
              <Step1MobileEmail
                onContinue={() => setSubStep('2_id')}
                onGoToLogin={onGoToLogin}
              />
            )}

            {subStep === '2_id' && (
              <Step2IdVerification onContinue={() => setSubStep('2_signature')} />
            )}

            {subStep === '2_signature' && (
              <Step2Signature
                onContinue={() => setSubStep('3_store')}
                onBack={() => setSubStep('2_id')}
              />
            )}

            {subStep === '3_store' && (
              <Step3StoreDetails
                onContinue={() => setSubStep('3_business')}
                onBack={() => setSubStep('2_signature')}
              />
            )}

            {subStep === '3_business' && (
              <Step3BusinessInfo
                onContinue={() => setSubStep('4_bank')}
                onBack={() => setSubStep('3_store')}
              />
            )}

            {subStep === '4_bank' && (
              <Step4BankAccount
                onBack={() => setSubStep('3_business')}
                onComplete={() => {}}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 text-center text-xs text-slate-500 bg-white">
        &copy; {new Date().getFullYear()} {branding.appName}. Hyperlocal Retail Commerce Infrastructure.
      </footer>
    </div>
  );
};
