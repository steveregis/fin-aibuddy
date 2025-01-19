// src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import dayjs from './utils/dayjs';
import { ChatMessage } from './types';

// Your FastAPI endpoint
//const API_URL = 'http://bank-chatbot-0125.eastus.azurecontainer.io:8000/api/chat';

const API_URL = 'http://marsbank.eastus.cloudapp.azure.com/api/chat';

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Restore chat history from localStorage (if any)
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [];
  });

  const [userInput, setUserInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBotTyping]);

  // Persist chat history in localStorage
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  // Format timestamps like "3 minutes ago"
  const getRelativeTime = (timestamp: number) => {
    return dayjs(timestamp).fromNow();
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // 1. Add the user's message to the list
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: userInput,
      sender: 'user',
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput('');

    try {
      // 2. Show that the bot is "typing"
      setIsBotTyping(true);

      // 3. Make the POST request to FastAPI
      //    The backend expects { "query": "some user text" }
      //    and returns { "response": "some bot answer" }
      const response = await axios.post<{ response: string }>(
        API_URL,
        { query: userInput },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // 4. Extract the bot's reply
      const botReply = response.data.response;

      // 5. Add the bot's message
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(), // a unique ID
        text: botReply,
        sender: 'bot',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      // 6. Show an error message from the bot if the request fails
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        text: 'Sorry, something went wrong. Please try again.',
        sender: 'bot',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsBotTyping(false);
    }
  };

  // Press Enter to send
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatContainer}>
        <div style={styles.chatHeader}>Bank Chatbot</div>

        <div style={styles.messagesWrapper}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                ...styles.messageRow,
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  ...styles.messageBubble,
                  backgroundColor: msg.sender === 'user' ? '#DCF8C6' : '#FFF',
                }}
              >
                <div style={{ marginBottom: 4 }}>{msg.text}</div>
                <div style={styles.timestamp}>{getRelativeTime(msg.timestamp)}</div>
              </div>
            </div>
          ))}

          {isBotTyping && (
            <div style={{ ...styles.messageRow, justifyContent: 'flex-start' }}>
              <div style={{ ...styles.messageBubble, backgroundColor: '#FFF' }}>
                <em>Bot is typing...</em>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div style={styles.inputContainer}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a message..."
            style={styles.input}
          />
          <button onClick={handleSendMessage} style={styles.sendButton}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

// Simple inline styles (for demo)
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: '#ECE5DD', // WhatsApp-like background
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'sans-serif',
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '400px',
    height: '600px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  chatHeader: {
    backgroundColor: '#075E54',
    color: '#fff',
    padding: '10px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  messagesWrapper: {
    flex: 1,
    padding: '10px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  messageRow: {
    display: 'flex',
    marginBottom: '10px',
  },
  messageBubble: {
    maxWidth: '60%',
    padding: '10px',
    borderRadius: '8px',
    position: 'relative',
  },
  timestamp: {
    fontSize: '0.75rem',
    color: '#999',
    marginTop: '4px',
    textAlign: 'right',
  },
  inputContainer: {
    display: 'flex',
    borderTop: '1px solid #CCC',
    padding: '10px',
  },
  input: {
    flex: 1,
    fontSize: '1rem',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #CCC',
    outline: 'none',
    marginRight: '10px',
  },
  sendButton: {
    backgroundColor: '#34B7F1',
    border: 'none',
    borderRadius: '4px',
    color: '#FFF',
    fontWeight: 'bold',
    padding: '8px 16px',
    cursor: 'pointer',
  },
};
