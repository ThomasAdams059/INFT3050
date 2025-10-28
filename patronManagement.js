import { useState } from "react";


const PatronManagement = () => {
  // Add User state
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [postCode, setPostCode] = useState("");
  const [state, setState] = useState("NSW");

  // Edit/Delete User state
  const [searchPatron, setSearchPatron] = useState("");
  const [showPatronInfo, setShowPatronInfo] = useState(true); // Changed to true

  // Handle Add User
  const handleAddPatron = (event) => {
    event.preventDefault();
    // Clear form after submission
    setUserName("");
    setEmail("");
    setPassword("");
    setAddress("");
    setPostCode("");
    setState("NSW");
  };

  // Handle Search Patron
  const handleSearchPatron = (event) => {
    event.preventDefault();
    setShowPatronInfo(true);
  };

  // Handle Edit Patron
  const handleEditPatron = () => {
    // Edit functionality will be added later
  };

  // Handle Delete Patron
  const handleDeletePatron = () => {
    setShowUserInfo(false);
    setSearchUser("");
  };

  return (
    <div className="management-container">
      <h1>Patron Management</h1>
      
      <div className="management-grid">
        {/* Add Patron Section */}
        <div className="management-section">
          <h2>Add Patron</h2>
          <form onSubmit={handleAddPatron}>
            <div className="form-group">
              <label>
                Name<span className="required">*</span>
              </label>
              <input
                type="text"
                placeholder="First and Last"
                value={userName}
                onChange={(e) => setPatronName(e.target.value)}
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

            <button type="submit" className="btn-add">
              Add User
            </button>
          </form>
        </div>

        {/* Edit/Delete User Section */}
        <div className="management-section">
          <h2>Edit/Delete User</h2>
          <form onSubmit={handleSearchUser} className="search-box">
            <label>
              Name<span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="Search for user"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              required
            />
          </form>

          {showUserInfo && (
            <>
              <div className="user-info">
                <h3>User Info</h3>
                <p><strong>Full Name:</strong> John Smith</p>
                <p><strong>Email Address:</strong> johnsmith@gmail.com</p>
                <p><strong>Address:</strong> 123 street, suburb</p>
              </div>

              <div className="button-row">
                <button className="btn-edit" onClick={handleEditUser}>
                  Edit User
                </button>
                <button className="btn-delete" onClick={handleDeleteUser}>
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
