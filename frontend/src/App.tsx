import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Library from "./pages/Library";
import LoginPage from "./pages/LoginPage";


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/Library" element={<Library />} />
      <Route path="/LoginPage" element={<LoginPage />} />


    </Routes>
  );
}

export default App;
