import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Accept the currentUser prop from App.js
const AccountSettings = ({ currentUser }) => {

    // --- NEW: Handle nested user object ---
    // This checks if App.js passed the whole response { user: {...} }
    // or just the user object itself.
    const user = currentUser ? (currentUser.user || currentUser) : null;
    // --- END NEW ---

    // State for the forms
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); // Current password
    const [newPassword, setNewPassword] = useState(""); // New password

    // State for messages and loading
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // When user loads, fill the form
    useEffect(() => {
        // --- UPDATED: Use the 'user' variable ---
        if (user) {
            setFullName(user.Name || "");
            setEmail(user.Email || "");
        }
    }, [user]); // Run when the 'user' variable is ready

    // --- Password Hashing Functions (copied from createAccount.js) ---
    async function sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    const generateSalt = () => {
        return window.crypto.randomUUID().replaceAll("-", "");
    };
    // --- End Hashing Functions ---

    // Helper to get the correct API endpoint
    const getApiEndpoint = () => {
        // --- UPDATED: Use the 'user' variable ---
        if (!user) return null;
        
        // Admins/Employees are in /User
        if (user.hasOwnProperty('UserName')) {
            return `http://localhost:3001/api/inft3050/User/${user.UserID}`;
        }
        // Patrons are in /Patrons
        else {
            return `http://localhost:3001/api/inft3050/Patrons/${user.UserID}`;
        }
    };

    // --- Handle Account Details Update ---
    const handleEditAccount = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        const endpoint = getApiEndpoint();
        if (!endpoint) {
            setErrorMessage("User not loaded.");
            setIsLoading(false);
            return;
        }

        try {
            const payload = {
                Name: fullName,
                Email: email
            };
            
            await axios.patch(endpoint, payload, { withCredentials: true });
            
            setSuccessMessage("Account details updated successfully! Note: You may need to refresh the page to see changes.");
            
        } catch (error) {
            console.error("Error updating account:", error.response || error);
            setErrorMessage(error.response?.data?.message || "Failed to update details.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- Handle Password Change ---
    const handleChangePassword = async (event) => {
        event.preventDefault();
        
        if (!password || !newPassword) {
            setErrorMessage("Please fill in both current and new password fields.");
            return;
        }
        
        setIsLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            // Step 1: Verify the user's *current* password by re-logging in
            // --- UPDATED: Use the 'user' variable ---
            const loginCredential = user.UserName || user.Email;
            
            await axios.post(
                "http://localhost:3001/login", 
                { username: loginCredential, password: password },
                { withCredentials: true }
            );

            // Step 2: If login is successful, generate new salt/hash
            const salt = generateSalt();
            const hashHex = await sha256(salt + newPassword);

            const payload = {
                Salt: salt,
                HashPW: hashHex
            };

            // Step 3: Patch the new password to the correct endpoint
            const endpoint = getApiEndpoint();
            await axios.patch(endpoint, payload, { withCredentials: true });

            setSuccessMessage("Password changed successfully!");
            setPassword("");
            setNewPassword("");

        } catch (error) {
            console.error("Error changing password:", error.response || error);
            if (error.response && error.response.status === 401) {
                setErrorMessage("Your 'Current Password' is incorrect.");
            } else {
                setErrorMessage(error.response?.data?.message || "Failed to change password.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // --- Sidebar and Navigation Logic (Unchanged) ---
    const navigate = (path) => {
        window.location.href = path;
    };

    const sidebarLinks = [
        { name: 'Account Dashboard', path: '/myAccount' },
        { name: 'Order History', path: '/orderHistory' },
        { name: 'Account Settings', path: '/accountSettings' },
        { name: 'Address Book', path: '/addressBook' },
        { name: 'Payment Methods', path: '/paymentMethod' },
    ];
    // --- End Sidebar Logic ---

    // --- UPDATED: Use the 'user' variable ---
    if (!user) {
        return (
            <div className="main-container">
                <h1 className="main-heading custom-header-color">Account Settings</h1>
                <p>Loading user data...</p>
            </div>
        );
    }

    return (
        <div className="main-container">
            <h1 className="main-heading custom-header-color">Account Settings</h1>

            <div className="three-column-layout">
                {/* --- Sidebar --- */}
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

                {/* --- Edit Account Details Form --- */}
                <div className='threeColumns-account-container'>
                    <div className="account-header">
                        <h2 className="admin-box-heading">Edit Account</h2>
                    </div>

                    {/* --- Replaced placeholder onClick with form submit --- */}
                    <form onSubmit={handleEditAccount}>
                        <div className="inputs">
                            <div className='input'>
                                <label htmlFor="name">Full Name</label>
                                <input id="name" type='text' placeholder="Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                            </div>

                            <div className='input'>
                                <label htmlFor="email">Email Address</label>
                                <input id="email" type='email' placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        </div>
                        <div className='container-account'>
                            <button type="submit" className="threeColumns-account-container-button" disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- Change Password Form --- */}
                <div className='threeColumns-account-container'>
                    <div className="account-header">
                        <h2 className="admin-box-heading">Change Password</h2>
                    </div>

                    {/* --- Replaced placeholder onClick with form submit --- */}
                    <form onSubmit={handleChangePassword}>
                        <div className="inputs">
                            <div className='input'>
                                <label htmlFor="current-password">Current Password</label>
                                <input id="current-password" type='password' placeholder="Current Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>

                            <div className='input'>
                                <label htmlFor="new-password">New Password</label>
                                <input id="new-password" type='password' placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
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

            {/* --- Global Messages for the page --- */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}
                {successMessage && <p className="success-message" style={{ color: 'green' }}>{successMessage}</p>}
            </div>

        </div>
    );
};

export default AccountSettings;