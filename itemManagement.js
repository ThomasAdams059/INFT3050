import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

// --- UPDATED: Accept currentUser prop ---
const ItemManagement = () => {
  
    const { user } = useSelector((state) => state.auth);

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
  const [sources, setSources] = useState([]);
  const [sourceId, setSourceId] = useState("");
  
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  

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

  // gets genres
useEffect(() => {
  axios.get(`${baseUrl}/Genre`, { withCredentials: true })
    .then((response) => {
      setGenres(response.data.list || []);
    })
    .catch((err) => {
      console.error("Error getting genres:", err);
      setErrorAdd("Failed to load genres. Refresh the page."); // maybe get rid of this not exactly needed?
    });
}, []);

// gets Sources
  useEffect(() => {
    axios.get(`${baseUrl}/Source`, { withCredentials: true })
      .then((response) => {
        console.log("got sources:", response.data);
        setSources(response.data.list || []);
      })
      .catch((err) => {
        console.error("Error getting sources:", err);
        setErrorAdd("Failed to load sources. Refresh the page.");
      });
  }, []);

  // gets Subgenres when Genre changes
useEffect(() => {
  if (!genreId) {
    setSubGenreOptions([]);
    setSubgenreId("");
    return;
  }
  
  let subGenreEndpoint = "";
  switch (parseInt(genreId)) {
    case 1:
      subGenreEndpoint = `${baseUrl}/BookGenre`;
      break;
    case 2:
      subGenreEndpoint = `${baseUrl}/MovieGenre`;
      break;
    case 3:
      subGenreEndpoint = `${baseUrl}/GameGenre`;
      break;
    default:
      setSubGenreOptions([]);
      setSubgenreId("");
      return;
  }

  axios.get(subGenreEndpoint, { withCredentials: true })
    .then((response) => {

      // error log get rid later
      console.log("Subgenres fetched:", response.data);

      setSubGenreOptions(response.data.list || []);
      setSubgenreId("");
    })
    .catch((err) => {
      console.error("Error getting subgenres:", err);
      setErrorAdd("Failed to load subgenres.");
    });
}, [genreId]);

// handles add items new attempt to this
const handleAddItem = (event) => {
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

  // makes the product 
  const productAddition = {
    Name: itemName,
    Author: author,
    Description: description,
    Genre: parseInt(genreId),
    SubGenre: parseInt(subgenreId),
    Published: published,
    LastUpdatedBy: user?.username || user?.UserName || user?.name || "admin", // changed from just user.UserName
    LastUpdated: new Date().toISOString()
  };

  // more error logs
  console.log("=== ADDING PRODUCT ===");
  console.log("product added:", productAddition);

  axios.post(productBaseUrl, productAddition, { withCredentials: true })
    .then((productResponse) => {
      console.log("Product response:", productResponse);
      console.log("Product response data:", productResponse.data);
      
      // same as the user role one, trying different ID field names
      const newProductId = productResponse.data.ID || 
                          productResponse.data.id || 
                          productResponse.data.ProductID ||
                          productResponse.data.productId;
      
      if (!newProductId) {
        console.error("No product ID in response:", productResponse.data);
        throw new Error("Product was created but ID was not returned"); // added since last time it said it added on our end but not actually added in database
      }

      console.log("New Product ID:", newProductId);
      
      // stocktake entry creation 
      const stocktakeAddition = {
        SourceId: parseInt(sourceId),
        ProductId: newProductId,
        Quantity: parseInt(quantity),
        Price: parseFloat(price)
      };

      console.log("=== ADDING STOCKTAKE ===");
      console.log("Stocktake addition:", stocktakeAddition);

      return axios.post(stocktakeBaseUrl, stocktakeAddition, { withCredentials: true })
        .then((stocktakeResponse) => {
          console.log("Stocktake response:", stocktakeResponse);
          console.log("Stocktake response data:", stocktakeResponse.data);
          
          return { productId: newProductId, stocktakeResponse };
        });
    })
    .then((result) => {
      console.log(" Sucess!!!");
      console.log("Product and stocktake created successfully");
      
      setSuccessAdd(`Product '${itemName}' (ID: ${result.productId}) and its stock item were created successfully!`);
      
      // clears form
      setItemName("");
      setAuthor("");
      setDescription("");
      setPublished("");
      setGenreId("");
      setSubgenreId("");
      setPrice("");
      setQuantity("");
      setSourceId("");
      setIsLoadingAdd(false);
    })
    .catch((error) => {
      console.error("=== ERROR ADDING ITEM ===");
      console.error("Error object:", error);
      console.error("Error response:", error.response);
      console.error("Error response data:", error.response?.data);
      
      setErrorAdd(error.response?.data?.message || error.message || "Failed to create item. Check console for details.");
      setIsLoadingAdd(false);
    });
};

  // handles searching of items
const handleSearchItem = (event) => {
  event.preventDefault();
  setIsLoadingSearch(true);
  setErrorSearch("");
  setSuccessSearch("");
  setShowItemInfo(false);
  setCurrentItem(null);
  setStocktakeEntries([]);

  // gets all products
  axios.get(`${productBaseUrl}?pageSize=1000`, { withCredentials: true })
    .then((productsResponse) => {
      console.log("Products fetched:", productsResponse.data);
      
      const product = (productsResponse.data.list || []).find(
        p => p.Name.toLowerCase() === searchItemName.toLowerCase()
      );

      if (!product) {
        setErrorSearch(`Product "${searchItemName}" not found.`);
        setIsLoadingSearch(false);
        return null; 
      }
      
      console.log("Found product:", product);
      setCurrentItem(product);

      // gets stocktake items for this product
      return axios.get(stocktakeBaseUrl, { withCredentials: true })
        .then((stocktakeResponse) => {
          return { product, stocktakeResponse };
        });
    })
    .then((result) => {
      if (!result) return; // product not found
      
      const { product, stocktakeResponse } = result;
      
      console.log("Stocktake data:", stocktakeResponse.data);
      
      const entries = (stocktakeResponse.data.list || [])
        .filter(s => s.ProductId === product.ID)
        .map(entry => ({
          ...entry,
          Source: entry.Source || { SourceName: `Source ID ${entry.SourceId}` }
        }));
        
      console.log("Filtered stocktake entries:", entries);
      
      setStocktakeEntries(entries);
      setSuccessSearch(`Found product ID: ${product.ID}`);
      setShowItemInfo(true);
      setIsLoadingSearch(false);
    })
    .catch((error) => {
      console.error("Error searching item:", error.response || error);
      setErrorSearch(error.response?.data?.message || "Failed to search for item.");
      setIsLoadingSearch(false);
    });
};

// editing an existing item
const handleEditItem = () => {
  if (!currentItem || !user) return;

  const newName = prompt("Enter new Item Name:", currentItem.Name);
  const newAuthor = prompt("Enter new Author:", currentItem.Author);
  const newDesc = prompt("Enter new Description:", currentItem.Description);

  if (newName === null || newAuthor === null || newDesc === null) {
    return; // admin cancelled
  }

  setIsLoadingSearch(true);
  setErrorSearch("");
  setSuccessSearch("");

  const productEdit = {
    Name: newName,
    Author: newAuthor,
    Description: newDesc,
    LastUpdatedBy: user?.username || user?.UserName || user?.name || "admin",
    LastUpdated: new Date().toISOString()
  };

  axios.patch(`${productBaseUrl}/${currentItem.ID}`, productEdit, { withCredentials: true })
    .then((response) => {
      console.log("Product updated:", response);
      setSuccessSearch("Product details updated successfully!");
      setCurrentItem(prev => ({ ...prev, ...productEdit }));
      setIsLoadingSearch(false);
    })
    .catch((error) => {
      console.error("Error updating item:", error.response || error);
      setErrorSearch(error.response?.data?.message || "Failed to update item.");
      setIsLoadingSearch(false);
    });
};

// deleting an existing item
const handleDeleteItem = () => {
  if (!currentItem) return;
  
  if (!window.confirm(`Are you sure you want to delete "${currentItem.Name}"? This action CANNOT be undone.`)) {
    return;
  }

  setIsLoadingSearch(true);
  setErrorSearch("");
  setSuccessSearch("");

  axios.delete(`${productBaseUrl}/${currentItem.ID}`, { withCredentials: true })
    .then((response) => {
      console.log("Product deleted:", response);
      setSuccessSearch(`Product "${currentItem.Name}" was deleted successfully.`);
      
      // clears the form
      setCurrentItem(null);
      setShowItemInfo(false);
      setSearchItemName("");
      setStocktakeEntries([]);
      setIsLoadingSearch(false);
    })
    .catch((error) => {
      console.error("Error deleting item:", error.response || error); // error logs 
      setErrorSearch(error.response?.data?.message || "Failed to delete item. It may be part of an order.");
      setIsLoadingSearch(false);
    });
};


// editing the price and quantity from stocktake table 
const handleEditStockItem = (entry) => {
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

  const productStockEdit = {
    Price: parsedPrice,
    Quantity: parsedQuantity
  };

  axios.patch(`${stocktakeBaseUrl}/${entry.ItemId}`, productStockEdit, { withCredentials: true })
    .then((response) => {
      console.log("Stock item updated:", response);
      setSuccessSearch(`Stock item ${entry.ItemId} updated successfully!`);
      
      setStocktakeEntries(prevEntries =>
        prevEntries.map(e =>
          e.ItemId === entry.ItemId
            ? { ...e, Price: parsedPrice, Quantity: parsedQuantity }
            : e
        )
      );
      setIsLoadingSearch(false);
    })
    .catch((error) => {
      console.error("Error updating stock item:", error.response || error);
      setErrorSearch(error.response?.data?.message || "Failed to update stock item.");
      setIsLoadingSearch(false);
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
      
      <h1>Item Management</h1>
      
      <div className="management-grid">
        {/* --- ADD ITEM FORM --- */}
        <div className="management-section">
          <h2>Add Item</h2>
          <form onSubmit={handleAddItem}>
            {errorAdd && <div className="error-message">{errorAdd}</div>}
            {successAdd && <div className="success-message">{successAdd}</div>}

            <div className="form-group">
              <label>Item Name<span className="required">*</span></label>
              <input 
                type="text" 
                placeholder="Product Name" 
                value={itemName} 
                onChange={(e) => setItemName(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Author/Director/Developer<span className="required">*</span></label>
              <input 
                type="text" 
                placeholder="Author" 
                value={author} 
                onChange={(e) => setAuthor(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea 
                placeholder="Product Description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>

            <div className="form-group">
              <label>Published Date<span className="required">*</span></label>
              <input 
                type="date" 
                value={published} 
                onChange={(e) => setPublished(e.target.value)} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Genre<span className="required">*</span></label>
              <select 
                value={genreId} 
                onChange={(e) => setGenreId(e.target.value)} 
                required
              >
                <option key="genre-placeholder" value="">Select Genre...</option>
                {genres.map(g => (
                  <option key={g.GenreID} value={g.GenreID}>{g.Name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Subgenre<span className="required">*</span></label>
              <select 
                value={subgenreId} 
                onChange={(e) => setSubgenreId(e.target.value)} 
                required 
                disabled={!genreId}
              >
                <option key="subgenre-placeholder" value="">Select Subgenre...</option>
                {subGenreOptions.map(sg => (
                  <option key={sg.SubGenreID} value={sg.SubGenreID}>{sg.Name}</option>
                ))}
              </select>
            </div>

            {/* --- UPDATED: Source dropdown instead of text input --- */}
            <div className="form-group">
              <label>Source<span className="required">*</span></label>
              <select 
                value={sourceId} 
                onChange={(e) => setSourceId(e.target.value)} 
                required
              >
                <option key="source-placeholder" value="">Select Source...</option>
                {sources.map(s => (
                  <option key={s.Sourceid} value={s.Sourceid}>
                    {s.SourceName} {s.ExternalLink ? `(${s.ExternalLink})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price<span className="required">*</span></label>
                <input 
                  type="number" 
                  step="0.01" 
                  placeholder="Price (e.g., 24.99)" 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Quantity<span className="required">*</span></label>
                <input 
                  type="number" 
                  placeholder="Quantity" 
                  value={quantity} 
                  onChange={(e) => setQuantity(e.target.value)} 
                  required 
                />
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
          <form onSubmit={handleSearchItem} className="search-box">
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
