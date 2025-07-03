import React, { useState } from 'react';

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
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Chat Room</h2>
      <div style={{ border: '1px solid #ccc', padding: '10px', height: '200px', overflowY: 'scroll', marginBottom: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: 'left', marginBottom: '5px' }}>{msg}</div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={inputMsg}
          onChange={e => setInputMsg(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit" style={{ marginLeft: '10px' }}>Send</button>
      </form>
    </div>
  );
};

export default Chat;
