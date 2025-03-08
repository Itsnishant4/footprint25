import React, { useState, useEffect, useRef } from "react";

function Main() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        deletsession();
    }, []);

    useEffect(() => {
        const storedMessages = sessionStorage.getItem("chatMessages");
        if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
        }
    }, []);

    async function deletsession(){
        await sleep(2000)
        await sessionStorage.removeItem("chatMessages");
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function handleSend() {
        if (message.trim()) {
            const newMessage = { id: Date.now(), text: message, type: "user" };
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, newMessage];
                sessionStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
                return updatedMessages;
            });
            setMessage("");

            const response = await fetch("http://127.0.0.1:8000/m", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ m: message }),
            });
            const data = await response.json();
            const user_id = localStorage.getItem("id");

            if (data.id) {
                await fetch("http://127.0.0.1:8000/d", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ d: user_id, m: data.id }),
                });
            }
        }
    }

    async function getMessages() {
        const user_id = localStorage.getItem("id");
        const result = await fetch("http://127.0.0.1:8000/w", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ d: user_id }),
        });

        const data = await result.json();
        if (data.data) {
            const formattedMessages = data.data.map((msg) => {
                const deleteAt = msg.delete_at ? new Date(msg.delete_at).toLocaleString() : "Not Set";
                console.log("Delete at:", deleteAt); // Debug log
                return {
                    id: msg.id,
                    text: msg.msg,
                    type: msg.id === localStorage.getItem("id") ? "user" : "bot",
                    delete_at: deleteAt,
                };
            });

            setMessages((prevMessages) => {
                const existingIds = new Set(prevMessages.map((msg) => msg.id));
                const newMessages = formattedMessages.filter((msg) => !existingIds.has(msg.id));
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
        const g = localStorage.getItem("id");
        if (!g) {
            window.open("/?pg=name", "_self");
        } else {
            getMessages();
            const interval = setInterval(getMessages, 2000);
            return () => clearInterval(interval);
        }
    }, []);

    return (
        <div className="flex flex-col h-screen bg-gray-900 pt-20 p-4">
            <div className="flex flex-col gap-3 flex-grow px-4 mb-20 mx-auto md:w-[50%] md:max-w-screen-2xl max-w-lg w-full overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}> 
                {messages.map((msg, index) => (
                    <div key={msg.id} className="flex flex-col max-w-[100%]">
                        <div
                            className={`px-5 py-3 rounded-xl shadow-md transition-all duration-300 ${msg.type === "user"
                                    ? "bg-blue-600 text-white self-end"
                                    : "bg-gray-700 text-white self-start"
                                }`}
                        >
                            {msg.text}
                        </div>
                        {(() => {
                            // Determine delete time
                            let deleteAtTime = msg.delete_at
                                ? new Date(msg.delete_at) 
                                : new Date(new Date(msg.id).getTime() + 24 * 60 * 60 * 1000); 
                            let alignClass = msg.delete_at ? "hidden" : "self-end";

                            return (
                                <span className={`text-xs text-gray-400 mt-2 ${alignClass}`}>
                                    Deleting at: {deleteAtTime.toLocaleString()}
                                </span>
                            );
                        })()}

                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="fixed bottom-6 left-[50%] md:w-[50%] w-[95%] translate-x-[-50%] flex bg-white shadow-lg backdrop-blur-md rounded-full p-3 border border-gray-300">
                <input
                    className="flex-1 outline-none px-4 text-lg bg-transparent"
                    id="msg"
                    type="text"
                    placeholder="Type a message..."
                    autoComplete="off"
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
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
