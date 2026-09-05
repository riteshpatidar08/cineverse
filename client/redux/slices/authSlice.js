import {createSlice} from '@reduxjs/toolkit' ;
import Cookies from 'js-cookie'

const initialState = {
name : '' ,
id : '' ,
email : "",
role : "" ,
isAuthenticated :  Cookies.get('isAuthenticated') || null
}

//NOTE configure the slice
const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers : {
        authenticated : (state,action)=>{
            // state.id =
            console.log(action.payload)
            state.id =  action.payload.id 
            state.email = action.payload.email
            state.name= action.payload.name 
            state.isAuthenticated = action.payload.isAuthenticated
            state.role = action.payload.role
            Cookies.set('id' , action.payload.id)
            Cookies.set('email' , action.payload.email)
            Cookies.set('role' , action.payload.role)
            Cookies.set('isAuthenticated' , action.payload.isAuthenticated)
            console.log(state)
        }
    }
})

export default authSlice.reducer ;
export const {authenticated} = authSlice.actions