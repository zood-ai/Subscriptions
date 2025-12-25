'use client';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { LoginAction } from '@/actions/AuthActions';

export default function Form() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, action, loading] = useActionState(LoginAction, {});

  return (
    <form action={action} className="space-y-[25px]">
      <Input
        Label="Email"
        name="email"
        animateLabel
        type="email"
        error={state?.errors?.email}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        Label="Password"
        name="password"
        type="password"
        error={state?.errors?.password}
        animateLabel
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex justify-end pt-5">
        <Button loading={loading} type="submit" variant="primary">
          {loading ? 'Loading...' : 'Login'}
        </Button>
      </div>
    </form>
  );
}
