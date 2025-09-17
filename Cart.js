import React from 'react';

// This is a placeholder component for a single item in the cart.
const CartItem = ({ imageSrc, name, price }) => {
  return (
    <div className="cart-item">
      <div className="cart-item-details">
        <div className="cart-item-image-container">
          <img src={imageSrc} alt={name} className="cart-item-image" />
        </div>
        <div className="cart-item-info">
          <p className="cart-item-name">{name}</p>
          <p className="cart-item-price">{price}</p>
        </div>
      </div>
    </div>
  );
};

// Reusing the ProductCard component from your homepage for consistency.
const ProductCard = ({ imageSrc, bookName, price }) => {
  return (
    <div className="product-card-container">
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

// Mock data to simulate cart and recommended items.
const mockCartItems = [
  { id: 1, name: 'Book Name', price: 30.99, type: 'Book', image: 'https://placehold.co/100x150/F4F4F5/18181B?text=Book' },
  { id: 2, name: 'Movie Name', price: 30.99, type: 'Movie', image: 'https://placehold.co/100x150/F4F4F5/18181B?text=Movie' },
];

const mockRecommendedItems = [
  { id: 3, name: 'Book 1', price: '$30.99', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
  { id: 4, name: 'Book 2', price: '$30.99', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
  { id: 5, name: 'Book 3', price: '$30.99', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
];

const CartPage = () => {
  const cartTotal = mockCartItems.reduce((total, item) => total + item.price, 0);

  return (
    <div className="main-container">
      <div className="cart-layout">
        <div className="cart-box">
          <h1 className="cart-heading">Cart</h1>
          <div className="cart-items-container">
            {mockCartItems.map(item => (
              <CartItem key={item.id} imageSrc={item.image} name={item.name} price={`$${item.price.toFixed(2)}`} />
            ))}
          </div>
          <div className="cart-total-section">
            <span className="cart-total-text">Total: </span>
            <span className="cart-total-price-text">${cartTotal.toFixed(2)}</span>
          </div>
          <button className="cart-checkout-button">Proceed to Payment</button>
        </div>

        <div className="recommended-box">
          <h1 className="recommended-heading">Recommended For You</h1>
          <div className="recommended-items-container">
            {mockRecommendedItems.map(product => (
              <ProductCard
                key={product.id}
                imageSrc={product.image}
                bookName={product.name}
                price={product.price}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

