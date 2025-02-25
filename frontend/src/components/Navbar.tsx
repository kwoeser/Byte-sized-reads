import { Link } from "react-router-dom";
import Login from "./Login";

type Props = {}

const Navbar = (props: Props) => {
  return (
    <div className="navbar">
      Navbar
      
      {/* <Link>Home</Link> */}

      {/* Search Bar */}
      {/* Login */}
      <Login/>

    </div>
    
      
  )
}

export default Navbar