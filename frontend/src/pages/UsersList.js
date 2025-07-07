import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './UsersList.css'; // ✅ Import external CSS

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/users');
        setUsers(res.data.filter(u => u._id !== user._id));
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [user]);

  return (
    <div className="users-container">
      <div className="users-card">
        <h2>Choose someone to chat with:</h2>
        <div style={{ marginTop: '1.5rem' }}>
          {users.map(u => (
            <div key={u._id} className="user-entry">
              <span>{u.username}</span>
              <button
                className="chat-button"
                onClick={() => navigate(`/chat/${u._id}`)}
              >
                Chat
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersList;
