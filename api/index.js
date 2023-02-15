import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Hono } from 'https://deno.land/x/hono@v2.7.7/mod.ts';
import { getAnimeFilters } from '../utils/get-anime-filters.js';
import { supabase } from '../utils/supabase-client.js';

const app = new Hono();

app.use('*', async (c, next) => {
  const rapidapiSecret = c.req.headers.get('X-RapidAPI-Proxy-Secret');

  if (rapidapiSecret !== Deno.env.get('RAPIDAPI_SECRET')) {
    return c.json({ message: 'Forbidden' });
  }

  await next();
});

app.get('/', async (c) => {
  const params = c.req.query();

  const limit = Number(params.limit) || 10;
  const maxLimit = limit > 100 ? 100 : limit;

  const { data, nextPage } = await getAnimeFilters(params);

  if (!data || data.length === 0) {
    return c.json({ message: '404 not found' });
  }

  return c.json({
    animes: data,
    nextPage: data && data.length === maxLimit ? nextPage : null,
  });
});

app.get('/anime/:id', async (c) => {
  const id = c.req.param('id');
  const params = c.req.query();

  const fields = params.fields || 'id,title,title_english,mal_id,main_picture';

  const { data, error } = await supabase
    .from('animes')
    .select(fields)
    .eq('mal_id', id);

  if (!data || data.length === 0 || error) {
    return c.json({ message: 'Anime not found' });
  }

  return c.json({
    anime: data[0],
  });
});

app.get('/search/:search', async (c) => {
  const params = c.req.query();
  const search = c.req.param('search');
  const fields = params.fields || 'id,title,title_english,mal_id,main_picture';

  const { data, error } = await supabase
    .from('animes')
    .select(fields)
    .or(
      `title.ilike.${search},title_english.ilike.${search},title_japanese.ilike.${search}%`,
    );

  if (!data || data.length === 0 || error) {
    return c.json({ message: '404 not found' });
  }

  return c.json({
    anime: data[0],
  });
});

serve(app.fetch);
