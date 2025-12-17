import { useState, useEffect } from "react";

// Define the possible roles
export type UserRole = "admin" | "user" | "freeUser";

// Define the return type of the hook
interface UseUserRoleReturn {
  role: UserRole;
  isAdmin: boolean;
  isUser: boolean;
  isFreeUser: boolean;
  setRole: (role: UserRole) => void;
}

export const useUserRole = (initialRole: UserRole = "freeUser"): UseUserRoleReturn => {
  const [role, setRole] = useState<UserRole>(initialRole);

  // Optional: fetch role from API/localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole") as UserRole | null;
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return {
    role,
    isAdmin: role === "admin",
    isUser: role === "user",
    isFreeUser: role === "freeUser",
    setRole,
  };
};

 
 

const Dashboard: React.FC = () => {
  const { isAdmin, isUser, isFreeUser, setRole } = useUserRole();

  return (
    <div>
      {isAdmin && <h1>Welcome Admin! You have full access.</h1>}
      {isUser && <h1>Welcome User! You have limited access.</h1>}
      {isFreeUser && <h1>Welcome Free User! Upgrade to get more features.</h1>}

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setRole("admin")}>Set Admin</button>
        <button onClick={() => setRole("user")}>Set User</button>
        <button onClick={() => setRole("freeUser")}>Set Free User</button>
      </div>
    </div>
  );
};

export default Dashboard;
