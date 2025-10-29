import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './productCard';

const ProductPage = ({ onAddToCart }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [productData, setProductData] = useState(null);
  const [otherTitles, setOtherTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stockItemId, setStockItemId] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const productId = urlParams.get('id');

      if (!productId) {
        setError("No product ID provided in the URL.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setProductData(null);
      setOtherTitles([]);
      setStockItemId(null);

      const baseUrl = "http://localhost:3001/api/inft3050";
      const allProductsUrl = `${baseUrl}/Product`;
      const stocktakeUrl = `${baseUrl}/Stocktake`;

      try {
        const [allProductsResponse, stocktakeResponse] = await Promise.all([
          axios.get(allProductsUrl),
          axios.get(stocktakeUrl)
        ]);

        const allProductsList = allProductsResponse.data.list;
        const stocktakeList = stocktakeResponse.data.list;

        const mainProduct = allProductsList.find(p => p.ID.toString() === productId);

        if (!mainProduct) {
          setError("Product not found.");
          setLoading(false);
          return;
        }

        const relevantStockItem = stocktakeList.find(
          item => item.ProductId.toString() === productId && item.SourceId === 1
        );

        let displayPrice = 'N/A';
        if (relevantStockItem) {
          setStockItemId(relevantStockItem.ItemId);
          displayPrice = relevantStockItem.Price.toFixed(2);
          mainProduct.Price = relevantStockItem.Price;
        } else {
          mainProduct.Price = null;
          console.warn("Could not find matching Stocktake item (SourceId 1) for Product ID:", productId);
        }

        mainProduct.displayPrice = displayPrice;

        setProductData(mainProduct);

        if (mainProduct.Author) {
          const authorProducts = allProductsList.filter(
            p => p.Author === mainProduct.Author && p.ID !== mainProduct.ID
          );

          const otherTitlesWithPrices = authorProducts.map(p => {
            const otherStock = stocktakeList.find(item => item.ProductId === p.ID && item.SourceId === 1);
            return {
              id: p.ID,
              name: p.Name,
              image: "https://placehold.co/200x300/F4F4F5/18181B?text=Book",
              price: otherStock ? `$${otherStock.Price.toFixed(2)}` : 'N/A'
            };
          }).slice(0, 7);

          setOtherTitles(otherTitlesWithPrices);
        }

      } catch (err) {
        console.error("Error fetching product data:", err);
        setError("Failed to load product data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [window.location.search]);

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

  const onAddToCartClick = () => {
    if (productData && stockItemId) {
      onAddToCart({
        name: productData.Name,
        stockItemId: stockItemId
      });
    } else if (!stockItemId) {
      alert("Cannot add to cart. Item stock information is unavailable.");
    } else {
      alert("Product data is not loaded yet.");
    }
  };

  const handleOtherCardClick = (id) => {
    window.location.href = `/products?id=${id}`;
  };

  if (loading) {
    return <div className="main-container"><p>Loading product...</p></div>;
  }

  if (error) {
    return <div className="main-container"><p>{error}</p></div>;
  }

  if (!productData) {
    return <div className="main-container"><p>Product not found.</p></div>;
  }

  return (
    <div className="main-container">
      <nav className="breadcrumbs">
        <span>Home &gt; </span>
        <span>{productData.Genre?.Name || 'Genre'} &gt; </span>
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
            <span className="price-tag">${productData.Price ? productData.Price.toFixed(2) : 'N/A'}</span>
            <div className="payment-icons">
              <img src="https://placehold.co/70x40/992D2D/FFFFFF?text=Mastercard" alt="Mastercard" className="rounded-md" />
              <img src="https://placehold.co/70x40/003C87/FFFFFF?text=VISA" alt="VISA" className="rounded-md" />
            </div>
            <button
              className="add-to-cart-button"
              onClick={onAddToCartClick}
              disabled={!stockItemId}
            >
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
          <h1 className="other-titles-heading">Other Titles by {productData.Author}</h1>
        </header>
        <main className="horizontal-scroll-container">
          {otherTitles.length > 0 ? (
            otherTitles.map(product => (
              <ProductCard
                key={product.id}
                imageSrc={product.image}
                bookName={product.name}
                price={product.price}
                onClick={() => handleOtherCardClick(product.id)}
              />
            ))
          ) : (
            <p>No other titles found by this author.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductPage;
