'use client';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';

type accountDataFeilds =
  | 'businessName'
  | 'businessType'
  | 'businessLocation'
  | 'accountName'
  | 'phone'
  | 'email'
  | 'password'
  | 'numberOfBranches'
  | 'isFirstTime';

interface accountDataInterface {
  businessName: string;
  businessType: string;
  businessLocation: string;
  accountName: string;
  phone: string;
  email: string;
  password: string;
  numberOfBranches: number;
  isFirstTime: boolean;
}

export default function Signup() {
  const [accountData, setAccountData] = useState<accountDataInterface>({
    businessName: '',
    businessType: '',
    businessLocation: '',
    accountName: '',
    phone: '',
    email: '',
    password: '',
    numberOfBranches: 0,
    isFirstTime: false,
  });
  const [step, setStep] = useState<number>(1);

  const handleChange = (
    field: accountDataFeilds,
    value: string | number | boolean
  ) => {
    setAccountData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form className="space-y-[25px]">
      <h1 className="text-[25px] font-semibold">Let&apos;s get started</h1>
      <p>
        Already have a Zood account ?{' '}
        <Link href="/login" className="text-primary font-semibold">
          Login
        </Link>
      </p>
      {step === 1 && (
        <>
          <Input
            Label="Business name"
            animateLabel
            value={accountData.businessName}
            onChange={(e) => handleChange('businessName', e.target.value)}
          />
          <Input
            Label="Business type"
            animateLabel
            value={accountData.businessType}
            onChange={(e) => handleChange('businessType', e.target.value)}
          />
          <Input
            Label="Business location"
            animateLabel
            value={accountData.businessLocation}
            onChange={(e) => handleChange('businessLocation', e.target.value)}
          />
        </>
      )}
      {step === 2 && (
        <>
          <Input
            Label="Account name"
            animateLabel
            value={accountData.accountName}
            onChange={(e) => handleChange('accountName', e.target.value)}
          />
          <Input
            Label="Phone"
            type="phone"
            animateLabel
            value={accountData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
          <Input
            Label="Email"
            animateLabel
            value={accountData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          <Input
            Label="Password"
            type="password"
            animateLabel
            value={accountData.password}
            onChange={(e) => handleChange('password', e.target.value)}
          />
        </>
      )}
      {step === 3 && (
        <>
          <Input
            Label="Number of branches"
            animateLabel
            type="number"
            value={String(accountData.numberOfBranches)}
            onChange={(e) => handleChange('numberOfBranches', +e.target.value)}
          />
          <Input
            Label="Have you used POS system before ?"
            animateLabel
            value={String(accountData.isFirstTime)}
            onChange={(e) => handleChange('isFirstTime', e.target.value)}
          />
        </>
      )}
      <div
        className={cn(
          'flex pt-5',
          `${step !== 1 ? 'justify-between' : 'justify-end'}`
        )}
      >
        {step !== 1 && (
          <button
            onClick={() => setStep((prev) => prev - 1)}
            type="button"
            className="cursor-pointer text-primary bg-[#F2F2F2] rounded-full px-4 py-[6px] text-base text-center min-w-[100px] disabled:cursor-not-allowed disabled:bg-[#F2F2F2]/50 disabled:text-primary/50"
          >
            Previous
          </button>
        )}
        {step === 3 ? (
          <button
            key={1}
            type="submit"
            className="cursor-pointer text-[#F2F2F2] bg-primary rounded-full px-4 py-[6px] text-base text-center min-w-[100px] disabled:cursor-not-allowed disabled:bg-primary/50 disabled:text-[#F2F2F2]/50"
          >
            Sign Up
          </button>
        ) : (
          <button
            key={2}
            onClick={() => setStep((prev) => prev + 1)}
            type="button"
            className="cursor-pointer text-[#F2F2F2] bg-primary rounded-full px-4 py-[6px] text-base text-center min-w-[100px] disabled:cursor-not-allowed disabled:bg-primary/50"
          >
            Next
          </button>
        )}
      </div>
    </form>
  );
}
