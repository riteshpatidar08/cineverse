import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchMovies,
  getMovieById,
  nearBy,
  nowPlayingMovies,
} from '../../src/services/movie.api';
const initialState = {
  movies: null,
  loading: false,
  error: null,
  moviesByCity: null,
  singleMovie : null
};

export const fetchAllMovies = createAsyncThunk(
  '/fetchmovies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchMovies();
      const apiData = response.data?.data || response.data || [];
      if (Array.isArray(apiData) && apiData.length > 0) {
        return apiData;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const nowPlaying = createAsyncThunk(
  'movies/now-playing',
  async (data, { rejectWithValue }) => {
    try {
      const response = await nowPlayingMovies(data);
      const apiData = response.data?.data || response.data || [];
      if (Array.isArray(apiData) && apiData.length > 0) {
        return apiData;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const nearByMovies = createAsyncThunk(
  'movies/near-by',
  async (data, { rejectWithValue }) => {
    try {
      const response = await nearBy(data);
      const apiData = response.data?.data || response.data || [];
      if (Array.isArray(apiData) && apiData.length > 0) {
        return apiData;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchMovieById = createAsyncThunk(
  'movies/singleMovie',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getMovieById(id);
      const apiData = response.data?.data || response.data 
   
        return apiData;

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// /fetchmovies/pending => hanlde this case
// /fetchmovies/fulfilled => hanlde the data
// /fetchmovies/rejected => handle the error

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllMovies.fulfilled, (state, action) => {
        console.log(action.payload);
        state.movies = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(nearByMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(nearByMovies.fulfilled, (state, action) => {
        console.log(action.payload);
        state.moviesByCity = action.payload;
        state.loading = false;
      })
      .addCase(nearByMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMovieById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        console.log(action.payload);
        state.singleMovie = action.payload;
        state.loading = false;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default movieSlice.reducer;
export const { storeMovies } = movieSlice.actions;
