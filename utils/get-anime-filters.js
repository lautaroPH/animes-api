import { supabase } from './supabase-client.js';

export const getAnimeFilters = async (params) => {
  const fields = params.fields || 'id,title,title_english,mal_id,main_picture';
  const search = params.q || '';
  const limit = Number(params.limit) || 10;
  const offset = Number(params.offset) || 0;
  const ascending = params.sort === 'false' ? false : true;
  const order = params.order || 'rank';
  const mediaType = params.media_type || '';
  const studio = params.studio || '';
  const source = params.source || '';
  const genre = params.genre || '';
  const status = params.status || '';
  const season = params.season || '';
  const yearEqual = params.year_equal || '';
  const yearLess = params.year_less || '';
  const yearGreater = params.year_greater || '';
  const nsfw = params.nsfw || 'false';

  const maxLimit = limit > 100 ? 100 : limit;

  let query = supabase
    .from('animes')
    .select(fields)
    .range(offset, maxLimit + offset - 1)
    .order(order, { ascending });

  if (mediaType) query = query.eq('media_type', mediaType);
  if (studio) query = query.contains('studios', [studio]);
  if (source) query = query.eq('source', source);
  if (genre) query = query.contains('genres', [genre]);
  if (status) query = query.eq('status', status);
  if (season) query = query.eq('season', season);
  if (yearEqual) query = query.eq('year', yearEqual);
  if (yearLess) query = query.lt('year', yearLess);
  if (yearGreater) query = query.gt('year', yearGreater);
  if (search)
    query = query.or(
      `title.ilike.${search}%,title_english.ilike.${search}%,title_japanese.ilike.${search}%`,
    );
  if (nsfw === 'false') query = query.not('genres', 'cs', '{[Hentai]}');

  const { data, error } = await query;

  if (error) {
    console.log(error);
  }

  const searchUrl = search ? `q=${search}` : '';
  const fieldsUrl = fields ? `fields=${fields}` : '';
  const limitUrl = maxLimit ? `&limit=${maxLimit}` : '';
  const offsetUrl = `&offset=${maxLimit + offset}`;
  const orderUrl = order ? `&order=${order}` : '';
  const ascendingUrl = ascending ? `&ascending=${ascending}` : '';
  const mediaTypeUrl = mediaType ? `&media_type=${mediaType}` : '';
  const studioUrl = studio ? `&studio=${studio}` : '';
  const sourceUrl = source ? `&source=${source}` : '';
  const genreUrl = genre ? `&genre=${genre}` : '';
  const statusUrl = status ? `&status=${status}` : '';
  const seasonUrl = season ? `&season=${season}` : '';
  const yearEqualUrl = yearEqual ? `&year_equal=${yearEqual}` : '';
  const yearLessUrl = yearLess ? `&year_less=${yearLess}` : '';
  const yearGreaterUrl = yearGreater ? `&year_greater=${yearGreater}` : '';

  const nextPage = `https://animes5.p.rapidapi.com/?${searchUrl}${fieldsUrl}${limitUrl}${offsetUrl}${orderUrl}${ascendingUrl}${mediaTypeUrl}${studioUrl}${sourceUrl}${genreUrl}${statusUrl}${seasonUrl}${yearEqualUrl}${yearLessUrl}${yearGreaterUrl}`;

  return { data, nextPage };
};
