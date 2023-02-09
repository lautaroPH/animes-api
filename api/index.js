import { supabase } from '../utils/supabase-client.js';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Hono } from 'https://deno.land/x/hono@v2.7.7/mod.ts';
import { getAnimeFilters } from '../utils/get-anime-filters.js';

const app = new Hono();

app.get('/', async (c) => {
  const params = c.req.query();
  const { data, nextPage } = await getAnimeFilters(params, c);

  if (!data || data.length === 0) {
    return c.json({ message: '404 not found' });
  }
  return c.json({
    animes: data,
    nextPage: data && data.length === params.limit ? nextPage : null,
  });
});

app.get('/anime/:id', async (c) => {
  const id = c.req.param('id');
  const params = c.req.query();

  const fields = params.fields || 'id,title,mal_id,main_picture';

  const { data } = await supabase
    .from('animes')
    .select(fields)
    .eq('mal_id', id);

  if (!data || data.length === 0) {
    return c.json({ message: 'Anime not found' });
  }

  return c.json(data);
});

app.put('/anime/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const dataToUpdate = await c.req.json();

    const { data, error } = await supabase
      .from('animes')
      .update(dataToUpdate)
      .eq('mal_id', id)
      .select('*');

    if (error) {
      return c.json({ message: 'Anime not found' });
    }

    return c.json(data[0]);
  } catch (error) {
    console.log(error);
    return c.json({ message: 'Invalid JSON' });
  }
});

serve(app.fetch);
