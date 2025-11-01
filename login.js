import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from './redux/authSlice';

// No longer needs onLogin prop
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // --- Redux Hooks ---
  const dispatch = useDispatch();
  // Select data from the auth slice
  const { status, error, isLoggedIn, isAdmin, isPatron } = useSelector((state) => state.auth);

  // --- NEW: Handle redirect after login ---
  useEffect(() => {
    if (isLoggedIn) {
      // Redirect based on user type
      if (isPatron) {
        window.location.href = '/myAccount';
      } else if (isAdmin) {
        window.location.href = '/adminAccount';
      } else {
        window.location.href = '/employeePage';
      }
    }
  }, [isLoggedIn, isAdmin, isPatron]); // Run this effect when auth state changes

  const handleLogin = (event) => {
    event.preventDefault(); // Prevent reloading of the page
    if (username && password) {
      // Dispatch the async thunk
      dispatch(loginUser({ username, password }));
    } else {
      alert("Please enter both username/email and password.");
    }
  };

  const renderLoginForm = () => (
    <div className='account-container'>
      <div className="account-header">
        <div className='account-text'>Log In</div>
        <div className='underline'></div>
      </div>
      <div className='inputs'>
        <div className='input'>
          <label htmlFor="username">Username/Email*</label>
          <input id="username" type='text' placeholder="Username or Email" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className='input'>
          <label htmlFor="password">Password*</label>
          <input id="password" type='password' placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
      </div>

      {/* --- NEW: Display error messages from Redux --- */}
      {status === 'failed' && (
        <div className="error-message" style={{color: 'red', margin: '10px 0', textAlign: 'center'}}>
          {error || "Login failed. Please check credentials."}
        </div>
      )}

      <div className="forgot-password">
        <span>
          <a href="/recoverAccount">Lost Password? Click Here!</a>
        </span>
      </div>
      <div className='create-container'>
        <div 
          className="submit" 
          onClick={handleLogin}
          // --- NEW: Disable button while loading ---
          style={{opacity: status === 'loading' ? 0.5 : 1}}
        >
          {status === 'loading' ? 'Logging in...' : 'Log In'}
        </div>
        <div className="submit gray" onClick={() => { window.location.href = "/createAccount"; }}>Create Account</div>
      </div>
    </div>
  );

  return (
    <>
      {renderLoginForm()}
    </>
  );
};

export default Login;