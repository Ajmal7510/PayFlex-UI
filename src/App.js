import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserHomePage from './pages/UserHomePage';
import AdminHomePage from './pages/AdminHomePage';
import { fetchUser } from './redux/auth/authSlice';

const App = () => {
 

  return (
    <Router>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/user-home' element={<UserHomePage />} />
        <Route path='/admin-home' element={<AdminHomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
