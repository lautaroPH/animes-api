export const animeHeaders = (access_token) => {
  return {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
      apikey: Deno.env.get('SUPABASE_KEY'),
      'Content-Type': 'application/json',
    },
  };
};
