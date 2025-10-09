import React, { useState } from "react";
import { tryAddNewUser } from './helpers/userHelpers';

const CreateAccount = ({ onCreateAccount }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [state, setState] = useState("");

  const handleCreateAccount = () => {
    // You might want to add validation here before calling the helper function
    if (fullName && email && password && address && postcode && state) {
      const resultHandler = (result) => {
        if (result === "Success") {
          onCreateAccount();
        } else {
          alert("Account creation failed.");
        }
      };
      tryAddNewUser(fullName, email, password, address, postcode, state, resultHandler);
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const handleRecoverClick = () => {
    window.location.href = "/recoverAccount";
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
          <input id='fullName' type='text' placeholder="First and Last Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className='input'>
          <label htmlFor="email">Email*</label>
          <input id="email" type='email' placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className='input'>
          <label htmlFor="password">Password*</label>
          <input id="password" type='password' placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className='input'>
          <label htmlFor="address">Address*</label>
          <input id="address" type='text' placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className='input'>
          <label htmlFor="postcode">Post Code*</label>
          <input id="postcode" type='number' placeholder="Post Code" value={postcode} onChange={(e) => setPostcode(e.target.value)} />
        </div>
        <div className='input'>
          <label htmlFor="state">State*</label>
          <select id="state" value={state} onChange={(e) => setState(e.target.value)}>
            <option value="">State</option>
            <option>NSW</option>
            <option>VIC</option>
            {/* ... other state options */}
          </select>
        </div>
      </div>
      <div className='create-container'>
        <div className="submit" onClick={handleCreateAccount}>Create Account</div>
        <div className="submit gray" onClick={() => window.location.href = "/login"}>Back to Login</div>
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