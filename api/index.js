import { supabase } from '../utils/supabase-client.js';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Hono } from 'https://deno.land/x/hono@v2.7.7/mod.ts';
import { getAnimeFilters } from '../utils/get-anime-filters.js';

const app = new Hono();
app.get('/', async (c) => {
  const params = c.req.query();
  const rapidapiSecret = c.req.headers.get('X-RapidAPI-Proxy-Secret');

  if (rapidapiSecret !== Deno.env.get('RAPIDAPI_SECRET')) {
    return c.json({ message: 'Forbidden' });
  }

  const limit = Number(params.limit) || 10;

  const { data, nextPage } = await getAnimeFilters(params, c);

  if (!data || data.length === 0) {
    return c.json({ message: '404 not found' });
  }

  return c.json({
    animes: data,
    nextPage: data && data.length === limit ? nextPage : null,
  });
});

app.get('/anime/:id', async (c) => {
  const id = c.req.param('id');
  const rapidapiSecret = c.req.headers.get('X-RapidAPI-Proxy-Secret');

  if (rapidapiSecret !== Deno.env.get('RAPIDAPI_SECRET')) {
    return c.json({ message: 'Forbidden' });
  }

  const { data } = await supabase.from('animes').select('*').eq('mal_id', id);

  if (!data || data.length === 0) {
    return c.json({ message: 'Anime not found' });
  }

  return c.json(data);
});

serve(app.fetch);
