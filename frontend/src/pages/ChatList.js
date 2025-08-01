// src/pages/ChatList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { database } from '../firebase';
import { ref, onValue, off } from 'firebase/database';
import './ChatList.css';

const ChatList = () => {
  const [chatContacts, setChatContacts] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.uid) return;

    // ✅ Reference to Firebase Chatlist for current user
    const chatListRef = ref(database, `Chatlist/${user.uid}`);

    // ✅ Listen for changes in Chatlist
    const unsubscribe = onValue(chatListRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        // Convert Firebase object to array with id
        const contacts = Object.values(data).map((contact) => ({
          id: contact.id || "",
          username: contact.username || "Unknown User",
        }));
        setChatContacts(contacts);
      } else {
        setChatContacts([]);
      }
    });

    // ✅ Cleanup listener on unmount
    return () => off(chatListRef);
  }, [user?.uid]);

  return (
    <div className="chatlist-container">
      <div className="chatlist-card">
        <div className="chatlist-topbar">
          <span className="chatlist-heading">Your Recent Chats</span>
        </div>

        <p className="recent-chats-text">People you’ve messaged before:</p>

        <div>
          {chatContacts.length === 0 ? (
            <p className="recent-chats-text">No recent chats found.</p>
          ) : (
            chatContacts.map((contact, index) => (
              <div key={index} className="chat-entry">
                <span>{contact.username}</span>
                <button
                  className="open-chat-button"
                  onClick={() =>
                    navigate(`/chat/${contact.id}`, {
                      state: { username: contact.username },
                    })
                  }
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

export default ChatList;

