import axios from 'axios'

const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
  },
  params: { language: 'es-ES' },
})

// ── Trending ──────────────────────────────────────────
export const getTrending = (type = 'all', window = 'day') =>
  tmdbApi.get(`/trending/${type}/${window}`)

// ── Movies ────────────────────────────────────────────
export const getPopularMovies  = (page = 1) => tmdbApi.get('/movie/popular',     { params: { page } })
export const getMovieById      = (id)       => tmdbApi.get(`/movie/${id}`)
export const getMovieCredits   = (id)       => tmdbApi.get(`/movie/${id}/credits`)
export const getSimilarMovies  = (id)       => tmdbApi.get(`/movie/${id}/similar`)
export const getRecommendedMovies = (id)    => tmdbApi.get(`/movie/${id}/recommendations`)

// ── TV Shows ──────────────────────────────────────────
export const getPopularTvShows    = (page = 1) => tmdbApi.get('/tv/popular',          { params: { page } })
export const getTvShowById        = (id)       => tmdbApi.get(`/tv/${id}`)
export const getTvCredits         = (id)       => tmdbApi.get(`/tv/${id}/credits`)
export const getSimilarTvShows    = (id)       => tmdbApi.get(`/tv/${id}/similar`)
export const getRecommendedTvShows = (id)      => tmdbApi.get(`/tv/${id}/recommendations`)

// ── People ────────────────────────────────────────────
export const getPopularPeople  = (page = 1) => tmdbApi.get('/person/popular',     { params: { page } })
export const getPersonById     = (id)       => tmdbApi.get(`/person/${id}`)
export const getPersonCredits  = (id)       => tmdbApi.get(`/person/${id}/combined_credits`)

// ── Search ────────────────────────────────────────────
export const searchContent = (type, query, page = 1) =>
  tmdbApi.get(`/search/${type}`, { params: { query, page } })

export default tmdbApi