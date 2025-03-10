import { Link } from "react-router-dom";
import { useState } from "react";
import { apiClient } from "../Connection";
import DropdownFilter from "./DropdownFilter";
import LogoutButton from "./LogoutButton";
import { Home, Book, ShieldCheck, Bookmark } from "lucide-react";

const Navbar = ({ onFilterChange }: { onFilterChange: (filters: { category: string | null; readingTime: string | null }) => void }) => {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isModerator, setIsModerator] = useState(false);

  // fetch user session status
  const { data } = apiClient.getUser.useQuery(["getUser"], {}, {
    onSuccess: (data) => {
      if (data?.status === 200) {
        setIsLoggedIn(true);
        setUsername(data.body.username);
        setIsModerator(data.body.moderator || false);
      } else {
        setIsLoggedIn(false);
        setUsername("");
        setIsModerator(false);
      }
    },
    onError: () => {
      setIsLoggedIn(false);
      setUsername("");
      setIsModerator(false)
;    },
  });


  return (
    <nav className="fixed w-full bg-white text-black shadow-md border-b border-gray-100">
      <div className="flex items-center justify-between px-8 py-3">

        {/* Left side */}
        <div className="flex items-center space-x-10">
          <Link to="/" className="flex items-center hover:text-red-500">
            <Home className="mr-2" size={18} />
            <span>Home</span>
          </Link>
          <Link to="/Library" className="flex items-center hover:text-red-500">
            <Book className="mr-2" size={18} />
            <span>Our Library</span>
          </Link>
          
          <DropdownFilter onFilterChange={onFilterChange}/>
          {/* Moderator Link (Conditional) */}
          {isLoggedIn && isModerator && (
            <Link to="/ModeratorPage" className="flex items-center hover:text-red-500">
              <ShieldCheck className="mr-2" size={18} />
              <span>Moderator</span>
            </Link>
          )}

          

        </div>
       
        {/* Right side, Login or Logout */}
        {/* bug: login shows for a split second when you reload page. */}
        <div className="flex items-center space-x-10">
          
          {/* bookmarks tab only if user is logged in */}
          {isLoggedIn && (
            <Link to="/BookmarkPage" className="flex items-center hover:text-red-500">
              <Bookmark className="mr-2" size={18} />
              <span>Bookmarks</span>
            </Link>
          )}

          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {username}</span>
              <LogoutButton /> 
            </div>
          ) : (
            <Link to="/LoginPage">
              <button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                Login
              </button>
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;

