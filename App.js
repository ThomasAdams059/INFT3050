import React, { useState } from 'react';
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
import MyAccount from "./myAccount";
import OrderHistory from "./orderHistory";
import './styles.css';
import AddressBook from './addressBook';
import PaymentMethods from './paymentMethod';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Initialize from sessionStorage
    return sessionStorage.getItem('isLoggedIn') === 'true';
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('isAdmin') === 'true';
  });

  
  const handleAddToCart = (item) => {
    setCartItems(prevItems => [...prevItems, item]);
    alert(`${item.name} has been added to your cart!`);
    console.log("Current cart:", [...cartItems, item]);
  };

  const handleLogin = (isAdmin = false) => {
  setIsLoggedIn(true);
  // Store login state in sessionStorage so it persists across page reloads
  sessionStorage.setItem('isLoggedIn', 'true');
  sessionStorage.setItem('isAdmin', isAdmin.toString());
  
  // Redirect
  window.location.href = isAdmin ? '/adminAccount' : '/dminAccount';
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
    case "/accountSettings": 
      component = <AccountSettings />;
      break;
    case "/userManagement": 
      component = <UserManagement />;
      break;
    case "/itemManagement": 
      component = <ItemManagement />;
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
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="container">
        {component}
      </div>
      <Footer />
    </>
  );
}

export default App;
