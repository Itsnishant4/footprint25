import React, { useState, useEffect, useRef } from "react";

function Main() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const storedMessages = sessionStorage.getItem("chatMessages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  async function handleSend() {
    if (message.trim()) {
      const newMessage = { id: Date.now(), text: message, type: "user" };
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMessage];
        sessionStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
        return updatedMessages;
      });
      setMessage("");

      await fetch("http://127.0.0.1:8000/m", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ m: message }),
      });
    }
  }

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

      setMessages((prevMessages) => {
        const existingIds = new Set(prevMessages.map(msg => msg.id));
        const newMessages = formattedMessages.filter(msg => !existingIds.has(msg.id));
        const mergedMessages = [...prevMessages, ...newMessages];
        sessionStorage.setItem("chatMessages", JSON.stringify(mergedMessages));
        return mergedMessages;
      });
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!sessionStorage.getItem("name")) {
      window.open("/?pg=name", "_self");
    } else {
      getMessages();
      const interval = setInterval(getMessages, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-900 pt-20 p-4">
      <div className="flex flex-col gap-3 flex-grow px-4 mb-20 mx-auto md:w-[50%] md:max-w-screen-2xl max-w-lg w-full overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={msg.id}
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
        {isTyping && (
          <div className="text-gray-400 italic text-sm self-start">Typing...</div>
        )}
      </div>
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
            setTimeout(() => setIsTyping(false), 1000);
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
