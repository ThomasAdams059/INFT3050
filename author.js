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

// Mock data structured by author.
const mockAuthors = [
  {
    id: 1,
    name: "Jane Doe",
    books: [
      { id: 1, name: 'Jane Doe\'s Book 1', price: '$20', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
      { id: 2, name: 'Jane Doe\'s Book 2', price: '$25', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
      { id: 3, name: 'Jane Doe\'s Book 3', price: '$15', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
      { id: 4, name: 'Jane Doe\'s Book 4', price: '$30', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
    ]
  },
  {
    id: 2,
    name: "John Smith",
    books: [
      { id: 5, name: 'John Smith\'s Book 1', price: '$18', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
      { id: 6, name: 'John Smith\'s Book 2', price: '$22', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
      { id: 7, name: 'John Smith\'s Book 3', price: '$28', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
      { id: 8, name: 'John Smith\'s Book 4', price: '$19', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
    ]
  },
  {
    id: 3,
    name: "A. B. C. Author",
    books: [
      { id: 9, name: 'Author Book 1', price: '$24', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
      { id: 10, name: 'Author Book 2', price: '$21', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
      { id: 11, name: 'Author Book 3', price: '$26', image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' },
    ]
  }
];

export default function Author() {
  const handleCardClick = (bookName) => {
    console.log(`You clicked on: ${bookName}`);
  };

  return (
    <div className="main-container">
      <header className="section-header">
        <h1 className="section-heading">Browse Authors</h1>
      </header>
      {mockAuthors.map(author => (
        <div key={author.id} className="content-section">
          <header className="section-header">
            <h2 className="section-heading">{author.name}</h2>
          </header>
          <main className="horizontal-scroll-container">
            {author.books.map(book => (
              <ProductCard
                key={book.id}
                imageSrc={book.image}
                bookName={book.name}
                price={book.price}
                onClick={() => handleCardClick(book.name)}
              />
            ))}
          </main>
        </div>
      ))}
    </div>
  );
}
