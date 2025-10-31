
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ItemManagement = () => {
  // --- State for Add Item form ---
  const [itemName, setItemName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [published, setPublished] = useState("");
  const [genreId, setGenreId] = useState("");
  const [subGenreOptions, setSubGenreOptions] = useState([]);
  const [subgenreId, setSubgenreId] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sourceId, setSourceId] = useState("");

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

  const sourceOptions = [
    { id: 1, name: "Hard copy book" },
    { id: 2, name: "Audible" },
    { id: 3, name: "Kindle" },
    { id: 4, name: "DVD" },
    { id: 5, name: "BlueRay" },
    { id: 6, name: "Apple" },
    { id: 7, name: "Hard copy audiobook" },
    { id: 8, name: "Steam" },
    { id: 9, name: "XBox" },
    { id: 10, name: "PlayStation" }
  ];

  // useEffect to fetch sub-genres
  useEffect(() => {
    const fetchSubGenres = async () => {
      if (!genreId) {
        setSubGenreOptions([]);
        setSubgenreId("");
        return;
      }

      let subGenreUrl = "";
      if (genreId === "1") subGenreUrl = `${baseUrl}/BookGenre`;
      else if (genreId === "2") subGenreUrl = `${baseUrl}/MovieGenre`;
      else if (genreId === "3") subGenreUrl = `${baseUrl}/GameGenre`;
      else {
        setSubGenreOptions([]);
        setSubgenreId("");
        return;
      }

      try {
        const response = await axios.get(subGenreUrl, { withCredentials: true });
        const validSubGenres = (response.data.list || []).filter(
          option => option.Name && !option.Name.startsWith('<')
        );
        setSubGenreOptions(validSubGenres);
      } catch (error) {
        console.error("Error fetching sub-genres:", error);
        setErrorAdd("Failed to load sub-genres.");
        setSubGenreOptions([]);
      }
      setSubgenreId("");
    };

    fetchSubGenres();
  }, [genreId]);

  // Handle Add Item (Product + Stock)
  const handleAddItem = async (event) => {
    event.preventDefault();
    setIsLoadingAdd(true);
    setErrorAdd("");
    setSuccessAdd("");

    if (!itemName || !genreId || !subgenreId || !price || !quantity || !sourceId) {
      setErrorAdd("Please fill in all required fields (*).");
      setIsLoadingAdd(false);
      return;
    }
    
    // Step 1: Create the Product object
    const newProduct = {
      Name: itemName,
      Author: author || null,
      Description: description || null,
      Genre: parseInt(genreId, 10),
      // --- FIX: Trying 'Subgenre' (all lowercase g) to match Excel dictionary ---
      SubGenre: parseInt(subgenreId, 10),
      // --- END FIX ---
      Published: published ? new Date(published).toISOString() : null,
      LastUpdatedBy: "adminAccount",
      LastUpdated: new Date().toISOString(),
    };


    console.log("New Product Payload:", newProduct);

    try {
      // Step 2: POST to /Product
      const productResponse = await axios.post(productBaseUrl, newProduct, { withCredentials: true });
      const newProductId = productResponse.data.ID;
      
      if (!newProductId) {
        throw new Error("Failed to get new Product ID from response.");
      }

      // Step 3: Create the Stocktake object
      const newStockItem = {
        ProductId: newProductId,
        SourceId: parseInt(sourceId, 10),
        Price: parseFloat(price),
        Quantity: parseInt(quantity, 10)
      };

      // Step 4: POST to /Stocktake
      await axios.post(stocktakeBaseUrl, newStockItem, { withCredentials: true });

      setSuccessAdd(`Product "${itemName}" and its stock entry added successfully!`);
      setIsLoadingAdd(false);
      setItemName(""); setAuthor(""); setDescription(""); setGenreId("");
      setSubgenreId(""); setPublished(""); setPrice(""); setQuantity(""); setSourceId("");
      
    } catch (error) {
      console.error("Error adding item:", error);
      // Log the specific error from the backend
      setErrorAdd(error.response?.data?.msg || error.response?.data?.message || "Failed to add item. Product may be created without stock.");
      setIsLoadingAdd(false);
    }
  };

  // Search Item (Client-side)
  const handleSearchItem = async (event) => {
    event.preventDefault();
    if (!searchItemName.trim()) {
      setErrorSearch("Please enter a product name to search.");
      return;
    }
    setIsLoadingSearch(true);
    setErrorSearch("");
    setSuccessSearch("");
    setCurrentItem(null);
    setShowItemInfo(false);
    setStocktakeEntries([]);

    try {
      const response = await axios.get(productBaseUrl, { withCredentials: true });
      const allProducts = response.data.list;
      if (!allProducts) throw new Error("Could not fetch product list.");

      const searchTermLower = searchItemName.toLowerCase();
      const foundProduct = allProducts.find(
        product => product.Name.toLowerCase() === searchTermLower
      );

      if (foundProduct && foundProduct.ID) {
        setCurrentItem(foundProduct);
        setShowItemInfo(true);

        const stocktakeResponse = await axios.get(stocktakeBaseUrl, { withCredentials: true });
        if (stocktakeResponse.data && stocktakeResponse.data.list) {
          const productStockEntries = stocktakeResponse.data.list.filter(
            item => item.ProductId === foundProduct.ID
          );
          setStocktakeEntries(productStockEntries);
        }
      } else {
        setErrorSearch(`Product "${searchItemName}" not found.`);
      }
    } catch (error) {
      console.error("Error searching item:", error);
      setErrorSearch("An error occurred during search.");
    } finally {
      setIsLoadingSearch(false);
    }
  };

  // Edit Product Description
  const handleEditItem = async () => {
    if (!currentItem) return;
    const newDescription = prompt("Enter new description:", currentItem.Description);
    if (newDescription === null) return;

    setIsLoadingSearch(true);
    setErrorSearch("");
    setSuccessSearch("");
    try {
      await axios.patch(`${productBaseUrl}/${currentItem.ID}`,
        { Description: newDescription, LastUpdated: new Date().toISOString(), LastUpdatedBy: "adminAccount" },
        { withCredentials: true }
      );
      setSuccessSearch("Item description updated successfully!");
      setCurrentItem({ ...currentItem, Description: newDescription });
    } catch (error) {
      setErrorSearch("Failed to update description.");
    } finally {
      setIsLoadingSearch(false);
    }
  };

  // Edit Stock Entry (Price/Quantity)
  const handleEditStockItem = async (stockItem) => {
    const { ItemId, Price, Quantity } = stockItem;
    const newPrice = prompt("Enter new price:", Price);
    const newQuantity = prompt("Enter new quantity:", Quantity);

    if (newPrice === null || newQuantity === null) return;
    const parsedPrice = parseFloat(newPrice);
    const parsedQuantity = parseInt(newQuantity, 10);
    if (isNaN(parsedPrice) || isNaN(parsedQuantity)) {
      alert("Invalid input. Price and Quantity must be numbers.");
      return;
    }

    setIsLoadingSearch(true);
    setErrorSearch("");
    setSuccessSearch("");
    try {
      await axios.patch(`${stocktakeBaseUrl}/${ItemId}`, 
        { Price: parsedPrice, Quantity: parsedQuantity }, 
        { withCredentials: true }
      );
      setSuccessSearch(`Stock for ItemID ${ItemId} updated successfully!`);
      const pseudoEvent = { preventDefault: () => {} };
      handleSearchItem(pseudoEvent); 
    } catch (error) {
      setErrorSearch(error.response?.data?.message || "Failed to update stock.");
    } finally {
      setIsLoadingSearch(false);
    }
  };

  // Delete Product
  const handleDeleteItem = async () => {
    if (!currentItem) return;
    if (window.confirm(`Are you sure you want to delete "${currentItem.Name}"? This may fail if it is linked to stock or orders.`)) {
      setIsLoadingSearch(true);
      setErrorSearch("");
      setSuccessSearch("");
      try {
        await axios.delete(`${productBaseUrl}/${currentItem.ID}`, { withCredentials: true });
        setSuccessSearch("Item deleted successfully!");
        setCurrentItem(null);
        setShowItemInfo(false);
        setSearchItemName("");
      } catch (error) {
        setErrorSearch(error.response?.data?.message || "Failed to delete item. It may be in use.");
      } finally {
        setIsLoadingSearch(false);
      }
    }
  };

  return (
    <div className="management-container">
      <h1>Item Management</h1>
      <div className="management-grid">
        
        <div className="management-section">
          <h2>Add Product & Stock</h2>
          <form onSubmit={handleAddItem}>
            <div className="form-group">
              <label>Name<span className="required">*</span></label>
              <input type="text" placeholder="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Author</label>
              <input type="text" placeholder="Author/Director" value={author} onChange={(e) => setAuthor(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea placeholder="Product Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Category<span className="required">*</span></label>
              <select value={genreId} onChange={(e) => setGenreId(e.target.value)} required>
                <option value="">Select Category...</option>
                <option value="1">Book</option>
                <option value="2">Movie</option>
                <option value="3">Game</option>
              </select>
            </div>
            <div className="form-group">
              <label>Sub-Genre<span className="required">*</span></label>
              <select value={subgenreId} onChange={(e) => setSubgenreId(e.target.value)} required disabled={subGenreOptions.length === 0}>
                <option value="">{genreId ? 'Select Sub-Genre...' : 'Select Category First'}</option>
                {subGenreOptions.map(option => (
                  <option key={option.SubGenreID} value={option.SubGenreID}>
                    {option.Name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Published Date</label>
              <input type="date" value={published} onChange={(e) => setPublished(e.target.value)} />
            </div>
            
            <hr style={{ margin: '20px 0' }} />
            <h4>Initial Stock Entry</h4>
            
            <div className="form-group">
              <label>Source (Type)<span className="required">*</span></label>
              <select value={sourceId} onChange={(e) => setSourceId(e.target.value)} required>
                <option value="">Select Source Type...</option>
                {sourceOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Price<span className="required">*</span></label>
              <input type="number" step="0.01" min="0" placeholder="e.g., 29.99" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Quantity<span className="required">*</span></label>
              <input type="number" step="1" min="0" placeholder="e.g., 50" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
            </div>
            
            {isLoadingAdd && <p>Loading...</p>}
            {errorAdd && <p className="error-message">{errorAdd}</p>}
            {successAdd && <p className="success-message">{successAdd}</p>}
            
            <button type="submit" className="btn-add" disabled={isLoadingAdd}>Add Product & Stock Entry</button>
          </form>
        </div>

        <div className="management-section">
          <h2>Edit/Delete Product & Stock</h2>
          <form onSubmit={handleSearchItem} className="search-box">
            <label>Search by Product Name<span className="required">*</span></label>
            <input
              type="text"
              placeholder="Search for product (exact name)"
              value={searchItemName}
              onChange={(e) => setSearchItemName(e.target.value)}
              required
            />
            <button type="submit" className="btn-search" disabled={isLoadingSearch}>Search</button>
          </form>

          {isLoadingSearch && <p>Loading...</p>}
          {errorSearch && <p className="error-message">{errorSearch}</p>}
          {successSearch && <p className="success-message">{successSearch}</p>}

          {showItemInfo && currentItem && (
            <>
              <div className="item-info">
                <h3>Product Details</h3>
                <p><strong>ID:</strong> {currentItem.ID}</p>
                <p><strong>Name:</strong> {currentItem.Name}</p>
                <p><strong>Author:</strong> {currentItem.Author || 'N/A'}</p>
                <p><strong>Description:</strong> {currentItem.Description || 'N/A'}</p>
                <p><strong>Genre ID:</strong> {typeof currentItem.Genre === 'number' ? currentItem.Genre : 'N/A'}</p> 
                {/* This will show the SubGenre ID. If you need the name, more logic is needed */}
                <p><strong>SubGenre ID:</strong> {currentItem.SubGenre || currentItem.subGenre}</p> 
              </div>
              <div className="button-row">
                <button className="btn-edit" onClick={handleEditItem} disabled={isLoadingSearch}>
                  Edit Description
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
