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

  let component;
  switch (window.location.pathname) {
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
    case "/products":
      component = <ProductPage onAddToCart={handleAddToCart} />;
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
  }
  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} onLogout={handleLogout} />
      
      <div className="container">
        {component}
      </div>
      <Footer />
    </>
  );
}

export default App;
