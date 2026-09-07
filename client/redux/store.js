import authReducer from './slices/authSlice' ;

import { configureStore } from '@reduxjs/toolkit';
import MovieReducer from './slices/moviesSlice'
import LocationReducer from './slices/locationSlice'
const store = configureStore({
    reducer : {
        auth : authReducer,
        movies : MovieReducer,
        location : LocationReducer
    }
})

export default store ;

// {auth : {id :"" , name : "" , isAuthenticted}}