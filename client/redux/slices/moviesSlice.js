import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMovies } from '../../src/services/movie.api';
const initialState = {
  movies: null,
  loading: false,
  error : null
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
        console.log(action.payload)
        state.movies = action.payload;
        state.loading = false;
      }).addCase(fetchAllMovies.rejected , (state,action)=>{
        state.loading = false ;
        state.error = action.payload
      })
  },
});
export default movieSlice.reducer;
export const { storeMovies } = movieSlice.actions;
