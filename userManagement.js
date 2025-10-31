import React, { useState } from 'react';
import axios from 'axios';


const UserManagement = () => {

  const baseUrl = "http://localhost:3001/api/inft3050";
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [postCode, setPostCode] = useState("");
  const [state, setState] = useState("NSW");
  const [makeAdmin, setMakeAdmin] = useState(false);

  const [searchUser, setSearchUser] = useState("");
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [foundUser, setFoundUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // --- NEW: Navigation handler ---
  const handleBackToDashboard = () => {
    window.location.href = '/adminAccount';
  };
  // --- END NEW ---

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

  const handleAddUser = (event) => {
    event.preventDefault();
    if (!userName || !fullName || !email || !password || !address || !postCode || !state) {
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
        StreetAddress: address,
        PostCode: postCode,
        State: state,
        IsAdmin: makeAdmin,
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
          setAddress("");
          setPostCode("");
          setState("NSW");
          setMakeAdmin(false);
        })
        .catch(error => {
          console.error("Error adding user:", error.response || error);
          setErrorMessage(error.response?.data?.message || "Failed to create user.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    });
  };

  const handleSearchUser = (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setShowUserInfo(false);
    setFoundUser(null);

    // Fetch all users and filter by username
    axios.get(`${baseUrl}/User`, { withCredentials: true })
      .then(response => {
        const users = response.data.list || [];
        const user = users.find(u => u.UserName.toLowerCase() === searchUser.toLowerCase());

        if (user) {
          setFoundUser(user);
          setShowUserInfo(true);
          setSuccessMessage(`Found user: ${user.UserName}`);
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

  const handleEditUser = () => {
    if (!foundUser) return;

    // Use prompts to get new info
    const newName = prompt("Enter new Full Name:", foundUser.Name);
    const newEmail = prompt("Enter new Email:", foundUser.Email);
    const newIsAdmin = window.confirm(`Make this user an Admin? (Currently: ${foundUser.IsAdmin ? 'Yes' : 'No'})`);

    if (newName === null || newEmail === null) {
      return; // User cancelled
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const payload = {
      Name: newName,
      Email: newEmail,
      IsAdmin: newIsAdmin
    };

    axios.patch(`${baseUrl}/User/${foundUser.UserID}`, payload, { withCredentials: true })
      .then(response => {
        setSuccessMessage("User updated successfully!");
        // Update local state
        setFoundUser(prev => ({ ...prev, ...payload }));
      })
      .catch(error => {
        console.error("Error updating user:", error.response || error);
        setErrorMessage(error.response?.data?.message || "Failed to update user.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDeleteUser = () => {
    if (!foundUser) return;
    if (!window.confirm(`Are you sure you want to delete user "${foundUser.UserName}"? This cannot be undone.`)) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

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
        setErrorMessage(error.response?.data?.message || "Failed to delete user. They may be linked to other records.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Helper to combine salt and hash generation
  const generateSaltAndHash = async (password) => {
    const salt = generateSalt();
    const hash = await sha256(salt + password);
    return { salt, hash };
  };

  return (
    <div className="management-container">
      {/* --- NEW BUTTON --- */}
      <button 
        onClick={handleBackToDashboard} 
        className="admin-manage-button" // Use a consistent class
        style={{ marginBottom: '20px', width: 'auto', backgroundColor: '#6c757d', color: 'white' }} 
      >
        &larr; Back to Admin Dashboard
      </button>
      {/* --- END NEW BUTTON --- */}

      <h1>User Management</h1>
      
      {/* Display Messages */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="management-grid">
        {/* --- ADD USER FORM --- */}
        <div className="management-section">
          <h2>Add User</h2>
          <form onSubmit={handleAddUser}>
            <div className="form-group">
              <label>Username<span className="required">*</span></label>
              <input type="text" placeholder="Username" value={userName} onChange={(e) => setUserName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Full Name<span className="required">*</span></label>
              <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Email<span className="required">*</span></label>
              <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Password<span className="required">*</span></label>
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Address<span className="required">*</span></label>
              <input type="text" placeholder="Street Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Post Code<span className="required">*</span></label>
                <input type="text" placeholder="Post Code" value={postCode} onChange={(e) => setPostCode(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>State<span className="required">*</span></label>
                <select value={state} onChange={(e) => setState(e.target.value)} required>
                  <option value="NSW">NSW</option>
                  <option value="VIC">VIC</option>
                  <option value="QLD">QLD</option>
                  <option value="WA">WA</option>
                  <option value="SA">SA</option>
                  <option value="TAS">TAS</option>
                  <option value="ACT">ACT</option>
                  <option value="NT">NT</option>
                </select>
              </div>
            </div>
            <div className="form-group-checkbox">
              <input type="checkbox" id="makeAdmin" checked={makeAdmin} onChange={(e) => setMakeAdmin(e.target.checked)} />
              <label htmlFor="makeAdmin">Make this user an Admin?</label>
            </div>
            <button type="submit" className="btn-add" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add User"}
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
              placeholder="Search for user"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              required
            />
            <button type="submit" className="btn-search" disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </button>
          </form>
          {showUserInfo && foundUser && (
            <>
              <div className="user-info">
                <h3>User Info</h3>
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
