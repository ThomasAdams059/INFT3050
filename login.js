import React, { useState } from "react";
import axios from 'axios';
import { tryLoginUser, tryLoginPatron } from './helpers/userHelpers';



const Login = ({ onLogin }) => {
  //const [action, setAction] = useState("Login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

 const handleLogin = (event) => {
    event.preventDefault();
    
    if (!username || !password) {
      setErrorMessage("Please enter both username/email and password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    const isEmail = username.includes('@');
    
    console.log("=== LOGIN.JS LOGIN ATTEMPT ===");
    console.log("Username/Email entered:", username);
    console.log("Detected as:", isEmail ? "PATRON (email)" : "USER (username)");

    // result handler for both login types
    const resultHandler = async (result) => {
      console.log("=== LOGIN RESULT FROM HELPER ===");
      console.log("Full result:", result);
      console.log("Status:", result.status);

      if (result && result.status === "Success!") {
        // After successful login via helper, query /me to determine exact role
        try {
          console.log("✅ Helper login successful, querying /me endpoint...");
          
          const meResponse = await axios.get("http://localhost:3001/me", { 
            withCredentials: true 
          });

          console.log("=== /ME ENDPOINT RESPONSE ===");
          console.log("Full response:", meResponse.data);

          // Determine user role from /me response
          let userRole = 'patron'; // default

          if (meResponse.data.isAdmin === true) {
            userRole = 'admin';
            console.log(" role: ADMIN");
          } else if (meResponse.data.isEmployee === true || meResponse.data.role === 'employee') {
            userRole = 'employee';
            console.log("role: EMPLOYEE");
          } else if (meResponse.data.patronId || meResponse.data.role === 'patron') {
            userRole = 'patron';
            console.log("role: PATRON");
          }

          console.log("=== CALLING onLogin WITH ROLE:", userRole, "===");

          // Call parent's onLogin handler with the determined role
          if (onLogin) {
            onLogin(userRole);
          } else {
            // Fallback navigation if onLogin is not provided
            if (userRole === 'admin') {
              window.location.href = '/adminAccount';
            } else if (userRole === 'employee') {
              window.location.href = '/employeePage';
            } else {
              window.location.href = '/accountSettings';
            }
          }

        } catch (meError) {
          console.error("error checking user role from /me:", meError);
          setErrorMessage("Login succeeded but couldn't verify user role. Please try refreshing the page.");
          setIsLoading(false);
        }
      } else {
        // Login failed
        console.log("Login failed");
        setErrorMessage(result.error || "Login failed. Please check your credentials.");
        setIsLoading(false);
      }
    };
    
    if (isEmail) {
      // Patron login
      console.log("Attempting PATRON login via tryLoginPatron helper");
      tryLoginPatron(username, password, resultHandler);
    } else {
      // User (admin or employee) login
      console.log("Attempting USERS login via tryLoginUser helper");
      tryLoginUser(username, password, resultHandler);
    }
  };
  return (
    <div className='account-container'>
      <div className="account-header">
        <div className='account-text'>Login</div>
        <div className='underline'></div>
      </div>
      
      <form onSubmit={handleLogin}>
        <div className='inputs'>
          <div className='input'>
            <label htmlFor="username">Username / Email*</label>
            <input 
              id="username" 
              type='text' 
              placeholder="Username or Email" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className='input'>
            <label htmlFor="password">Password*</label>
            <input 
              id="password" 
              type='password' 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        {errorMessage && (
          <div className="error-message" style={{color: 'red', margin: '10px 0', textAlign: 'center'}}>
            {errorMessage}
          </div>
        )}

        <div className="forgot-password">
          <span>
            <a href="/recoverAccount">Lost Password? Click Here!</a>
          </span>
        </div>

        <div className='create-container'>
          <button 
            type="submit" 
            className="submit" 
            disabled={isLoading}
            style={{opacity: isLoading ? 0.5 : 1, cursor: isLoading ? 'not-allowed' : 'pointer'}}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
          
          <div 
            className="submit gray" 
            onClick={() => !isLoading && (window.location.href = "/createAccount")}
            style={{
              opacity: isLoading ? 0.5 : 1, 
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            Create Account
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
