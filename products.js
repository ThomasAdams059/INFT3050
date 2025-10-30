import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './productCard';

// Accept props from App.js (isLoggedIn, isPatron, patronInfo)
const ProductPage = ({ isLoggedIn, isPatron, patronInfo }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [productData, setProductData] = useState(null);
  const [otherTitles, setOtherTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- NEW STATE for managing product versions ---
  // Stores all available versions (e.g., Hard Copy, Digital)
  const [availableSources, setAvailableSources] = useState([]);
  // Stores the ItemId of the *selected* version
  const [selectedStockItemId, setSelectedStockItemId] = useState(null);
  // Stores the price of the *selected* version for display
  const [selectedPrice, setSelectedPrice] = useState(null);
  
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const productId = urlParams.get('id');
      if (!productId) {
        setError("No product ID provided in the URL.");
        setLoading(false);
        return;
      }
      // Reset all state
      setLoading(true);
      setError(null);
      setProductData(null);
      setOtherTitles([]);
      setAvailableSources([]);
      setSelectedStockItemId(null);
      setSelectedPrice(null);

      const baseUrl = "http://localhost:3001/api/inft3050";
      const allProductsUrl = `${baseUrl}/Product`;
      const stocktakeUrl = `${baseUrl}/Stocktake`;

      try {
        const [allProductsResponse, stocktakeResponse] = await Promise.all([
          axios.get(allProductsUrl),
          axios.get(stocktakeUrl) // Fetch the full stocktake list
        ]);
        
        const allProductsList = allProductsResponse.data.list;
        const stocktakeList = stocktakeResponse.data.list;
        
        const mainProduct = allProductsList.find(p => p.ID.toString() === productId);
        if (!mainProduct) {
          setError("Product not found.");
          setLoading(false);
          return;
        }

        // --- NEW LOGIC: Find all available sources for this product ---
        const allSourcesForProduct = stocktakeList
          // Find all stock items matching this ProductId that have a Source
          .filter(item => item.ProductId.toString() === productId && item.Source)
          // Map them to a cleaner object
          .map(item => ({
            itemId: item.ItemId,
            sourceName: item.Source.SourceName, // Get name from nested object
            price: item.Price,
            quantity: item.Quantity
          }));
        
        setAvailableSources(allSourcesForProduct);

        // Set a default selection
        if (allSourcesForProduct.length > 0) {
          // Default to the first available source
          setSelectedStockItemId(allSourcesForProduct[0].itemId);
          setSelectedPrice(allSourcesForProduct[0].price);
          mainProduct.Price = allSourcesForProduct[0].price; // for initial price display
        } else {
          mainProduct.Price = null; // No sources found
        }
        // --- END NEW LOGIC ---

        setProductData(mainProduct);

        // Other titles logic (remains the same)
        if (mainProduct.Author) {
          const authorProducts = allProductsList.filter(
            p => p.Author === mainProduct.Author && p.ID !== mainProduct.ID
          );
          const otherTitlesWithPrices = authorProducts.map(p => {
            const otherStock = stocktakeList.find(item => item.ProductId === p.ID && item.SourceId === 1);
            return {
              id: p.ID, name: p.Name,
              image: "https://placehold.co/200x300/F4F4F5/18181B?text=Book",
              price: otherStock ? `$${otherStock.Price.toFixed(2)}` : 'N/A'
            };
          }).slice(0, 7);
          setOtherTitles(otherTitlesWithPrices);
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to load product data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [window.location.search]);

  // --- NEW: Handler for changing the selected source ---
  const handleSourceChange = (event) => {
    const newSelectedItemId = parseInt(event.target.value, 10);
    const selectedSource = availableSources.find(s => s.itemId === newSelectedItemId);
    
    if (selectedSource) {
      setSelectedStockItemId(selectedSource.itemId);
      setSelectedPrice(selectedSource.price);
      // Update the main product price for display
      setProductData(prevData => ({
        ...prevData,
        Price: selectedSource.price
      }));
    }
  };

  // --- "Add to Order" Handler (Updated) ---
  const handleAddToOrderClick = async () => {
    if (!isLoggedIn || !isPatron) {
      alert("Please log in as a customer to place an order.");
      window.location.href = '/login';
      return;
    }
    if (!productData || !patronInfo || !patronInfo.customerId) {
      alert("Cannot create order. User or product information is missing. Please refresh.");
      return;
    }
    // --- UPDATED: Check if a source is selected ---
    if (!selectedStockItemId) {
      alert("Please select a product version (e.g., Hard Copy, Digital) before ordering.");
      return;
    }
    if (isSubmittingOrder) return;
    setIsSubmittingOrder(true);

    try {
      const customerDetailsResponse = await axios.get(
        `http://localhost:3001/api/inft3050/Customers/${patronInfo.customerId}`,
        { withCredentials: true }
      );
      const customerDetails = customerDetailsResponse.data;

      const orderBody = {
        Customer: patronInfo.customerId,
        StreetAddress: customerDetails.StreetAddress || 'N/A',
        PostCode: customerDetails.PostCode || 0,
        Suburb: customerDetails.Suburb || 'N/A',
        State: customerDetails.State || 'N/A',
        OrderDate: new Date().toISOString()
        // Note: As per constraints, this POST /Orders request does not link
        // the selected item (selectedStockItemId).
      };

      const response = await axios.post(
        `http://localhost:3001/api/inft3050/Orders`,
        orderBody,
        { withCredentials: true }
      );

      alert(`${productData.Name} has been added to order ${response.data.OrderID}!`);

    } catch (error) {
      console.error("Error creating order:", error.response || error);
      alert(`Failed to create order. ${error.response?.data?.message || 'Please try again.'}`);
    } finally {
      setIsSubmittingOrder(false);
    }
  };
  
  // Other handlers
  const handleStarClick = (index) => setRating(index);
  const handleMouseEnter = (index) => setHoverRating(index);
  const handleMouseLeave = () => setHoverRating(0);
  const displayRating = hoverRating || rating;
  const handleOtherCardClick = (id) => window.location.href = `/products?id=${id}`;

  // --- Helper function to get main genre name ---
  const getGenreName = (genreId) => {
    // The genreId from the API is a number (e.g., 1, 2, 3)
    switch (genreId) {
      case 1:
        return 'Book';
      case 2:
        return 'Movie';
      case 3:
        return 'Game';
      default:
        return 'Genre'; // Fallback
    }
  };
  // --- END Function ---

  if (loading) return <div className="main-container"><p>Loading product...</p></div>;
  if (error) return <div className="main-container"><p>{error}</p></div>;
  if (!productData) return <div className="main-container"><p>Product not found.</p></div>;

  return (
    <div className="main-container">
      <nav className="breadcrumbs">
        <span>Home &gt; </span>
        {/* --- UPDATED BREADCRUMB --- */}
        {/* Call the helper function with the correct property: productData.Genre */}
        <span>{getGenreName(productData.Genre)} &gt; </span>
        <span>{productData.Name}</span>
      </nav>
      <header className="section-header">
        <h1 className="main-heading">{productData.Name}</h1>
      </header>
      <div className="product-page-main-layout">
        <div className="product-details-container">
          <div className="product-image-section">
            <img src={"https://placehold.co/300x400/F4F4F5/18181B?text=Book"} alt={productData.Name} className="product-image" />
          </div>
          <div className="product-description">
            <h2 className="overview-heading">Overview:</h2>
            <p className="overview-text">{productData.Description}</p>
            <p className="author-info">Author: <span className="font-normal">{productData.Author}</span></p>
            <p className="published-info">Published: <span className="font-normal">{productData.Published ? new Date(productData.Published).toLocaleDateString() : 'N/A'}</span></p>
            <p className="last-updated-info">Last Updated: <span className="font-normal">{productData.LastUpdated ? new Date(productData.LastUpdated).toLocaleDateString() : 'N/A'}</span></p>
            <p className="last-updated-by-info">Last Updated By: <span className="font-normal">{productData.LastUpdatedBy}</span></p>
          </div>
        </div>
        <div className="purchase-container">
          <div className="purchase-box">
            
            {/* --- UPDATED PRICE DISPLAY --- */}
            <span className="price-tag">
              {/* Show selected price, or default to N/A if nothing is selected/available */}
              {selectedPrice !== null ? `$${selectedPrice.toFixed(2)}` : 'N/A'}
            </span>
            
            <div className="payment-icons">
              <img src="https://placehold.co/70x40/992D2D/FFFFFF?text=Mastercard" alt="Mastercard" className="rounded-md" />
              <img src="https://placehold.co/70x40/003C87/FFFFFF?text=VISA" alt="VISA" className="rounded-md" />
            </div>

            {/* --- NEW: Source Selection (Patrons Only) --- */}
            {isLoggedIn && isPatron && (
              <div className="source-selection" style={{ margin: '15px 0' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1em' }}>Select Version:</h3>
                {availableSources.length > 0 ? (
                  availableSources.map((source) => (
                    <div key={source.itemId} className="source-option" style={{ margin: '5px 0' }}>
                      <input
                        type="radio"
                        id={`source-${source.itemId}`}
                        name="productSource"
                        value={source.itemId}
                        checked={selectedStockItemId === source.itemId}
                        onChange={handleSourceChange}
                        disabled={source.quantity === 0}
                      />
                      <label htmlFor={`source-${source.itemId}`} style={{ marginLeft: '8px' }}>
                        {source.sourceName} - ${source.price.toFixed(2)}
                        {source.quantity === 0 && ' (Out of Stock)'}
                      </label>
                    </div>
                  ))
                ) : (
                  <p>No purchase options available.</p>
                )}
              </div>
            )}
            {/* --- END NEW Source Selection --- */}

            {/* Updated Button */}
            {isLoggedIn && isPatron ? (
              <button
                className="add-to-cart-button"
                onClick={handleAddToOrderClick}
                disabled={isSubmittingOrder || !selectedStockItemId || (availableSources.find(s => s.itemId === selectedStockItemId)?.quantity === 0)}
              >
                {isSubmittingOrder ? 'Adding...' : 'Add to Order'}
              </button>
            ) : (
                 <button
                   className="add-to-cart-button"
                   onClick={() => window.location.href='/login'}
                 >
                   Log in to Order
                 </button>
            )}
          </div>
          <div className="review-box">
            <h3 className="review-heading">Leave a Review!</h3>
            <div className="star-rating">
              {[...Array(5)].map((star, index) => {
                const ratingValue = index + 1;
                return (
                  <span
                    key={index} className="cursor-pointer"
                    style={{ color: ratingValue <= displayRating ? "gold" : "lightgray" }}
                    onClick={() => handleStarClick(ratingValue)}
                    onMouseEnter={() => handleMouseEnter(ratingValue)}
                    onMouseLeave={handleMouseLeave}
                  >&#9733;</span>
                );
              })}
            </div>
            <button className="submit-review-button">Submit</button>
          </div>
        </div>
      </div>
      <div className="other-titles-section">
        <header className="other-titles-header">
          <h1 className="other-titles-heading">Other Titles by {productData.Author}</h1>
        </header>
        <main className="horizontal-scroll-container">
          {otherTitles.length > 0 ? (
            otherTitles.map(product => (
              <ProductCard
                key={product.id} imageSrc={product.image}
                bookName={product.name} price={product.price}
                onClick={() => handleOtherCardClick(product.id)}
              />
            ))
          ) : (<p>No other titles found by this author.</p>)}
        </main>
      </div>
    </div>
  );
};

export default ProductPage;

