import React, { useState } from 'react';
import axios from 'axios';

const ItemManagement = () => {
  // Add Item state
  const [itemName, setItemName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [genreId, setGenreId] = useState(""); // added Genre ID state
  const [subgenreId, setSubgenreId] = useState(""); // Renamed for clarity
  const [published, setPublished] = useState(""); // Date as string

  // Edit/Delete Item state
  const [searchItemName, setSearchItemName] = useState("");
  const [currentItem, setCurrentItem] = useState(null);
  const [showItemInfo, setShowItemInfo] = useState(false);
 

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // API base URL
  const baseUrl = "http://localhost:3001/api/inft3050/Product";

 
  // all the search edit delete functions are taken from user management page.

  // Handles Add Item
const handleAddItem = (event) => {
    event.preventDefault();

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const newItem = {
      Name: itemName,
      Author: author || null,
      Description: description || null,
      Genre: genreId,
      SubGenre: parseInt(subgenreId, 10),
      Published: published ? new Date(published).toISOString() : null,
      LastUpdatedBy: "adminAccount",
      LastUpdated: new Date().toISOString(),
    };

    // some basic validation inspo taken from doms og code
    if (!itemName || isNaN(newItem.Genre) || isNaN(newItem.SubGenre)) {
      setErrorMessage("Please fill in required fields (Name, Genre ID, SubGenre ID).");
      setIsLoading(false);
      return;
    }

    axios.post(
      baseUrl,
      newItem,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    )
    .then((response) => {
      console.log("Item added successfully:", response.data);
      setSuccessMessage(`Item "${itemName}" added successfully! ID: ${response.data.ID}`);

      // clears form
      setItemName("");
      setAuthor("");
      setDescription("");
      setGenreId("");
      setSubgenreId("");
      setPublished("");

      setIsLoading(false);
    })
    .catch((error) => {
      console.error("Error adding item:", error);
      console.error("Error response:", error.response);

       // added just to check what error if any delete later ! delete everything from here to  line 99
      let errorMsg = "Failed to add item. ";

      if (error.response) {
        const status = error.response.status;
        if (status === 401 || status === 403) {
          errorMsg += "Authentication required. Please log in as admin.";
        } else if (status === 400) {
          errorMsg += error.response.data?.message || "Invalid data format.";
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

  // Handle Search Item by Name
  const handleSearchItem = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setShowItemInfo(false);
    setCurrentItem(null);

    console.log("Searching for item:", searchItemName);
    console.log("Making GET request to:", baseUrl);

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

      // Check if response has expected structure
      if (!response.data || !response.data.list) {
        console.error("Unexpected response structure:", response.data);
        setErrorMessage("Unexpected data format from server");
        setIsLoading(false);
        return;
      }

      const items = response.data.list;

      console.log("Total items found:", items.length);
      console.log("Items array:", items);

      // Search for item (case insensitive)
      const foundItem = items.find(item =>
        item.Name.toLowerCase() === searchItemName.toLowerCase()
      );

      if (foundItem) {
        console.log("Item found:", foundItem);
        setCurrentItem(foundItem);
        setShowItemInfo(true);
        setSuccessMessage(`Found item: ${foundItem.Name}`);
      } else {
        setErrorMessage(`Item "${searchItemName}" not found`);
        setCurrentItem(null);
        setShowItemInfo(false);
      }

      setIsLoading(false);
    })
    .catch((error) => {
      console.error("Error searching item:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });

      let errorMsg = "Failed to search for item. ";

      if (error.response) {
        const status = error.response.status;

        if (status === 401 || status === 403) {
          errorMsg += "Authentication required. Please log in as admin.";
        } else if (status === 404) {
          errorMsg += "Product endpoint not found. Check the API URL.";
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


  // Handle Edit Item 
 const handleEditItem = () => {
    if (!currentItem) return;

    const newDescription = prompt("Enter new description:", currentItem.Description);

    if (newDescription === null) return; // User cancelled

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // only fields being updated are sent
    const updatedFields = {
      Description: newDescription,
      LastUpdated: new Date().toISOString(),
      LastUpdatedBy: "adminAccount"
    };

    console.log("Updating item ID:", currentItem.ID);
    console.log("Update data:", updatedFields);

    axios.patch(
      `${baseUrl}/${currentItem.ID}`,
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
      console.log("Item updated successfully:", response.data);
      setSuccessMessage(`Item "${currentItem.Name}" updated successfully!`);

      // Update the current item display
      setCurrentItem({
        ...currentItem, // may cause an error check out later
        Description: newDescription,
        LastUpdated: new Date().toISOString(),
        LastUpdatedBy: "adminAccount" // hardcoded right now change later
      });

      setIsLoading(false);
    })
    .catch((error) => {
      console.error("Error updating item:", error);
      console.error("Error response:", error.response);

      // same delete later just soem error logging
      let errorMsg = "Failed to update item. ";

      if (error.response) {
        const status = error.response.status;

        if (status === 404) {
          errorMsg += "Item not found. Check the Item ID.";
        } else if (status === 401 || status === 403) {
          errorMsg += "Authentication required. Please log in as admin.";
        } else if (status === 400) {
          errorMsg += error.response.data?.message || "Invalid data format.";
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


  // Handle Delete Item
const handleDeleteItem = () => {
    if (!currentItem) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${currentItem.Name}"? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    console.log("Deleting item with ID:", currentItem.ID);
    console.log("DELETE URL:", `${baseUrl}/${currentItem.ID}`);

    axios.delete(
      `${baseUrl}/${currentItem.ID}`,
      {
        headers: {
          'Accept': 'application/json'
        },
        withCredentials: true
      }
    )
    .then((response) => {
      console.log("Item deleted successfully:", response);
      setSuccessMessage(`Item "${currentItem.Name}" deleted successfully.`);

      setShowItemInfo(false);
      setCurrentItem(null);
      setSearchItemName("");
      setIsLoading(false);
    })
    .catch((error) => {
      console.error("Error deleting item:", error);
      console.error("Error response:", error.response);

      let errorMsg = "Failed to delete item. ";

      if (error.response) {
        const status = error.response.status;

        if (status === 400) {
          errorMsg += "Cannot delete this item. It may have related data (stock, orders) in the system.";
        } else if (status === 401 || status === 403) {
          errorMsg += "Authentication required. Please log in as admin.";
        } else if (status === 404) {
          errorMsg += "Item not found.";
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


  // --- Render ---
  return (
    <div className="management-container">
      <h1>Item Management</h1>

      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      {isLoading && <div className="loading-message">Loading...</div>}

      <div className="management-grid">
        {/* Add Item Section */}
        <div className="management-section">
          <h2>Add Item</h2>
          <form onSubmit={handleAddItem}>
            <div className="form-group">
              <label>Name<span className="required">*</span></label>
              <input
                type="text"
                placeholder="Name of Item"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Author</label>
              <input
                type="text"
                placeholder="Author Name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Genre ID<span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="Genre ID"
                  value={genreId}
                  onChange={(e) => setGenreId(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>SubGenre ID<span className="required">*</span></label>
                <input
                  type="number"
                  placeholder="SubGenre ID"
                  value={subgenreId}
                  onChange={(e) => setSubgenreId(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Published Date</label>
              <input
                type="date"
                value={published}
                onChange={(e) => setPublished(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-add" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Item"}
            </button>
          </form>
        </div>

        {/* Edit/Delete Item Section */}
        <div className="management-section">
          <h2>Edit/Delete Item</h2>
          <form onSubmit={handleSearchItem} className="search-box">
            <label>
              Search by Name<span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter exact item name"
              value={searchItemName}
              onChange={(e) => setSearchItemName(e.target.value)}
              required
            />
            <button type="submit" className="btn-search" disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search Item'}
            </button>
          </form>

          {showItemInfo && currentItem && (
            <>
              <div className="item-info">
                <h3>Item Details</h3>
                <p><strong>ID:</strong> {currentItem.ID}</p>
                <p><strong>Name:</strong> {currentItem.Name}</p>
                <p><strong>Author:</strong> {currentItem.Author || 'N/A'}</p>
                <p><strong>Description:</strong> {currentItem.Description || 'N/A'}</p>
                <p><strong>Published:</strong> {currentItem.Published ? new Date(currentItem.Published).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Genre ID:</strong> {typeof currentItem.Genre === 'number' ? currentItem.Genre : 'N/A'}</p>
                <p><strong>SubGenre ID:</strong> {currentItem.SubGenre}</p>
                <p><strong>Last Updated:</strong> {currentItem.LastUpdated ? new Date(currentItem.LastUpdated).toLocaleString() : 'N/A'}</p>
                <p><strong>Last Updated By:</strong> {currentItem.LastUpdatedBy || 'N/A'}</p>
              </div>

              <div className="button-row">
                <button className="btn-edit" onClick={handleEditItem} disabled={isLoading}>
                  Edit Description
                </button>
                <button className="btn-delete" onClick={handleDeleteItem} disabled={isLoading}>
                  Delete Item
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemManagement;