import { useState } from "react";
import axios from 'axios';


const UserManagement = () => {
  
  // base url for api endpoints like products and genre page
  const baseUrl = "http://localhost:3001/api/inft3050";
  // Add User state
  const [userName, setUserName] = useState(""); // stores user inout value
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(""); // stores email
  const [password, setPassword] = useState(""); //stores passwords
  const [address, setAddress] = useState(""); //addresses
  const [postCode, setPostCode] = useState(""); //postcode
  const [state, setState] = useState("NSW"); //state

  // Edit/Delete User state
  const [searchUser, setSearchUser] = useState(""); //stores username being searched for
  const [showUserInfo, setShowUserInfo] = useState(false); // Tom Changed to true - changed back to false - boolean to control if user info section is visible
  
  // new addition 
   const [foundUser, setFoundUser] = useState(null); //stores the user returned from search
  
  // loading state during operations 
  const [isLoading, setIsLoading] = useState(false);

  // error message display
   const [errorMessage, setErrorMessage] = useState("");

   // success message display
   const [successMessage, setSuccessMessage] = useState("");



   // same function used in userHelper.js to convert plain tect password in secure hash
   async function sha256(message) {
      // encode as UTF-8
      const msgBuffer = new TextEncoder().encode(message);
      // hash the message
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      // convert ArrayBuffer to Array
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      // convert bytes to hex string
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex; // returns the final hash as a hex string
}

  // same as in userHelper.js - Generate a random salt: a 32-character hex string
  const generateSalt = () => {
    const salt = window.crypto.randomUUID().replaceAll("-", "");
    //console.log("Salt: ", salt);
    return salt;
  };

  // handle Add User form submission to create a new user in thr database 

   // Handle Add User
  const handleAddUser = (event) => {
    event.preventDefault();

    // sets loading state to true 
    setIsLoading(true);

    // clears any previous error or success messsage
    setErrorMessage("");
    setSuccessMessage("");
    
    // generates a unique salt for user
    const salt = generateSalt();

    // returns a primise so then() is used to handle it
    sha256(salt + password).then((hashedPW) => {

      // creates object with database fields that exist
      const newUser = {
        UserName: userName,
        Email: email,
        Name: fullName,
        IsAdmin: 0, // only another user not admin as only one admin
        Salt: salt,
        HashPW: hashedPW,
        Address: address,      
        PostCode: postCode,    
        State: state
      };

      // makes POST request to add user to database then uses then() catch() pattern
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

        // clears the form after
        setUserName("");
        setFullName("");
        setEmail("");
        setPassword("");
        setAddress("");
        setPostCode("");
        setState("NSW");

        // sets loading back to false
        setIsLoading(false);
      })

      .catch((error) => {
        // if somethng goes wrong error message for that added 
        console.error("Error adding user:", error);

        // more detailed error message logging to understand
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

   // SEARCH USER 

  // Handle Search User
  const handleSearchUser = (event) => {
    event.preventDefault();

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setShowUserInfo(false); //changed from true

    axios.get(
      `${baseUrl}/User`,
      {
        headers: {
          'Accept': 'application/json'
        },
        withCredentials: true 
      }
    )

    .then((response) => {
      const users = response.data.list; //array like handleAddUser

      // searches for user converting it to lowercase for case sensitivity
      const user = users.find(u =>
        u.UserName.toLowerCase()=== searchUser.toLowerCase() 
      );

      if (user) {
        // user found and is stored
        setFoundUser(user);

        // show user info section
        setShowUserInfo(true); // now its true

        // success message
        setSuccessMessage(`Found user: ${user.UserName}` 
        ); 

      }
      
      else { setErrorMessage(`User "${searchUser}" not found`);
        // clears the user and hides info again
        setFoundUser(null);
        setShowUserInfo(false);
      }

      setIsLoading(false);
    })
    .catch((error) => {
      console.error("Error searching user:", error);
      setErrorMessage("Failed to search for user. Please try again.");
      setIsLoading(false); 
    })
  };


  //EDIT USER


  // Handle Edit User
  const handleEditUser = () => {
    // no user then exit
    if (!foundUser) 
      return;

    const newName = prompt("Enter new full name:", foundUser.Name);
    const newEmail = prompt("Enter new email:", foundUser.Email);

    // if any fields are emtpy error displayed
    if (!newName || !newEmail) {
      alert("All fields are needed.")
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // changes or upadtes the new values
    const updatedUser = {
      ...foundUser, //copy all existing properties
      Name: newName,
      Email: newEmail
    };

    axios.put(
      `${baseUrl}/User/${foundUser.ID}`,
      updatedUser,                         // Request body (updated user data)
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

      // update the user info to display
      setFoundUser(updatedUser);

      // back to false
      setIsLoading(false);
    })

    .catch((error) => {

      console.error("Error updating user:", error);
      const errorMsg = error.response?.data?.message || "Failed to update user. Please try again.";
      setErrorMessage(errorMsg);

      setIsLoading(false);
    });
  };

  // Handle Delete User
  const handleDeleteUser = () => {

    if (!foundUser) return;

    const confirmDelete = window.confirm(`Are you sure you want to delete user "${foundUser.UserName}"? This action cannot be undone.`
    );

    if (!confirmDelete) return;
    setIsLoading(true);
    
    // Clear messages
    setErrorMessage("");
    setSuccessMessage("");
    
    axios.delete(
      `${baseUrl}/User/${foundUser.ID}`,  
      {
        headers: { 
          'Accept': 'application/json'
        },
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

    })
  };

  return (
    <div className="management-container">
      <h1>User Management</h1>
      
      {/* Display Messages */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      {isLoading && <div className="loading-message">Loading...</div>}
      
      <div className="management-grid">
        {/* Add User Section */}
        <div className="management-section">
          <h2>Add User</h2>
          <form onSubmit={handleAddUser}>
            <div className="form-group">
              <label>
                Username<span className="required">*</span>
              </label>
              <input
                type="text"
                placeholder="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>
                Full Name<span className="required">*</span>
              </label>
              <input
                type="text"
                placeholder="First and Last"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>
                Email<span className="required">*</span>
              </label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>
                Password<span className="required">*</span>
              </label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>
                Address<span className="required">*</span>
              </label>
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Post Code"
                  value={postCode}
                  onChange={(e) => setPostCode(e.target.value)}
                />
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

            <button type="submit" className="btn-add" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add User"}
            </button>
          </form>
        </div>

        {/* Edit/Delete User Section */}
        <div className="management-section">
          <h2>Edit/Delete User</h2>
          <form onSubmit={handleSearchUser} className="search-box">
            <label>
              Search Username<span className="required">*</span>
            </label>
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
