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
        // Read the query parameter from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('query') || "";
        
        setSearchTerm(query);

        if (!query) {
            setLoading(false);
            return;
        }
        
        const fetchSearchResults = async () => {
            // 1. Convert query to lowercase AND remove all spaces
            const normalizedQuery = query.toLowerCase().replace(/\s/g, '');

            try {
                // 2. Fetch all products and stocktake data
                const [productResponse, stocktakeResponse] = await Promise.all([
                  axios.get(`${API_BASE_URL}/Product`),
                  axios.get(`${API_BASE_URL}/Stocktake`)
                ]);
                
                const allProducts = productResponse.data.list || [];
                const stocktakeList = stocktakeResponse.data.list || [];
                
                // 3. Perform the space-insensitive filtering logic
                const matches = allProducts.filter(product => {
                    if (!product.Name && !product.Author) return false;
                    
                    // Convert product fields to lowercase AND remove all spaces for comparison
                    const name = product.Name?.toLowerCase().replace(/\s/g, '') || "";
                    const author = product.Author?.toLowerCase().replace(/\s/g, '') || "";
                    
                    return name.includes(normalizedQuery) || author.includes(normalizedQuery);
                });
                
                // Get prices from Stocktake data
                const priceMap = {};
                stocktakeList.forEach(item => {
                    if(item.SourceId === 1) // Hard Copy Books
                        priceMap[item.ProductId] = item.Price;
                });

                // Map results to include price
                const formattedProducts = matches.map(product => ({
                    ...product,
                    price: priceMap[product.ID] ? `$${priceMap[product.ID].toFixed(2)}` : 'Price N/A'
                }));

                setProducts(formattedProducts);
                
            } catch (error) {
                console.error("Error fetching search results:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [window.location.search]);

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
    
    // Fallback for no results or no query
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
              price={product.price}
              onClick={() => handleCardClick(product.ID)}
            />
          ))}
        </main>
      </div>
    );
};

export default SearchResults;
