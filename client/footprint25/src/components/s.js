import React from 'react'

function S() {
  return (
    <div class="max-w-lg w-full bg-white p-6 rounded-lg shadow-md">
    <h1 class="text-2xl font-bold mb-4 text-center">Secret Message Chat</h1>
    <textarea id="secret-message" class="w-full p-2 border rounded mb-2" placeholder="Enter your secret message..."></textarea>
    <button onclick="generateLink()" class="w-full bg-blue-500 text-white p-2 rounded">Generate One-Time Link</button>
    <p id="message-link" class="mt-4 text-center text-blue-600"></p>
</div>
  )
}

export default S