import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './productCard';

// Hard coded as there is no bestSellers endpoint in Postman
const bestSellersList = [
    { id: 25, name: "A Dance to the Music of Time", author: "Anthony Powell", price: "$19.99", image: "https://placehold.co/200x300/F4F4F5/18181B?text=Book" },
    { id: 17, name: "The Bridge of San Luis Rey", author: "Thornton Wilder", price: "$15.50", image: "https://placehold.co/200x300/F4F4F5/18181B?text=Book" },
    { id: 5, name: "Animal Farm", author: "George Orwell", price: "$12.00", image: "https://placehold.co/200x300/F4F4F5/18181B?text=Book" },
    { id: 1, name: "The Adventures of Augie March", author: "Saul Bellow", price: "$22.75", image: "https://placehold.co/200x300/F4F4F5/18181B?text=Book" },
    { id: 14, name: "The Blind Assassin", author: "Margaret Atwood", price: "$24.99", image: "https://placehold.co/200x300/F4F4F5/18181B?text=Book" },
    { id: 20, name: "The Catcher in the Rye", author: "J.D. Salinger", price: "$16.25", image: "https://placehold.co/200x300/F4F4F5/18181B?text=Book" },
    { id: 9, name: "At Swim-Two-Birds", author: "Flann O'Brien", price: "$14.00", image: "https://placehold.co/200x300/F4F4F5/18181B?text=Book" },
    { id: 19, name: "Catch-22", author: "Joseph Heller", price: "$17.50", image: "https://placehold.co/200x300/F4F4F5/18181B?text=Book" },
    { id: 11, name: "Beloved", author: "Toni Morrison", price: "$13.99", image: "https://placehold.co/200x300/F4F4F5/18181B?text=Book" },
    { id: 15, name: "Blood Meridian", author: "Cormac McCarthy", price: "$21.50", image: "https://placehold.co/200x300/F4F4F5/18181B?text=Book" }
];

// Hard coded as there is no bestSellers endpoint in Postman
const newReleasesList = [
    { id: 23, name: "The Corrections", author: "Jonathan Franzen", price: "$17.99", image: "https://placehold.co/200x300/F4F4F5/18181B?text=Book" },
    { id: 10, name: "Atonement", author: "Ian McEwan", price: "$14.25", image: "https://placehold.co/200x300/F4F4F5/18181B?text=Book" },
    { id: 14, name: "The Blind Assassin", author: "Margaret Atwood", price: "$19.50", image: "https://placehold.co/200x300/F4F4F5/18181B?text=Book" },
    { id: 7, name: "Are You There God? It's Me, Margaret", author: "Judy Blume", price: "$11.00", image: "https://placehold.co/200x300/F4F4F5/18181B?text=Book" },
    { id: 22, name: "The Confessions of Nat Turner", author: "William Styron", price: "$16.75", image: "https://placehold.co/200x300/F4F4F5/18181B?text=Book" },
    { id: 19, name: "Catch-22", author: "Joseph Heller", price: "$13.99", image: "https://placehold.co/200x300/F4F4F5/18181B?text=Book" },
    { id: 21, name: "A Clockwork Orange", author: "Anthony Burgess", price: "$10.50", image: "https://placehold.co/200x300/F4F4F5/18181B?text=Book" },
    { id: 11, name: "Beloved", author: "Toni Morrison", price: "$18.00", image: "https://placehold.co/200x300/F4F4F5/18181B?text=Book" },
    { id: 15, name: "Blood Meridian", author: "Cormac McCarthy", price: "$22.25", image: "https://placehold.co/200x300/F4F4F5/18181B?text=Book" },
    { id: 8, name: "The Assistant", author: "Bernard Malamud", price: "$16.50", image: "https://placehold.co/200x300/F4F4F5/18181B?text=Book" }
];

