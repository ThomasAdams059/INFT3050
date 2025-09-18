import React from 'react';

// Reusing the ProductCard component from your homepage.
const ProductCard = ({ imageSrc, bookName, price, onClick }) => {
  return (
    <div
      className="product-card-container"
      onClick={onClick}
    >
      <div className="product-image-container">
        <img src={imageSrc} alt={bookName} className="product-image" />
      </div>
      <div className="product-details">
        <h3 className="product-title">
          {bookName}
        </h3>
        <p className="product-price">
          {price}
        </p>
      </div>
    </div>
  );
};

// Mock data structured by genre.
const mockGenres = [
  {
    id: 1,
    name: "Fiction",
    books: [
      { id: 1, name: 'Fiction Book 1', price: '$20', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
      { id: 2, name: 'Fiction Book 2', price: '$25', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
      { id: 3, name: 'Fiction Book 3', price: '$15', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
      { id: 4, name: 'Fiction Book 4', price: '$30', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
    ]
  },
  {
    id: 2,
    name: "Non-Fiction",
    books: [
      { id: 5, name: 'Non-Fiction Book 1', price: '$18', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
      { id: 6, name: 'Non-Fiction Book 2', price: '$22', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
      { id: 7, name: 'Non-Fiction Book 3', price: '$28', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
      { id: 8, name: 'Non-Fiction Book 4', price: '$19', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
    ]
  },
  {
    id: 3,
    name: "Games",
    books: [
      { id: 9, name: 'Game 1', price: '$24', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Game' },
      { id: 10, name: 'Game 2', price: '$21', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Game' },
      { id: 11, name: 'Game 3', price: '$26', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Game' },
    ]
  },
  {
    id: 4,
    name: "Movies",
    books: [
      { id: 12, name: 'Movie 1', price: '$12', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Movie' },
      { id: 13, name: 'Movie 2', price: '$15', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Movie' },
      { id: 14, name: 'Movie 3', price: '$10', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Movie' },
    ]
  },
];

export default function Genre() {
  const handleCardClick = (bookId) => {
    // Navigates to the product page with the book's ID in the URL.
    window.location.href = `/products?id=${bookId}`;
  };

  return (
    <div className="main-container">
      <header className="section-header">
        <h1 className="section-heading">Browse by Genre</h1>
      </header>
      {mockGenres.map(genre => (
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
      ))}
    </div>
  );
}
