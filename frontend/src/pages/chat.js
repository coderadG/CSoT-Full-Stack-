import React, { useState } from 'react';
import styles from './Chat.module.css'; // ✅ Import CSS module

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMsg.trim()) {
      setMessages([...messages, inputMsg]);
      setInputMsg('');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Chat Room</h2>
        <div className={styles.chatBox}>
          {messages.map((msg, index) => (
            <div key={index} className={styles.message}>
              {msg}
            </div>
          ))}
        </div>
        <form className={styles.form} onSubmit={sendMessage}>
          <input
            className={styles.input}
            type="text"
            value={inputMsg}
            onChange={e => setInputMsg(e.target.value)}
            placeholder="Type a message"
          />
          <button className={styles.button} type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;

