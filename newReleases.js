import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './productCard';

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = "http://localhost:3001/api/inft3050/Stocktake";

    axios.get(url)
      .then(response => {
        const stocktakeItems = response.data.list;

        // Filter out any items that are missing product information
        const validItems = stocktakeItems.filter(item => item.Product && item.Product.Name);

        // Sort items by Quantity in ascending order (least remaining stock)
        const sortedItems = validItems.sort((a, b) => a.Quantity - b.Quantity);

        // Take the top 10 items from the sorted list
        const top10BestSellers = sortedItems.slice(0, 10);

        // Map the top 10 items to a structure that the ProductCard component can use
        const formattedProducts = top10BestSellers.map(item => ({
          id: item.Product.ID,
          name: item.Product.Name,
          price: `$${item.Price.toFixed(2)}`,
          image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' // Placeholder image
        }));

        setProducts(formattedProducts);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching best sellers:", error);
        setLoading(false);
      });
  }, []);

  const handleCardClick = (productId) => {
    window.location.href = `/products?id=${productId}`;
  };

  return (
    <div className="main-container">
      <header className="section-header">
        <h1 className="section-heading">Best Sellers</h1>
      </header>
      <main className="product-grid">
        {loading ? (
          <p>Loading best sellers...</p>
        ) : products.length > 0 ? (
          products.map(product => (
            <ProductCard
              key={product.id}
              imageSrc={product.image}
              productName={product.name}
              price={product.price}
              onClick={() => handleCardClick(product.id)}
            />
          ))
        ) : (
          <p>No best sellers found. Please check the database.</p>
        )}
      </main>
    </div>
  );
}
