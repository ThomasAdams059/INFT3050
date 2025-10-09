import React, { useState } from "react";
import { tryLoginUser } from './helpers/userHelpers'; // Corrected import path

const Login = ({ onLogin }) => {
  const [action, setAction] = useState("Login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username && password) {
      const resultHandler = (result) => {
        if (result === "Success!") {
          onLogin();
        } else {
          alert("Login failed. Please check your credentials.");
        }
      };
      tryLoginUser(username, password, resultHandler);
    } else {
      alert("Please enter both username and password.");
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
          <label htmlFor="username">Username*</label>
          <input id="username" type='text' placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className='input'>
          <label htmlFor="password">Password*</label>
          <input id="password" type='password' placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
      </div>
      <div className="forgot-password">
        <span>
          <a href="/recoverAccount">Lost Password? Click Here!</a>
        </span>
      </div>
      <div className='create-container'>
        <div className="submit" onClick={handleLogin}>Log In</div>
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