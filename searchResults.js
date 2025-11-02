import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './productCard';

const API_BASE_URL = "http://localhost:3001/api/inft3050";

const SearchResults = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('query') || "";
        
        setSearchTerm(query);

        if (!query) {
            setLoading(false);
            return;
        }
        
        const fetchSearchResults = async () => {
            const normalizedQuery = query.toLowerCase().replace(/\s/g, '');

            try {
                  // --- FIX: Added backticks (`) for template literals ---
                  const [productResponse, stocktakeResponse, genreResponse] = await Promise.all([
                      axios.get(`${API_BASE_URL}/Product?limit=10000`, { withCredentials: true }),
                      axios.get(`${API_BASE_URL}/Stocktake?limit=10000`, { withCredentials: true }),
                      axios.get(`${API_BASE_URL}/Genre?limit=10000`, { withCredentials: true })
                  ]);
                  // --- END FIX ---
                
                const allProducts = productResponse.data.list || [];
                const stocktakeList = stocktakeResponse.data.list || [];
                const allGenres = genreResponse.data.list || []; // <-- NEW

                // --- NEW: Create a Price Map (like in genre.js) ---
                const priceMap = {};
                stocktakeList.forEach(item => {
                  if (item.Price && (!priceMap[item.ProductId] || item.SourceId === 1)) {
                    priceMap[item.ProductId] = item.Price;
                  }
                });

                // --- NEW: Create a Genre Map ---
                const genreMap = {};
                allGenres.forEach(genre => {
                  genreMap[genre.GenreID] = genre.Name.toLowerCase().replace(/\s/g, '');
                });
                
                // --- UPDATED: Filter logic to include Genre ---
                const matches = allProducts.filter(product => {
                    if (!product.Name && !product.Author && !product.Genre) return false;
                    
                    const name = (product.Name || '').toLowerCase().replace(/\s/g, '');
                    const author = (product.Author || '').toLowerCase().replace(/\s/g, '');
                    // Find the genre name (e.g., "movies") from the map
                    const genreName = genreMap[product.Genre] || ''; 
                    
                    // Check if query is in name, author, OR genre name
                    return name.includes(normalizedQuery) || 
                           author.includes(normalizedQuery) ||
                           genreName.includes(normalizedQuery);
                });

                // --- NEW: Map prices to the filtered matches ---
                const pricedMatches = matches.map(product => ({
                  ...product,
                  price: priceMap[product.ID] ? `$${priceMap[product.ID].toFixed(2)}` : 'N/A'
                }));

                setProducts(pricedMatches);
                
            } catch (error) {
                console.error("Error fetching search results:", error);
            } finally {
                // --- NEW: Set loading to false in a finally block ---
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [window.location.search]); // Re-run search if URL query changes

    const handleCardClick = (productId) => {
        window.location.href = `/products?id=${productId}`;
    };

    if (loading) {
        return (
            <div className="main-container">
                <header className="section-header">
                    <h1 className="section-heading">Searching for: "{searchTerm}"</h1>
                </header>
                <p>Loading search results...</p>
            </div>
        );
    }
    
    if (products.length === 0) {
      return (
        <div className="main-container">
          <header className="section-header">
            <h1 className="section-heading">Search Results for: "{searchTerm}"</h1>
          </header>
          <p>No results found matching your search term. Please try a different query.</p>
        </div>
      );
    }

    return (
      <div className="main-container">
        <header className="section-header">
          <h1 className="section-heading">Search Results for: "{searchTerm}"</h1>
          <p className="results-count">{products.length} {products.length === 1 ? 'item' : 'items'} found.</p>
        </header>
        
        <main className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.ID}
              imageSrc={"https://placehold.co/200x300/F4F4F5/18181B?text=Book"}
              productName={product.Name}
              price={product.price} // <-- Use the price from the map
              onClick={() => handleCardClick(product.ID)}
            />
          ))}
        </main>
      </div>
    );
};

export default SearchResults;