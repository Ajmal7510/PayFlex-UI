import React, { useEffect, useState } from 'react'
import './SignUp.css'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../redux/auth/authSlice';
const Signup = () => {
  
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

    const [signupData, setSignupData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    
      const [passwordStrength, setPasswordStrength] = useState('');
      const [requiredCharacters, setRequiredCharacters] = useState([]);

      const navigateToLogin=()=>{
        navigate('/login')
      }
    
      const handleSignupChange = (e) => {
        const { name, value } = e.target;
        setSignupData({ ...signupData, [name]: value });
      };
    
      const handlePasswordChange = (e) => {
        const password = e.target.value;
        setSignupData({ ...signupData, password });
    
        // Password strength validation
        const strongRegex = new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})"
        );
        const hasLowerCase = /[a-z]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasMinLength = password.length >= 6;
        const isStrong = strongRegex.test(password);
    
        // Update password strength
        if (isStrong) {
          setPasswordStrength('Strong');
        } else {
          setPasswordStrength('Weak');
        }
    
        // Update required characters
        const requiredChars = [];
        if (!hasLowerCase) requiredChars.push('lowercase letters');
        if (!hasUpperCase) requiredChars.push('uppercase letters');
        if (!hasNumber) requiredChars.push('numbers');
        if (!hasMinLength) requiredChars.push('minimum length of 6 characters');
        setRequiredCharacters(requiredChars);
      };
    
      const handleSignupSubmit = (e) => {
        e.preventDefault();
        
 
        if (signupData.password !== signupData.confirmPassword) {
          alert("Passwords do not match");
          return;
        }




      
        console.log('Sign-up form submitted:', signupData);

        const regStatus=dispatch(register(signupData.fullName,signupData.email,signupData.password));
        console.log('its work');
        console.log(regStatus);
      };
      
    
      return (
        <div className="signup-body">
        <div className="main">  	
          <input type="checkbox" id="chk" aria-hidden="true" />
    
          <div className="signup">
            <form onSubmit={handleSignupSubmit}>
              <label htmlFor="chk" aria-hidden="true">Sign up</label>
              <input type="text" name="fullName" placeholder="Full name" value={signupData.fullName} onChange={handleSignupChange} required />
              <input type="email" name="email" placeholder="Email" value={signupData.email} onChange={handleSignupChange} required />
              <input type="password" name="password" placeholder="Password" value={signupData.password} onChange={handlePasswordChange} required />
              {signupData.password && (
                <div className={`password-strength ${passwordStrength === 'Weak' ? 'weak' : 'strong'}`}>
                  Password Strength: {passwordStrength}
                  {passwordStrength === 'Weak' && (
                    <div>Required: {requiredCharacters.join(', ')}</div>
                  )}
                </div>
              )}
              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={signupData.confirmPassword} onChange={handleSignupChange} required />
              <button type="submit">Sign up</button>
              {error && <div className="signup-error-message">{error}</div>}
              <p className='login-link' onClick={navigateToLogin}>Already have an account? Login</p>
            </form>

           
          </div>
        </div>
        </div>
      );
    }

export default Signup
