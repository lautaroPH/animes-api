import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Hono } from 'https://deno.land/x/hono@v2.7.7/mod.ts';
import { getAnimeFilters } from '../utils/get-anime-filters.js';
import { loginHeaders } from '../utils/login-headers.js';
import { animeHeaders } from '../utils/anime-headers.js';

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

  const res = await fetch(
    'https://mocvdkjomupgrvizemzh.supabase.co/auth/v1/token?grant_type=password',
    loginHeaders,
  );
  const { access_token } = await res.json();

  const limit = Number(params.limit) || 10;
  const maxLimit = limit > 100 ? 100 : limit;

  const { data, nextPage } = await getAnimeFilters(params, access_token);

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

  const resLogin = await fetch(
    'https://mocvdkjomupgrvizemzh.supabase.co/auth/v1/token?grant_type=password',
    loginHeaders,
  );
  const { access_token } = await resLogin.json();

  const res = await fetch(
    `https://mocvdkjomupgrvizemzh.supabase.co/rest/v1/animes?mal_id=eq.${id}&select=*`,
    animeHeaders(access_token),
  );
  const data = await res.json();

  if (!data || data.length === 0) {
    return c.json({ message: 'Anime not found' });
  }

  return c.json(data);
});

app.get('/:search', async (c) => {
  const language = c.req.query('language');
  const search = c.req.param('search');

  const resLogin = await fetch(
    'https://mocvdkjomupgrvizemzh.supabase.co/auth/v1/token?grant_type=password',
    loginHeaders,
  );
  const { access_token } = await resLogin.json();

  const searchUrl = language === 'en' ? 'title_english' : 'title';

  const res = await fetch(
    `https://mocvdkjomupgrvizemzh.supabase.co/rest/v1/animes?${searchUrl}=ilike.${search}&select=*`,
    animeHeaders(access_token),
  );

  const data = await res.json();

  if (!data || data.length === 0) {
    return c.json({ message: '404 not found' });
  }

  return c.json({
    animes: data,
  });
});

serve(app.fetch);
