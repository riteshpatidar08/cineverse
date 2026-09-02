import authReducer from './slices/authSlice' ;

import { configureStore } from '@reduxjs/toolkit';
import MovieReducer from './slices/moviesSlice'
const store = configureStore({
    reducer : {
        auth : authReducer,
        movies : MovieReducer
    }
})

export default store ;

// {auth : {id :"" , name : "" , isAuthenticted}}