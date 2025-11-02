import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux'; 
import { updateUser } from './redux/authSlice'; 

// API URL
const PATRONS_URL = "http://localhost:3001/api/inft3050/Patrons";

// password hashing same as userhelper
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
// ---


const AccountSettings = () => {
  
  // gets user data from redux
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

 
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // form shows user data
  useEffect(() => {
    if (user) {
      setFullName(user.Name || "");
      setEmail(user.Email || "");
    }
  }, [user]);

  // account details update
  const handleUpdateDetails = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    if (!user) {
      setErrorMessage("User not found. Please log in again.");
      setIsLoading(false);
      return;
    }

    const payload = {
      Name: fullName,
      Email: email,
    };

    try {
      const response = await axios.patch(
        `${PATRONS_URL}/${user.UserID}`,
        payload,
        { withCredentials: true }
      );

      // updates redux state
      dispatch(updateUser(response.data));
      setSuccessMessage("Account details updated successfully!");

    } catch (err) {
      console.error("Error updating account:", err.response || err);
      setErrorMessage(err.response?.data?.message || "Failed to update details. (Note: This is expected to fail with a 401 error due to the login workaround).");
    } finally {
      setIsLoading(false);
    }
  };

  // -handles the password update
  const handleUpdatePassword = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    if (!user) {
      setErrorMessage("User not found. Please log in again.");
      setIsLoading(false);
      return;
    }

    if (!currentPassword || !newPassword) {
      setErrorMessage("Please fill in all password fields.");
      setIsLoading(false);
      return;
    }

    // verify current password
    const currentHash = await sha256(user.Salt + currentPassword);
    if (currentHash !== user.HashPW) {
      setErrorMessage("Your current password does not match.");
      setIsLoading(false);
      return;
    }

    
    const newSalt = generateSalt();
    const newHash = await sha256(newSalt + newPassword);

    const payload = {
      Salt: newSalt,
      HashPW: newHash,
    };

    try {
      const response = await axios.patch(
        `${PATRONS_URL}/${user.UserID}`,
        payload,
        { withCredentials: true }
      );

      // updated redux state
      dispatch(updateUser(response.data));
      setSuccessMessage("Password updated successfully!");
      
      // clears passowrd
      setCurrentPassword("");
      setNewPassword("");

    } catch (err) {
      console.error("Error updating password:", err.response || err);
      setErrorMessage(err.response?.data?.message || "Failed to update password. (Note: This is expected to fail with a 401 error due to the login workaround).");
    } finally {
      setIsLoading(false);
    }
  };

  // for the side bar routing and logic
  const navigate = (path) => {
    window.location.href = path;
  };

  // removed gthe address book now
  const sidebarLinks = [
    { name: 'Account Dashboard', path: '/myAccount' },
    { name: 'Order History', path: '/orderHistory' },
    { name: 'Account Settings', path: '/accountSettings' },
  ];

 
  return (
    <div className="main-container">
      <h1 className="main-heading custom-header-color">Account Settings</h1>

      {/* added so there are 2 columns to match wireframes */}
      <div className="three-column-layout" style={{ gridTemplateColumns: '250px 1fr', gap: '30px' }}>
        
        {/* sidebar */}
        <div className="account-sidebar">
          <h2 className="admin-box-heading">My Account</h2>
          <ul className="sidebar-nav-list">
            {sidebarLinks.map((link) => (
              <li
                key={link.name}
                className={window.location.pathname === link.path ? 'active' : ''}
                onClick={() => navigate(link.path)}
              >
                <a href={link.path} className="block" onClick={(e) => e.preventDefault()}>
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        
        <div className="account-settings-content" style={{ gridColumn: 'span 1' }}>

          {/* feedback messsages */}
          {errorMessage && <p className="error-message" style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}
          {successMessage && <p className="success-message" style={{ color: 'green', textAlign: 'center' }}>{successMessage}</p>}

          {/* edit account details form */}
          <div className='threeColumns-account-container' style={{ marginBottom: '30px' }}>
            <form onSubmit={handleUpdateDetails}>
              <div className="account-header">
                <h2 className="admin-box-heading">Edit Account Details</h2>
              </div>
              
              <div className='inputs'>
                <div className='input'>
                  <label htmlFor="fullName">Name*</label>
                  <input id='fullName' type='text' placeholder="First and Last Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>

                <div className='input'>
                  <label htmlFor="email">Email*</label>
                  <input id="email" type='email' placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>

              <div className='container-account'>
                <button type="submit" className="threeColumns-account-container-button" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Details"}
                </button>
              </div>
            </form>
          </div>

          {/* change password form */}
          <div className='threeColumns-account-container'>
            <form onSubmit={handleUpdatePassword}>
              <div className="account-header">
                <h2 className="admin-box-heading">Change Password</h2>
              </div>
              
              <div className='inputs'>
                <div className='input'>
                  <label htmlFor="current-password">Current Password*</label>
                  <input id="current-password" type='password' placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                </div>

                <div className='input'>
                  <label htmlFor="new-password">New Password*</label>
                  <input id="new-password" type='password' placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                </div>
              </div>

              <div className='container-account'>
                <button type="submit" className="threeColumns-account-container-button" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>

        </div>
       

      </div>
    </div>
  );
}

export default AccountSettings;
