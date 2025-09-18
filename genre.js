import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './productCard';

export default function Genre() {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const url = "http://localhost:3001/api/inft3050/Genre";

    axios.get(url)
      .then(response => {
        const result = response.data;
        // The data is already in the correct nested structure
        // We only need to rename some keys to match the component props
        const restructuredGenres = result.list.map(genre => ({
          id: genre.GenreID,
          name: genre.Name,
          books: genre['Product List'].map(product => ({
            id: product.ID,
            name: product.Name,
            // Placeholder values for image and price, as the API doesn't provide them
            image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Product',
            price: '$30.99' 
          }))
        }));
        setGenres(restructuredGenres);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleCardClick = (bookId) => {
    window.location.href = `/products?id=${bookId}`;
  };

  return (
    <div className="main-container">
      <header className="section-header">
        <h1 className="section-heading">Browse by Genre</h1>
      </header>
      {genres.length > 0 ? (
        genres.map(genre => (
          <div key={genre.id} className="content-section">
            <header className="section-header">
              <h2 className="section-heading">{genre.name}</h2>
            </header>
            <main className="horizontal-scroll-container">
              {genre.books.map(book => (
                <ProductCard
                  key={book.id}
                  imageSrc={book.image}
                  bookName={book.name}
                  price={book.price}
                  onClick={() => handleCardClick(book.id)}
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
