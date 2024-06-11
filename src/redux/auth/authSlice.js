import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axios";

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userData: null,
    isAuthenticated: !!localStorage.getItem('accessToken'),
    isLoading: false,
    admin: false,
    error: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.isAuthenticated = true;
      state.userData = user;
      state.admin = user.authorities[0].authority === 'ADMIN';
      state.error = null;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    },
    loginFailure: (state, action) => {
      state.isAuthenticated = false;
      state.userData = null;
      state.admin = false;
      state.error = action.payload;
    },
    registerFailure: (state, action) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userData = null;
      state.admin = false;
      state.error = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    refreshTokenSuccess: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    },
    fetchUserSuccess: (state, action) => {
      state.userData = action.payload;
      state.isAuthenticated = true;
      state.admin = action.payload.authorities[0].authority === 'ADMIN';
      state.error = null;
    },
  },
});

export const {
  loginSuccess,
  loginFailure,
  logout,
  registerFailure,
  refreshTokenSuccess,
  fetchUserSuccess,
} = authSlice.actions;

export default authSlice.reducer;

// Thunks
export const login = (email, password) => async (dispatch) => {
  try {
    console.log("login work");
    const response = await axiosInstance.post('/auth/login', { email, password });
    dispatch(loginSuccess(response.data));
  } catch (error) {
    const errorMsg = error.response && error.response.status === 500
      ? error.response.data
      : "An unexpected error occurred. Please try again.";
    dispatch(loginFailure(errorMsg));
    console.error("Error:", errorMsg);
  }
};

export const register = (fullName, email, password) => async (dispatch) => {
  try {
    const response = await axiosInstance.post('/auth/register', { fullName, email, password });
    if (response.status === 200) {
      console.log('register work');
      dispatch(login(email, password)); // You can dispatch login action after successful registration if needed.
      return true;
    } else {
      return false;
    }
  } catch (error) {
    const errorMsg = error.response && error.response.status === 409
      ? error.response.data
      : "An unexpected error occurred. Please try again.";
    dispatch(registerFailure(errorMsg));
    console.error("Error:", errorMsg);
    return false;
  }
};

export const refreshToken = () => async (dispatch) => {
  try {
    const response = await axiosInstance.post('/auth/refresh-token', {
      token: localStorage.getItem('refreshToken')
    });
    if (response.status === 200) {
      dispatch(refreshTokenSuccess(response.data));
      dispatch(fetchUser());
    }
  } catch (error) {
    dispatch(logout());
  }
};

export const fetchUser = (navigate) => async (dispatch) => {
  try {
    const response = await axiosInstance.get('/user/fetch-user', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    dispatch(fetchUserSuccess(response.data));
  } catch (error) {
    if (error.response && error.response.status === 401) {
      dispatch(refreshToken());
    } else {
      navigate('/login');
    }
  }
};
