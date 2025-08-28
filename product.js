import React, { useState } from 'react';

const ProductCard = ({ imageSrc, bookName, price, onClick }) => {
  return (
    <div 
      className="product-card-horizontal product-card-container"
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


const ProductPage = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const productData = {
    title: "Book Title",
    image: "https://placehold.co/300x400/F4F4F5/18181B?text=Book",
    overview: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    author: "John Smith",
    published: "10/10/10",
    lastUpdated: "10/10/10",
    lastUpdatedBy: "Smith John",
    price: "$30.99",
  };

  const mockProducts = [
    { id: 1, name: 'Book 1', price: '$20', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
    { id: 2, name: 'Book 2', price: '$25', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
    { id: 3, name: 'Book 3', price: '$15', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
    { id: 4, name: 'Book 4', price: '$30', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
    { id: 5, name: 'Book 5', price: '$18', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
  ];

  const handleCardClick = (bookName) => {
    console.log(`You clicked on: ${bookName}`);
  };
  
  const handleStarClick = (index) => {
    setRating(index);
  };

  const handleMouseEnter = (index) => {
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="main-container">
      <nav className="breadcrumbs">
        <span>Home &gt; </span>
        <span>Genre &gt; </span>
        <span>Sub-Genre</span>
      </nav>
      <header className="section-header">
        <h1 className="main-heading">{productData.title}</h1>
        </header>
      <div className="product-page-main-layout">
        <div className="product-details-container">
          <div className="product-image-section">
            <img src={productData.image} alt={productData.title} className="product-image" />
          </div>
          <div className="product-description">
            <h2 className="overview-heading">Overview:</h2>
            <p className="overview-text">{productData.overview}</p>
            <p className="author-info">Author: <span className="font-normal">{productData.author}</span></p>
            <p className="published-info">Published: <span className="font-normal">{productData.published}</span></p>
            <p className="last-updated-info">Last Updated: <span className="font-normal">{productData.lastUpdated}</span></p>
            <p className="last-updated-by-info">Last Updated By: <span className="font-normal">{productData.lastUpdatedBy}</span></p>
          </div>
        </div>

        <div className="purchase-container">
          <div className="purchase-box">
            <span className="price-tag">{productData.price}</span>
            <div className="payment-icons">
              <img src="https://placehold.co/50x30/213554/fff?text=Card" alt="Credit Card" className="rounded-md" />
              <img src="https://placehold.co/50x30/213554/fff?text=Card" alt="VISA" className="rounded-md" />
              <img src="https://placehold.co/50x30/213554/fff?text=Card" alt="Card" className="rounded-md" />
            </div>
            <button className="add-to-cart-button">
              Add to Cart
            </button>
          </div>

          <div className="review-box">
            <h3 className="review-heading">Leave a Review!</h3>
            <div className="star-rating">
              {[...Array(5)].map((star, index) => {
                const ratingValue = index + 1;
                return (
                  <span
                    key={index}
                    className="cursor-pointer"
                    style={{
                      color: ratingValue <= displayRating ? "gold" : "lightgray"
                    }}
                    onClick={() => handleStarClick(ratingValue)}
                    onMouseEnter={() => handleMouseEnter(ratingValue)}
                    onMouseLeave={handleMouseLeave}
                  >
                    &#9733;
                  </span>
                );
              })}
            </div>
            <button className="submit-review-button">
              Submit
            </button>
          </div>
        </div>
      </div>
        
      <div className="other-titles-section">
        <header className="other-titles-header">
          <h1 className="other-titles-heading">Other Titles by Author</h1>
        </header>
        <main className="horizontal-scroll-container">
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
    </div>
  );
};

export default ProductPage;
