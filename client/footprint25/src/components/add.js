import React from 'react'

function Add() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="h-[280px] w-[420px] bg-white/20 m-4 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-white/30 flex flex-col justify-center items-center transition-all duration-300 hover:shadow-3xl">
        <h1 className="text-3xl font-extrabold mb-5 text-center text-white drop-shadow-lg tracking-wide">Show Secret Message</h1>
        <input 
          id="secret-message" 
          className="w-full p-3 border-none rounded-lg mb-4 text-gray-900 bg-white/80 placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-400 shadow-lg transition-all duration-300 hover:bg-white"
          placeholder="Enter URL here..."
        />
        <button 
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:from-purple-600 hover:to-blue-500"
          onClick={() => window.open(`${document.getElementById('secret-message').value}`, '_blank')}
        >
          🔥 View Message 🔥
        </button>
      </div>
    </div>
  )
}

export default Add
