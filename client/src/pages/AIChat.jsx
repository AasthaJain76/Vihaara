// src/pages/AIChat.jsx
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Button, Input } from "../components";
import { toast } from "react-toastify";
import { sendMessage, getChatHistory } from "../services/chatService";

function AIChat() {
  const user = useSelector((state) => state.auth.userData);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [contextId, setContextId] = useState(null); // keep track of chat session
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load chat history once
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const chats = await getChatHistory(1); // fetch last chat
        if (chats.length > 0) {
          setMessages(chats[0].messages.map((m) => ({
            sender: m.role === "ai" ? "ai" : "user",
            content: m.text,
          })));
          setContextId(chats[0]._id);
        }
      } catch (err) {
        toast.error("⚠️ Failed to load chat history");
        console.error(err);
      }
    };

    if (user?._id) fetchHistory();
  }, [user]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendMessage({
        message: input,
        tone: "supportive",
        contextId,
      });

      const aiMessage = { sender: "ai", content: res.reply };
      setMessages((prev) => [...prev, aiMessage]);

      // Save/update context ID
      setContextId(res.chatSession._id);
    } catch (err) {
      toast.error("❌ Failed to send message");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 flex flex-col">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-200 flex flex-col p-6 flex-1">
        <h1 className="text-2xl font-bold text-indigo-600 mb-4 text-center">
          AI Chat
        </h1>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-[60vh] flex flex-col">
          {messages.length === 0 && (
            <p className="text-gray-400 text-center">Start a conversation with AI...</p>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl max-w-[75%] ${
                msg.sender === "user"
                  ? "bg-blue-100 text-blue-800 self-end"
                  : "bg-pink-100 text-pink-800 self-start"
              }`}
            >
              {msg.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {loading ? "Sending..." : "Send"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default AIChat;
