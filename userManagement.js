import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const UserManagement = () => {
  const { user, isAdmin } = useSelector((state) => state.auth);

  const baseUrl = "http://localhost:3001/api/inft3050";

  // State for Add User form
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [makeAdmin, setMakeAdmin] = useState(false);

  // State for Edit/Delete form
  const [searchUser, setSearchUser] = useState("");
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [foundUser, setFoundUser] = useState(null);
  
  // State for messages
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Security check to redirect non-admins
  useEffect(() => {
    if (user === null) return; // Wait for auth state to be determined

    if (!isAdmin) {
      setErrorMessage("Access Denied: You must be an administrator to view this page.");
      setTimeout(() => {
        window.location.href = '/login'; 
      }, 2000);
    }
  }, [user, isAdmin]);

  // Navigation handler
  const handleBackToDashboard = () => {
    window.location.href = '/adminAccount';
  };

  // --- Hashing functions ---
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

  const generateSaltAndHash = async (password) => {
    const salt = generateSalt();
    const hash = await sha256(salt + password);
    return { salt, hash };
  };
  
  // --- handleAddUser ---
  const handleAddUser = (event) => {
    event.preventDefault();
    
    if (!userName || !fullName || !email || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    generateSaltAndHash(password).then(hashInfo => {
      
      const newUser = {
        UserName: userName,
        Name: fullName,
        Email: email,
        // --- THIS IS THE FIX ---
        // Convert boolean (makeAdmin) to 1 or 0 for the SQL database
        IsAdmin: makeAdmin ? 1 : 0, 
        // --- END FIX ---
        Salt: hashInfo.salt,
        HashPW: hashInfo.hash
      };

      axios.post(`${baseUrl}/User`, newUser, { withCredentials: true })
        .then(response => {
          setSuccessMessage(`User "${userName}" created successfully!`);
          // Clear form
          setUserName("");
          setFullName("");
          setEmail("");
          setPassword("");
          setMakeAdmin(false);
        })
        .catch(error => {
          console.error("Error adding user:", error.response || error);
          setErrorMessage(error.response?.data?.msg || error.response?.data?.message || "Failed to add user.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    });
  };

  // --- handleSearchUser ---
  const handleSearchUser = (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setShowUserInfo(false);
    setFoundUser(null);

    // --- FIX: Search by UserName ---
    // We fetch the full list and filter, as the API doesn't support /User/{username}
    axios.get(`${baseUrl}/User`, { withCredentials: true })
      .then(response => {
        const users = response.data.list || [];
        // Find by UserName, case-insensitive
        const userFound = users.find(u => u.UserName.toLowerCase() === searchUser.toLowerCase());
        
        if (userFound) {
          setFoundUser(userFound);
          setShowUserInfo(true);
          setSuccessMessage(`Found user: ${userFound.UserName}`);
        } else {
          setErrorMessage(`User "${searchUser}" not found.`);
        }
      })
      .catch(error => {
        console.error("Error searching user:", error.response || error);
        setErrorMessage(error.response?.data?.message || "Failed to search for user.");
      })
      .finally(() => {
          setIsLoading(false);
      });
  };

  // --- handleEditUser ---
  const handleEditUser = () => {
    if (!foundUser) return;

    const newName = prompt("Enter new Full Name:", foundUser.Name);
    const newEmail = prompt("Enter new Email:", foundUser.Email);
    // Use confirm for boolean, which is more reliable than a prompt
    const newIsAdmin = window.confirm(`Make this user an Admin?\n(Cancel = No, OK = Yes)`);

    if (newName === null || newEmail === null) {
      return; // User cancelled
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const payload = {
      Name: newName,
      Email: newEmail,
      IsAdmin: newIsAdmin ? 1 : 0 // --- FIX: Send 1 or 0 ---
    };

    // --- FIX: Use UserID for PATCH, not UserName ---
    axios.patch(`${baseUrl}/User/${foundUser.UserID}`, payload, { withCredentials: true })
      .then(response => {
        setSuccessMessage("User updated successfully!");
        setFoundUser(response.data); // Update UI with new data from response
      })
      .catch(error => {
        console.error("Error updating user:", error.response || error);
        setErrorMessage(error.response?.data?.message || "Failed to update user.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // --- handleDeleteUser ---
  const handleDeleteUser = () => {
    if (!foundUser) return;

    if (!window.confirm(`Are you sure you want to delete "${foundUser.UserName}"? This cannot be undone.`)) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // --- FIX: Use UserID for DELETE, not UserName ---
    axios.delete(`${baseUrl}/User/${foundUser.UserID}`, { withCredentials: true })
      .then(response => {
        setSuccessMessage(`User "${foundUser.UserName}" deleted successfully.`);
        // Clear form
        setFoundUser(null);
        setShowUserInfo(false);
        setSearchUser("");
      })
      .catch(error => {
        console.error("Error deleting user:", error.response || error);
        setErrorMessage(error.response?.data?.message || "Failed to delete user. They may be linked to other records (e.g., products).");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Render block for non-admins
  if (!isAdmin) {
    return (
      <div className="management-container">
        <h1>User Management</h1>
        {errorMessage && <div className="error-message" style={{color: 'red'}}>{errorMessage}</div>}
        {!errorMessage && <p>Loading...</p>}
      </div>
    );
  }

  return (
    <div className="management-container">
      <button 
        onClick={handleBackToDashboard} 
        className="admin-manage-button"
        style={{ marginBottom: '20px', width: 'auto', backgroundColor: '#6c757d', color: 'white' }} 
      >
        &larr; Back to Admin Dashboard
      </button>
      
      <h1>User Management</h1>
      
      {/* Display Messages */}
      {errorMessage && <div className="error-message" style={{color: 'red', marginBottom: '15px'}}>{errorMessage}</div>}
      {successMessage && <div className="success-message" style={{color: 'green', marginBottom: '15px'}}>{successMessage}</div>}
      
      <div className="management-grid">
        {/* --- ADD USER FORM --- */}
        <div className="management-section">
          <h2>Add User</h2>
          <form onSubmit={handleAddUser}>
            <div className="form-group">
              <label>Username<span className="required">*</span></label>
              <input type="text" placeholder="e.g., jsmith" value={userName} onChange={(e) => setUserName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Full Name<span className="required">*</span></label>
              <input type="text" placeholder="e.g., John Smith" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Email<span className="required">*</span></label>
              <input type="email" placeholder="e.g., john@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Password<span className="required">*</span></label>
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            
            <div className="form-group-checkbox" style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
              <input
                id="makeAdmin"
                type="checkbox"
                checked={makeAdmin}
                onChange={(e) => setMakeAdmin(e.target.checked)}
                style={{ width: 'auto', height: 'auto', marginRight: '10px' }}
              />
              <label htmlFor="makeAdmin" style={{ marginBottom: 0, fontWeight: 'bold' }}>Make this user an Admin?</label>
            </div>
            <button type="submit" className="btn-add" disabled={isLoading} style={{ marginTop: '20px' }}>
              {isLoading ? "Adding User..." : "Add User"}
            </button>
          </form>
        </div>
        
        {/* --- EDIT/DELETE USER FORM --- */}
        <div className="management-section">
          <h2>Edit/Delete User</h2>
          <form onSubmit={handleSearchUser} className="search-box">
            <label>Search Username<span className="required">*</span></label>
            <input
              type="text"
              placeholder="Enter exact username"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              required
            />
            {/* --- FIX: Changed class for styling --- */}
            <button type="submit" className="btn-edit" disabled={isLoading} style={{ background: '#007bff' }}>
              {isLoading ? "Searching..." : "Search"}
            </button>
          </form>
          {showUserInfo && foundUser && (
            <>
              <div className="user-info">
                {/* --- FIX: Use UserID --- */}
                <h3>User Info (ID: {foundUser.UserID})</h3>
                <p><strong>Username:</strong> {foundUser.UserName}</p>
                <p><strong>Full Name:</strong> {foundUser.Name}</p>
                <p><strong>Email Address:</strong> {foundUser.Email}</p>
                <p><strong>Is {foundUser.UserName} admin?</strong> {foundUser.IsAdmin ? 'Yes' : 'No'}</p>
              </div>
              <div className="button-row">
                <button className="btn-edit" onClick={handleEditUser} disabled={isLoading}>
                  Edit User
                </button>
                <button className="btn-delete" onClick={handleDeleteUser} disabled={isLoading}>
                  Delete User
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;