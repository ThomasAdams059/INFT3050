import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatronManagement = () => {

  const baseUrl = "http://localhost:3001/api/inft3050/Patrons";

  const [patrons, setPatrons] = useState([]);
  
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [successMessage, setSuccessMessage] = useState("");


  

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
      
      const patronList = response.data.list;
      console.log("Total patrons found:", patronList.length);
      
      // Store the patrons in state
      setPatrons(patronList);
      
      // Show the patron list section
      setShowPatronList(true);
      
      // Success message
      setSuccessMessage(`Loaded ${patronList.length} patron(s) successfully!`);
      
      setIsLoading(false);
    })
    .catch((error) => {
      console.error("Error loading patrons:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      
      let errorMsg = "Failed to load patrons. ";
      
      if (error.response) {
        const status = error.response.status;
        
        if (status === 401 || status === 403) {
          errorMsg += "Authentication required. Please log in as admin first.";
        } else if (status === 404) {
          errorMsg += "Patrons endpoint not found. Check the API URL.";
        } else if (status === 500) {
          errorMsg += "Server error. Please try again later.";
        } else {
          errorMsg += `Server error (${status}). ${error.response.data?.message || ''}`;
        }
      } else if (error.request) {
        errorMsg += "No response from server. Is Docker running?";
      } else {
        errorMsg += error.message;
      }
      
      setErrorMessage(errorMsg);
      setIsLoading(false);
    });
  };

  // Handle Edit Patron
  const handleEditPatron = (patron) => {
    // Prompt for new values
    const newName = prompt("Enter new full name:", patron.Name);
    const newEmail = prompt("Enter new email:", patron.Email);
    
    // If user cancels or leaves fields empty
    if (!newName || !newEmail) {
      alert("All fields are needed.");
      return;
    }
    
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    
    // Create object with only the fields to be updated
    const updatedFields = {
      Name: newName,
      Email: newEmail
    };
    
    console.log("Updating patron with ID:", patron.UserID);
    console.log("PATCH URL:", `${baseUrl}/${patron.UserID}`);
    console.log("Updated fields:", updatedFields);
    
    axios.patch(
      `${baseUrl}/${patron.UserID}`,
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
      console.log("Patron updated successfully:", response.data);
      setSuccessMessage(`Patron "${patron.Name}" updated successfully!`);
      
      // Update the patron in the local state
      setPatrons(prevPatrons => 
        prevPatrons.map(p => 
          p.UserID === patron.UserID 
            ? { ...p, Name: newName, Email: newEmail }
            : p
        )
      );
      
      setIsLoading(false);
    })
    .catch((error) => {
      console.error("Error updating patron:", error);
      const errorMsg = error.response?.data?.message || 
                       error.response?.data?.error || 
                       "Failed to update patron. Please try again.";
      setErrorMessage(errorMsg);
      setIsLoading(false);
    });
  };

  // Handle Delete Patron
  const handleDeletePatron = (patron) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete patron "${patron.Name}"? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;
    
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    
    console.log("Deleting patron with ID:", patron.UserID);
    console.log("DELETE URL:", `${baseUrl}/${patron.UserID}`);
    
    axios.delete(
      `${baseUrl}/${patron.UserID}`,
      {
        headers: {
          'Accept': 'application/json'
        },
        withCredentials: true
      }
    )
    .then((response) => {
      console.log("Patron deleted successfully:", response);
      setSuccessMessage(`Patron "${patron.Name}" deleted successfully.`);
      
      // Remove the deleted patron from the local state
      setPatrons(prevPatrons => 
        prevPatrons.filter(p => p.UserID !== patron.UserID)
      );
      
      setIsLoading(false);
    })
    .catch((error) => {
      console.error("Error deleting patron:", error);
      const errorMsg = error.response?.data?.message || 
                       error.response?.data?.error || 
                       "Failed to delete patron. Please try again.";
      setErrorMessage(errorMsg);
      setIsLoading(false);
    });
  };


  // --- Render ---
    return (
    <div className="management-container">
      <h1>Patron Management</h1>
      
      {/* Display Messages */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      {isLoading && <div className="loading-message">Loading...</div>}
      
      <div className="management-section">
        <h2>View All Patrons</h2>
        
        <button 
          onClick={handleLoadPatrons} 
          className="btn-search"
          disabled={isLoading}
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
