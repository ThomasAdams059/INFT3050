import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './productCard'; // Import the actual ProductCard component

// Base API URL (consider defining this globally)
const API_BASE_URL = "http://localhost:3001";
const API_SUFFIX = "/api/inft3050";

export default function NewReleases() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    const fetchNewReleases = async () => {
      setLoading(true); // Set loading at the start
      setError(null);   // Reset error
      try {
        const productUrl = `${API_BASE_URL}${API_SUFFIX}/Product`;
        const stocktakeUrl = `${API_BASE_URL}${API_SUFFIX}/Stocktake`;

        // Fetch products and stock/price data in parallel
        const [productResponse, stocktakeResponse] = await Promise.all([
          axios.get(productUrl),
          axios.get(stocktakeUrl)
        ]);

        const allProducts = productResponse.data.list || []; // Handle cases where list might be missing
        const stocktakeList = stocktakeResponse.data.list || [];

        // --- Create a price lookup map ---
        // Prioritize SourceId 1 (Hard Copy Books) for price, but fall back if needed
        const priceMap = {};
        stocktakeList.forEach(item => {
          // Store price only if it doesn't exist or if this item is from SourceId 1
          if (item.Price && (!priceMap[item.ProductId] || item.SourceId === 1)) {
            priceMap[item.ProductId] = item.Price;
          }
        });

        // --- Sort products by Published date (newest first) ---
        // Handle potential null or invalid dates
        const sortedProducts = allProducts.sort((a, b) => {
          const dateA = a.Published ? new Date(a.Published) : new Date(0); // Treat null/invalid as very old
          const dateB = b.Published ? new Date(b.Published) : new Date(0);
          // Check for invalid dates after parsing
          const timeA = !isNaN(dateA.getTime()) ? dateA.getTime() : 0;
          const timeB = !isNaN(dateB.getTime()) ? dateB.getTime() : 0;
          return timeB - timeA; // Sort descending
        });

        // Take the top 10 as "new releases"
        const top10NewReleases = sortedProducts.slice(0, 10);

        // Format for ProductCard, including price
        const formattedProducts = top10NewReleases.map(product => ({
          id: product.ID,
          name: product.Name,
          price: priceMap[product.ID] ? `$${priceMap[product.ID].toFixed(2)}` : 'Price N/A',
          image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' // Placeholder image
        }));

        setProducts(formattedProducts);

      } catch (err) { // Changed 'error' variable name to 'err'
        console.error("Error fetching new releases:", err);
        setError("Failed to load new releases. Please check the API connection."); // Set error message
        setProducts([]); // Clear products on error
      } finally {
        setLoading(false); // Set loading to false in finally block
      }
    };

    fetchNewReleases();
  }, []); // Empty dependency array to run once on mount

  // Function to handle clicking on a product card
  const handleCardClick = (productId) => {
    window.location.href = `/products?id=${productId}`;
  };

  return (
    <div className="main-container">
      <header className="section-header">
        <h1 className="section-heading">New Releases</h1>
      </header>
      <main className="product-grid"> {/* Use product-grid for layout */}
        {loading ? (
          <p>Loading new releases...</p>
        ) : error ? ( // Display error message if fetch failed
          <p className="error-message">{error}</p>
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              imageSrc={product.image}
              productName={product.name} // Ensure prop name matches ProductCard
              price={product.price}
              onClick={() => handleCardClick(product.id)}
            />
          ))
        ) : (
          // Message if no products are found after loading (and no error)
          <p>No new releases found.</p>
        )}
      </main>
    </div>
  );
}
