import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './productCard';

const ProductPage = ({ onAddToCart }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get the product ID from the URL query string
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
      // Use the new API endpoint to fetch a specific product by its ID
      const url = `http://localhost:3001/api/inft3050/Product/${productId}`;

      axios.get(url)
        .then(response => {
          // Assuming the API returns a single product object
          const product = response.data;
          setProductData(product);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching product data:", err);
          setError("Failed to load product data.");
          setLoading(false);
        });
    } else {
      setError("No product ID provided in the URL.");
      setLoading(false);
    }
  }, []);

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

  if (loading) {
    return <div className="main-container"><p>Loading product...</p></div>;
  }

  if (error) {
    return <div className="main-container"><p>{error}</p></div>;
  }

  if (!productData) {
    return <div className="main-container"><p>Product not found.</p></div>;
  }

  // Handle the "Add to Cart" button click
  const onAddToCartClick = () => {
    const itemToAdd = {
      id: productData.ID,
      name: productData.Name,
      price: productData.Price || 'N/A', // Assuming you have a price property
      image: "https://placehold.co/100x150/F4F4F5/18181B?text=Book" // Placeholder image
    };
    if (onAddToCart) {
      onAddToCart(itemToAdd);
    }
  };

  return (
    <div className="main-container">
      <nav className="breadcrumbs">
        <span>Home &gt; </span>
        <span>{productData.Genre ? productData.Genre.Name : 'Genre'} &gt; </span>
        <span>{productData.Name}</span>
      </nav>
      <header className="section-header">
        <h1 className="main-heading">{productData.Name}</h1>
      </header>
      <div className="product-page-main-layout">
        <div className="product-details-container">
          <div className="product-image-section">
            <img src={"https://placehold.co/300x400/F4F4F5/18181B?text=Book"} alt={productData.Name} className="product-image" />
          </div>
          <div className="product-description">
            <h2 className="overview-heading">Overview:</h2>
            <p className="overview-text">{productData.Description}</p>
            <p className="author-info">Author: <span className="font-normal">{productData.Author}</span></p>
            <p className="published-info">Published: <span className="font-normal">{productData.Published ? new Date(productData.Published).toLocaleDateString() : 'N/A'}</span></p>
            <p className="last-updated-info">Last Updated: <span className="font-normal">{productData.LastUpdated ? new Date(productData.LastUpdated).toLocaleDateString() : 'N/A'}</span></p>
            <p className="last-updated-by-info">Last Updated By: <span className="font-normal">{productData.LastUpdatedBy}</span></p>
          </div>
        </div>

        <div className="purchase-container">
          <div className="purchase-box">
            <span className="price-tag">${productData.Price || 'N/A'}</span>
            <div className="payment-icons">
              <img src="https://placehold.co/70x40/992D2D/FFFFFF?text=Mastercard" alt="Mastercard" className="rounded-md" />
              <img src="https://placehold.co/70x40/003C87/FFFFFF?text=VISA" alt="VISA" className="rounded-md" />
            </div>
            <button className="add-to-cart-button" onClick={onAddToCartClick}>
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
          {/* This section would require a separate API call to get other books by the same author */}
          <p>Other titles by {productData.Author} loading...</p>
        </main>
      </div>
    </div>
  );
};

export default ProductPage;
