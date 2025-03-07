import React, { useEffect, useState } from 'react';

function Secret() {
    const [message, setMessage] = useState("Loading...");
    const [fetched, setFetched] = useState(false); // Prevent double fetch

    useEffect(() => {
        if (fetched) return; // Prevent multiple API calls

        async function fetchMessage() {
            const urlParams = new URLSearchParams(window.location.search);
            const gid = urlParams.get('gid');
            if (!gid) return;

            const result = await fetch(`http://127.0.0.1:8000/fetch-message/${gid}`);
            const data = await result.json();

            if (data.message) {
                setMessage(`Secret Message: ${data.message}`);
            } else {
                setMessage("This message has already been viewed or does not exist.");
            }
            setFetched(true); // Mark as fetched
        }
        fetchMessage();

    }, [fetched]); // Depend on `fetched` to prevent duplicate calls

    return (
        <div className="flex justify-center items-center h-screen">
            
        <div className="max-w-lg w-full bg-white p-6 rounded-xl shadow-md text-center border-black border-[1px]">
            <p className="text-xl font-extrabold">{message}</p>
        </div>
        </div>
    );
}

export default Secret;
