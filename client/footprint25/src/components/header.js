import React from 'react'


function Header() {
    const params = new URLSearchParams(window.location.search);
    const pg = params.get("pg");
    console.log(pg);
  return (

    <div>
      <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
    <h1 className="text-xl font-bold">Anonymous Chate App</h1>
    <nav className="hidden md:flex gap-4">
    <a href="http://localhost:3000/" className={`hover:rounded-[15px] ${pg == null ? " text-white rounded-[15px] border-2 border-white" : "bg-white text-black"}  px-5 p-1 rounded-[5px] font-sans font-bold`}>Home</a>
      <a href="http://localhost:3000/?pg=add" className={`hover:rounded-[15px] ${pg == "add" ? " text-white rounded-[15px] border-2 border-white" : "bg-white text-black"}  px-5 p-1 rounded-[5px] font-sans font-bold`}>Add Url</a>
      <a href="http://localhost:3000/?pg=s" className={`hover:rounded-[15px] ${pg == "s" ? " text-white rounded-[15px] border-2 border-white" : "bg-white text-black"}  px-5 p-1 rounded-[5px] font-sans font-bold`}>Secret Message</a>
    </nav>
    <button className="md:hidden p-2"></button>
    </header>
    </div>
  )
}

export default Header