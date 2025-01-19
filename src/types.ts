// src/types.ts

export type ChatMessage = {
  id: string;               // unique identifier (e.g., could be Date.now() + random)
  text: string;            // message content
  sender: 'user' | 'bot';  // who sent the message
  timestamp: number;       // use a numeric timestamp (Date.now())
};
