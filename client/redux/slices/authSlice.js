import {createSlice} from '@reduxjs/toolkit' ;


const initialState = {
name : '' ,
id : '' ,
email : "",
role : "" ,
isAuthenticated : null
}

//NOTE configure the slice
const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers : {
        authenticated : (state,action)=>{
            // state.id =
            console.log(action)
            console.log(state)
        }
    }
})

export default authSlice.reducer ;
export const {authenticated} = authSlice.actions