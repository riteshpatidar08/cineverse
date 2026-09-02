import api from '../lib/api' ;


export const login = ( data) => api.post("/auth/login" , data) ;
export const register =  (data) => api.post('/auth/register' , data) ;
export const verifyOtp = (data) => api.post('/auth/verify-otp', data) ;
export const enable2fa = (data) => api.post('/auth/2fa/enable' , data);
export const disable2fa = (data) => api.post('/auth/2fa/disable' , data);
export const resendOtp = (data) => api.post('/auth/resend-otp' , data);
export const verify = () => api.post('/auth/verify');

//movies
export const fetchMovies = () => api.get('/movies')