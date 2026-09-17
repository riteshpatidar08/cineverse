import api from '../lib/api';

export const fetchMovies = (params = {}) => {
  return api.get('/movies', { params });
};

export const fetchMovieById = (id) => {
  return api.get(`/movies/${id}`);
};


export const nowPlayingMovies = (data) => {
  return api.get(`movies/now-playing`, data);
};

export const nearBy = (data) => {
  const { latitude, longitude } = data;
  return api.get(`movies/nearby?lat=${latitude}&lon=${longitude}`, data);
};

export const getMovieById = (id) => {
  return api.get(`movies/${id}`);
};

export const getShowByMovieId = (data) => {
  const {latitude , longitude , id} = data
  return api.get(`movies/${id}/shows?lat=${latitude}&lon=${longitude}`);
};
