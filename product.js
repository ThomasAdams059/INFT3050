import React from 'react';

const ProductCard = {{ imageSrc, bookName, price, onClick }} => {
  return (
    <div
      className="flex flex-col items-center p-4 bg-gray-100 rounded-1g shadow-md hover:shadow-x1 transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="w-full h-48 bg-white border border-gray-300 rounded-md flex items-center justify-center mb-4">
        <img src={imageSrc} alt={bookName} className="max-w-full max-h-full rounded-md" />
      </div>
      <div className="w-full text-center product-details">
        <h3 className="text-1g font-semibold py-1 px-2 rounded-md mb-2">
        {bookName}
        </h3>
        <p className="text-1g font-bold py-1 px-2 rounded-md">
        {price}
        </p>
      </div>
    </div>
  );
};

const ProductPage = () => {
  const productData = {
    title: "Book Title",
    image: "https://placehold.co/300x400/F4F4F5/18181B?text=Book",
    overview: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    author: "John Smith",
    published: "10/10/10",
    lastUpdated: "10/10/10",
    lastUpdatedBy: "Smith John",
    price "$30.99"
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
