import React, { useState, useEffect, useRef } from "react";

function Main() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Function to send message
  async function handleSend() {
    if (message.trim()) {
      const newMessage = { text: message, type: "user" };
      setMessages([...messages, newMessage]);
      setMessage("");

      await fetch("http://127.0.0.1:8000/m", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ m: message }),
      });

      getMessages(); // Refresh messages after sending
    }
  }

  // Function to fetch messages
  async function getMessages() {
    const user_id = sessionStorage.getItem("name");

    const result = await fetch("http://127.0.0.1:8000/w", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ d: user_id }),
    });

    const data = await result.json();
    if (data.data) {
      const formattedMessages = data.data.map((msgObj) => ({
        id: msgObj.id,
        text: msgObj.msg,
        type: "received",
      }));
      setMessages(formattedMessages);
    }
  }

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch messages on load & every 3 seconds for real-time updates
  useEffect(() => {
    if (!sessionStorage.getItem("name")) {
      window.open("/?pg=name", "_self");
    } else {
      getMessages(); 
        }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-900 pt-20 p-4">
      {/* Chat Messages */}
      <div className="flex flex-col gap-3 flex-grow px-4 mb-20 mx-auto md:w-[50%] max-w-lg w-full overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[50%] px-5 py-3 rounded-xl shadow-md transition-all duration-300 ${
              msg.type === "user"
                ? "bg-blue-600 text-white self-end"
                : "bg-gray-700 text-white self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />

        {/* Typing Indicator */}
        {isTyping && (
          <div className="text-gray-400 italic text-sm self-start">
            Typing...
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="fixed bottom-6 left-[50%] md:w-[50%] w-[95%] translate-x-[-50%] flex bg-white shadow-lg backdrop-blur-md rounded-full p-3 border border-gray-300">
        <input
          className="flex-1 outline-none px-4 text-lg bg-transparent"
          id="msg"
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 1000); // Reset typing status
          }}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-full hover:scale-105 transition-transform"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Main;
