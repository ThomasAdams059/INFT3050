import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ItemManagement = () => {
  // Add Item state
  const [itemName, setItemName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [genreId, setGenreId] = useState("");
  const [subgenreId, setSubgenreId] = useState("");
  const [published, setPublished] = useState("");

  // Edit/Delete Item state
  const [searchItemName, setSearchItemName] = useState("");
  const [currentItem, setCurrentItem] = useState(null);
  const [showItemInfo, setShowItemInfo] = useState(false);
  
  // State to hold stock entries
  const [stocktakeEntries, setStocktakeEntries] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // API base URLs
  const productBaseUrl = "http://localhost:3001/api/inft3050/Product";
  const stocktakeBaseUrl = "http://localhost:3001/api/inft3050/Stocktake";

  // Handle Add Item (no changes)
  const handleAddItem = (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const newItem = {
      Name: itemName,
      Author: author || null,
      Description: description || null,
      Genre: (typeof genreId === 'object' ? genreId.value : parseInt(genreId, 10)),
      SubGenre: parseInt(subgenreId, 10),
      Published: published ? new Date(published).toISOString() : null,
      LastUpdatedBy: "adminAccount",
      LastUpdated: new Date().toISOString(),
    };

    if (!newItem.Name || !newItem.Genre || !newItem.SubGenre) {
      setErrorMessage("Please fill in all required fields (Name, Genre ID, SubGenre ID).");
      setIsLoading(false);
      return;
    }

    axios.post(productBaseUrl, newItem, { withCredentials: true })
      .then(response => {
        setSuccessMessage(`Item "${response.data.Name}" added successfully!`);
        setIsLoading(false);
        setItemName(""); setAuthor(""); setDescription(""); setGenreId(""); setSubgenreId(""); setPublished("");
      })
      .catch(error => {
        console.error("Error adding item:", error);
        setErrorMessage(error.response?.data?.message || "Failed to add item.");
        setIsLoading(false);
      });
  };

  // --- UPDATED: Handle Search Item ---
  const handleSearchItem = async (event) => {
    event.preventDefault();
    if (!searchItemName.trim()) {
        setErrorMessage("Please enter a product name to search.");
        return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setCurrentItem(null);
    setShowItemInfo(false);
    setStocktakeEntries([]);

    try {
      // 1. Fetch ALL products
      const response = await axios.get(productBaseUrl, { withCredentials: true });
      const allProducts = response.data.list;

      if (!allProducts || allProducts.length === 0) {
        setErrorMessage("No products found in the database.");
        setIsLoading(false);
        return;
      }
      
      // 2. Find the product client-side (case-insensitive)
      const searchTermLower = searchItemName.toLowerCase();
      const foundProduct = allProducts.find(
        product => product.Name.toLowerCase() === searchTermLower
      );

      if (foundProduct && foundProduct.ID) {
        setCurrentItem(foundProduct);
        setShowItemInfo(true);

        // 3. Fetch ALL stocktake items
        const stocktakeResponse = await axios.get(stocktakeBaseUrl, { withCredentials: true });
        
        if (stocktakeResponse.data && stocktakeResponse.data.list) {
          // 4. Filter stocktake items for this product
          const productStockEntries = stocktakeResponse.data.list.filter(
            item => item.ProductId === foundProduct.ID
          );
          setStocktakeEntries(productStockEntries);
          console.log("Found stock entries:", productStockEntries);
        }
      } else {
        setErrorMessage(`Product "${searchItemName}" not found.`);
      }
    } catch (error) {
      console.error("Error searching item:", error);
      setErrorMessage("An error occurred during search.");
    } finally {
      setIsLoading(false);
    }
  };
  // --- END UPDATED Search ---

  // Handle Edit Item (Product Description) - (no changes)
  const handleEditItem = async () => {
    if (!currentItem) return;
    const newDescription = prompt("Enter new description:", currentItem.Description);
    if (newDescription === null) return;

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      await axios.patch(`${productBaseUrl}/${currentItem.ID}`,
        { Description: newDescription, LastUpdated: new Date().toISOString(), LastUpdatedBy: "adminAccount" },
        { withCredentials: true }
      );
      setSuccessMessage("Item description updated successfully!");
      setCurrentItem({ ...currentItem, Description: newDescription });
    } catch (error) {
      console.error("Error updating item:", error);
      setErrorMessage("Failed to update description.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Edit Stock (Price/Quantity) - (no changes)
  const handleEditStockItem = async (stockItem) => {
    const { ItemId, Price, Quantity } = stockItem;
    const newPrice = prompt("Enter new price:", Price);
    const newQuantity = prompt("Enter new quantity:", Quantity);

    if (newPrice === null || newQuantity === null) {
      alert("Edit cancelled.");
      return;
    }
    const parsedPrice = parseFloat(newPrice);
    const parsedQuantity = parseInt(newQuantity, 10);
    if (isNaN(parsedPrice) || isNaN(parsedQuantity)) {
      alert("Invalid input. Price and Quantity must be numbers.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      await axios.patch(`${stocktakeBaseUrl}/${ItemId}`, 
        { Price: parsedPrice, Quantity: parsedQuantity }, 
        { withCredentials: true }
      );
      setSuccessMessage(`Stock for ItemID ${ItemId} updated successfully!`);
      // Re-run search to get fresh data
      handleSearchItem(new Event('submit'));
    } catch (error) {
      console.error("Error updating stock item:", error);
      setErrorMessage(error.response?.data?.message || "Failed to update stock.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Delete Item (no changes)
  const handleDeleteItem = async () => {
    if (!currentItem) return;
    if (window.confirm(`Are you sure you want to delete "${currentItem.Name}"? This may fail if it is linked to stock or orders.`)) {
      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      try {
        await axios.delete(`${productBaseUrl}/${currentItem.ID}`, { withCredentials: true });
        setSuccessMessage("Item deleted successfully!");
        setCurrentItem(null);
        setShowItemInfo(false);
        setSearchItemName("");
      } catch (error) {
        console.error("Error deleting item:", error);
        setErrorMessage(error.response?.data?.message || "Failed to delete item. It may be in use.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="management-container">
      <h1>Item Management</h1>
      <div className="management-grid">
        
        {/* Add Item Section (no changes) */}
        <div className="management-section">
          <h2>Add Product</h2>
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
              <label>Genre ID (1=Book, 2=Movie, 3=Game)<span className="required">*</span></label>
              <input type="number" placeholder="e.g., 1" value={genreId} onChange={(e) => setGenreId(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>SubGenre ID<span className="required">*</span></label>
              <input type="number" placeholder="e.g., 1 for Fiction" value={subgenreId} onChange={(e) => setSubgenreId(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Published Date</label>
              <input type="date" value={published} onChange={(e) => setPublished(e.target.value)} />
            </div>
            <button type="submit" className="btn-add" disabled={isLoading}>Add Product</button>
          </form>
        </div>

        {/* Edit/Delete Item Section (no changes to JSX) */}
        <div className="management-section">
          <h2>Edit/Delete Product & Stock</h2>
          <form onSubmit={handleSearchItem} className="search-box">
            <label>Search by Product Name<span className="required">*</span></label>
            <input
              type="text"
              placeholder="Search for product"
              value={searchItemName}
              onChange={(e) => setSearchItemName(e.target.value)}
              required
            />
            <button type="submit" className="btn-search" disabled={isLoading}>Search</button>
          </form>

          {isLoading && <p>Loading...</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}

          {showItemInfo && currentItem && (
            <>
              <div className="item-info">
                <h3>Product Details</h3>
                <p><strong>ID:</strong> {currentItem.ID}</p>
                <p><strong>Name:</strong> {currentItem.Name}</p>
                <p><strong>Author:</strong> {currentItem.Author || 'N/A'}</p>
                <p><strong>Description:</strong> {currentItem.Description || 'N/A'}</p>
                <p><strong>Genre ID:</strong> {typeof currentItem.Genre === 'number' ? currentItem.Genre : 'N/A'}</p> 
                <p><strong>SubGenre ID:</strong> {currentItem.SubGenre}</p>
              </div>
              <div className="button-row">
                <button className="btn-edit" onClick={handleEditItem} disabled={isLoading}>
                  Edit Description
                </button>
                <button className="btn-delete" onClick={handleDeleteItem} disabled={isLoading}>
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
                        disabled={isLoading}
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