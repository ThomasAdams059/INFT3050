import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './productCard';

// --- UPDATED to accept cartItems, onOrderSuccess, and currentUser ---
const CartPage = ({ isLoggedIn, isAdmin, isPatron, patronInfo, cartItems, onOrderSuccess, currentUser }) => {
  // State for recommended items
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [recsError, setRecsError] = useState(null);
  
  // --- NEW: State for order submission ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);


  // useEffect for fetching recommendations (Unchanged)
  useEffect(() => {
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
          if (item.SourceId === 1 && item.Price) { // Assuming SourceId 1 for a default price
            priceMap[item.ProductId] = item.Price;
          }
        });

        const allPricedProducts = allProducts.map(product => ({
          id: product.ID,
          name: product.Name,
          price: priceMap[product.ID] ? `$${priceMap[product.ID].toFixed(2)}` : 'N/A',
          author: product.Author,
          description: product.Description,
          image: "https://placehold.co/200x300/F4F4F5/18181B?text=Book"
        }));
        
        // Simple recommendation: filter out items already in cart and take first 5
        const itemsInCartIds = new Set(cartItems.map(item => item.id));
        const filteredRecs = allPricedProducts
          .filter(product => !itemsInCartIds.has(product.id))
          .slice(0, 5);

        setRecommendedItems(filteredRecs);

      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setRecsError("Failed to load recommendations.");
      } finally {
        setLoadingRecs(false);
      }
    };

    fetchRecommendations();
    // Re-fetch recs if cart items change
  }, [cartItems]);


  // --- NEW: handlePlaceOrder function added back ---
  const handlePlaceOrder = async () => {
    // Double-check all conditions
    if (!isLoggedIn || !isPatron || !patronInfo || !patronInfo.customerId) {
      setOrderError("You must be logged in as a customer to place an order.");
      return;
    }
    if (!cartItems || cartItems.length === 0) {
      setOrderError("Your cart is empty.");
      return;
    }
    if (isSubmitting) return; // Prevent double-clicks

    setIsSubmitting(true);
    setOrderError(null);
    setOrderSuccess(null);

    // --- NEW: Dynamic Address Logic ---
    let shippingAddress = {
      StreetAddress: "123 Placeholder St",
      Suburb: "Placeholder",
      PostCode: "2000",
      State: "NSW"
    };

    // Check if the logged-in user object has address details
    // (This will be true for Admins/Employees, but not Patrons)
    if (currentUser && currentUser.StreetAddress) {
      shippingAddress = {
        StreetAddress: currentUser.StreetAddress,
        Suburb: currentUser.Suburb,
        PostCode: currentUser.PostCode,
        State: currentUser.State
      };
    } else if (isPatron) {
      // This is a Patron, and their address *should* come from an Address Book.
      // Since that's not implemented, we'll use a placeholder and alert the user.
      // TODO: This should be replaced with a fetch to the /Address endpoint.
      alert("Note: Using a placeholder address. Please update your Address Book.");
    }
    // --- END: Dynamic Address Logic ---

    // Build the "Stocktake List" for the API
    // It needs to be an array of objects, where each object is just { ItemId: ... }
    const stocktakeListForApi = [];
    cartItems.forEach(item => {
      // Add one entry for each *quantity* of the item
      for (let i = 0; i < item.quantity; i++) {
        stocktakeListForApi.push({ ItemId: item.stockItemId });
      }
    });

    const orderBody = {
      Customer: patronInfo.customerId,
      // --- UPDATED: Use the dynamic address object ---
      StreetAddress: shippingAddress.StreetAddress,
      Suburb: shippingAddress.Suburb,
      PostCode: shippingAddress.PostCode,
      State: shippingAddress.State,
      // --- END UPDATED ---
      "Stocktake List": stocktakeListForApi
    };

    try {
      const response = await axios.post(
        `http://localhost:3001/api/inft3050/Orders`,
        orderBody,
        { withCredentials: true }
      );

      setOrderSuccess(`Order ${response.data.OrderID} created successfully!`);
      
      // Call the function from App.js to clear the cart
      if (onOrderSuccess) {
        onOrderSuccess();
      }

      // Redirect to order history after a short delay
      setTimeout(() => {
        window.location.href = '/orderHistory';
      }, 2000);

    } catch (error) {
      console.error("Error creating order:", error.response || error);
      setOrderError(`Failed to create order. ${error.response?.data?.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  // --- END function ---

  // Handle click on recommended item
  const handleCardClick = (productId) => {
    window.location.href = `/products?id=${productId}`;
  };

  // Calculate total price
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // --- UPDATED: Block non-patrons ---
  if (!isLoggedIn) {
    return (
      <div className="main-container">
        <h1 className="main-heading custom-header-color">Cart</h1>
        <p>You must be logged in to view your cart.</p>
        <button onClick={() => window.location.href='/login'} className="admin-manage-button" style={{width: 'auto'}}>Log In</button>
      </div>
    );
  }
  
  // Block Admins and Employees
  if (isAdmin || !isPatron) {
    return (
      <div className="main-container">
        <h1 className="main-heading custom-header-color">Cart</h1>
        <p>Admin and Employee accounts do not have a shopping cart.</p>
      </div>
    );
  }
  // --- END UPDATED BLOCK ---

  return (
    <div className="main-container">
      <h1 className="main-heading custom-header-color">Your Cart</h1>
      
      {/* --- UPDATED: Added flex styles for side-by-side layout --- */}
      <div 
        className="cart-layout-container"
        style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}
      >
        {/* --- UPDATED: Set width for cart items box (left side) --- */}
        <div 
          className="cart-items-box"
          style={{ flex: '2', minWidth: '300px' }}
        >
          <h2>Order Summary</h2>
          
          <div className="cart-items-container">
            {/* Check if cartItems exists and has items */}
            {cartItems && cartItems.length > 0 ? (
              <>
                {cartItems.map(item => (
                  <div key={item.stockItemId} className="cart-item-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '15px 0' }}>
                    <div>
                      <h4 style={{ margin: 0 }}>{item.name}</h4>
                      <p style={{ margin: '5px 0' }}>Type: {item.sourceName}</p>
                      <p style={{ margin: '5px 0' }}>Unit Price: ${item.price.toFixed(2)}</p>
                      {/* TODO: Add buttons to change quantity */}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p>Quantity: {item.quantity}</p>
                      <p><strong>Subtotal: ${(item.price * item.quantity).toFixed(2)}</strong></p>
                      {/* TODO: Add a "Remove" button */}
                    </div>
                  </div>
                ))}
                
                {/* Cart Total */}
                <div className="cart-total" style={{ marginTop: '20px', textAlign: 'right', fontSize: '1.5em' }}>
                  <strong>
                    Total: ${cartTotal.toFixed(2)}
                  </strong>
                </div>
              </>
            ) : (
              // If cart is empty, show this
              <p>Your cart is currently empty.</p>
            )}
          </div>
          
          {/* --- NEW: Order Status Messages --- */}
          {orderError && <p className="error-message" style={{ color: 'red' }}>{orderError}</p>}
          {orderSuccess && <p className="success-message" style={{ color: 'green' }}>{orderSuccess}</p>}

          <button
            // --- UPDATED: Button class for styling ---
            className="cart-checkout-button"
            style={{
              backgroundColor: 'green',
              color: 'white',
              opacity: (!patronInfo || !patronInfo.customerId || !cartItems || cartItems.length === 0 || isSubmitting || orderSuccess) ? 0.5 : 1
            }}
            onClick={handlePlaceOrder}
            disabled={
              !patronInfo || !patronInfo.customerId || 
              !cartItems || cartItems.length === 0 || 
              isSubmitting || orderSuccess // Disable if submitting or already successful
            }
          >
            {/* --- UPDATED: Button text changed --- */}
            {isSubmitting ? 'Confirming...' : 'Confirm Order'}
          </button>
        </div>

        {/* --- UPDATED: Set width for recommended box (right side) --- */}
        <div 
          className="recommended-box"
          style={{ flex: '1', minWidth: '300px' }}
        >
          <h1 className="recommended-heading">Recommended For You</h1>
          {loadingRecs && <p>Loading recommendations...</p>}
          {recsError && <p className="error-message">{recsError}</p>}
          {!loadingRecs && !recsError && (
            <div className="recommended-items-container-updated"> 
              {recommendedItems.length > 0 ? (
                recommendedItems.map(product => (
                  <ProductCard
                    key={product.id}
                    imageSrc={product.image}
                    productName={product.name}
                    price={product.price}
                    author={product.author}
                    description={product.description}
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

