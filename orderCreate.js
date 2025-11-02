import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const API_BASE_URL = "http://localhost:3001/api/inft3050";

const OrderCreate = ({ cartItems, onOrderSuccess }) => {
  // gets user from redux
  const { user } = useSelector((state) => state.auth);

 
  const [street, setStreet] = useState("");
  const [suburb, setSuburb] = useState("");
  const [postcode, setPostcode] = useState("");
  const [state, setState] = useState("NSW");
  
  // -payment details state for TO table
  const [cardOwner, setCardOwner] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");


 
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // gets last order address



  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchLastOrderAddress = async () => {
      try {
        setLoading(true);
        // gets all orders
        const response = await axios.get(
          `${API_BASE_URL}/Orders`, 
          { withCredentials: true }
        );
        
        const allOrders = response.data.list || [];

       
        const patronOrders = allOrders.filter(order => 
          order.TO && order.TO.PatronId === user.UserID
        );
        
        // finds most recent
        patronOrders.sort((a, b) => new Date(b.OrderDate) - new Date(a.OrderDate));

        if (patronOrders.length > 0) {
          // pre fills most recent order
          const lastOrder = patronOrders[0];
          
          // use Order shipping address
          setStreet(lastOrder.StreetAddress || "");
          setSuburb(lastOrder.Suburb || "");
          setPostcode(lastOrder.PostCode || "");
          setState(lastOrder.State || "NSW"); 
          
          // use payment details from TO
          if (lastOrder.TO) {
            setCardOwner(lastOrder.TO.CardOwner || "");
            setCardNumber(lastOrder.TO.CardNumber || "");
            setCardExpiry(lastOrder.TO.Expiry || "");
            setCardCVV(lastOrder.TO.CVV || "");
          }
        }
      } catch (err) {
        console.error("Error fetching last order address:", err);
        setError("Could not load your saved address data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLastOrderAddress();
  }, [user]);


  // order place handler
  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    
    if (!street || !suburb || !postcode || !state || !cardOwner || !cardNumber || !cardExpiry || !cardCVV) {
      setError("Please fill in all shipping and payment fields.");
      return;
    }

    if (!user || !user.Email) {
       setError("User is not logged in properly. Please log in again.");
       return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // creates TO customer info table
      const toPayload = {
        PatronId: user.UserID, // link to patron table
        Email: user.Email,     
        StreetAddress: street,
        PostCode: postcode,
        Suburb: suburb,
        State: state,
        CardNumber: cardNumber,
        CardOwner: cardOwner,
        Expiry: cardExpiry,
        CVV: cardCVV
      };
      
      const toResponse = await axios.post(
        `${API_BASE_URL}/TO`, 
        toPayload,
        { withCredentials: true }
      );
      
      const newCustomerId = toResponse.data.customerID;
      
      // create order record
      const orderPayload = {
        Customer: newCustomerId, 
        StreetAddress: street,
        Suburb: suburb,
        PostCode: postcode,
        State: state
      };
      
      const orderResponse = await axios.post(
        `${API_BASE_URL}/Orders`, 
        orderPayload,
        { withCredentials: true }
      );

      const newOrderId = orderResponse.data.OrderID;

      // creates ProductsInOrder for each cart item
      const productsInOrdersPayloads = cartItems.map(item => ({
        OrderId: newOrderId,
        ProduktId: item.stockItemId, // itemID from stocktake table
        Quantity: item.quantity
      }));

      // executes all item posts in parallel
      await Promise.all(
        productsInOrdersPayloads.map(payload => 
          axios.post(
            `${API_BASE_URL}/ProductsInOrders`, 
            payload,
            { withCredentials: true }
          )
        )
      );

      // --- Success ---
      if (onOrderSuccess) {
        onOrderSuccess(); // clears the cart
      }

      alert(`Order ${newOrderId} successfully created! You will now be redirected to Order History.`);
      window.location.href = '/orderHistory';


      // error logs remove later
    } catch (err) {
      console.error("Error creating order:", err.response || err);
      let errorMsg = 'Failed to place order.';
      if (err.code === "ERR_NETWORK") {
         errorMsg = 'Network Error. Is the backend server running?';
      } else if (err.response?.status === 401) {
         errorMsg = 'Unauthorized. Your login session is not valid for placing orders. Please contact support.';
      } else if (err.response?.status === 404) {
         errorMsg = 'Error: An order API endpoint was not found (404).';
      } else {
         errorMsg = err.response?.data?.message || 'An unknown error occurred.';
      }
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  if (loading) {
    return <div className="main-container"><p>Loading checkout...</p></div>;
  }
  
  if (!user) {
     return <div className="main-container"><p>You must be logged in as a Customer to check out.</p></div>;
  }

  return (
    <div className="main-container">
      <h1 className="main-heading custom-header-color">Confirm Your Order</h1>
      <div className="management-grid">
        {/* shipping form */}
        <div className="management-section">
          <h2 className="admin-box-heading">Shipping & Payment</h2>
          <form onSubmit={handlePlaceOrder} id="shipping-form">
            <h3 style={{ fontSize: '1.1em', marginBottom: '10px' }}>Shipping Address</h3>
            <div className="form-group">
              <label>Street Address*</label>
              <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Suburb*</label>
              <input type="text" value={suburb} onChange={(e) => setSuburb(e.target.value)} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Post Code*</label>
                <input type="text" value={postcode} onChange={(e) => setPostcode(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>State*</label>
                <select value={state} onChange={(e) => setState(e.target.value)} required>
                  <option value="NSW">NSW</option>
                  <option value="VIC">VIC</option>
                  <option value="QLD">QLD</option>
                  <option value="SA">SA</option>
                  <option value="WA">WA</option>
                  <option value="TAS">TAS</option>
                  <option value="NT">NT</option>
                  <option value="ACT">ACT</option>
                </select>
              </div>
            </div>

            <hr style={{ margin: '20px 0' }} />

            {/* payment form here */}
            <h3 style={{ fontSize: '1.1em', marginBottom: '10px' }}>Payment Details</h3>
             <div className="form-group">
              <label>Name on Card*</label>
              <input type="text" value={cardOwner} onChange={(e) => setCardOwner(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Card Number*</label>
              <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expiry (MM/YY)*</label>
                <input type="text" placeholder="MM/YY" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>CVV*</label>
                <input type="text" value={cardCVV} onChange={(e) => setCardCVV(e.target.value)} required />
              </div>
            </div>

          
            
          </form>
        </div>

        {/* order summary */}
        <div className="management-section">
          <h2 className="admin-box-heading">Order Summary</h2>
          <div className="cart-items-container" style={{ padding: '10px 0' }}>
            {cartItems.length > 0 ? (
              cartItems.map(item => (
                <div key={item.stockItemId} className="cart-item-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0' }}>
                  <div>
                    <h4 style={{ margin: 0 }}>{item.name}</h4>
                    <p style={{ margin: '3px 0', fontSize: '0.9em' }}>Qty: {item.quantity}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0 }}><strong>${(item.price * item.quantity).toFixed(2)}</strong></p>
                  </div>
                </div>
              ))
            ) : (
              <p>Your cart is empty.</p>
            )}
            
            <div className="cart-total" style={{ marginTop: '20px', textAlign: 'right', fontSize: '1.5em', borderTop: '2px solid #ccc', paddingTop: '10px' }}>
              <strong>Total: ${cartTotal.toFixed(2)}</strong>
            </div>
          </div>
          
          {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
          
          <button
            type="submit" 
            form="shipping-form"
            className="cart-checkout-button"
            onClick={handlePlaceOrder}
            style={{ 
              marginTop: '20px', 
              backgroundColor: 'green', 
              cursor: (cartItems.length === 0 || isSubmitting) ? 'not-allowed' : 'pointer'
            }}
            disabled={cartItems.length === 0 || isSubmitting}
          >
            {isSubmitting ? 'Placing Order...' : 'Place Order Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCreate;