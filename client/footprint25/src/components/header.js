import React from 'react'

function Header() {
  return (

    <div>
      <header className="bg-black text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">My Website</h1>
        <nav className="hidden md:flex gap-4">
        <a href="#" className="hover:underline">Home</a>
        <a href="#" className="hover:underline">About</a>
        <a href="#" className="hover:underline">Services</a>
        <a href="#" className="hover:underline">Contact</a>
    </nav>
    <button className="md:hidden p-2"></button>
    </header>
    </div>
  )
}

export default Header