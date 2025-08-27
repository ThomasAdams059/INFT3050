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

return (
    <div className="container mx-auto px-4 py-8">

      <nav className="text-gray-500 text-sm mb-4">
        <span>Home &gt; </span>
        <span>Genre &gt; </span>
        <span>Sub-Genre</span>
      </nav>

      <h1 className="text-3xl font-bold custom-color-main mb-6">{productData.title}</h1>
      <div className="flex flex-col lg:flex-row gap-8">

        <div className="flex flex-col lg:flex-row lg:w-2/3 gap-8">
          <div className="w-full lg:w-1/2 flex justify-center">
            <img src={productData.image} alt={productData.title} className="rounded-lg shadow-lg" />
          </div>
          <div className="w-full lg:w-1/2">
            <h2 className="text-xl font-bold mb-2">Overview:</h2>
            <p className="text-gray-600 mb-4">{productData.overview}</p>
            <p className="font-semibold mb-2">Author: <span className="font-normal">{productData.author}</span></p>
            <p className="font-semibold mb-2">Published: <span className="font-normal">{productData.published}</span></p>
            <p className="font-semibold mb-2">Last Updated: <span className="font-normal">{productData.lastUpdated}</span></p>
            <p className="font-semibold">Last Updated By: <span className="font-normal">{productData.lastUpdatedBy}</span></p>
          </div>
        </div>

        <div className="flex flex-col lg:w-1/3 gap-4">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md flex flex-col items-center justify-between">
            <span className="text-3xl font-bold text-gray-800 mb-2">{productData.price}</span>
            <div className="flex gap-2 mb-4">
              <img src="https://placehold.co/50x30/213554/fff?text=Card" alt="Credit Card" className="rounded-md" />
              <img src="https://placehold.co/50x30/213554/fff?text=Card" alt="VISA" className="rounded-md" />
              <img src="https://placehold.co/50x30/213554/fff?text=Card" alt="Card" className="rounded-md" />
            </div>
            <button className="w-full py-3 bg-[#495867] text-white font-bold rounded-full transition-colors duration-300 hover:bg-[#213554]">
              Add to Cart
            </button>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-xl font-bold mb-2">Leave a Review!</h3>
            <div className="flex text-3xl text-gray-400 gap-1 mb-4">
  //need to figure out how to make a proper ratings thing
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <button className="w-full py-3 bg-[#495867] text-white font-bold rounded-full transition-colors duration-300 hover:bg-[#213554]">
              Submit
            </button>
          </div>
        </div>
      </div>
          
      <div className="mt-12">
        <header className="border-b pb-2 mb-4 custom-border-color">
          <h1 className="text-3xl font-bold custom-color-main">Other Titles by Author</h1>
        </header>
        <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
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
