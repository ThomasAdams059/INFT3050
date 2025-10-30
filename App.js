import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "./navBar"
import HomePage from "./homepage"
import Genre from "./genre"
import NewReleases from "./newReleases"
import BestSellers from "./bestSellers"
import Author from "./author"
import ProductPage from "./products"
import Footer from "./footer"
import Login from "./login"
import CreateAccount from "./createAccount"
import RecoverAccount from "./recoverAccount"
import CartPage from "./Cart";
import AdminAccount from "./adminAccount";
import AccountSettings from "./accountSettings";
import UserManagement from "./userManagement";
import ItemManagement from "./itemManagement";
import PatronManagement from './patronManagement';
import MyAccount from "./myAccount";
import OrderHistory from "./orderHistory";
import './styles.css';
import AddressBook from './addressBook';
import PaymentMethods from './paymentMethod';
import EmployeePage from './employeePage';
import ViewAccounts from './viewAccounts';
import ViewOrders from './viewOrders';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [userRole, setUserRole] = useState(null);
  const [patronInfo, setPatronInfo] = useState(null);
  const [activeOrderId, setActiveOrderId] = useState(null);
  //const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get("http://localhost:3001/me", { 
          withCredentials: true 
        });
        
        console.log("=== APP.JS LOGIN CHECK ===");
        console.log("Login check response:", response.data);
        
        if (response.data) {
          setIsLoggedIn(true);
          
          // Determine user role from /me response
          if (response.data.isAdmin === true) {
            setUserRole('admin');
            console.log("\User is ADMIN");
          } else if (response.data.isEmployee === true || response.data.role === 'employee') {
            setUserRole('employee');
            console.log(" User is EMPLOYEE");
          } else if (response.data.patronId || response.data.role === 'patron') {
            setUserRole('patron');
            setPatronInfo(response.data);
            console.log("User is PATRON");
            
            // Fetch active order for patron's cart
            if (response.data.patronId) {
              await fetchActiveOrder(response.data.patronId);
            }
          }
        }
      } catch (error) {
        console.log("Not logged in or session expired:", error.response?.status);
        setIsLoggedIn(false);
        setUserRole(null);
        setPatronInfo(null);
        setActiveOrderId(null);
      }
    };

    checkLoginStatus();
  }, []);

    const fetchActiveOrder = async (patronId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/inft3050/Orders?filter[PatronId]=${patronId}&filter[Status]=inProgress`,
        { withCredentials: true }
      );
      
      if (response.data.list && response.data.list.length > 0) {
        const activeOrder = response.data.list[0];
        setActiveOrderId(activeOrder.ID);
        console.log("Active order found:", activeOrder.ID);
      } else {
        console.log("No active order found for patron");
      }
    } catch (error) {
      console.error("Error fetching active order:", error);
    }
  };

  const handleAddToCart = (item) => {
    setCartItems(prevItems => [...prevItems, item]);
    alert(`${item.name} has been added to your cart!`);
    console.log("Current cart:", [...cartItems, item]);
  };

  const handleLogin = ( role= 'patron') => {
    setIsLoggedIn(true);
    setUserRole(role);

    console.log("=== HANDLELOGIN CALLED ===");
    console.log("Role:", role);

     // Redirect based on role
    if (role === 'admin') {
      window.location.href = '/adminAccount';
    } else if (role === 'employee') {
      window.location.href = '/employeePage';
    } else {
      window.location.href = '/accountSettings';
    }
  };

  const handleLogout = async () => {
    try {
      console.log("=== LOGOUT INITIATED ===");
      await axios.post("http://localhost:3001/logout", {}, { 
        withCredentials: true 
      });
      console.log("Logout successful");
      alert("Logout Successful.");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Clear all state
      setIsLoggedIn(false);
      setUserRole(null);
      setPatronInfo(null);
      setActiveOrderId(null);
      window.location.href = "/";
    }
  };

  

  const handleSearch = async (searchTerm) => {
    console.log("Search initiated for:", searchTerm);
    const normalizedSearchTerm = searchTerm.toLowerCase().replace(/\s/g, '');

    try {
      // Hardcoded backend data URL
      const response = await axios.get("http://localhost:3001/api/inft3050/Product", {
        headers: {
          'Accept': 'application/json'
        },
      });

      const products = response.data.list;

      if (!products || products.length === 0) {
        alert(`Search failed: No products found on the server.`);
        return;
      }

      const foundProduct = products.find(product => {
        if (!product.Name) return false;
        const normalizedProductName = product.Name.toLowerCase().replace(/\s/g, '');
        return normalizedProductName === normalizedSearchTerm;
      });

      if (foundProduct) {
        const productId = foundProduct.ID;
        const path = `/products?id=${productId}`;
        console.log("Product found, navigating to:", path);
        window.location.href = path;
      } else {
        alert(`Sorry, the product "${searchTerm}" was not found. Please try again.`);
      }

    } catch (error) {
      console.error("Error during product search:", error.response || error);
      alert(`Search failed: Unable to connect to product API or unauthorized. Check server status/login.`);
    }
  };

  let component;
  const path = window.location.pathname;

  if (path.startsWith("/products")) {
    component = <ProductPage onAddToCart={handleAddToCart} />;
  } else {
    switch (path) {
      case "/":
        component = <HomePage />;
        break;
      case "/genre":
        component = <Genre />;
        break;
      case "/newReleases":
        component = <NewReleases />;
        break;
      case "/bestSellers":
        component = <BestSellers />;
        break;
      case "/author":
        component = <Author />;
        break;
      case "/login":
        component = <Login onLogin={handleLogin} />;
        break;
      case "/createAccount":
        component = <CreateAccount onCreateAccount={handleLogin} />;
        break;
      case "/recoverAccount":
        component = <RecoverAccount />;
        break;
      case "/Cart":
        component = <CartPage cartItems={cartItems} />;
        break;
      case "/adminAccount":
        component = <AdminAccount />;
        break;
      case "/userManagement":
        component = <UserManagement />;
        break;
      case "/itemManagement":
        component = <ItemManagement />;
        break;
      case "/patronManagement":
        component = <PatronManagement />;
        break;
      case "/myAccount":
        component = <MyAccount />;
        break;
      case "/orderHistory":
        component = <OrderHistory />;
        break;
      case "/accountSettings":
        component = <AccountSettings />;
        break;
      case "/addressBook":
        component = <AddressBook />;
        break;
      case "/paymentMethod":
        component = <PaymentMethods />;
        break;
      default:
        component = <HomePage />;
        break;
      case "/employeePage":
        component = <EmployeePage />;
        break;
      case "/viewAccounts":
        component = <ViewAccounts />;
        break;
      case "/viewOrders":
        component = <ViewOrders />;
        break;
    }
  }
  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        onLogout={handleLogout}
        onSearch={handleSearch}
      />
      <div className="container">
        {component}
      </div>
      <Footer />
    </>
  );
}

export default App;
