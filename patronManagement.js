import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatronManagement = () => {

  const baseUrl = "http://localhost:3001/api/inft3050/Patrons";

  const [patrons, setPatrons] = useState([]);

  const [showPatronList, setShowPatronList] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  
  // --- NEW: Navigation handler ---
  const handleBackToDashboard = () => {
    window.location.href = '/adminAccount';
  };
  // --- END NEW ---


 // Handle Load All Patrons
  const handleLoadPatrons = (event) => {
    event.preventDefault();
    
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    
    console.log("Loading all patrons from:", baseUrl);
    
    axios.get(
      baseUrl,
      {
        headers: {
          'Accept': 'application/json'
        },
        withCredentials: true
      }
    )
    .then((response) => {
      console.log("Response received:", response);
      console.log("Response data:", response.data);
      
      // Check if response has the expected structure
      if (!response.data || !response.data.list) {
        console.error("Unexpected response structure:", response.data);
        setErrorMessage("Unexpected data format from server");
        setIsLoading(false);
        return;
      }
      
      setPatrons(response.data.list);
      setShowPatronList(true); // Show the list
      setSuccessMessage("Patrons loaded successfully.");
      
    })
    .catch((error) => {
      console.error("Error loading patrons:", error.response || error);
      setErrorMessage(error.response?.data?.message || "Failed to load patrons. Check permissions.");
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  // Handle Edit Patron
  const handleEditPatron = (patron) => {
    // Use prompts to get new info
    const newName = prompt("Enter new Full Name:", patron.Name);
    const newEmail = prompt("Enter new Email:", patron.Email);

    if (newName === null || newEmail === null) {
      return; // User cancelled
    }
    
    if (!newName || !newEmail) {
      setErrorMessage("Name and Email cannot be empty.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const payload = {
      Name: newName,
      Email: newEmail
    };

    axios.patch(`${baseUrl}/${patron.UserID}`, payload, { withCredentials: true })
      .then(response => {
        setSuccessMessage("Patron updated successfully!");
        // Update local state to reflect change
        setPatrons(prevPatrons => 
          prevPatrons.map(p => 
            p.UserID === patron.UserID ? { ...p, ...payload } : p
          )
        );
      })
      .catch(error => {
        console.error("Error updating patron:", error.response || error);
        setErrorMessage(error.response?.data?.message || "Failed to update patron.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Handle Delete Patron
  const handleDeletePatron = (patron) => {
    if (!window.confirm(`Are you sure you want to delete patron "${patron.Name}" (ID: ${patron.UserID})? This cannot be undone.`)) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    axios.delete(`${baseUrl}/${patron.UserID}`, { withCredentials: true })
      .then(response => {
        setSuccessMessage(`Patron "${patron.Name}" deleted successfully.`);
        // Remove patron from local state
        setPatrons(prevPatrons => 
          prevPatrons.filter(p => p.UserID !== patron.UserID)
        );
      })
      .catch(error => {
        console.error("Error deleting patron:", error.response || error);
        setErrorMessage(error.response?.data?.message || "Failed to delete patron. They may be linked to other records (e.g., orders).");
      })
      .finally(() => {
        setIsLoading(false);
      });
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
      
      <div className="management-section">
        <h2>Patron Management</h2>
        
        {/* Display Messages */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        
        <button 
          className="btn-load"
          onClick={handleLoadPatrons}
          disabled={isLoading}
          style={{ width: '100%', padding: '10px', fontSize: '1.1em' }}
        >
          {isLoading ? "Loading..." : "Load All Patrons"}
        </button>
        
        {showPatronList && (
          <div className="scrollable-list-container">
            {patrons.length > 0 ? (
              patrons.map(patron => (
                <div key={patron.UserID} className="list-item-row">
                  <div className="list-item-info">
                    <p className="list-item-name"><strong>Name:</strong> {patron.Name}</p>
                    <p className="list-item-email"><strong>Email:</strong> {patron.Email}</p>
                    <p className="list-item-id"><strong>User ID:</strong> {patron.UserID}</p>
                  </div>
                  <div className="button-row">
                    <button 
                      className="btn-edit" 
                      onClick={() => handleEditPatron(patron)}
                      disabled={isLoading}
                    >
                      Edit Patron
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDeletePatron(patron)}
                      disabled={isLoading}
                    >
                      Delete Patron
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

