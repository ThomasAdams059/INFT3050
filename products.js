import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Import Redux hook
import axios from 'axios';
import ProductCard from './productCard';

// Accept only 'onAddToCart' prop from App.js
const ProductPage = ({ onAddToCart }) => {
  // --- NEW: Get auth state from Redux ---
  const { isLoggedIn, isPatron } = useSelector((state) => state.auth);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [productData, setProductData] = useState(null);
  const [otherTitles, setOtherTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- State for managing product versions ---
  const [availableSources, setAvailableSources] = useState([]);
  const [selectedStockItemId, setSelectedStockItemId] = useState(null);
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
      
      // --- FIX: Add limit=10000 to fetch ALL items ---
      const allProductsUrl = `${baseUrl}/Product?limit=10000`;
      const stocktakeUrl = `${baseUrl}/Stocktake?limit=10000`;
      // --- END FIX ---

      try {
        // --- FIX: Add withCredentials: true ---
        const [allProductsResponse, stocktakeResponse] = await Promise.all([
          axios.get(allProductsUrl, { withCredentials: true }),
          axios.get(stocktakeUrl, { withCredentials: true }) // Fetch the full stocktake list
        ]);
        // --- END FIX ---
        
        const allProductsList = allProductsResponse.data.list;
        const stocktakeList = stocktakeResponse.data.list;
        
        const mainProduct = allProductsList.find(p => p.ID.toString() === productId);
        if (!mainProduct) {
          setError("Product not found.");
          setLoading(false);
          return;
        }

        // --- Logic for finding available sources (Unchanged) ---
        const allSourcesForProduct = stocktakeList
          .filter(item => item.ProductId.toString() === productId && item.Source)
          .map(item => ({
            itemId: item.ItemId,
            sourceName: item.Source.SourceName, 
            price: item.Price,
            quantity: item.Quantity
          }));
        
        setAvailableSources(allSourcesForProduct);

        if (allSourcesForProduct.length > 0) {
          // Default to the first available source
          setSelectedStockItemId(allSourcesForProduct[0].itemId);
          setSelectedPrice(allSourcesForProduct[0].price);
          mainProduct.Price = allSourcesForProduct[0].price; 
        } else {
          mainProduct.Price = null; // No purchase options
        }
        // --- END Source Logic ---

        setProductData(mainProduct);

        // Other titles logic (Unchanged)
        if (mainProduct.Author) {
          const authorProducts = allProductsList.filter(
            p => p.Author === mainProduct.Author && p.ID.toString() !== productId
          );
          
          // --- FIX: Correctly find price for "other titles" ---
          const otherTitlesWithPrices = authorProducts.map(p => {
            // Find the cheapest stock item for this other product
            const otherStock = stocktakeList.find(item => item.ProductId === p.ID);
            return {
              id: p.ID, name: p.Name,
              image: "https://placehold.co/200x300/F4F4F5/18181B?text=Book",
              price: otherStock ? `$${otherStock.Price.toFixed(2)}` : 'N/A'
            };
          }).slice(0, 7);
          // --- END FIX ---
          
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
  }, [window.location.search]); // Re-run on URL change

  // --- Handler for changing the selected source (Unchanged) ---
  const handleSourceChange = (event) => {
    const newSelectedItemId = parseInt(event.target.value, 10);
    const selectedSource = availableSources.find(s => s.itemId === newSelectedItemId);
    
    if (selectedSource) {
      setSelectedStockItemId(selectedSource.itemId);
      setSelectedPrice(selectedSource.price);
      setProductData(prevData => ({
        ...prevData,
        Price: selectedSource.price // Update price on main product data
      }));
    }
  };

 // --- "Add to Cart" Handler (Unchanged) ---
 // This function now uses the 'isLoggedIn' and 'isPatron' variables from Redux
const handleAddToOrderClick = async () => {
  if (!isLoggedIn || !isPatron) {
    alert("Please log in as a customer to add items to your cart.");
    window.location.href = '/login';
    return;
  }
  if (!selectedStockItemId) {
    alert("Please select a product version (e.g., Hard Copy, Digital) before adding to cart.");
    return;
  }
  if (isSubmittingOrder) return;
  setIsSubmittingOrder(true); 

  try {
    const selectedSource = availableSources.find(s => s.itemId === selectedStockItemId);
    if (!selectedSource) {
        throw new Error("Selected source not found.");
    }
    
    if (selectedSource.quantity === 0) {
       alert("This item is out of stock.");
       setIsSubmittingOrder(false);
       return;
    }

    const itemToAdd = {
      id: productData.ID,
      name: productData.Name,
      price: selectedSource.price,
      stockItemId: selectedStockItemId, 
      sourceName: selectedSource.sourceName,
      image: "https://placehold.co/200x300/F4F4F5/18181B?text=Book",
      quantity: 1 // Add quantity 1
    };

    // Call the onAddToCart function passed from App.js
    onAddToCart(itemToAdd);

  } catch (error) {
    console.error("Error adding to cart:", error);
    alert(`Failed to add item to cart. ${error.message || 'Please try again.'}`);
  } finally {
    setIsSubmittingOrder(false);
  }
};
  
  // Other handlers (Unchanged)
  const handleStarClick = (index) => setRating(index);
  const handleMouseEnter = (index) => setHoverRating(index);
  const handleMouseLeave = () => setHoverRating(0);
  const displayRating = hoverRating || rating;
  const handleOtherCardClick = (id) => window.location.href = `/products?id=${id}`;

  // Helper function (Unchanged)
  const getGenreName = (genreId) => {
    switch (genreId) {
      case 1: return 'Book';
      case 2: return 'Movie';
      case 3: return 'Game';
      default: return 'Genre';
    }
  };

  if (loading) return <div className="main-container"><p>Loading product...</p></div>;
  if (error) return <div className="main-container"><p>{error}</p></div>;
  if (!productData) return <div className="main-container"><p>Product not found.</p></div>;

  return (
    <div className="main-container">
      <nav className="breadcrumbs">
        <span>Home &gt; </span>
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
            
            <span className="price-tag">
              {selectedPrice !== null ? `$${selectedPrice.toFixed(2)}` : 'N/A'}
            </span>
            
            <div className="payment-icons">
              <img src="https://placehold.co/70x40/992D2D/FFFFFF?text=Mastercard" alt="Mastercard" className="rounded-md" />
              <img src="https://placehold.co/70x40/003C87/FFFFFF?text=VISA" alt="VISA" className="rounded-md" />
            </div>

            {/* --- Source Selection (Patrons Only) --- */}
            {/* This logic now uses Redux state */}
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
            {/* --- END Source Selection --- */}

            {/* Updated Button Logic (uses Redux state) */}
            {isLoggedIn && isPatron ? (
              <button
                  className="add-to-cart-button"
                  onClick={handleAddToOrderClick}
                  disabled={isSubmittingOrder || !selectedStockItemId || (availableSources.find(s => s.itemId === selectedStockItemId)?.quantity === 0)}
                >
                  {isSubmittingOrder ? 'Adding...' : 'Add to Cart'}
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
                productName={product.name} price={product.price}
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