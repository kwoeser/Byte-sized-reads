import { apiClient } from "../Connection";

const LogoutButton = () => {

  // logout mutation, POST /auth/logout
  const logoutMutation = apiClient.logout.useMutation();

  const handleLogout = () => {  
    logoutMutation.mutate(
      {},
      {
        onSuccess: (data) => {
          console.log("User logged out");
          window.location.reload(); 
        },
        onError: (err) => {
          console.error("Regristration error:", err);
        },
      }
    )
  };

  return (
    <button onClick={() => handleLogout()} 
      className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
