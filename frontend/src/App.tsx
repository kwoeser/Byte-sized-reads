import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Library from "./pages/Library";
import LoginPage from "./pages/LoginPage";
import SubmitArticle from "./pages/SubmitArticle";


function App({ filters }: { filters: { category: string | null; readingTime: string | null } }) {
  return (
    <Routes>
      <Route path="/" element={<HomePage filters={filters} />} />
      <Route path="/Library" element={<Library />} />
      <Route path="/LoginPage" element={<LoginPage />} />
      <Route path="/Submit" element={<SubmitArticle />} />


    </Routes>
  );
}

export default App;
