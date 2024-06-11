import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, logout } from '../redux/auth/authSlice';

const UserHomePage = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, userData, error } = useSelector((state) => state.auth);
 

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      dispatch(fetchUser());
    } else {
     
      window.location.href = '/login';
    }
  }, [dispatch,isAuthenticated]);

  const actionClick=()=>{
dispatch(logout())
  }

  

  return (
    <div style={{ backgroundColor: 'red', width: '100%', height: '100vh' }}>
      <h1>User Home</h1>
      <button onClick={actionClick}>

        
        clich here
      </button>
      <p>{userData&&
        <h1>{userData.fullName}</h1>}</p>
    </div>
  );
};

export default UserHomePage;
