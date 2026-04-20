/**
 * API Endpoints - Movies API (localhost:5000/api)
 */
export const API_ENDPOINTS = {
  // Movie endpoints
  MOVIES: '/movies',
  MOVIE_BY_ID: (id: string | number) => `/movies/${id}`,
  MOVIES_SEARCH: '/movies/search',
  MOVIES_BY_GENRE: (genre: string) => `/movies/genre/${genre}`
};
