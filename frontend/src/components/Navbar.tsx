import { Link } from "react-router-dom";
import Login from "./Login";
import SearchBar from "./SearchBar";
import DropdownFilter from "./DropdownFilter";
import { Home, Book } from "lucide-react";


const Navbar = () => {
  return (

    <nav className="fixed w-full bg-white text-black shadow-md border-b border-gray-100">
      
      <div className="flex items-center justify-between px-8 py-3">

        {/* Left side */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center hover:text-red-500">
           <Home className="mr-2" size={18} />
           <span>Home</span>
        </Link>
        <Link to="/Library" className="flex items-center hover:text-red-500">
          <Book className="mr-2" size={18} />
          <span>Our Library</span>
         </Link>
        <DropdownFilter />
        </div>
       
        {/* Rghit side */}
        <div className="flex items-center space-x-4">
        <SearchBar/>
        
        <Link to="/LoginPage">
         <Login/>
        </Link>
      </div>
    </div>
    </nav>
    

  )
}

export default Navbar