import api from '../lib/api';

export const fetchMovies = (params = {}) => {
  return api.get('/movies', { params });
};

export const fetchMovieById = (id) => {
  return api.get(`/movies/${id}`);
};
