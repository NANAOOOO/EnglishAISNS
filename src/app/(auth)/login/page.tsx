'use client';
import { supabaseClient } from '@/lib/supabase-client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function Login() {
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Log in</h1>
      <Auth
        supabaseClient={supabaseClient}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
        view="sign_in"
        redirectTo={`${getBaseUrl()}/callback`}
        magicLink
      />
    </div>
  );
}
