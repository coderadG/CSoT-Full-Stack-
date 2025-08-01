// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { database } from "../firebase";
import { ref, set } from "firebase/database";

const AuthContext = createContext();

// ✅ Helper function: Sync user to Firebase
const saveUserToFirebase = async (user) => {
  if (!user || !user._id) return;
  try {
    const userRef = ref(database, `ChatUsers/${user._id}`);
    await set(userRef, {
      email: user.email || "",
      username: user.username || "",
      photo: user.photo || "",
      status: "online",
      flag: "chat",
      userId: user._id
    });
    console.log("✅ User synced to Firebase successfully");
  } catch (err) {
    console.error("❌ Error saving user to Firebase:", err);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // ✅ Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);

      const normalizedUser = {
        ...parsedUser,
        uid: parsedUser.uid || parsedUser._id || parsedUser.id
      };

      setUser(normalizedUser);
      setToken(storedToken);

      // ✅ Sync user to Firebase on app load
      saveUserToFirebase(normalizedUser);
    }
  }, []);

  // ✅ Login function - ensures uid is always set
  const login = async ({ user, token, refreshToken }) => {
    const normalizedUser = {
      ...user,
      uid: user.uid || user._id || user.id
    };

    localStorage.setItem("user", JSON.stringify(normalizedUser));
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);

    setUser(normalizedUser);
    setToken(token);

    // ✅ Sync user to Firebase immediately
    await saveUserToFirebase(normalizedUser);
  };

  // ✅ Logout - clears all auth data
  const logout = () => {
    if (user?._id) {
      // Mark user offline in Firebase
      const userRef = ref(database, `ChatUsers/${user._id}/status`);
      set(userRef, "offline");
    }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
