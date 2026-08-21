import authReducer from './slices/authSlice' ;

import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
    reducer : {
        auth : authReducer
    }
})

export default store ;

// {auth : {id :"" , name : "" , isAuthenticted}}