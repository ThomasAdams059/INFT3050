import React, { useState } from "react";
import axios from 'axios';

const CreateAccount = ({ onCreateAccount }) => {

  const baseUrl = "http://localhost:3001/api/inft3050";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  const generateSalt = () => {
    const salt = window.crypto.randomUUID().replaceAll("-", "");
    return salt;
  };

  const handleCreateAccount = (event) => {
    event.preventDefault();

    if (!fullName || !email || !password ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    // email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    const salt = generateSalt();

     sha256(salt + password).then((hashedPW) => {

      // new customer info
      const newCustomer = {
        Email: email,
        Name: fullName,
        Salt: salt,
        HashPW: hashedPW
      };

      console.log("Creating new customer:", newCustomer);


      // posts to patrons table -- doesnt work :/
      axios.post(
        `${baseUrl}/Patrons`,
        newCustomer,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      )
      
      .then((response) => {
        console.log("Customer account created successfully:", response.data);
        setSuccessMessage(`Account for "${fullName}" created successfully! Redirecting to login...`);

        setFullName("");
        setEmail("");
        setPassword("");
        setIsLoading(false);

        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      })
      .catch((error) => {
        console.error("Error creating account:", error);
        let errorMsg = "Failed to create account. ";
        

        // error logging remove later
        if (error.response) {
          const status = error.response.status;
          if (status === 409) {
            errorMsg += "An account with this email already exists.";
          } else if (status === 404) {
             errorMsg += "The create account API endpoint was not found (404)."
          } else {
             errorMsg += error.response.data?.message || "Please try again.";
          }
        } else {
          errorMsg += "No response from server.";
        }
        setErrorMessage(errorMsg);
        setIsLoading(false);
      });
    })
    .catch((error) => {
      console.error("Error hashing password:", error);
      setErrorMessage("Failed to process password. Please try again.");
      setIsLoading(false);
    });
  };
  
return (
    <div className='account-container'>
      <div className="account-header">
        <div className='account-text'>Create Account</div>
        <div className='underline'></div>
      </div>
      <div className='inputs'>
        <div className='input'>
          <label htmlFor="fullName">Name*</label>
          <input 
            id='fullName' 
            type='text' 
            placeholder="First and Last Name" 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)} 
          />
        </div>
        <div className='input'>
          <label htmlFor="email">Email*</label>
          <input 
            id="email" 
            type='email' 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
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
          />
        </div>
      </div>
      {errorMessage && (
        <div className="error-message" style={{color: 'red', margin: '10px 0'}}>
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="success-message" style={{color: 'green', margin: '10px 0'}}>
          {successMessage}
        </div>
      )}
      <div className='create-container'>
        <div className="submit" onClick={handleCreateAccount} style={{opacity: isLoading ? 0.5 : 1}}>
          {isLoading ? "Creating..." : "Create Account"}
        </div>
        <div className="submit gray" onClick={() => window.location.href = "/login"}>
          Back to Login
        </div>
      </div>
      <div className="forgot-password">
        <span>
          <a href="/recoverAccount">Lost Password? Click Here!</a>
        </span>
      </div>
    </div>
  );
};

export default CreateAccount;