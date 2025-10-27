import React, { useState } from 'react';
import axios from 'axios';

const ItemManagement = () => {
  // Add Item state
  const [itemName, setItemName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [genreId, setGenreId] = useState(""); // Added Genre ID state
  const [subgenreId, setSubgenreId] = useState(""); // Renamed for clarity
  const [published, setPublished] = useState(""); // Date as string

  // Edit/Delete Item state
  const [searchItemName, setSearchItemName] = useState("");
  const [currentItem, setCurrentItem] = useState(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // API base URL
  const baseUrl = "http://localhost:3001/api/inft3050/Product";

  // --- API Functions ---

  // Handle Add Item
  const handleAddItem = async (event) => {
    event.preventDefault();
    const newItem = {
      Name: itemName,
      Author: author || null, // Allow empty author
      Description: description || null, // Allow empty description
      Genre: parseInt(genreId, 10), // Parse to integer
      SubGenre: parseInt(subgenreId, 10), // Parse to integer
      Published: published ? new Date(published).toISOString() : null,
      LastUpdatedBy: "adminAccount", // Example user
      LastUpdated: new Date().toISOString(),
    };

    // Basic validation
    if (!itemName || isNaN(newItem.Genre) || isNaN(newItem.SubGenre)) {
      alert("Please fill in required fields (Name, Genre ID, SubGenre ID).");
      return;
    }

    try {
      const response = await axios.post(baseUrl, newItem, { withCredentials: true });
      alert(`Item "${response.data.Name}" added successfully! ID: ${response.data.ID}`);
      // Clear form
      setItemName("");
      setAuthor("");
      setDescription("");
      setGenreId("");
      setSubgenreId("");
      setPublished("");
    } catch (error) {
      console.error("Error adding item:", error.response ? error.response.data : error);
      alert(`Failed to add item. ${error.response?.data?.message || 'Check console.'}`);
    }
  };

  // Handle Search Item by Name
  const handleSearchItem = async (event) => {
    event.preventDefault();
    setLoadingSearch(true);
    setCurrentItem(null);
    setSearchError(null);

    try {
      // Fetch all and filter client-side
      const response = await axios.get(baseUrl, { withCredentials: true });
      const foundItem = response.data.list.find(item =>
        item.Name.toLowerCase() === searchItemName.toLowerCase()
      );

      if (foundItem) {
        setCurrentItem(foundItem);
      } else {
        setSearchError("Item not found.");
      }
    } catch (error) {
      console.error("Error searching item:", error);
      setSearchError("Failed to search for item.");
    } finally {
      setLoadingSearch(false);
    }
  };

  // Handle Edit Item (Placeholder - a real edit needs a form)
  const handleEditItem = async () => {
    if (!currentItem) return;

    const newDescription = prompt("Enter new description:", currentItem.Description);
    if (newDescription !== null) {
      // Prepare the data matching the API structure
      const updatedItemData = {
        ID: currentItem.ID, // Keep the ID
        Name: currentItem.Name, // Keep existing Name
        Author: currentItem.Author, // Keep existing Author
        Description: newDescription, // Update Description
        Genre: currentItem.Genre, // Keep existing Genre ID
        SubGenre: currentItem.SubGenre, // Keep existing SubGenre ID
        Published: currentItem.Published, // Keep existing Published date
        LastUpdated: new Date().toISOString(), // Update timestamp
        LastUpdatedBy: "adminAccount", // Update user
      };

      try {
        const response = await axios.put(`${baseUrl}/${currentItem.ID}`, updatedItemData, { withCredentials: true });
        setCurrentItem(response.data);
        alert(`Item "${response.data.Name}" updated successfully!`);
      } catch (error) {
        console.error("Error updating item:", error.response ? error.response.data : error);
        alert(`Failed to update item. ${error.response?.data?.message || 'Check console.'}`);
      }
    }
  };

  // Handle Delete Item
  const handleDeleteItem = async () => {
    if (!currentItem || !window.confirm(`Are you sure you want to delete "${currentItem.Name}"?`)) {
      return;
    }

    try {
      await axios.delete(`${baseUrl}/${currentItem.ID}`, { withCredentials: true });
      alert(`Item "${currentItem.Name}" deleted successfully!`);
      setCurrentItem(null);
      setSearchItemName("");
    } catch (error) {
      console.error("Error deleting item:", error.response ? error.response.data : error);
      alert(`Failed to delete item. ${error.response?.data?.message || 'Check console.'}`);
    }
  };

  // --- Render ---
  return (
    <div className="management-container">
      <h1>Item Management</h1>

      <div className="management-grid">
        {/* Add Item Section */}
        <div className="management-section">
          <h2>Add Item</h2>
          <form onSubmit={handleAddItem}>
            <div className="form-group">
              <label>Name<span className="required">*</span></label>
              <input type="text" placeholder="Name of Item" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Author</label>
              <input type="text" placeholder="Author Name" value={author} onChange={(e) => setAuthor(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="form-row"> {/* Group Genre and SubGenre */}
              <div className="form-group">
                <label>Genre ID<span className="required">*</span></label>
                <input type="number" placeholder="Genre ID" value={genreId} onChange={(e) => setGenreId(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>SubGenre ID<span className="required">*</span></label>
                <input type="number" placeholder="SubGenre ID" value={subgenreId} onChange={(e) => setSubgenreId(e.target.value)} required />
              </div>
            </div>
             <div className="form-group">
               <label>Published Date</label>
               <input type="date" value={published} onChange={(e) => setPublished(e.target.value)} />
             </div>
            {/* Removed Type dropdown as it's implied by Genre/SubGenre in your API structure */}
            <button type="submit" className="btn-add">Add Item</button>
          </form>
        </div>

        {/* Edit/Delete Item Section */}
        <div className="management-section">
          <h2>Edit/Delete Item</h2>
          <form onSubmit={handleSearchItem} className="search-box">
            <div className="form-group">
                <label>Search by Name<span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="Enter exact item name"
                  value={searchItemName}
                  onChange={(e) => setSearchItemName(e.target.value)}
                  required
                />
            </div>
            <button type="submit" className="btn-search" disabled={loadingSearch}>
              {loadingSearch ? 'Searching...' : 'Search Item'}
            </button>
          </form>

          {searchError && <p className="error-message">{searchError}</p>}

          {currentItem && (
            <>
              <div className="item-info">
                    <h3>Item Details</h3>
                    <p><strong>ID:</strong> {currentItem.ID}</p>
                    <p><strong>Name:</strong> {currentItem.Name}</p>
                    <p><strong>Author:</strong> {currentItem.Author || 'N/A'}</p>
                    <p><strong>Description:</strong> {currentItem.Description || 'N/A'}</p>
                    <p><strong>Published:</strong> {currentItem.Published ? new Date(currentItem.Published).toLocaleDateString() : 'N/A'}</p>
                    
                    {/* --- CORRECTED LINE --- */}
                    {/* Check if Genre is a number before rendering, handle object case */}
                    <p><strong>Genre ID:</strong> {typeof currentItem.Genre === 'number' ? currentItem.Genre : 'N/A'}</p> 
                    
                    <p><strong>SubGenre ID:</strong> {currentItem.SubGenre}</p>
                    <p><strong>Last Updated:</strong> {currentItem.LastUpdated ? new Date(currentItem.LastUpdated).toLocaleString() : 'N/A'}</p>
                    <p><strong>Last Updated By:</strong> {currentItem.LastUpdatedBy || 'N/A'}</p>
                    </div>

              <div className="button-row">
                {/* Edit Button - Basic implementation */}
                <button className="btn-edit" onClick={handleEditItem}>
                  Edit Description (Prompt)
                </button>
                <button className="btn-delete" onClick={handleDeleteItem}>
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