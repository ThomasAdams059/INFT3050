import React, { useState } from "react";
import { tryLoginUser, tryLoginPatron } from './helpers/userHelpers';



const Login = ({ onLogin }) => {
  //const [action, setAction] = useState("Login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (event) => {
    event.preventDefault(); // Prevent reloading of the page
    if (username && password) {
      
      // --- HARDCODED ADMIN CHECK ---
      //if (username === 'adminAccount') {
          // Bypass API check for the admin account and redirect directly to the admin page
          // Pass 'true' for isAdmin status
          /*onLogin(true); 
          return;
      }*/
      // --- END HARDCODED ADMIN CHECK ---
      
      const resultHandler = (result) => {

        //new error log
        console.log("=== LOGIN DEBUG ===");
        console.log("Full result:", result);
        console.log("result.status:", result.status);
        console.log("result.isAdmin:", result.isAdmin);
        console.log("typeof result.isAdmin:", typeof result.isAdmin);

        if (result && result.status === "Success!") {
          // If not the hardcoded admin, check the isAdmin status returned from the API
          const isAdmin = result.isAdmin === true; 

          //another error log
          console.log("isAdmin value being passed:", isAdmin);
          onLogin(isAdmin);
        } else {
          alert("Login failed. Please check your credentials.");
        }
      };

      const isEmail = username.includes('@');
      
      console.log("🔍 Username entered:", username);
      console.log("🔍 Contains @?:", isEmail);
      
      if (isEmail) {
        // use Patron login
        console.log("🔵 Attempting PATRON login");
        tryLoginPatron(username, password, resultHandler);
      } else {
        
        console.log("🟢 Attempting USER login");
        tryLoginUser(username, password, resultHandler);
      }
      
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
