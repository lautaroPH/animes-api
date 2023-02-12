import { loginHeaders } from './login-headers.js';

export const getAccessToken = async () => {
  const res = await fetch(
    'https://mocvdkjomupgrvizemzh.supabase.co/auth/v1/token?grant_type=password',
    loginHeaders,
  );
  const { access_token } = await res.json();

  return access_token;
};
