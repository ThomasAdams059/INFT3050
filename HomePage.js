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
  const handleCardClick = (bookName) => {
    console.log(You clicked on: ${bookName});
  };

  
  return (
    <>
      <div className="mb-8">
        <header className="border-b pb-2 mb-4 custom-border-color">
          <a href="/bestSellers" className="block">
            <h1 className="text-3xl font-bold custom-header-color">Best Sellers</h1>
          </a>
        </header>
        <main>
          <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
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
                
      <div className="mb-8">
            <header className="border-b pb-2 mb-4 custom-border-color">
              <a href="/newReleases" className="block">
                <h1 className="text-3xl font-bold custom-header-color">New Releases</h1>
              </a>
            </header>
            <main>
              <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
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
                    
         <div className="mb-8">
                <header className="border-b pb-2 mb-4 custom-border-color">
                    <a href="/nonFiction" className="block">
                      <h1 className="text-3xl font-bold custom-header-color">Non-Fiction</h1>
                    </a>
                </header>
                <main>
                  <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
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
                        
        <div className="mb-8">
              <header className="border-b pb-2 mb-4 custom-border-color">
                <a href="/fiction" className="block">
                  <h1 className="text-3xl font-bold custom-header-color">Fiction</h1>
                </a>
              </header>
              <main>
                <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
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
                      
        <div className="mb-8">
              <header className="border-b pb-2 mb-4 custom-border-color">
                <a href="/movies" className="block">
                  <h1 className="text-3xl font-bold custom-header-color">Movies</h1>
                </a>
              </header>
              <main>
                <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
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
                      
        <div className="mb-8">
              <header className="border-b pb-2 mb-4 custom-border-color">
                <a href="/games" className="block">
                  <h1 className="text-3xl font-bold custom-header-color">Games</h1>
                </a>
              </header>
              <main>
                <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
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
                      
          <div className="mb-8">
              <header className="border-b pb-2 mb-4 custom-border-color">
                <a href="/recentlyViewed" className="block">
                  <h1 className="text-3xl font-bold custom-header-color">Recently Viewed Items</h1>
                </a>
              </header>
              <main>
                <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
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
