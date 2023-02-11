export const loginHeaders = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    apikey: Deno.env.get('SUPABASE_KEY'),
  },
  body: JSON.stringify({
    email: Deno.env.get('SUPABASE_EMAIL'),
    password: Deno.env.get('SUPABASE_PASSWORD'),
  }),
};
