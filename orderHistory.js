import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux'; // --- 1. IMPORT useSelector ---

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
    <div className="order-details-box" style={{ marginTop: '15px', padding: '15px', borderTop: '1px solid #ddd', background: '#f9f9f9', borderRadius: '4px' }}>
      <h4 style={{marginTop: 0, marginBottom: '10px'}}>Items in this Order:</h4>
      {items.length > 0 ? (
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          {items.map(item => (
            <li key={item.id} style={{marginBottom: '5px'}}>
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

// --- NEW: Date Formatting Function ---
const formatDate = (dateString) => {
    if (!dateString) return 'No Date Provided';
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
        return 'Invalid Date'; // This was the bug
    }
    // Format to a readable string
    return date.toLocaleString('en-AU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// --- Main OrderHistory Component ---
const OrderHistory = () => {
    
    // --- GET user FROM REDUX STORE ---
    const { user } = useSelector((state) => state.auth);

    // State for fetching and displaying orders
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null); // For success messages
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    // --- State for editing an order ---
    const [isEditing, setIsEditing] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [street, setStreet] = useState("");
    const [suburb, setSuburb] = useState("");
    const [postcode, setPostcode] = useState("");
    const [orderState, setOrderState] = useState("NSW");
    // ---

    // Fetch orders when the 'user' from Redux is available
    useEffect(() => {
        // --- CHECK REDUX user ---
        if (!user) {
            setLoading(false);
            setError("Please log in to view your order history.");
            return;
        }
        
        // --- NEW: Clear error if user is now loaded ---
        setError(null);

        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await axios.get(ORDERS_URL, { withCredentials: true });
                const allOrders = response.data.list || [];
                
                // --- FIX: Filter by order.TO.PatronId === user.UserID ---
                const userOrders = allOrders.filter(order => 
                    order.TO && order.TO.PatronId === user.UserID
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
    }, [user]); // --- SET DEPENDENCY to user from Redux ---


    // --- Sidebar and Navigation Logic ---
    const navigate = (path) => {
        window.location.href = path;
    };
    
    // --- REMOVED handleAddressBookClick ---

    const sidebarLinks = [
        { name: 'Account Dashboard', path: '/myAccount' },
        { name: 'Order History', path: '/orderHistory' },
        { name: 'Account Settings', path: '/accountSettings' },
    ];
    
    const handleViewDetailsClick = (orderId) => {
        if (selectedOrderId === orderId) {
            setSelectedOrderId(null); // Close if already open
        } else {
            setSelectedOrderId(orderId); // Open selected order
        }
    };

    // --- Handle opening the edit modal ---
    const handleEditClick = (order) => {
        setEditingOrder(order);
        setStreet(order.StreetAddress);
        setSuburb(order.Suburb);
        setPostcode(order.PostCode);
        setOrderState(order.State);
        setIsEditing(true);
        setError(null);
        setSuccess(null);
    };

    // --- Handle closing the edit modal ---
    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingOrder(null);
        setError(null);
        setSuccess(null);
    };

    // --- Handle submitting the address update ---
    const handleUpdateOrder = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        if (!editingOrder) return;

        const payload = {
            StreetAddress: street,
            Suburb: suburb,
            PostCode: postcode,
            State: orderState
        };

        try {
            await axios.patch(
                `${ORDERS_URL}/${editingOrder.OrderID}`,
                payload,
                { withCredentials: true }
            );

            // Update the order in the local state to reflect the change immediately
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.OrderID === editingOrder.OrderID ? { ...order, ...payload } : order
                )
            );
            
            setSuccess("Address updated successfully!");
            handleCancelEdit(); // Close the modal

        } catch (err) {
            console.error("Error updating order:", err.response || err);
            setError(err.response?.data?.message || "Failed to update order.");
        }
    };

    // --- STYLING for buttons ---
    const smallButtonStyle = {
        padding: '5px 12px',
        fontSize: '0.9em',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        color: 'white',
        background: '#495867', // Main theme color
    };

    const editButtonStyle = {
        ...smallButtonStyle,
        background: '#ffc107', // Yellow for "Edit"
        color: '#212529',
    };
    // --- END STYLING ---


    return (
        <div className="main-container">
            <h1 className="main-heading custom-header-color">Order History</h1>

            <div className="three-column-layout" style={{ gridTemplateColumns: '250px 1fr', gap: '30px' }}>
                {/* --- Sidebar (Updated) --- */}
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
                <div className="orderHistory-box" style={{ height: 'auto', minHeight: '400px', gridColumn: 'span 1' }}>
                    <h2 className="admin-box-heading">Your Orders</h2>
                    
                    {success && <p className="success-message" style={{color: 'green', textAlign: 'center'}}>{success}</p>}

                    <div className="cart-items-container">
                        {loading && <p>Loading orders...</p>}
                        {error && <p className="error-message" style={{color: 'red', textAlign: 'center'}}>{error}</p>}
                        
                        {!loading && !error && orders.length > 0 && (
                            orders.map(order => (
                                <div key={order.OrderID} className="list-item-row" style={{ borderBottom: '1px solid #eee', padding: '15px', marginBottom: '10px', background: '#fff', borderRadius: '5px' }}>
                                    
                                    {/* --- STYLING UPDATE --- */}
                                    <p style={{margin: '0 0 5px 0'}}><strong>Order ID:</strong> {order.OrderID}</p>
                                    <p style={{margin: '0 0 5px 0'}}>
                                        <strong>Order Date:</strong> {formatDate(order.OrderDate)}
                                    </p>
                                    <p style={{margin: '0 0 10px 0'}}>
                                        <strong>Shipped To:</strong> {
                                        order.StreetAddress
                                        ? `${order.StreetAddress}, ${order.Suburb}, ${order.State} ${order.PostCode}`
                                        : 'N/A'
                                        }
                                    </p>
                                    {/* --- END STYLING UPDATE --- */}

                                    
                                    {/* --- Button row (STYLED) --- */}
                                    <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                                        <button 
                                          style={smallButtonStyle}
                                          onClick={() => handleViewDetailsClick(order.OrderID)}
                                        >
                                            {selectedOrderId === order.OrderID ? 'Hide Items' : 'View Items'}
                                        </button>
                                        <button 
                                          style={editButtonStyle}
                                          onClick={() => handleEditClick(order)}
                                        >
                                            Edit Shipping Address
                                        </button>
                                    </div>

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

                {/* --- DELETED: Address Book Box --- */}
                
            </div>

            {/* --- Edit Order Modal (Unchanged) --- */}
            {isEditing && editingOrder && (
                <div className="modal-backdrop" style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.5)', display: 'flex',
                    justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div className="modal-content" style={{
                        background: 'white', padding: '20px', borderRadius: '8px',
                        width: '90%', maxWidth: '500px'
                    }}>
                        <form onSubmit={handleUpdateOrder}>
                            <h2 className="admin-box-heading">Edit Address for Order #{editingOrder.OrderID}</h2>
                            <div className="inputs">
                                <div className='input'>
                                    <label>Street Address*</label>
                                    <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} required />
                                </div>
                                <div className='input'>
                                    <label>Suburb*</label>
                                    <input type="text" value={suburb} onChange={(e) => setSuburb(e.target.value)} required />
                                </div>
                                <div className="input-row-2">
                                    <div className='input'>
                                        <label>Post Code*</label>
                                        <input type="text" value={postcode} onChange={(e) => setPostcode(e.target.value)} required />
                                    </div>
                                    <div className='input'>
                                        <label>State*</label>
                                        <select value={orderState} onChange={(e) => setOrderState(e.target.value)} required>
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
                            </div>
                            {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}
                            <div className="create-container" style={{marginTop: '20px'}}>
                                <button type="submit" className="submit">Save Changes</button>
                                <button type="button" className="submit gray" onClick={handleCancelEdit}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* --- END MODAL --- */}

        </div>
    );
};

export default OrderHistory;

