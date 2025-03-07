import React, { useState } from 'react';

function Main() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const handleSend = () => {
        if (message.trim()) {
            setMessages([...messages, message]);
            setMessage("");
        }
    };

    const check = () => {
        console.log(sessionStorage.getItem("user"))
        window.open("http://localhost:3000/?pg=name","_blank")
    }

    check()
    

    return (
        <div className="flex flex-col h-[100vh] bg-gray-100 p-4">
            {/* Chat Messages */}
            <div className="flex flex-col gap-2 mb-16">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`max-w-xs p-3 rounded-lg shadow-md ${
                            index % 2 === 0 ? "bg-blue-500 text-white self-end" : "bg-gray-300 text-black self-start"
                        }`}
                    >
                        {msg}
                    </div>
                ))}
            </div>

            {/* Input Box (Fixed at Bottom) */}
            <div className="fixed bottom-4 left-[50%] w-[90%] max-w-md translate-x-[-50%] flex bg-white shadow-lg rounded-full p-2 border">
                <input
                    className="flex-1 outline-none px-3 text-lg bg-transparent"
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition">
                    Send
                </button>
            </div>
        </div>
    );
}

export default Main;
