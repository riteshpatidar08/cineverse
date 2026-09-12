import {createSlice} from '@reduxjs/toolkit' ;
import Cookies from 'js-cookie'

const initialState = {
currentCity : null,
currentState : null,
latitude : null ,
longitude : null
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
        state.latitude =  action.payload.latitude 
        state.longitude = action.payload.longitude
      }
    }
})

export default LocationSlice.reducer ;
export const {getCityAndState} = LocationSlice.actions