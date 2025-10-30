import React, { useState, useEffect } from 'react';
import axios from 'axios';

// API URLs
const USERS_URL = "http://localhost:3001/api/inft3050/User";
const PATRONS_URL = "http://localhost:3001/api/inft3050/Patrons";

const ViewAccounts = () => {
  const [users, setUsers] = useState([]);
  const [patrons, setPatrons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- NEW: State for the filter input ---
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      setError(null);
      try {
        const [userResponse, patronResponse] = await Promise.all([
          axios.get(USERS_URL, { withCredentials: true }),
          axios.get(PATRONS_URL, { withCredentials: true })
        ]);

        setUsers(userResponse.data.list || []);
        setPatrons(patronResponse.data.list || []);

      } catch (err) {
        console.error("Error fetching accounts:", err);
        setError("Failed to load account data. Ensure you are logged in with appropriate permissions.");
        if (err.response?.status === 401 || err.response?.status === 403) {
            setError("Unauthorized: You do not have permission to view these accounts.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const handleBackToDashboard = () => {
    window.location.href = '/employeePage';
  };

  // --- NEW: Filter logic ---
  const lowerCaseFilter = filterText.toLowerCase();

  // Filter Admin/Employee users
  const filteredUsers = users.filter(user => {
    const idMatch = user.UserID.toString().includes(lowerCaseFilter);
    const nameMatch = user.Name && user.Name.toLowerCase().includes(lowerCaseFilter);
    const usernameMatch = user.UserName && user.UserName.toLowerCase().includes(lowerCaseFilter);
    const emailMatch = user.Email && user.Email.toLowerCase().includes(lowerCaseFilter);
    return idMatch || nameMatch || usernameMatch || emailMatch;
  });

  // Filter Patrons
  const filteredPatrons = patrons.filter(patron => {
    const idMatch = patron.UserID.toString().includes(lowerCaseFilter);
    const nameMatch = patron.Name && patron.Name.toLowerCase().includes(lowerCaseFilter);
    const emailMatch = patron.Email && patron.Email.toLowerCase().includes(lowerCaseFilter);
    // Patrons don't have UserName, they use Email
    return idMatch || nameMatch || emailMatch;
  });
  // --- END Filter logic ---

  return (
    <div className="main-container">
      <h1 className="main-heading custom-header-color">View All Accounts</h1>

      <button 
        onClick={handleBackToDashboard} 
        className="admin-manage-button" // Re-using class
        style={{ marginBottom: '20px', width: 'auto' }}
      >
        &larr; Back to Employee Dashboard
      </button>

      {/* --- NEW: Filter Input --- */}
      <div className="filter-container" style={{ marginBottom: '20px', marginTop: '10px' }}>
        <label htmlFor="accountFilter" style={{ marginRight: '10px', fontWeight: 'bold' }}>
          Filter Accounts (ID, Name, Username, Email):
        </label>
        <input
          id="accountFilter"
          type="text"
          placeholder="Start typing to filter..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{ padding: '8px', fontSize: '1em', width: '300px' }}
        />
      </div>
      {/* --- END NEW Filter Input --- */}

      {loading && <p>Loading accounts...</p>}
      {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

          {/* --- UPDATED: Admin/Employee Users Section --- */}
          <section className="management-section">
            <h2>Admin/Employee Users ({filteredUsers.length})</h2>
            <div className="scrollable-list-container" style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <div key={`user-${user.UserID}`} className="list-item-row" style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}>
                    <p><strong>ID:</strong> {user.UserID}</p>
                    <p><strong>Username:</strong> {user.UserName}</p>
                    <p><strong>Name:</strong> {user.Name}</p>
                    <p><strong>Email:</strong> {user.Email || 'N/A'}</p>
                    <p><strong>Is Admin:</strong> {user.IsAdmin ? 'Yes' : 'No'}</p>
                  </div>
                ))
              ) : (
                <p>{filterText ? 'No users match your filter.' : 'No admin/employee users found.'}</p>
              )}
            </div>
          </section>

          {/* --- UPDATED: Patron Accounts Section --- */}
          <section className="management-section">
            <h2>Patron Accounts ({filteredPatrons.length})</h2>
             <div className="scrollable-list-container" style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
              {filteredPatrons.length > 0 ? (
                filteredPatrons.map(patron => (
                  <div key={`patron-${patron.UserID}`} className="list-item-row" style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}>
                     <p><strong>ID:</strong> {patron.UserID}</p>
                     <p><strong>Name:</strong> {patron.Name}</p>
                     <p><strong>Email:</strong> {patron.Email}</p>
                  </div>
                ))
              ) : (
                <p>{filterText ? 'No patrons match your filter.' : 'No patron accounts found.'}</p>
              )}
             </div>
          </section>

        </div>
      )}
    </div>
  );
};

export default ViewAccounts;