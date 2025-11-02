import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './productCard';

export default function Author() {
  const [authors, setAuthors] = useState([]); // stores data grouped by author
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthorAndStocktakeData = async () => {
      try {
        const baseUrl = "http://localhost:3001/api/inft3050";
        const productsUrl = `${baseUrl}/Product`; // gets all products to find Authors
        const stocktakeUrl = `${baseUrl}/Stocktake`;

        // gets products and stocktake data
        const [productsResponse, stocktakeResponse] = await Promise.all([
          axios.get(productsUrl),
          axios.get(stocktakeUrl)
        ]);

        const productsList = productsResponse.data.list;
        const stocktakeList = stocktakeResponse.data.list;

        if (!productsList) {
            setError("No products found.");
            setLoading(false);
            return;
        }

        // creates price look up for ease
        const priceMap = {};
        stocktakeList.forEach(item => {
          // ensures we consider items from source id 1 as in genre.js
          if(item.SourceId === 1) 
            priceMap[item.ProductId] = item.Price;
        });

        // 3. Group products by Author
        const authorsMap = {};

        productsList.forEach(product => {
          // uses unknown author as fallback if the field is missing
          const authorName = product.Author || 'Unknown Author';
          
          if (!authorsMap[authorName]) {
            authorsMap[authorName] = {
              id: authorName.replace(/\s/g, ''), // creates a simple unique ID by removing spaces
              name: authorName,
              products: []
            };
          }

          // price to product added if there is one
          const price = priceMap[product.ID] ? `$${priceMap[product.ID].toFixed(2)}` : 'Price N/A';
          
          authorsMap[authorName].products.push({
            id: product.ID,
            name: product.Name,
            
            image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Product',
            price: price
          });
        });

        // converts maps to authos in an array
        setAuthors(Object.values(authorsMap));
        setLoading(false);
        setError(null);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load author data. Check API connection.");
        setLoading(false);
      }
    };

    fetchAuthorAndStocktakeData();
  }, []);

  const handleCardClick = (productId) => {
    // goes to the product page with the products ID in the url as standard
    window.location.href = `/products?id=${productId}`;
  };

  return (
    <div className="main-container">
      <header className="section-header">
        <h1 className="section-heading">Browse by Author</h1>
      </header>
      
      {loading ? (
        <p>Loading authors...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : authors.length > 0 ? (
        authors.map(author => (
          <div key={author.id} className="content-section"> {/* uses unique author name as key */}
            <header className="section-header">
              <h2 className="section-heading">{author.name}</h2>
            </header>
            <main className="horizontal-scroll-container">
              {/* displays the first 7 books by this author like other pages */}
              {author.products.slice(0, 7).map(product => (
                <ProductCard
                  key={product.id}
                  imageSrc={product.image}
                  productName={product.name}
                  price={product.price}
                  onClick={() => handleCardClick(product.id)}
                />
              ))}
            </main>
          </div>
        ))
      ) : (
        <p>No authors found in the database.</p>
      )}
    </div>
  );
}