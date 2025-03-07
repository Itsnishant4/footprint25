import React from 'react'

function Namee() {
    const setSession = () =>{
        sessionStorage.setItem("name",document.getElementById("secret-message").value)
    }
  return (
    <div className="flex justify-center items-center h-screen">
            <div className="h-[200px] w-[350px] bg-white p-6 rounded-lg shadow-md border-black border-2 flex flex-col justify-center items-center">
                <h1 className="text-2xl font-bold mb-4 text-center">Enter Your Name : </h1>
                <input id="secret-message" className="w-full p-2 border rounded mb-2" placeholder="ENTER YOUR NAME "></input>
                <button className="w-full bg-blue-500 text-white p-2 rounded-xl" onClick={setSession}>
                    View Message
                </button>
            </div>
            </div>
  )
}

export default Namee