import React, { useState } from 'react';

function Namee() {
    const [loading, setLoading] = useState(false);

    async function setSession() {
        setLoading(true);
        const secretMessage = document.getElementById("secret-message").value;
        const result = await fetch("http://127.0.0.1:8000/id", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: secretMessage })
        });
        const data = await result.json();
        if (data) {
            await sleep(3000);
            sessionStorage.setItem("name", data.name);
            sessionStorage.setItem("id", data.id);
            check();
        }
        setLoading(false);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    const check = () => {
        window.open("/", "_self");
    };

    return (
        <div className="flex justify-center items-center h-screen  bg-gray-900  text-white">
            <div className="h-[250px] w-[380px] p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl flex flex-col justify-center items-center">
                <h1 className="text-3xl font-bold mb-4 text-center">Enter Your Name</h1>
                <input 
                    id="secret-message" 
                    className="w-full p-3 border-none rounded-lg mb-3 text-black outline-none focus:ring-2 focus:ring-white shadow-md" 
                    placeholder="Enter your name" 
                />
                <button
                    className="w-full bg-white text-blue-600 font-semibold p-2 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-blue-600 hover:text-white shadow-md"
                    onClick={setSession}
                    disabled={loading}
                >
                    {loading ? <span className="loader"></span> : "Submit"}
                </button>
            </div>
        </div>
    );
}

export default Namee;
