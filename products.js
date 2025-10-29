import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './productCard';

// Base API URL (consider defining this globally or in a config file)
const API_BASE_URL = "http://localhost:3001";
const API_SUFFIX = "/api/inft3050";

const ProductPage = ({ onAddToCart }) => {
  // Original state variables from your base code
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [productData, setProductData] = useState(null);
  const [otherTitles, setOtherTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- NEW state variable ---
  const [stockItemId, setStockItemId] = useState(null); // To store the ID from Stocktake

  // Original useEffect hook structure
  useEffect(() => {
    const fetchProductDetails = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const productId = urlParams.get('id');

      if (!productId) { // Original check
        setError("No product ID provided in the URL.");
        setLoading(false);
        return;
      }

      // --- Reset state like original + new state ---
      setLoading(true);
      setError(null);
      setProductData(null);
      setOtherTitles([]);
      setStockItemId(null); // Reset new state variable

      // Original URLs
      const baseUrl = "http://localhost:3001/api/inft3050";
      const allProductsUrl = `${baseUrl}/Product`;
      const stocktakeUrl = `${baseUrl}/Stocktake`;

      try {
        // Original parallel fetch
        const [allProductsResponse, stocktakeResponse] = await Promise.all([
          axios.get(allProductsUrl),
          axios.get(stocktakeUrl)
        ]);

        const allProductsList = allProductsResponse.data.list;
        const stocktakeList = stocktakeResponse.data.list;

        // Original logic to find the main product
        const mainProduct = allProductsList.find(p => p.ID.toString() === productId);

        if (!mainProduct) { // Original check
          setError("Product not found.");
          setLoading(false);
          return;
        }

        // --- NEW Logic: Find Stocktake Item ID and Price ---
        // Find the specific item in stocktake (assuming SourceId 1 for primary)
        const relevantStockItem = stocktakeList.find(
          item => item.ProductId.toString() === productId && item.SourceId === 1 // Assuming SourceId 1
        );

        let displayPrice = 'N/A'; // Default price from your base code was 'N/A'
        if (relevantStockItem) {
          setStockItemId(relevantStockItem.ItemId); // Set the Stocktake ItemId needed for adding to cart
          displayPrice = relevantStockItem.Price.toFixed(2); // Get price and format it
          // Store the raw price in mainProduct, similar to your base code logic
          mainProduct.Price = relevantStockItem.Price;
        } else {
          // Keep original behavior if stock item isn't found
          mainProduct.Price = null; // Or handle as appropriate
          console.warn("Could not find matching Stocktake item (SourceId 1) for Product ID:", productId);
        }
        // --- End NEW Logic ---

        // Set product data (original logic)
        setProductData(mainProduct);

        // Original logic for finding other titles
        if (mainProduct.Author) {
          const authorProducts = allProductsList.filter(
            p => p.Author === mainProduct.Author && p.ID !== mainProduct.ID
          );

          // Original logic to add prices to other titles
          const otherTitlesWithPrices = authorProducts.map(p => {
            const otherStock = stocktakeList.find(item => item.ProductId === p.ID && item.SourceId === 1); // Assuming SourceId 1
            return {
              id: p.ID,
              name: p.Name,
              image: "https://placehold.co/200x300/F4F4F5/18181B?text=Book", // Original placeholder
              price: otherStock ? `$${otherStock.Price.toFixed(2)}` : 'N/A' // Original price format
            };
          }).slice(0, 7); // Original slice

          setOtherTitles(otherTitlesWithPrices);
        }
        // End original logic for other titles

      } catch (err) { // Original error handling
        console.error("Error fetching product data:", err);
        setError("Failed to load product data.");
      } finally { // Original finally block
        setLoading(false);
      }
    };

    fetchProductDetails();
  // }, []); // Original base code had empty dependency array, using search for correctness
  }, [window.location.search]); // Updated dependency array to refetch if URL changes


  // --- Original Rating handlers ---
  const handleStarClick = (index) => {
    setRating(index);
  };

  const handleMouseEnter = (index) => {
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  // Original rating display logic
  const displayRating = hoverRating || rating;

  // --- UPDATED Add To Cart Handler ---
  // Renamed back to onAddToCartClick to match your base code
  const onAddToCartClick = () => {
    if (productData && stockItemId) { // Check if we have product data AND the Stocktake ID
      // Call the prop function passed from App.js
      onAddToCart({
        // Pass necessary details for App.js's handleAddToCart
        name: productData.Name,
        // Potentially other details like description if needed by App.js
        stockItemId: stockItemId // Pass the crucial ID from Stocktake
      });
    } else if (!stockItemId) {
      alert("Cannot add to cart. Item stock information is unavailable.");
    } else {
      alert("Product data is not loaded yet.");
    }
  };
  // --- END UPDATED Handler ---

  // Original handler for other cards
  const handleOtherCardClick = (id) => {
    window.location.href = `/products?id=${id}`;
  };


  // --- Original Render Logic ---
  if (loading) {
    return <div className="main-container"><p>Loading product...</p></div>;
  }

  if (error) {
    return <div className="main-container"><p>{error}</p></div>;
  }

  if (!productData) {
    return <div className="main-container"><p>Product not found.</p></div>;
  }

  // --- Return statement uses EXACTLY the same structure and class names as your base code ---
  return (
    <div className="main-container"> {/* Base code class */}
      <nav className="breadcrumbs"> {/* Base code element */}
        <span>Home &gt; </span>
        <span>{productData.Genre?.Name || 'Genre'} &gt; </span> {/* Base code logic */}
        <span>{productData.Name}</span>
      </nav>
      <header className="section-header"> {/* Base code class */}
        <h1 className="main-heading">{productData.Name}</h1> {/* Base code class */}
      </header>
      <div className="product-page-main-layout"> {/* Base code class */}
        <div className="product-details-container"> {/* Base code class */}
          <div className="product-image-section"> {/* Base code class */}
            <img src={"https://placehold.co/300x400/F4F4F5/18181B?text=Book"} alt={productData.Name} className="product-image" /> {/* Base code class */}
          </div>
          <div className="product-description"> {/* Base code class */}
            <h2 className="overview-heading">Overview:</h2> {/* Base code class */}
            <p className="overview-text">{productData.Description}</p> {/* Base code class */}
            <p className="author-info">Author: <span className="font-normal">{productData.Author}</span></p> {/* Base code classes */}
            <p className="published-info">Published: <span className="font-normal">{productData.Published ? new Date(productData.Published).toLocaleDateString() : 'N/A'}</span></p> {/* Base code classes */}
            <p className="last-updated-info">Last Updated: <span className="font-normal">{productData.LastUpdated ? new Date(productData.LastUpdated).toLocaleDateString() : 'N/A'}</span></p> {/* Base code classes */}
            <p className="last-updated-by-info">Last Updated By: <span className="font-normal">{productData.LastUpdatedBy}</span></p> {/* Base code classes */}
          </div>
        </div>

        <div className="purchase-container"> {/* Base code class */}
          <div className="purchase-box"> {/* Base code class */}
             {/* Use Price from mainProduct object, determined by NEW logic */}
            <span className="price-tag">${productData.Price ? productData.Price.toFixed(2) : 'N/A'}</span> {/* Base code class */}
            <div className="payment-icons"> {/* Base code class */}
              <img src="https://placehold.co/70x40/992D2D/FFFFFF?text=Mastercard" alt="Mastercard" className="rounded-md" /> {/* Base code class */}
              <img src="https://placehold.co/70x40/003C87/FFFFFF?text=VISA" alt="VISA" className="rounded-md" /> {/* Base code class */}
            </div>
            <button
              className="add-to-cart-button" // Base code class
              onClick={onAddToCartClick} // Uses UPDATED handler
              disabled={!stockItemId} // <-- NEW: Disable button if no stock info
            >
              Add to Cart
            </button>
          </div>

          <div className="review-box"> {/* Base code class */}
            <h3 className="review-heading">Leave a Review!</h3> {/* Base code class */}
            <div className="star-rating"> {/* Base code class */}
              {[...Array(5)].map((star, index) => { // Base code logic
                const ratingValue = index + 1;
                return (
                  <span
                    key={index}
                    className="cursor-pointer" // Base code class
                    style={{ // Base code style
                      color: ratingValue <= displayRating ? "gold" : "lightgray"
                    }}
                    onClick={() => handleStarClick(ratingValue)}
                    onMouseEnter={() => handleMouseEnter(ratingValue)}
                    onMouseLeave={handleMouseLeave}
                  >
                    &#9733; {/* Base code character */}
                  </span>
                );
              })}
            </div>
            <button className="submit-review-button"> {/* Base code class */}
              Submit
            </button>
          </div>
        </div>
      </div>

      <div className="other-titles-section"> {/* Base code class */}
        <header className="other-titles-header"> {/* Base code class */}
          <h1 className="other-titles-heading">Other Titles by {productData.Author}</h1> {/* Base code class */}
        </header>
        <main className="horizontal-scroll-container"> {/* Base code class */}
          {otherTitles.length > 0 ? ( // Base code logic
            otherTitles.map(product => (
              <ProductCard
                key={product.id}
                imageSrc={product.image}
                bookName={product.name} // Base code prop name
                price={product.price}
                onClick={() => handleOtherCardClick(product.id)}
              />
            ))
          ) : (
            <p>No other titles found by this author.</p> // Base code message
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductPage;