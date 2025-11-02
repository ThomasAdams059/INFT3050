import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './productCard';


export default function NewReleases() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewReleases = async () => {
      setLoading(true);
      setError(null);
      try {
        const productUrl = "http://localhost:3001/api/inft3050/Product?limit=10000";
        const stocktakeUrl = "http://localhost:3001/api/inft3050/Stocktake?limit=10000";

        const [productResponse, stocktakeResponse] = await Promise.all([
          axios.get(productUrl),
          axios.get(stocktakeUrl)
        ]);

        const allProducts = productResponse.data.list || [];
        const stocktakeList = stocktakeResponse.data.list || [];

        const priceMap = {};
        stocktakeList.forEach(item => {
          if (item.Price && (!priceMap[item.ProductId] || item.SourceId === 1)) {
            priceMap[item.ProductId] = item.Price;
          }
        });

        const sortedProducts = allProducts.sort((a, b) => {
          const dateA = a.Published ? new Date(a.Published) : new Date(0);
          const dateB = b.Published ? new Date(b.Published) : new Date(0);
          const timeA = !isNaN(dateA.getTime()) ? dateA.getTime() : 0;
          const timeB = !isNaN(dateB.getTime()) ? dateB.getTime() : 0;
          return timeB - timeA;
        });

        const top10NewReleases = sortedProducts.slice(0, 10);

        const formattedProducts = top10NewReleases.map(product => ({
          id: product.ID,
          name: product.Name,
          price: priceMap[product.ID] ? `$${priceMap[product.ID].toFixed(2)}` : 'Price N/A',
          image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book'
        }));

        setProducts(formattedProducts);

      } catch (err) {
        console.error("Error fetching new releases:", err);
        setError("Failed to load new releases. Please check the API connection.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewReleases();
  }, []);

  const handleCardClick = (productId) => {
    window.location.href = `/products?id=${productId}`;
  };

  return (
    <div className="main-container">
      <header className="section-header">
        <h1 className="section-heading">New Releases</h1>
      </header>
      <main className="product-grid">
        {loading ? (
          <p>Loading new releases...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              imageSrc={product.image}
              productName={product.name}
              price={product.price}
              onClick={() => handleCardClick(product.id)}
            />
          ))
        ) : (
          <p>No new releases found.</p>
        )}
      </main>
    </div>
  );
}