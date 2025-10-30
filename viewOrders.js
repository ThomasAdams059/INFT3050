import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ORDERS_URL = "http://localhost:3001/api/inft3050/Orders";
const PATRONS_URL = "http://localhost:3001/api/inft3050/Patrons";
const STOCKTAKE_URL = "http://localhost:3001/api/inft3050/Stocktake";
const PRODUCT_URL = "http://localhost:3001/api/inft3050/Product";

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
              const stocktakeResponse = await axios.get(
                `${STOCKTAKE_URL}/${item.ItemId}`,
                { withCredentials: true }
              );
              const stockItem = stocktakeResponse.data;

              const productResponse = await axios.get(
                `${PRODUCT_URL}/${stockItem.ProductId}`,
                { withCredentials: true }
              );
              const productDetails = productResponse.data;

              return {
                id: item.ItemId,
                name: productDetails.Name,
                price: stockItem.Price,
                quantity: 1, 
              };
            } catch (detailError) {
              console.error(`Error fetching details for item ${item.ItemId}:`, detailError);
              return null;
            }
          })
        );
        setItems(detailedItems.filter(item => item !== null));
      } catch (err) {
        console.error(`Error fetching item details:`, err);
        setError("Failed to load item details for this order.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [stockItems]);

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


const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [patronNameMap, setPatronNameMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrdersAndNames = async () => {
      setLoading(true);
      setError(null);
      try {
        const ordersResponse = await axios.get(ORDERS_URL, { withCredentials: true });
        const fetchedOrders = ordersResponse.data.list || [];

        const patronIds = new Set();
        fetchedOrders.forEach(order => {
          if (order.TO && order.TO.PatronId) {
            patronIds.add(order.TO.PatronId);
          }
        });

        const nameMap = {};
        if (patronIds.size > 0) {
          const patronPromises = Array.from(patronIds).map(id =>
            axios.get(`${PATRONS_URL}/${id}`, { withCredentials: true })
          );
          const patronResponses = await Promise.all(patronPromises);
          
          patronResponses.forEach(response => {
            const patronData = response.data;
            if (patronData && patronData.UserID) {
              nameMap[patronData.UserID] = patronData.Name;
            }
          });
        }
        
        setPatronNameMap(nameMap);

        fetchedOrders.sort((a, b) => new Date(b.OrderDate) - new Date(a.OrderDate));
        setOrders(fetchedOrders);

      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load order data. Ensure you are logged in with appropriate permissions.");
        if (err.response?.status === 401 || err.response?.status === 403) {
            setError("Unauthorized: You do not have permission to view these orders.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndNames();
  }, []);

  const handleViewDetailsClick = (orderId) => {
    if (selectedOrderId === orderId) {
      setSelectedOrderId(null);
    } else {
      setSelectedOrderId(orderId);
    }
  };

  return (
    <div className="main-container">
      <h1 className="main-heading custom-header-color">View All Orders</h1>

      {loading && <p>Loading orders...</p>}
      {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <section className="management-section">
          <h2>All Orders ({orders.length})</h2>
          <div className="scrollable-list-container" style={{ maxHeight: '70vh', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
            {orders.length > 0 ? (
              orders.map(order => (
                <div key={order.OrderID} className="list-item-row" style={{ borderBottom: '1px solid #eee', padding: '10px', marginBottom: '10px', background: '#fff' }}>
                  <p><strong>Order ID:</strong> {order.OrderID}</p>
                  
                  <p>
                    <strong>Customer:</strong> {
                      (order.TO && patronNameMap[order.TO.PatronId]) 
                      ? patronNameMap[order.TO.PatronId] 
                      : `Customer ID ${order.Customer}`
                    }
                  </p>
                  <p>
                    <strong>Shipping Address:</strong> {
                      order.StreetAddress
                      ? `${order.StreetAddress}, ${order.Suburb}, ${order.State} ${order.PostCode}`
                      : 'N/A'
                    }
                  </p>
                  
                  <p><strong>Order Date:</strong> {new Date(order.OrderDate).toLocaleString()}</p>
                  
                  <button onClick={() => handleViewDetailsClick(order.OrderID)} style={{ marginTop: '5px' }}>
                    {selectedOrderId === order.OrderID ? 'Hide Items' : 'View Items'}
                  </button>

                  {selectedOrderId === order.OrderID && (
                    <OrderDetails stockItems={order['Stocktake List']} />
                  )}
                </div>
              ))
            ) : (
              <p>No orders found in the database.</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default ViewOrders;