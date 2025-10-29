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

const API_BASE_URL = "http://localhost:3001/api/inft3050";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get("http://localhost:3001/me", { withCredentials: true });
        setIsLoggedIn(true);
        if (response.data && response.data.isAdmin === true) {
          setIsAdmin(true);
        }
      } catch (error) {
        setIsLoggedIn(false);
        setIsAdmin(false); 
      }
    };
    
    checkLoginStatus();
  }, []);

  const handleAddToCart = (item) => {
    setCartItems(prevItems => [...prevItems, item]);
    alert(`${item.name} has been added to your cart!`);
    console.log("Current cart:", [...cartItems, item]);
  };

  const handleLogin = (isAdmin = false) => {
    setIsLoggedIn(true);
    setIsAdmin(isAdmin);
    
    window.location.href = isAdmin ? '/adminAccount' : '/accountSettings';
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3001/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      alert("Logout Successful.");
      setIsLoggedIn(false);
      setIsAdmin(false);
      window.location.href = "/";
    }
  };

  const handleSearch = async (searchTerm) => {
    console.log("Search initiated for:", searchTerm);

    // 1. Normalize the search term (lowercase, remove all whitespace)
    const normalizedSearchTerm = searchTerm.toLowerCase().replace(/\s/g, '');

    try {
        // 2. Fetch all products from the /Product endpoint
        const response = await axios.get(`${API_BASE_URL}/Product`,
      {
        headers: {
          'Accept': 'application/json'
        },
      }
    )
        

        // The product list is expected under 'response.data.list' based on other components (e.g., genre.js)
        const products = response.data.list;

        if (!products || products.length === 0) {
            alert(`Search failed: No products found on the server.`);
            return;
        }

        // 3. Search for a matching product name
        const foundProduct = products.find(product => {
            if (!product.Name) return false;
            
            // Normalize product name from list (lowercase, remove all whitespace)
            const normalizedProductName = product.Name.toLowerCase().replace(/\s/g, '');
            
            // Check for an exact match
            return normalizedProductName === normalizedSearchTerm;
        });

        // 4. Handle the result and navigate
        if (foundProduct) {
            const productId = foundProduct.ID;
            const path = `/products?id=${productId}`;
            
            console.log("Product found, navigating to:", path);
            // Navigate using full URL change, consistent with existing routing
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

  // 💡 CRITICAL: Handle the /products route outside the switch statement 
  // because it might have query parameters that the switch statement won't match.
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
          // The "/products" case is now handled in the 'if' block above
          // case "/products": 
          //   component = <ProductPage onAddToCart={handleAddToCart} />;
          //   break;
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
            }
  }
  return (
    <>
      <Navbar 
        isLoggedIn={isLoggedIn} 
        isAdmin={isAdmin} 
        onLogout={handleLogout}
        onSearch={handleSearch} // <-- Connect the search function
      />
      <div className="container">
        {component}
      </div>
      <Footer />
    </>
  );
}

export default App;
