import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
// import HomePage from "@/pages/HomePage";
 import Login from "./components/Login";

function App() {
  return (
    <div style={{
      backgroundColor: "#f8f9fa",
      minHeight: "100vh",
      backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)"
    }}>
      
      {/* Main content */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "2rem",
        marginTop: "1rem"
      }}>
        <Routes>

          {/* Main route */}
          <Route path="/" element={<HomePage />} />
          
        </Routes>
      </div>
    </div>
  );
}

export default App;
