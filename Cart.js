import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; 
import axios from 'axios';
import ProductCard from './productCard';

const CartPage = ({ cartItems, onRemoveItem, onClearCart }) => {
  
  // redux hook
  const { isLoggedIn, isAdmin, isPatron } = useSelector((state) => state.auth);

  
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [recsError, setRecsError] = useState(null);
  
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  
  useEffect(() => {
    // only runs if user is a patron
    if (!isPatron) return; 
    
    const fetchRecommendations = async () => {
      setLoadingRecs(true);
      setRecsError(null);
      try {
        const [productResponse, stocktakeResponse] = await Promise.all([
          axios.get("http://localhost:3001/api/inft3050/Product", { withCredentials: true }),
          axios.get("http://localhost:3001/api/inft3050/Stocktake", { withCredentials: true })
        ]);

        const allProducts = productResponse.data.list || [];
        const stocktakeItems = stocktakeResponse.data.list || [];

        const priceMap = {};
        stocktakeItems.forEach(item => {
          if (item.SourceId === 1 && item.Product) { // only recommend hard copy books
            priceMap[item.Product.ID] = item.Price;
          }
        });

        // filters and format products that have a price
        const pricedProducts = allProducts
          .filter(p => priceMap[p.ID] !== undefined)
          .map(p => ({
            id: p.ID,
            name: p.Name,
            price: `$${priceMap[p.ID].toFixed(2)}`,
            image: 'https://placehold.co/200x300/F4F4F5/18181B?text=Book'
          }));
        
        // gets random items for recommendations like 5 of them, not hardcoded anymore
        const randomRecs = pricedProducts.sort(() => 0.5 - Math.random()).slice(0, 5);
        setRecommendedItems(randomRecs);

      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setRecsError("Could not load recommendations.");
      } finally {
        setLoadingRecs(false);
      }
    };

    fetchRecommendations();
  }, [isPatron]); // depends on isPatron to ensure it runs when true

  // conditional return based on whether or not is a patron ---
  if (!isPatron) {
    return (
      <div className="main-container">
        <h1 className="main-heading custom-header-color">Access Denied</h1>
        <p style={{textAlign: 'center'}}>Only logged-in customers (Patrons) can access the shopping cart.</p>
      </div>
    );
  }
 
  const handleCardClick = (productId) => {
    window.location.href = `/products?id=${productId}`;
  };

  const handleCheckoutClick = () => {
    window.location.href = '/createOrder'; // goes to the create order page
  };

  // UI stuff
  return (
    <div className="main-container">
      <h1 className="main-heading custom-header-color">Your Cart</h1>
      <div className="cart-layout">

        {/* cart items shown on left */}
        <div className="cart-box" style={{ flex: '2 1 600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 className="cart-heading">Items ({cartItems.length})</h1>
            
            {/* new clear entire cart button */}
            {cartItems.length > 0 && (
              <button 
                className="btn-delete" 
                style={{ width: 'auto', padding: '8px 12px', marginTop: 0 }}
                onClick={onClearCart}
              >
                Clear Cart
              </button>
            )}
           
            
          </div>

          <div className="cart-items-container">
            {cartItems.length > 0 ? (
              cartItems.map(item => (
                <div key={item.stockItemId} className="cart-item">
                  <div className="cart-item-details">
                    <div className="cart-item-image-container">
                      <img src={item.image} alt={item.name} className="cart-item-image" />
                    </div>
                    <div>
                      <h3 className="cart-item-name">{item.name}</h3>
                      <p className="cart-item-price" style={{ fontSize: '0.9em' }}>
                        {item.sourceName} - ${item.price.toFixed(2)}
                      </p>
                      <p className="cart-item-price">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p className="cart-item-price" style={{ fontWeight: 'bold' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    
                    {/* remove item button here */}
                    <button 
                      onClick={() => onRemoveItem(item.stockItemId)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#d9534f', 
                        cursor: 'pointer', 
                        textDecoration: 'underline' 
                      }}
                    >
                      Remove
                    </button>
                    
                    
                  </div>
                </div>
              ))
            ) : (
              <p>Your cart is empty.</p>
            )}
          </div>

          <div className="cart-total-section">
            <span className="cart-total-text">Total:</span>
            <span className="cart-total-price-text">${cartTotal.toFixed(2)}</span>
          </div>

          {/* checkout button here */}
          <button
            className="cart-checkout-button"
            onClick={handleCheckoutClick} // Use navigation handler
            style={{ 
              marginTop: '20px', 
              backgroundColor: 'green', 
              color: 'white',
              cursor: (cartItems.length === 0) ? 'not-allowed' : 'pointer'
            }}
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout
          </button>
         

        </div>

        {/* recommended items now on right insteasd */}
        <div className="recommended-box" style={{ flex: '1 1 300px', minWidth: '250px' }}>
          <h1 className="recommended-heading">Recommended For You</h1>
          {loadingRecs && <p>Loading recommendations...</p>}
          {recsError && <p className="error-message">{recsError}</p>}
          {!loadingRecs && !recsError && (
            <div className="recommended-items-container-updated" style={{ maxHeight: '600px', overflowY: 'auto' }}> 
              {recommendedItems.length > 0 ? (
                recommendedItems.map(product => (
                  <ProductCard
                    key={product.id}
                    imageSrc={product.image}
                    productName={product.name}
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