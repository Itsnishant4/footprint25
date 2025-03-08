import React from 'react'

function Namee() {
    async function setSession() {
        const secretMessage = document.getElementById("secret-message").value;
    
        // Await the fetch request before proceeding
        const result = await fetch("http://127.0.0.1:8000/id", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: secretMessage })
        });
    
        const data = await result.json();
    
        if (data) {
            sessionStorage.setItem("name", data.name);
            sessionStorage.setItem("id", data.id);
    
            // Ensure check() runs after session storage is updated
            check();
        }
    }
    const check = () => {
        window.open("/","_self")
        
    }
  return (
    <div className="flex justify-center items-center h-screen">
            <div className="h-[200px] w-[350px] bg-white p-6 rounded-lg shadow-md border-black border-2 flex flex-col justify-center items-center">
                <h1 className="text-2xl font-bold mb-4 text-center">Enter Your Name : </h1>
                <input id="secret-message" className="w-full p-2 border rounded mb-2" placeholder="ENTER YOUR NAME "></input>
                <button className="w-full bg-blue-500 text-white p-2 rounded-xl" onClick={setSession}>
                    Submit
                </button>
            </div>
            </div>
  )
}

export default Namee