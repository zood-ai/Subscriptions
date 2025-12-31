'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useCustomMutation from '@/lib/Mutation';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface LoginResponse {
  token: string;
}
interface LoginBody {
  email: string;
  password: string;
}

export default function Form() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { mutate, isPending, error } = useCustomMutation<
    LoginBody,
    LoginResponse
  >({
    api: 'v1/super-admin/login',
    method: 'POST',
    options: {
      onSuccess: (data) => {
        Cookies.set('token', data.token);
        router.push('/dashboard');
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-[25px]">
      <Input
        Label="Email"
        name="email"
        animateLabel
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        Label="Password"
        name="password"
        type="password"
        animateLabel
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <div className="text-red-500 text-sm">{error.message}</div>}
      <div className="flex justify-end pt-5">
        <Button loading={isPending} type="submit" variant="primary">
          {isPending ? 'Loading...' : 'Login'}
        </Button>
      </div>
    </form>
  );
}
