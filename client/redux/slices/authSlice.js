import {createSlice} from '@reduxjs/toolkit' ;
import Cookies from 'js-cookie'

const initialState = {
  name: Cookies.get('name') || '',
  id: Cookies.get('id') || '',
  email: Cookies.get('email') || '',
  role: Cookies.get('role') || '',
  isAuthenticated: Cookies.get('isAuthenticated') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticated: (state, action) => {
      const payload = action.payload || {};
      const user = payload.user || payload;

      state.id = user.id || user._id || '';
      state.email = user.email || '';
      state.name = user.name || '';
      state.role = user.role || 'customer';
      state.isAuthenticated = 'true';

      if (payload.token) {
        Cookies.set('token', payload.token, { expires: 7 });
        localStorage.setItem('token', payload.token);
      }
      Cookies.set('id', state.id, { expires: 7 });
      Cookies.set('name', state.name, { expires: 7 });
      Cookies.set('email', state.email, { expires: 7 });
      Cookies.set('role', state.role, { expires: 7 });
      Cookies.set('isAuthenticated', 'true', { expires: 7 });
    },
    logout: (state) => {
      state.id = '';
      state.email = '';
      state.name = '';
      state.role = '';
      state.isAuthenticated = null;

      Cookies.remove('id');
      Cookies.remove('name');
      Cookies.remove('email');
      Cookies.remove('role');
      Cookies.remove('token');
      Cookies.remove('isAuthenticated');
      localStorage.removeItem('token');
    },
  },
});

export default authSlice.reducer;
export const { authenticated, logout } = authSlice.actions;