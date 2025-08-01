import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUsers } from '../utils/api'; // ✅ Use helper function
import './UsersList.css';

console.log("📦 UsersList component mounted");

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers(); // ✅ uses custom api.js internally
        const otherUsers = res.filter(u => String(u._id) !== String(user._id));
        setUsers(otherUsers);

        console.log("All users:", res);
        console.log("Logged-in ID:", user._id);
        console.log("Other users:", otherUsers);
      } catch (err) {
        console.error("❌ Error fetching users:", err);
      }
    };

    if (user?._id) {
      fetchUsers();
    }
  }, [user]);

  return (
    <div className="users-container">
      <div className="users-card">
        <div className="top-bar">
          <span className="welcome-text">Welcome, {user?.username}</span>
        </div>

        <h2 className="main-heading">Choose someone to chat with:</h2>

        <div style={{ marginTop: '1.5rem' }}>
          {users.length === 0 ? (
            <p>No other users found.</p>
          ) : (
            users.map(u => (
              <div key={u._id} className="user-entry">
                <span>{u.username}</span>
                <button
                  className="chat-button"
                  // ✅ Pass username along with userId
                  onClick={() => navigate(`/chat/${u._id}`, { state: { username: u.username } })}
                >
                  Chat
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersList;

