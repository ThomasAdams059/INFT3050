import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './productCard';

const API_BASE_URL = "http://localhost:3001";
const API_SUFFIX = "/api/inft3050";

const CartItem = ({ item, onRemove }) => {
  if (!item) return null;

  return (
    <div className="cart-item">
      <div className="cart-item-details">
        <div className="cart-item-image-container">
          <img
            src={item.image || 'https://placehold.co/100x150/F4F4F5/18181B?text=Item'}
            alt={item.name || 'Item'}
            className="cart-item-image"
            onError={(e) => { e.target.src = 'https://placehold.co/100x150/cccccc/ffffff?text=Error'; }}
          />
        </div>
        <div className="cart-item-info">
          <p className="cart-item-name">{item.name || 'Unknown Item'}</p>
          <p className="cart-item-price">{item.price ? `$${item.price.toFixed(2)}` : 'Price N/A'}</p>
          <p className="cart-item-quantity">Quantity: {item.quantity || 1}</p>
        </div>
      </div>
      <button onClick={() => onRemove(item.productsInOrdersId)} className="remove-item-button">
        Remove
      </button>
    </div>
  );
};


const CartPage = ({ isLoggedIn, isAdmin, patronInfo, activeOrderId }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true); // Renamed for clarity
  const [cartError, setCartError] = useState(null);    // Renamed for clarity
  const [cartTotal, setCartTotal] = useState(0);

  const [recommendedItems, setRecommendedItems] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [recsError, setRecsError] = useState(null);

  // Fetch cart items (useEffect remains largely the same)
  useEffect(() => {
    const fetchCartItems = async () => {
      // ... (previous fetchCartItems logic remains the same)
      if (!isLoggedIn || isAdmin || !activeOrderId) {
        setLoadingCart(false);
        return;
      }
      setLoadingCart(true);
      setCartError(null);
      try {
        const itemsResponse = await axios.get(`${API_BASE_URL}${API_SUFFIX}/ProductsInOrders?filter[OrderId]=${activeOrderId}`, { withCredentials: true });
        const orderItems = itemsResponse.data.list || [];
        if (orderItems.length === 0) {
           setCartItems([]); setCartTotal(0); setLoadingCart(false); return;
        }
        const detailedItems = await Promise.all(
          orderItems.map(async (orderItem) => {
            try {
              const stocktakeResponse = await axios.get(`${API_BASE_URL}${API_SUFFIX}/Stocktake/${orderItem.produktId}`, { withCredentials: true });
              const stockItem = stocktakeResponse.data;
              const productResponse = await axios.get(`${API_BASE_URL}${API_SUFFIX}/Product/${stockItem.ProductId}`, { withCredentials: true });
              const productDetails = productResponse.data;
              return {
                productsInOrdersId: orderItem.rowId, stockItemId: orderItem.produktId, productId: stockItem.ProductId,
                name: productDetails.Name, price: stockItem.Price, quantity: orderItem.Quantity,
                image: 'https://placehold.co/100x150/F4F4F5/18181B?text=Book' // Placeholder
              };
            } catch (detailError) { console.error(`Error fetching details for item ${orderItem.produktId}:`, detailError); return null; }
          })
        );
        const validItems = detailedItems.filter(item => item !== null);
        setCartItems(validItems);
        const total = validItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setCartTotal(total);
      } catch (err) {
        console.error("Error fetching cart items:", err);
        setCartError("Failed to load cart items. Please try refreshing.");
        setCartItems([]); setCartTotal(0);
      } finally { setLoadingCart(false); }
    };
    fetchCartItems();
  }, [activeOrderId, isLoggedIn, isAdmin]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoadingRecs(true);
      setRecsError(null);
      try {
        // Fetch all products and stocktake items
        const [productResponse, stocktakeResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}${API_SUFFIX}/Product`),
          axios.get(`${API_BASE_URL}${API_SUFFIX}/Stocktake`)
        ]);

        const allProducts = productResponse.data.list || [];
        const stocktakeItems = stocktakeResponse.data.list || [];

        // Create a price map
        const priceMap = {};
        stocktakeItems.forEach(item => {
          if (item.SourceId === 1 && item.Price) {
            priceMap[item.ProductId] = item.Price;
          }
        });

        // Combine product data with prices
        const allPricedProducts = allProducts.map(product => ({
          id: product.ID,
          name: product.Name,
          price: priceMap[product.ID] ? `$${priceMap[product.ID].toFixed(2)}` : 'Price N/A',
          image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book' // Placeholder
        })).filter(p => p.price !== 'Price N/A'); // Filter out items without price for recommendations

        // --- Select 5 Random Items ---
        const shuffled = allPricedProducts.sort(() => 0.5 - Math.random()); // Simple shuffle
        const selectedRecs = shuffled.slice(0, 5); // Get the first 5

        setRecommendedItems(selectedRecs);

      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setRecsError("Could not load recommendations.");
      } finally {
        setLoadingRecs(false);
      }
    };

    fetchRecommendations();
  }, []);


  const handleRemoveItem = async (productsInOrdersId) => {
      if (!productsInOrdersId) return;
      try {
          await axios.delete(`${API_BASE_URL}${API_SUFFIX}/ProductsInOrders/${productsInOrdersId}`, { withCredentials: true });
          const removedItem = cartItems.find(item => item.productsInOrdersId === productsInOrdersId); // Find before filtering
          setCartItems(prevItems => prevItems.filter(item => item.productsInOrdersId !== productsInOrdersId));
          setCartTotal(prevTotal => removedItem ? prevTotal - (removedItem.price * removedItem.quantity) : prevTotal);
          alert("Item removed from cart.");
      } catch (error) {
          console.error("Error removing item from cart:", error);
          alert(`Failed to remove item. ${error.response?.data?.message || 'Check console.'}`);
      }
  };

  // Handle clicking recommendation cards
  const handleCardClick = (productId) => {
    window.location.href = `/products?id=${productId}`;
  };


  if (!isLoggedIn) {
     return (
      <div className="main-container">
        <h1>Cart</h1>
        <p>Please log in to view your cart.</p>
        <button onClick={() => window.location.href = '/login'}>Log In</button>
      </div>
    );
  }
  if (isAdmin) {
      // ... (previous code)
       return (
          <div className="main-container">
              <h1>Cart</h1>
              <p>Admins do not have a shopping cart.</p>
          </div>
      );
  }

  return (
    <div className="main-container">
      <div className="cart-layout">
        <div className="cart-box">
          <h1 className="cart-heading">Cart</h1>
          {loadingCart && <p>Loading cart...</p>}
          {cartError && <p className="error-message">{cartError}</p>}

          {!loadingCart && !cartError && (
            <>
              <div className="cart-items-container">
                {cartItems.length > 0 ? (
                  cartItems.map(item => (
                    <CartItem key={item.productsInOrdersId} item={item} onRemove={handleRemoveItem} />
                  ))
                ) : (
                  <p>Your cart is empty.</p>
                )}
              </div>
              {cartItems.length > 0 && (
                <>
                  <div className="cart-total-section">
                    <span className="cart-total-text">Total: </span>
                    <span className="cart-total-price-text">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button className="cart-checkout-button">Proceed to Payment</button>
                </>
              )}
            </>
          )}
        </div>

        {/* --- 4. RE-ADD Recommended Items Section --- */}
        <div className="recommended-box">
          <h1 className="recommended-heading">Recommended For You</h1>
          {loadingRecs && <p>Loading recommendations...</p>}
          {recsError && <p className="error-message">{recsError}</p>}
          {!loadingRecs && !recsError && (
            <div className="recommended-items-container">
              {recommendedItems.length > 0 ? (
                recommendedItems.map(product => (
                  <ProductCard
                    key={product.id}
                    imageSrc={product.image}
                    productName={product.name} // Use correct prop
                    price={product.price}
                    onClick={() => handleCardClick(product.id)}
                  />
                ))
              ) : (
                <p>No recommendations available at this time.</p>
              )}
            </div>
          )}
        </div>

      </div> 
    </div>
  );
};

export default CartPage;