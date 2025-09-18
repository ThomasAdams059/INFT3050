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
  { id: 1, name: 'Best Seller 1', price: '$20', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
  { id: 2, name: 'Best Seller 2', price: '$25', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
  { id: 3, name: 'Best Seller 3', price: '$15', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
  { id: 4, name: 'Best Seller 4', price: '$30', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
  { id: 5, name: 'Best Seller 5', price: '$18', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
  { id: 6, name: 'Best Seller 6', price: '$22', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
  { id: 7, name: 'Best Seller 7', price: '$28', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
  { id: 8, name: 'Best Seller 8', price: '$19', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
  { id: 9, name: 'Best Seller 9', price: '$24', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
  { id: 10, name: 'Best Seller 10', price: '$21', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
];

export default function BestSellers() {
  const handleCardClick = (productId) => {
    // Navigates to the product page with the product's ID in the URL.
    window.location.href = `/products?id=${productId}`;
  };

  return (
    <div className="main-container">
      <header className="section-header">
        <h1 className="section-heading">Best Sellers</h1>
      </header>
      <main className="product-grid">
        {mockProducts.map((product) => (
          <ProductCard
            key={product.id}
            imageSrc={product.image}
            bookName={product.name}
            price={product.price}
            onClick={() => handleCardClick(product.id)}
          />
        ))}
      </main>
    </div>
  );
}
