import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatronManagement = () => {
  const [patrons, setPatrons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API base URL
  const baseUrl = "http://localhost:3001/api/inft3050/Patrons";

  // Fetch all patrons
  useEffect(() => {
    const fetchPatrons = async () => {
      try {
        setLoading(true);
        const response = await axios.get(baseUrl, { withCredentials: true });
        setPatrons(response.data.list || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching patrons:", err);
        setError("Failed to fetch patrons.");
      } finally {
        setLoading(false);
      }
    };
    fetchPatrons();
  }, []);

  // Handle Edit Patron
  const handleEdit = (patron) => {
    alert(`Editing patron: ${patron.Name} (ID: ${patron.UserID})`);
  };

  // Handle Delete Patron
  const handleDelete = async (patronId, patronName) => {
    if (window.confirm(`Are you sure you want to delete "${patronName}"? This action cannot be undone.`)) {
      try {
        await axios.delete(`${baseUrl}/${patronId}`, { withCredentials: true });
        
        // Update the UI by filtering out the deleted patron
        setPatrons(prevPatrons => prevPatrons.filter(p => p.UserID !== patronId));
        alert(`Patron "${patronName}" deleted successfully.`);

      } catch (err) {
        console.error("Error deleting patron:", err);
        alert(`Failed to delete patron. ${err.response?.data?.message || 'Check console.'}`);
      }
    }
  };

  // --- Render ---
  return (
    <div className="management-container">
      <h1>Patron Management</h1>

      <div className="management-section">
        <h2>All Patrons</h2>
        
        {loading && <p>Loading patrons...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <div className="scrollable-list-container">
            {patrons.length > 0 ? (
              patrons.map(patron => (
                <div key={patron.UserID} className="list-item-row">
                  <div className="list-item-info">
                    <p className="list-item-name">{patron.Name}</p>
                    <p className="list-item-email">{patron.Email}</p>
                  </div>
                  <div className="button-row">
                    <button className="btn-edit" onClick={() => handleEdit(patron)}>
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(patron.UserID, patron.Name)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No patrons found in the database.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatronManagement;
