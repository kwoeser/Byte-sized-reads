import { Link } from "react-router-dom";
import Login from "./Login";
import SearchBar from "./SearchBar";
import DropdownFilter from "./DropdownFilter";


const Navbar = () => {
  return (

    <nav className="fixed w-full bg-white text-black shadow-md border-b border-gray-100">
      
      <div className="flex items-center px-8 py-3">

        {/* navbar links */}
        <div className="space-x-6">
          <Link to="/" className="hover:text-red-500">Home</Link>
          <Link to="/Library" className="hover:text-red-500">Our Library</Link>
        </div>
        
        <DropdownFilter/>
       
        {/* might move search bar off navbar onto middle of page or on the top right of the home page */}
        <SearchBar/>
        
        <Link to="/LoginPage"><Login/></Link>

      </div>
    </nav>
    
      
  )
}

export default Navbar