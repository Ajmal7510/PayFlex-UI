import React, { useState, useEffect } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/auth/authSlice';

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, userData, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      if (userData && userData.authorities[0].authority === 'ADMIN') {
        navigate('/admin-home');
      } else {
        navigate('/user-home');
      }
    }
  }, [isAuthenticated, userData, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginData.email, loginData.password));
  };

  return (
    <div className="body-login">
      <div className="login-main">
        <div className="signup">
          <form onSubmit={handleSubmit}>
            <label htmlFor="chk" aria-hidden="true">Login</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={loginData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleChange}
              required
            />
            <button type="submit">Login</button>
            {error && <div className="signup-error-message">{error}</div>}
            <p className="login-link" onClick={() => navigate('/signup')}>Don't have an account? Signup</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
