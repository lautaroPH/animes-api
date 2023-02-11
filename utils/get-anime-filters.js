import { animesHeaders } from './animes-headers.js';

export const getAnimeFilters = async (params, access_token) => {
  const fields = params.fields || 'id,title,title_english,mal_id,main_picture';
  const search = params.q || '';
  const limit = Number(params.limit) || 10;
  const offset = Number(params.offset) || 0;
  const ascending = params.ascending === 'false' ? false : true;
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
  const language = params.language || 'ja';
  const nsfw = params.nsfw || 'false';

  const maxLimit = limit > 100 ? 100 : limit;

  let url = `https://mocvdkjomupgrvizemzh.supabase.co/rest/v1/animes?select=${fields}&order=${order}.${
    ascending ? 'asc' : 'desc'
  }`;

  if (mediaType) url += `&media_type=ilike.${mediaType}`;
  if (studio) url += `&studios=cs.{${studio}}`;
  if (source) url += `&source=ilike.source`;
  if (genre) url += `&genres=cs.{${genre}}`;
  if (status) url += `&status=ilike.${status}`;
  if (season) url += `&season=ilike.${season}`;
  if (yearEqual) url += `&year=eq.${yearEqual}`;
  if (yearLess) url += `&year=lt.${yearLess}`;
  if (yearGreater) url += `&year=gt.${yearGreater}`;
  if (search)
    if (language === 'ja') {
      url += `&title=ilike.${search}`;
    } else if (language === 'en') {
      url += `&title_english=ilike.${search}`;
    }

  if (nsfw === 'false') url += `&genres=not.cs.{Hentai}`;

  const range = `${offset}-${maxLimit + offset - 1}`;

  const res = await fetch(url, animesHeaders(access_token, range));

  const data = await res.json();

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