const HomePage = () => {

    const [nonFiction, setNonFiction] = useState([]);
    const [fiction, setFiction] = useState([]);
    // const [movies, setMovies] = useState([]); 
    // const [games, setGames] = useState([]);
    const [genres, setGenres] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
      const fetchAllProducts = async () => {
         
          const url = "http://localhost:3001/api/inft3050";
          const productsUrl = `${url}/Product?limit=10000`; // added limit
          const genreUrl = `${url}/Genre?limit=10000`;
          const stocktakeUrl = `${url}/Stocktake?limit=10000`;
        
        
        try {
          
          const [allProductsResponse, stocktakeResponse, genreResponse] = await Promise.all([
              axios.get(productsUrl, { withCredentials: true }),
              axios.get(stocktakeUrl, { withCredentials: true }),
              axios.get(genreUrl, { withCredentials: true })
          ]);
         
            const allProductsList = allProductsResponse.data.list;
            const stocktakeList = stocktakeResponse.data.list;
            const genresList = genreResponse.data.list;

            // Filter for Fiction books SubGenreID 1, 2, 3
            const fictionBooks = allProductsList.filter(p => p.SubGenre === 1 || p.SubGenre === 2 || p.SubGenre === 3);

            // Filter for Non-Fiction books subgenreID > 3 to have enough data
            const nonFictionBooks = allProductsList.filter(p => p.SubGenre > 3);

            // Create a price lookup map for quick access
            const priceMap = {};
            stocktakeList.forEach(item => {
            if(item.SourceId === 1) //only consider items from SourceId 1 
              priceMap[item.ProductId] = item.Price;
            });

            // Add price to each book
            fictionBooks.forEach(book => {
              book.price = priceMap[book.ID] ? `$${priceMap[book.ID].toFixed(2)}` : 'Price N/A';
            });
            nonFictionBooks.forEach(book => {
              book.price = priceMap[book.ID] ? `$${priceMap[book.ID].toFixed(2)}` : 'Price N/A';
            });
            
            // restructured the genre data and add prices from the lookup map
            const restructuredGenres = genresList.map(genre => ({
              id: genre.GenreID,
              name: genre.Name,
              products: genre['Product List'].map(product => {
                const price = priceMap[product.ID] ? `$${priceMap[product.ID].toFixed(2)}` : 'Price N/A';
                return {
                  id: product.ID,
                  name: product.Name,
                  // image placeholder
                  image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Product',
                  price: price
                };
              })
            }));

            // updates state of components 
            setGenres(restructuredGenres);
            setFiction(fictionBooks);
            setNonFiction(nonFictionBooks);
            setLoading(false);
            } catch (err) {
            console.error("Error fetching product data:", err);
            setError("Failed to load product data.");
            setLoading(false);
        }
    };
    
    fetchAllProducts();
}, []);

    const handleCardClick = (productId) => {
      window.location.href = `/products?id=${productId}`;
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
          {bestSellersList.slice(0, 7).map((product) => (
            <ProductCard
              key={product.id}
              imageSrc={product.image}
              productName={product.name}
              price={product.price}
              onClick={() => handleCardClick(product.id)}
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
          {newReleasesList.slice(0, 7).map((product) => (
            <ProductCard
              key={product.id}
              imageSrc={product.image}
              productName={product.name}
              price={product.price}
              onClick={() => handleCardClick(product.id)}
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
          {loading ? (
            <p>Loading Non-Fiction books...</p>
        ) : error ? (
            <p>{error}</p>
        ) : nonFiction.length > 0 ? (
            nonFiction.slice(0, 7).map(product => (
                <ProductCard
                    key={product.ID}
                    imageSrc={"https://placehold.co/200x300/F4F4F5/18181B?text=Book"}
                    productName={product.Name}
                    price={product.price} // assuming price is available
                    onClick={() => handleCardClick(product.ID)}
                />
            ))
        ) : (
            <p>No Non-Fiction books found.</p>
        )}
        </main>
      </div>
            
      <div className="content-section">
        <header className="section-header">
          <a href="/fiction" className="block">
            <h1 className="section-heading">Fiction</h1>
          </a>
        </header>
        <main className="horizontal-scroll-container">
          {loading ? (
            <p>Loading Fiction books...</p>
        ) : error ? (
            <p>{error}</p>
        ) : fiction.length > 0 ? (
            fiction.slice(0, 7).map(product => (
                <ProductCard
                    key={product.ID}
                    imageSrc={"https://placehold.co/200x300/F4F4F5/18181B?text=Book"}
                    productName={product.Name}
                    price={product.price} // assuming price is available
                    onClick={() => handleCardClick(product.ID)}
                />
            ))
        ) : (
            <p>No Fiction books found.</p>
        )}
        </main>
      </div>

      <div className="content-section">
        {loading ? (
        <p>Loading genres...</p>
      ) : genres.length > 0 ? (
        genres.map(genre => (
          <div key={genre.id} className="content-section">
            <header className="section-header">
              <h2 className="section-heading">{genre.name}</h2>
            </header>
            <main className="horizontal-scroll-container">
              {genre.products.slice(0, 7).map(product => (
                <ProductCard
                  key={product.id}
                  imageSrc={product.image}
                  productName={product.name}
                  price={product.price}
                  onClick={() => handleCardClick(product.id)}
                />
              ))}
            </main>
          </div>
        ))
      ) : (
        <p>No genres found. Please check the database.</p>
      )}
      </div>
      
      
            
      <div className="content-section">
        <header className="section-header">
          <a href="/recentlyViewed" className="block">
            <h1 className="section-heading">Recently Viewed Items</h1>
          </a>
        </header>
        <main className="horizontal-scroll-container">
          {loading ? (
            <p>Loading Fiction books...</p>
        ) : error ? (
            <p>{error}</p>
        ) : fiction.length > 0 ? (
            fiction.slice(0, 7).map(product => (
                <ProductCard
                    key={product.ID}
                    imageSrc={"https://placehold.co/200x300/F4F4F5/18181B?text=Book"}
                    productName={product.Name}
                    price={product.price} // assuming price is available
                    onClick={() => handleCardClick(product.ID)}
                />
            ))
        ) : (
            <p>No Fiction books found.</p>
        )}
        </main>
      </div>
    </>
  );
};

export default HomePage;