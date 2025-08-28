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

//placeholder until connect to database
const mockProducts = [
  { id: 1, name: 'Book 1', price: '$20', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
  { id: 2, name: 'Book 2', price: '$25', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
  { id: 3, name: 'Book 3', price: '$15', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
  { id: 4, name: 'Book 4', price: '$30', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
  { id: 5, name: 'Book 5', price: '$18', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
  { id: 6, name: 'Book 6', price: '$22', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
  { id: 7, name: 'Book 7', price: '$28', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
  { id: 8, name: 'Book 8', price: '$19', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
  { id: 9, name: 'Book 9', price: '$24', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
  { id: 10, name: 'Book 10', price: '$21', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
];

const HomePage = () => {
    const handleCardClick = (bookId) => {
      window.location.href = `/products?id=${bookId}`;
    };

  return (
    <>
      <div className="content-section">
        <header className="section-header">
          <a href="/bestSellers" className="block">
            <h1 className="section-heading">Best Sellers</h1>
          </a>
        </header>
        <main className="horizontal-scroll-container">
          {mockProducts.slice(0, 10).map((product) => (
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
        
      <div className="content-section">
        <header className="section-header">
          <a href="/newReleases" className="block">
            <h1 className="section-heading">New Releases</h1>
          </a>
        </header>
        <main className="horizontal-scroll-container">
          {mockProducts.slice(0, 10).map((product) => (
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
            
      <div className="content-section">
        <header className="section-header">
          <a href="/nonFiction" className="block">
            <h1 className="section-heading">Non-Fiction</h1>
          </a>
        </header>
        <main className="horizontal-scroll-container">
          {mockProducts.slice(0, 10).map((product) => (
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
            
      <div className="content-section">
        <header className="section-header">
          <a href="/fiction" className="block">
            <h1 className="section-heading">Fiction</h1>
          </a>
        </header>
        <main className="horizontal-scroll-container">
          {mockProducts.slice(0, 10).map((product) => (
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
            
      <div className="content-section">
        <header className="section-header">
          <a href="/movies" className="block">
            <h1 className="section-heading">Movies</h1>
          </a>
        </header>
        <main className="horizontal-scroll-container">
          {mockProducts.slice(0, 10).map((product) => (
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
            
      <div className="content-section">
        <header className="section-header">
          <a href="/games" className="block">
            <h1 className="section-heading">Games</h1>
          </a>
        </header>
        <main className="horizontal-scroll-container">
          {mockProducts.slice(0, 10).map((product) => (
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
            
      <div className="content-section">
        <header className="section-header">
          <a href="/recentlyViewed" className="block">
            <h1 className="section-heading">Recently Viewed Items</h1>
          </a>
        </header>
        <main className="horizontal-scroll-container">
          {mockProducts.slice(0, 10).map((product) => (
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
    </>
  );
};

export default HomePage;
