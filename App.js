import Navbar from "./Navbar"
import Home from "./pages/Home"
import Genre from "./pages/Genre"
import NewReleases from "./pages/NewReleases"
import BestSellers from "./pages/BestSellers"
import Author from "./pages/Author"
import Products from "./pages/Products"
import './styles.css';

//The main component
function App() {
  let component
  switch (window.location.pathname) {
    case "/":
      component = <HomePage />
      break
    case "/genre":
      component = <Genre />
      break
    case "/newReleases":
      component = <New Releases />
      break
    case "/bestSellers":
      component = <Best Sellers />
      break
    case "/author":
      component = <Author />
      break
    case "/products":
      component = <Products />
      break
  }
  return ( 
    <>
      <Navbar />
        <div className="container">
      {component}
    </div>
    </>
  );
}

export default App;

