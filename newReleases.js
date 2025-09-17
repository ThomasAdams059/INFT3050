import React from 'react';

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

// Placeholder until connected to a database.
const mockProducts = [
  { id: 1, name: 'New Release 1', price: '$20', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
  { id: 2, name: 'New Release 2', price: '$25', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
  { id: 3, name: 'New Release 3', price: '$15', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
  { id: 4, name: 'New Release 4', price: '$30', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
  { id: 5, name: 'New Release 5', price: '$18', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
  { id: 6, name: 'New Release 6', price: '$22', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
  { id: 7, name: 'New Release 7', price: '$28', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
  { id: 8, name: 'New Release 8', price: '$19', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
  { id: 9, name: 'New Release 9', price: '$24', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
  { id: 10, name: 'New Release 10', price: '$21', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
];

export default function NewReleases() {
  const handleCardClick = (bookName) => {
    // This function can be expanded to navigate to a product details page
    console.log(`You clicked on: ${bookName}`);
  };

  return (
    <div className="main-container">
      <header className="section-header">
        <h1 className="section-heading">New Releases</h1>
      </header>
      <main className="product-grid">
        {mockProducts.map((product) => (
          <ProductCard
            key={product.id}
            imageSrc={product.image}
            bookName={product.name}
            price={product.price}
            onClick={() => handleCardClick(product.name)}
          />
        ))}
      </main>
    </div>
  );
}
