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
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    const salt = generateSalt();

    sha256(salt + password).then((hashedPW) => {
      const newUser = {
        UserName: userName,
        Email: email,
        Name: fullName,
        IsAdmin: makeAdmin ? 1 : 0,
        Salt: salt,
        HashPW: hashedPW,
        Address: address,
        PostCode: postCode,
        State: state
      };

      axios.post(
        `${baseUrl}/User`,
        newUser,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      )
      .then((response) => {
        console.log("User added successfully:", response.data);
        setSuccessMessage(`User "${userName}" created successfully!`);
        setUserName("");
        setFullName("");
        setEmail("");
        setPassword("");
        setAddress("");
        setPostCode("");
        setState("NSW");
        setMakeAdmin(false);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error adding user:", error);
        const errorMsg = error.response?.data?.message ||
                         error.response?.data?.error ||
                         "Failed to create user. Please try again.";
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

  const handleSearchUser = (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setShowUserInfo(false);
    setFoundUser(null);
    console.log("Searching for user:", searchUser);
    console.log("Making GET request to:", `${baseUrl}/User`);

    axios.get(
      `${baseUrl}/User`,
      {
        headers: { 'Accept': 'application/json' },
        withCredentials: true
      }
    )
    .then((response) => {
      console.log("Response received:", response);
      console.log("Response data:", response.data);
      if (!response.data || !response.data.list) {
        console.error("Unexpected response structure:", response.data);
        setErrorMessage("Unexpected data format from server");
        setIsLoading(false);
        return;
      }
      const users = response.data.list;
      console.log("Total users found:", users.length);
      console.log("Users array:", users);
      const user = users.find(u =>
        u.UserName && u.UserName.toLowerCase() === searchUser.toLowerCase()
      );
      if (user) {
        console.log("User found:", user);
        setFoundUser(user);
        setShowUserInfo(true);
        setSuccessMessage(`Found user: ${user.UserName}`);
      } else {
        setErrorMessage(`User "${searchUser}" not found`);
        setFoundUser(null);
        setShowUserInfo(false);
      }
      setIsLoading(false);
    })
    .catch((error) => {
      console.error("Error searching user:", error);
        let errorMsg = "Failed to search for user. ";
        if (error.response) {
            const status = error.response.status;
            if (status === 401 || status === 403) errorMsg += "Authentication required.";
            else if (status === 404) errorMsg += "User endpoint not found.";
            else if (status === 500) errorMsg += "Server error.";
            else errorMsg += `Server error (${status}). ${error.response.data?.message || ''}`;
        } else if (error.request) errorMsg += "No response from server.";
        else errorMsg += error.message;
        setErrorMessage(errorMsg);
        setIsLoading(false);
    });
  };

  const handleEditUser = () => {
    if (!foundUser) return;
    const newName = prompt("Enter new full name:", foundUser.Name);
    const newEmail = prompt("Enter new email:", foundUser.Email);
    const changeAdmin = window.confirm(`Is ${foundUser.UserName} an admin? (Currently: ${foundUser.IsAdmin ? 'Yes' : 'No'}). Click OK for Yes, Cancel for No.`);
    const newIsAdmin = changeAdmin ? 1 : 0;

    if (newName === null || newEmail === null) {
        alert("Edit cancelled.");
        return;
    }
     if (!newName || !newEmail) {
       alert("Name and Email fields cannot be empty.");
       return;
     }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const updatedFields = {
      Name: newName,
      Email: newEmail,
      IsAdmin: newIsAdmin
    };

    axios.patch(
      `${baseUrl}/User/${foundUser.UserID}`,
      updatedFields,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    )
    .then((response) => {
       console.log("User updated successfully:", response.data);
       setSuccessMessage(`User "${foundUser.UserName}" updated successfully!`);
       setFoundUser({
         ...foundUser,
         Name: newName,
         Email: newEmail,
         IsAdmin: newIsAdmin === 1
       });
       setIsLoading(false);
    })
    .catch((error) => {
       console.error("Error updating user:", error);
       const errorMsg = error.response?.data?.message || "Failed to update user. Please try again.";
       setErrorMessage(errorMsg);
       setIsLoading(false);
    });
  };

  const handleDeleteUser = () => {
    if (!foundUser) return;
    const confirmDelete = window.confirm(`Are you sure you want to delete user "${foundUser.UserName}"? This action cannot be undone.`);
    if (!confirmDelete) return;
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    console.log("Deleting user with ID:", foundUser.UserID);

    axios.delete(
      `${baseUrl}/User/${foundUser.UserID}`,
      {
        headers: { 'Accept': 'application/json' },
        withCredentials: true
      }
    )
    .then((response) => {
      console.log("User deleted successfully");
      setSuccessMessage(`User "${foundUser.UserName}" deleted successfully.`);
      setShowUserInfo(false);
      setFoundUser(null);
      setSearchUser("");
      setIsLoading(false);
    })
    .catch((error) => {
      console.error("Error deleting user:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete user. Please try again.";
      setErrorMessage(errorMsg);
      setIsLoading(false);
    });
  };

  return (
    <div className="management-container">
      <h1>User Management</h1>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      {isLoading && <div className="loading-message">Loading...</div>}
      <div className="management-grid">
        <div className="management-section">
          <h2>Add User</h2>
          <form onSubmit={handleAddUser}>
            <div className="form-group">
              <label>Username<span className="required">*</span></label>
              <input type="text" placeholder="Username" value={userName} onChange={(e) => setUserName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Full Name<span className="required">*</span></label>
              <input type="text" placeholder="First and Last" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Email<span className="required">*</span></label>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Password<span className="required">*</span></label>
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Address<span className="required">*</span></label>
              <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <input type="text" placeholder="Post Code" value={postCode} onChange={(e) => setPostCode(e.target.value)} />
              </div>
              <div className="form-group">
                <select value={state} onChange={(e) => setState(e.target.value)}>
                  <option value="NSW">NSW</option>
                  <option value="VIC">VIC</option>
                  <option value="QLD">QLD</option>
                  <option value="SA">SA</option>
                  <option value="WA">WA</option>
                  <option value="TAS">TAS</option>
                  <option value="NT">NT</option>
                  <option value="ACT">ACT</option>
                </select>
              </div>
            </div>
            <div className="form-group checkbox-group">
                <input
                    type="checkbox"
                    id="isAdminCheckbox"
                    checked={makeAdmin}
                    onChange={(e) => setMakeAdmin(e.target.checked)}
                />
                <label htmlFor="isAdminCheckbox">Make Admin?</label>
            </div>
            <button type="submit" className="btn-add" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add User"}
            </button>
          </form>
        </div>
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