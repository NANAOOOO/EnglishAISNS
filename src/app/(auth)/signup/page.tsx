'use client';
import { supabaseClient } from '@/lib/supabase-client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { getBaseUrl } from '@/lib/base-url'; 

export default function Signup() {
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Sign up</h1>
      <Auth
        supabaseClient={supabaseClient}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
        view="sign_up"
        redirectTo={`${getBaseUrl()}/callback`}
        magicLink
      />
    </div>
  );
}
