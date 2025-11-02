import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './productCard';

export default function Genre() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenreAndStocktakeData = async () => {
      try {
        const baseUrl = "http://localhost:3001/api/inft3050";
        const genreUrl = `${baseUrl}/Genre?limit=10000`;
        const stocktakeUrl = `${baseUrl}/Stocktake?limit=10000`;

        // gets from genre and stocktake in paralellel
        const [genreResponse, stocktakeResponse] = await Promise.all([
          axios.get(genreUrl, { withCredentials: true }),
          axios.get(stocktakeUrl, { withCredentials: true })
        ]);

        const genresList = genreResponse.data.list;
        const stocktakeList = stocktakeResponse.data.list;

        // price lookup map for quick access
        const priceMap = {};
        stocktakeList.forEach(item => {
          // finds a price and preferring source id 1
          if (item.Price && (!priceMap[item.ProductId] || item.SourceId === 1)) {
            priceMap[item.ProductId] = item.Price;
          }
        });

        // restructured the genre data and add prices from the lookup map
        const restructuredGenres = genresList.map(genre => ({
          id: genre.GenreID,
          name: genre.Name,
          products: genre['Product List'].map(product => {
            const price = priceMap[product.ID] ? `$${priceMap[product.ID].toFixed(2)}` : 'Price N/A';
            return {
              id: product.ID,
              name: product.Name,
              image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Product',
              price: price
            };
          })
        }));

        setGenres(restructuredGenres);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchGenreAndStocktakeData();
  }, []);

  const handleCardClick = (productId) => {
    window.location.href = `/products?id=${productId}`;
  };

  return (
    <div className="main-container">
      <header className="section-header">
        <h1 className="section-heading">Browse by Genre</h1>
      </header>
      {loading ? (
        <p>Loading genres...</p>
      ) : genres.length > 0 ? (
        genres.map(genre => (
          <div key={genre.id} className="content-section">
            <header className="section-header">
              <h2 className="section-heading">{genre.name}</h2>
            </header>
          
            <main className="product-grid">
              
              {genre.products.map(product => (
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
        <p>No genres found. Please check the database.</p>
      )}
    </div>
  );
}