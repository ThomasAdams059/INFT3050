import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- UPDATED: Accept currentUser prop ---
const ItemManagement = ({ currentUser }) => {
  
  // --- NEW: Handle nested user object (consistent with other fixes) ---
  const user = currentUser ? (currentUser.user || currentUser) : null;

  // --- State for Add Item form ---
  const [itemName, setItemName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [published, setPublished] = useState(""); // Will be type="date"
  
  // --- NEW: State for dynamic dropdowns ---
  const [genres, setGenres] = useState([]);
  const [genreId, setGenreId] = useState(""); 
  const [subGenreOptions, setSubGenreOptions] = useState([]);
  const [subgenreId, setSubgenreId] = useState("");
  
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sourceId, setSourceId] = useState("1"); // Default to 1 (Hard Copy Book)

  // --- State for Edit/Delete form ---
  const [searchItemName, setSearchItemName] = useState("");
  const [currentItem, setCurrentItem] = useState(null);
  const [showItemInfo, setShowItemInfo] = useState(false);
  const [stocktakeEntries, setStocktakeEntries] = useState([]);

  // --- Separated state for messages/loading ---
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);
  const [errorAdd, setErrorAdd] = useState("");
  const [successAdd, setSuccessAdd] = useState("");
  
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [errorSearch, setErrorSearch] = useState("");
  const [successSearch, setSuccessSearch] = useState("");

  // API base URLs
  const baseUrl = "http://localhost:3001/api/inft3050";
  const productBaseUrl = `${baseUrl}/Product`;
  const stocktakeBaseUrl = `${baseUrl}/Stocktake`;

  // --- NEW: Navigation handler ---
  const handleBackToDashboard = () => {
    window.location.href = '/adminAccount';
  };
  // --- END NEW ---

  // --- NEW: Fetch Genres on component load ---
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        // --- FIXED: Added withCredentials ---
        const response = await axios.get(`${baseUrl}/Genre`, { withCredentials: true });
        setGenres(response.data.list || []);
      } catch (err) {
        console.error("Error fetching genres:", err);
        setErrorAdd("Failed to load genres. Refresh the page.");
      }
    };
    fetchGenres();
  }, []);

  // --- NEW: Fetch Subgenres when Genre changes ---
  useEffect(() => {
    const fetchSubgenres = async () => {
      if (!genreId) {
        setSubGenreOptions([]);
        setSubgenreId("");
        return;
      }
      
      let subGenreEndpoint = "";
      switch (parseInt(genreId)) {
        case 1: // Book
          subGenreEndpoint = `${baseUrl}/BookGenre`;
          break;
        case 2: // Movie
          subGenreEndpoint = `${baseUrl}/MovieGenre`;
          break;
        case 3: // Game
          subGenreEndpoint = `${baseUrl}/GameGenre`;
          break;
        default:
          setSubGenreOptions([]);
          setSubgenreId("");
          return;
      }

      try {
        // --- FIXED: Added withCredentials ---
        const response = await axios.get(subGenreEndpoint, { withCredentials: true });
        setSubGenreOptions(response.data.list || []);
        setSubgenreId(""); // Reset subgenre selection
      } catch (err) {
        console.error("Error fetching subgenres:", err);
        setErrorAdd("Failed to load subgenres.");
      }
    };
    fetchSubgenres();
  }, [genreId]); // Dependency array

  // --- NEW: Handle Add Item ---
  const handleAddItem = async (event) => {
    event.preventDefault();
    if (!user) {
      setErrorAdd("You must be logged in to add an item.");
      return;
    }
    if (!itemName || !author || !genreId || !subgenreId || !price || !quantity || !sourceId || !published) {
      setErrorAdd("Please fill out all fields.");
      return;
    }
    
    setIsLoadingAdd(true);
    setErrorAdd("");
    setSuccessAdd("");

    try {
      // Step 1: Create the Product
      const productPayload = {
        Name: itemName,
        Author: author,
        Description: description,
        Genre: parseInt(genreId),
        SubGenre: parseInt(subgenreId),
        Published: published,
        LastUpdatedBy: user.UserName, // Use logged-in user's name
        LastUpdated: new Date().toISOString()
      };

      const productResponse = await axios.post(productBaseUrl, productPayload, { withCredentials: true });
      const newProductId = productResponse.data.ID;

      // Step 2: Create the initial Stocktake entry for this product
      const stocktakePayload = {
        SourceId: parseInt(sourceId),
        ProductId: newProductId,
        Quantity: parseInt(quantity),
        Price: parseFloat(price)
      };

      await axios.post(stocktakeBaseUrl, stocktakePayload, { withCredentials: true });

      setSuccessAdd(`Product '${itemName}' (ID: ${newProductId}) and its stock item were created successfully!`);
      setItemName("");
      setAuthor("");
      setDescription("");
      setPublished("");
      setGenreId("");
      setSubgenreId("");
      setPrice("");
      setQuantity("");
      setSourceId("1");

    } catch (error) {
      console.error("Error adding item:", error.response || error);
      setErrorAdd(error.response?.data?.message || "Failed to create item. Check all fields.");
    } finally {
      setIsLoadingAdd(false);
    }
  };

  // --- NEW: Handle Search Item ---
  const handleSearchItem = async (event) => {
    event.preventDefault();
    setIsLoadingSearch(true);
    setErrorSearch("");
    setSuccessSearch("");
    setShowItemInfo(false);
    setCurrentItem(null);
    setStocktakeEntries([]);

    try {
      // 1. Fetch all products to find the one we want
      const productsResponse = await axios.get(productBaseUrl, { withCredentials: true });
      const product = (productsResponse.data.list || []).find(
        p => p.Name.toLowerCase() === searchItemName.toLowerCase()
      );

      if (!product) {
        setErrorSearch(`Product "${searchItemName}" not found.`);
        setIsLoadingSearch(false);
        return;
      }
      
      setCurrentItem(product);

      // 2. Fetch all stocktake items and filter for this product
      const stocktakeResponse = await axios.get(stocktakeBaseUrl, { withCredentials: true });
      const entries = (stocktakeResponse.data.list || [])
        .filter(s => s.ProductId === product.ID)
        // Enrich with source name (as seen in viewOrders.js)
        .map(entry => ({
          ...entry,
          Source: entry.Source || { SourceName: `Source ID ${entry.SourceId}` }
        }));
        
      setStocktakeEntries(entries);
      setSuccessSearch(`Found product ID: ${product.ID}`);
      setShowItemInfo(true);

    } catch (error) {
      console.error("Error searching item:", error.response || error);
      setErrorSearch(error.response?.data?.message || "Failed to search for item.");
    } finally {
      setIsLoadingSearch(false);
    }
  };

  // --- NEW: Handle Edit Item (Product Details) ---
  const handleEditItem = async () => {
    if (!currentItem || !user) return;

    const newName = prompt("Enter new Item Name:", currentItem.Name);
    const newAuthor = prompt("Enter new Author:", currentItem.Author);
    const newDesc = prompt("Enter new Description:", currentItem.Description);

    if (newName === null || newAuthor === null || newDesc === null) {
      return; // User cancelled
    }

    setIsLoadingSearch(true);
    setErrorSearch("");
    setSuccessSearch("");

    try {
      const payload = {
        Name: newName,
        Author: newAuthor,
        Description: newDesc,
        LastUpdatedBy: user.UserName,
        LastUpdated: new Date().toISOString()
      };

      await axios.patch(`${productBaseUrl}/${currentItem.ID}`, payload, { withCredentials: true });
      
      setSuccessSearch("Product details updated successfully!");
      // Update local state to reflect change
      setCurrentItem(prev => ({ ...prev, ...payload }));

    } catch (error) {
      console.error("Error updating item:", error.response || error);
      setErrorSearch(error.response?.data?.message || "Failed to update item.");
    } finally {
      setIsLoadingSearch(false);
    }
  };

  // --- NEW: Handle Delete Item ---
  const handleDeleteItem = async () => {
    if (!currentItem) return;
    if (!window.confirm(`Are you sure you want to delete "${currentItem.Name}"? This action CANNOT be undone.`)) {
      return;
    }

    setIsLoadingSearch(true);
    setErrorSearch("");
    setSuccessSearch("");

    try {
      await axios.delete(`${productBaseUrl}/${currentItem.ID}`, { withCredentials: true });

      setSuccessSearch(`Product "${currentItem.Name}" was deleted successfully.`);
      // Clear the form
      setCurrentItem(null);
      setShowItemInfo(false);
      setSearchItemName("");
      setStocktakeEntries([]);

    } catch (error) {
      console.error("Error deleting item:", error.response || error);
      setErrorSearch(error.response?.data?.message || "Failed to delete item. It may be part of an order.");
    } finally {
      setIsLoadingSearch(false);
    }
  };

  // --- NEW: Handle Edit Stock Item (Price/Quantity) ---
  const handleEditStockItem = async (entry) => {
    const newPrice = prompt(`Enter new price for ${entry.Source.SourceName} (ID: ${entry.ItemId}):`, entry.Price);
    const newQuantity = prompt(`Enter new quantity for ${entry.Source.SourceName} (ID: ${entry.ItemId}):`, entry.Quantity);
    
    const parsedPrice = parseFloat(newPrice);
    const parsedQuantity = parseInt(newQuantity, 10);

    if (isNaN(parsedPrice) || isNaN(parsedQuantity)) {
      setErrorSearch("Invalid price or quantity. Must be numbers.");
      return;
    }
    
    setIsLoadingSearch(true);
    setErrorSearch("");
    setSuccessSearch("");

    try {
      const payload = {
        Price: parsedPrice,
        Quantity: parsedQuantity
      };

      await axios.patch(`${stocktakeBaseUrl}/${entry.ItemId}`, payload, { withCredentials: true });

      setSuccessSearch(`Stock item ${entry.ItemId} updated successfully!`);
      // Update local state to reflect change
      setStocktakeEntries(prevEntries =>
        prevEntries.map(e =>
          e.ItemId === entry.ItemId
            ? { ...e, Price: parsedPrice, Quantity: parsedQuantity }
            : e
        )
      );
    } catch (error) {
      console.error("Error updating stock item:", error.response || error);
      setErrorSearch(error.response?.data?.message || "Failed to update stock item.");
    } finally {
      setIsLoadingSearch(false);
    }
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
      
      <h1>Item Management</h1>
      
      <div className="management-grid">
        {/* --- ADD ITEM FORM --- */}
        <div className="management-section">
          <h2>Add Item</h2>
          {/* --- UPDATED: Converted to a functional form --- */}
          <form onSubmit={handleAddItem}>
            {/* ... (Error/Success messages for Add) ... */}
            {errorAdd && <div className="error-message">{errorAdd}</div>}
            {successAdd && <div className="success-message">{successAdd}</div>}

            <div className="form-group">
              <label>Item Name<span className="required">*</span></label>
              <input type="text" placeholder="Product Name" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Author/Director/Developer<span className="required">*</span></label>
              <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea placeholder="Product Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Published Date<span className="required">*</span></label>
              {/* --- UPDATED: Input type to date --- */}
              <input type="date" value={published} onChange={(e) => setPublished(e.target.value)} required />
            </div>
            
            {/* --- NEW: Dynamic Dropdowns --- */}
            <div className="form-group">
              <label>Genre<span className="required">*</span></label>
              <select value={genreId} onChange={(e) => setGenreId(e.target.value)} required>
                {/* --- FIXED: Added unique key --- */}
                <option key="genre-placeholder" value="">Select Genre...</option>
                {genres.map(g => (
                  <option key={g.genreID} value={g.genreID}>{g.Name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Subgenre<span className="required">*</span></label>
              <select value={subgenreId} onChange={(e) => setSubgenreId(e.target.value)} required disabled={!genreId}>
                {/* --- FIXED: Added unique key --- */}
                <option key="subgenre-placeholder" value="">Select Subgenre...</option>
                {subGenreOptions.map(sg => (
                  <option key={sg.SubGenreID} value={sg.SubGenreID}>{sg.Name}</option>
                ))}
              </select>
            </div>
            {/* --- END NEW --- */}

            <div className="form-group">
              <label>Source ID<span className="required">*</span></label>
              <input type="number" placeholder="e.g., 1 for Hard Copy" value={sourceId} onChange={(e) => setSourceId(e.target.value)} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Price<span className="required">*</span></label>
                <input type="number" step="0.01" placeholder="Price (e.g., 24.99)" value={price} onChange={(e) => setPrice(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Quantity<span className="required">*</span></label>
                <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
              </div>
            </div>
            <button type="submit" className="btn-add" disabled={isLoadingAdd}>
              {isLoadingAdd ? "Adding..." : "Add Item"}
            </button>
          </form>
        </div>
        
        {/* --- EDIT/DELETE ITEM FORM --- */}
        <div className="management-section">
          <h2>Edit/Delete Item</h2>
          {/* --- UPDATED: Converted to a functional form --- */}
          <form onSubmit={handleSearchItem} className="search-box">
            {/* ... (Error/Success messages for Search) ... */}
            {errorSearch && <div className="error-message">{errorSearch}</div>}
            {successSearch && <div className="success-message">{successSearch}</div>}

            <label>Search by Item Name<span className="required">*</span></label>
            <input
              type="text"
              placeholder="Enter exact item name..."
              value={searchItemName}
              onChange={(e) => setSearchItemName(e.target.value)}
              required
            />
            <button type="submit" className="btn-search" disabled={isLoadingSearch}>
              {isLoadingSearch ? "Searching..." : "Search"}
            </button>
          </form>

          {/* --- UPDATED: Info box now functional --- */}
          {showItemInfo && currentItem && (
            <>
              <div className="user-info">
                <h3>Product Details (ID: {currentItem.ID})</h3>
                <p><strong>Name:</strong> {currentItem.Name}</p>
                <p><strong>Author:</strong> {currentItem.Author}</p>
                <p><strong>Description:</strong> {currentItem.Description}</p>
              </div>
              <div className="button-row">
                <button className="btn-edit" onClick={handleEditItem} disabled={isLoadingSearch}>
                  Edit Product Details
                </button>
                <button className="btn-delete" onClick={handleDeleteItem} disabled={isLoadingSearch}>
                  Delete Product
                </button>
              </div>

              <div className="stocktake-info" style={{ marginTop: '20px' }}>
                <h3>Stock & Price Management</h3>
                {stocktakeEntries.length > 0 ? (
                  stocktakeEntries.map(entry => (
                    <div key={entry.ItemId} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                      <p><strong>Stock Item ID: {entry.ItemId}</strong></p>
                      <p><strong>Source:</strong> {entry.Source ? entry.Source.SourceName : `SourceID ${entry.SourceId}`}</p>
                      <p><strong>Price:</strong> ${entry.Price.toFixed(2)}</p>
                      <p><strong>Quantity:</strong> {entry.Quantity}</p>
                      <button 
                        className="btn-edit" 
                        style={{ background: '#007bff' }}
                        onClick={() => handleEditStockItem(entry)}
                        disabled={isLoadingSearch}
                      >
                        Edit Price/Quantity
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No stocktake entries found for this product.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemManagement;