import {createSlice} from '@reduxjs/toolkit' ;
import Cookies from 'js-cookie'

const initialState = {
currentCity : null,
currentState : null
}

//NOTE configure the slice
const LocationSlice = createSlice({
    name : "auth",
    initialState,
    reducers : {
      getCityAndState : (state,action)=>{
        console.log(action.payload)
        state.currentCity = action.payload.city 
        state.currentState = action.payload.state
      }
    }
})

export default LocationSlice.reducer ;
export const {getCityAndState} = LocationSlice.actions