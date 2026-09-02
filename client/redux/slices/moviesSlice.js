import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    movies  : null
}

const movieSlice = createSlice({
    name : "movies",
    initialState ,
    reducers : {

        storeMovies : (state,action) => {
         console.log(action.payload)
         state.movies = action.payload
        }
    }
})
export default movieSlice.reducer ;
export const {storeMovies} = movieSlice.actions;