import React from 'react';

const ProductCard = ({ imageSrc, productName, price, onClick }) => {
  return (
    <div
      className="product-card-container"
      onClick={onClick}
    >
      <div className="product-image-container">
        <img src={imageSrc} alt={productName} className="product-image" />
      </div>
      <div className="product-details">
        <h3 className="product-title" title={productName}>
          {productName}
        </h3>
        <p className="product-price">
          {price}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;