import React, { useEffect, useState } from 'react';
import styles from './Chat.module.css';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { database } from '../firebase';
import { ref, push, onValue, update } from 'firebase/database';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const { user } = useAuth();
  const { userId: recipientId } = useParams(); // URL :userId

  const currentUserId = user?.uid;

  // 📩 Send a new message to Firebase
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !currentUserId || !recipientId) return;

    const now = new Date();

    const newMessage = {
      message: inputMsg,
      sender: currentUserId,
      receiver: recipientId,
      date: now.toLocaleDateString('en-IN'),
      time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      status: "NOT_SEEN",
      img_message: ""
    };

    try {
      const chatRef = ref(database, 'Chats');
      await push(chatRef, newMessage);

      // ✅ Update Chatlist
      const senderRef = ref(database, `Chatlist/${currentUserId}/${recipientId}`);
      const receiverRef = ref(database, `Chatlist/${recipientId}/${currentUserId}`);

      await update(senderRef, { id: recipientId });
      await update(receiverRef, { id: currentUserId });

      setInputMsg('');
    } catch (err) {
      console.error('Firebase message send error:', err);
    }
  };

  // 🔁 Real-time listener for messages
  useEffect(() => {
    const chatRef = ref(database, 'Chats');
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const filtered = Object.values(data).filter(
        msg =>
          (msg.sender === currentUserId && msg.receiver === recipientId) ||
          (msg.sender === recipientId && msg.receiver === currentUserId)
      );
      setMessages(filtered);
    });

    return () => unsubscribe();
  }, [currentUserId, recipientId]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Chat Room</h2>
        <div className={styles.chatBox}>
          {messages.map((msg, index) => (
            <div key={index} className={styles.message}>
              {msg.message}
            </div>
          ))}
        </div>
        <form className={styles.form} onSubmit={sendMessage}>
          <input
            className={styles.input}
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Type a message"
          />
          <button className={styles.button} type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;

