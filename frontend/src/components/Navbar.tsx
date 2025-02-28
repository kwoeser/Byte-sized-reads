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
      backgroundColor: "#9370DB", 
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

        {/* Category filter */}
        <div style={{ margin: "2rem 0" }}>
          <h3 style={{ marginBottom: "1rem", color: "white" }}>Browse by Category</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {['All', 'Technology', 'Travel', 'Video Games'].map((category, index) => (
              <button
                key={category}
                style={{
                  backgroundColor: index === 0 ? "#4B0082" : "transparent",
                  color: index === 0 ? "white" : "#eeeeee",
                  border: index === 0 ? "none" : "1px solid #dee2e6",
                  borderRadius: "0.375rem",
                  padding: "0.5rem 1rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  if (index !== 0) {
                    e.currentTarget.style.backgroundColor = "#f8f9fa";
                  }
                }}
                onMouseOut={(e) => {
                  if (index !== 0) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Login Section */}
        <div style={{
          backgroundColor: "#FFD700", 
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
              padding: "0.375rem 0.75rem",
              borderRadius: "0.25rem",
              border: "1px solid #ccc",
              fontSize: "0.875rem",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease"
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#C45AEC";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(196, 90, 236, 0.25)";
              e.currentTarget.style.outline = "none";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#ccc";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
            
          <input 
            type="password" 
            placeholder="Password" 
            style={{
              padding: "0.375rem 0.75rem",
              borderRadius: "0.25rem",
              border: "1px solid #ccc",
              fontSize: "0.875rem",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease"
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#C45AEC";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(196, 90, 236, 0.25)";
              e.currentTarget.style.outline = "none";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#ccc";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
            {/* login button */}
            <button style={{
              backgroundColor: "#333",
              color: "white",
              padding: "0.375rem 0.75rem",
              borderRadius: "0.25rem",
              border: "none",
              fontSize: "0.875rem",
              cursor: "pointer",
              fontWeight: "500",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#000";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.3)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#333";
              e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
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