import React, { useState, useEffect } from 'react';
import axios from 'axios';

// API URLs
const ORDERS_URL = "http://localhost:3001/api/inft3050/Orders";
const STOCKTAKE_URL = "http://localhost:3001/api/inft3050/Stocktake";
const PRODUCT_URL = "http://localhost:3001/api/inft3050/Product";

// --- Sub-Component (OrderDetails) ---
// This component fetches the details for the items in a specific order
const OrderDetails = ({ stockItems }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!stockItems || stockItems.length === 0) {
      setLoading(false);
      setItems([]);
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const detailedItems = await Promise.all(
          stockItems.map(async (item) => {
            try {
              if (item.ItemId === undefined) {
                 console.warn("Item in Stocktake List is missing ItemId:", item);
                 return null;
              }
              // 1. Get Stocktake item to find ProductId and Price
              const stocktakeResponse = await axios.get(
                `${STOCKTAKE_URL}/${item.ItemId}`,
                { withCredentials: true }
              );
              const stockItem = stocktakeResponse.data;

              // 2. Get Product item to find Name
              const productResponse = await axios.get(
                `${PRODUCT_URL}/${stockItem.ProductId}`,
                { withCredentials: true }
              );
              const productDetails = productResponse.data;

              return {
                id: item.ItemId,
                name: productDetails.Name,
                price: stockItem.Price,
                quantity: 1, // Each item in the list represents quantity 1
              };
            } catch (detailError) {
              console.error(`Error fetching details for item ${item.ItemId}:`, detailError);
              return null;
            }
          })
        );
        // Group identical items
        const groupedItems = {};
        detailedItems.filter(item => item !== null).forEach(item => {
            if (groupedItems[item.id]) {
                groupedItems[item.id].quantity += 1;
            } else {
                groupedItems[item.id] = { ...item };
            }
        });
        setItems(Object.values(groupedItems));
        
      } catch (err) {
        console.error(`Error fetching item details:`, err);
        setError("Failed to load item details for this order.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [stockItems]); // Re-run if stockItems prop changes

  if (loading) return <p style={{ paddingLeft: '20px' }}>Loading order items...</p>;
  if (error) return <p className="error-message" style={{ color: 'red', paddingLeft: '20px' }}>{error}</p>;

  return (
    <div className="order-details-box" style={{ marginTop: '10px', padding: '10px 10px 10px 25px', borderTop: '1px solid #ddd', background: '#f9f9f9' }}>
      <h4>Items in this Order:</h4>
      {items.length > 0 ? (
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          {items.map(item => (
            <li key={item.id}>
              {item.quantity}x {item.name} (@ ${item.price ? item.price.toFixed(2) : 'N/A'} each)
            </li>
          ))}
        </ul>
      ) : (
        <p>No item details could be loaded for this order.</p>
      )}
    </div>
  );
};


// --- Main OrderHistory Component ---
const OrderHistory = ({ currentUser }) => {
    
    // State for fetching and displaying orders
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    // Fetch orders when the currentUser prop is available
    useEffect(() => {
        // Don't fetch if user isn't loaded or isn't a patron
        if (!currentUser) {
            setLoading(false);
            setError("Please log in to view your order history.");
            return;
        }

        const fetchOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(ORDERS_URL, { withCredentials: true });
                const allOrders = response.data.list || [];
                
                // Filter orders to find only those belonging to the current user
                const userOrders = allOrders.filter(order => 
                    order.Customer === currentUser.UserID
                );
                
                // Sort by date, newest first
                userOrders.sort((a, b) => new Date(b.OrderDate) - new Date(a.OrderDate));
                
                setOrders(userOrders);

            } catch (err) {
                console.error("Error fetching order history:", err);
                setError("Failed to load order history.");
                if (err.response?.status === 401 || err.response?.status === 403) {
                    setError("You are not authorized to view this page.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [currentUser]); // Re-run effect if currentUser changes


    // --- Sidebar and Navigation Logic (Unchanged) ---
    const navigate = (path) => {
        window.location.href = path;
    };
    
    const handleAddressBookClick = () => {
        window.location.href = '/addressBook'; 
    };

    const sidebarLinks = [
        { name: 'Account Dashboard', path: '/myAccount' },
        { name: 'Order History', path: '/orderHistory' },
        { name: 'Account Settings', path: '/accountSettings' },
        { name: 'Address Book', path: '/addressBook' },
        { name: 'Payment Methods', path: '/paymentMethod' },
    ];
    // --- End Sidebar Logic ---

    // Toggle for viewing order details
    const handleViewDetailsClick = (orderId) => {
        if (selectedOrderId === orderId) {
            setSelectedOrderId(null); // Close if already open
        } else {
            setSelectedOrderId(orderId); // Open selected order
        }
    };


    return (
        <div className="main-container">
            <h1 className="main-heading custom-header-color">Order History</h1>

            <div className="three-column-layout">
                {/* --- Sidebar --- */}
                <div className="account-sidebar">
                    <h2 className="admin-box-heading">My Account</h2>
                    <ul className="sidebar-nav-list">
                        {sidebarLinks.map((link) => (
                            <li
                                key={link.name}
                                className={window.location.pathname === link.path ? 'active' : ''}
                                onClick={() => navigate(link.path)}
                            >
                                <a href={link.path} className="block" onClick={(e) => e.preventDefault()}>
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div> 

                {/* --- Main Order History Box --- */}
                <div className="orderHistory-box">
                    <h2 className="admin-box-heading">Your Orders</h2>
                    
                    <div className="cart-items-container">
                        {loading && <p>Loading orders...</p>}
                        {error && <p className="error-message">{error}</p>}
                        
                        {!loading && !error && orders.length > 0 && (
                            orders.map(order => (
                                <div key={order.OrderID} className="list-item-row" style={{ borderBottom: '1px solid #eee', padding: '10px', marginBottom: '10px', background: '#fff' }}>
                                    <p><strong>Order ID:</strong> {order.OrderID}</p>
                                    <p><strong>Order Date:</strong> {new Date(order.OrderDate).toLocaleString()}</p>
                                    <p>
                                        <strong>Shipped To:</strong> {
                                        order.StreetAddress
                                        ? `${order.StreetAddress}, ${order.Suburb}, ${order.State} ${order.PostCode}`
                                        : 'N/A'
                                        }
                                    </p>
                                    
                                    <button onClick={() => handleViewDetailsClick(order.OrderID)} style={{ marginTop: '5px' }}>
                                        {selectedOrderId === order.OrderID ? 'Hide Items' : 'View Items'}
                                    </button>

                                    {selectedOrderId === order.OrderID && (
                                        <OrderDetails stockItems={order['Stocktake List']} />
                                    )}
                                </div>
                            ))
                        )}
                        
                        {!loading && !error && orders.length === 0 && (
                            <p>You have not placed any orders yet.</p>
                        )}
                    </div>
                </div> 

                {/* --- Address Book Box (Placeholder) --- */}
                <div className="threeColumns-account-container">
                    <div className='admin-box-heading'>Address Book</div>
                    <div className='underline'></div>
                    
                    <ul className="account-box-list">
                        <li>Shipping Address: 123 street, suburb</li>
                        <li>Secondary Shipping Address: 123 street, suburb</li>
                        <li>Billing Address: 123 street, suburb</li>
                    </ul>

                    <button className="threeColumns-account-container-button" onClick={handleAddressBookClick}>
                        Add New Address
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;
