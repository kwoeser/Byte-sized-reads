import { Link } from "react-router-dom";
import Login from "./Login";
import HomePage from "../pages/HomePage";

type Props = {}

const Navbar = (props: Props) => {
  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      backgroundColor: "#C45AEC", 
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      padding: "1rem 0"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 1.5rem"
      }}>
        <div style={{
          fontSize: "1.875rem", 
          fontWeight: "bold", 
          color: "white",
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)"
        }}>
          Welcome to ByteSized Reads!
        </div>

        {/* Navbar Links */}
        <div style={{
          display: "flex",
          gap: "2rem"
        }}>
          <Link to="/" style={{
            color: "white",
            fontSize: "1.125rem",
            textDecoration: "none",
            transition: "all 0.2s ease",
            padding: "0.5rem 0.75rem",
            borderRadius: "0.25rem",
            backgroundColor: "rgba(255, 255, 255, 0.1)"
          }}>
            Home
          </Link>
        </div>

        {/* Login Section */}
        <div style={{
          backgroundColor: "#FFBF00", 
          padding: "0.75rem 1.5rem",
          borderRadius: "0.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
        }}>
          <div style={{
            fontWeight: "bold",
            fontSize: "1.25rem",
            marginBottom: "0.5rem",
            color: "#333"
          }}>
            Login
          </div>
          
          {/* Input fields container */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <input 
              type="text" 
              placeholder="Username" 
              style={{
                padding: "0.375rem",
                borderRadius: "0.25rem",
                border: "1px solid #ccc",
                fontSize: "0.875rem"
              }} 
            />
            
            <input 
              type="password" 
              placeholder="Password" 
              style={{
                padding: "0.375rem",
                borderRadius: "0.25rem",
                border: "1px solid #ccc",
                fontSize: "0.875rem"
              }} 
            />
            
            <button style={{
              backgroundColor: "#333",
              color: "white",
              padding: "0.375rem 0.75rem",
              borderRadius: "0.25rem",
              border: "none",
              fontSize: "0.875rem",
              cursor: "pointer",
              fontWeight: "500"
            }}>
              Login
            </button>
            </div>

            {/* Sign Up Link */}
          <div style={{ marginTop: '0.5rem' }}>
            <Link to="/signup" style={{ color: 'blue', textDecoration: 'underline' }}>
              Sign Up
            </Link>
          </div>
          </div>
        </div>
    </nav>
  )
}
export default Navbar;