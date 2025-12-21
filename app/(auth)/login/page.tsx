'use client';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useState } from 'react';

export default function Login() {
  const [businessReference, setBusinessReference] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form className="space-y-[25px]">
      <h1 className="text-[25px] font-semibold">Sign in</h1>
      <p>
        New to Zood ?{' '}
        <Link href="/signup" className="text-primary font-semibold">
          Sign Up
        </Link>
      </p>
      <Input
        Label="Business reference"
        animateLabel
        value={businessReference}
        onChange={(e) => setBusinessReference(e.target.value)}
      />
      <Input
        Label="Email"
        animateLabel
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        Label="Password"
        type="password"
        animateLabel
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex justify-end pt-5">
        <button
          type="submit"
          className="cursor-pointer text-white bg-primary rounded-full px-4 py-[6px] text-base text-center min-w-[100px] disabled:cursor-not-allowed disabled:bg-primary/50"
        >
          Login
        </button>
      </div>
    </form>
  );
}
