// src/viewAccounts.js
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

  // --- NEW: Function to go back ---
  const handleBackToDashboard = () => {
    window.location.href = '/employeePage';
  };

  return (
    <div className="main-container">
      <h1 className="main-heading custom-header-color">View All Accounts</h1>

      {/* --- NEW: Back Button Added --- */}
      <button 
        onClick={handleBackToDashboard} 
        className="admin-manage-button" // Re-using class from employeePage.js
        style={{ marginBottom: '20px', width: 'auto' }} // Added style for good spacing
      >
        &larr; Back to Employee Dashboard
      </button>

      {loading && <p>Loading accounts...</p>}
      {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

          {/* Admin/Employee Users Section */}
          <section className="management-section">
            <h2>Admin/Employee Users ({users.length})</h2>
            <div className="scrollable-list-container" style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
              {users.length > 0 ? (
                users.map(user => (
                  <div key={`user-${user.UserID}`} className="list-item-row" style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}>
                    <p><strong>ID:</strong> {user.UserID}</p>
                    <p><strong>Username:</strong> {user.UserName}</p>
                    <p><strong>Name:</strong> {user.Name}</p>
                    <p><strong>Email:</strong> {user.Email || 'N/A'}</p>
                    <p><strong>Is Admin:</strong> {user.IsAdmin ? 'Yes' : 'No'}</p>
                  </div>
                ))
              ) : (
                <p>No admin/employee users found.</p>
              )}
            </div>
          </section>

          {/* Patron Accounts Section */}
          <section className="management-section">
            <h2>Patron Accounts ({patrons.length})</h2>
             <div className="scrollable-list-container" style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
              {patrons.length > 0 ? (
                patrons.map(patron => (
                  <div key={`patron-${patron.UserID}`} className="list-item-row" style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}>
                     <p><strong>ID:</strong> {patron.UserID}</p>
                     <p><strong>Name:</strong> {patron.Name}</p>
                     <p><strong>Email:</strong> {patron.Email}</p>
                  </div>
                ))
              ) : (
                <p>No patron accounts found.</p>
              )}
             </div>
          </section>

        </div>
      )}
    </div>
  );
};

export default ViewAccounts;