import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux'; // Import hooks
import { updateUser } from './redux/authSlice'; // Import the new action

// API URL
const PATRONS_URL = "http://localhost:3001/api/inft3050/Patrons";

// --- Password Hashing Functions (copied from authSlice) ---
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

// --- REMOVED currentUser PROP ---
const AccountSettings = () => {
  
  // --- Get user data from Redux ---
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // --- Form States ---
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // --- UI State ---
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Populate form with user data when component loads
  useEffect(() => {
    if (user) {
      setFullName(user.Name || "");
      setEmail(user.Email || "");
    }
  }, [user]);

  // --- Handle Account Detail Update (Name/Email) ---
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

      // Update Redux state
      dispatch(updateUser(response.data));
      setSuccessMessage("Account details updated successfully!");

    } catch (err) {
      console.error("Error updating account:", err.response || err);
      setErrorMessage(err.response?.data?.message || "Failed to update details. (Note: This is expected to fail with a 401 error due to the login workaround).");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Handle Password Update ---
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

    // 1. Verify current password
    const currentHash = await sha256(user.Salt + currentPassword);
    if (currentHash !== user.HashPW) {
      setErrorMessage("Your current password does not match.");
      setIsLoading(false);
      return;
    }

    // 2. Create new salt and hash
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

      // Update Redux state with the new user object
      dispatch(updateUser(response.data));
      setSuccessMessage("Password updated successfully!");
      
      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");

    } catch (err) {
      console.error("Error updating password:", err.response || err);
      setErrorMessage(err.response?.data?.message || "Failed to update password. (Note: This is expected to fail with a 401 error due to the login workaround).");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Sidebar and Navigation Logic ---
  const navigate = (path) => {
    window.location.href = path;
  };

  // --- UPDATED: Removed 'Address Book' ---
  const sidebarLinks = [
    { name: 'Account Dashboard', path: '/myAccount' },
    { name: 'Order History', path: '/orderHistory' },
    { name: 'Account Settings', path: '/accountSettings' },
  ];

  // --- Render ---
  return (
    <div className="main-container">
      <h1 className="main-heading custom-header-color">Account Settings</h1>

      {/* --- MODIFIED: Use 2-column layout --- */}
      <div className="three-column-layout" style={{ gridTemplateColumns: '250px 1fr', gap: '30px' }}>
        
        {/* --- Sidebar (Unchanged) --- */}
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

        {/* --- Main Content Area --- */}
        <div className="account-settings-content" style={{ gridColumn: 'span 1' }}>

          {/* --- Global Messages --- */}
          {errorMessage && <p className="error-message" style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}
          {successMessage && <p className="success-message" style={{ color: 'green', textAlign: 'center' }}>{successMessage}</p>}

          {/* --- Form 1: Edit Account Details --- */}
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

          {/* --- Form 2: Change Password --- */}
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
        {/* --- End Main Content Area --- */}

      </div>
    </div>
  );
}

export default AccountSettings;

