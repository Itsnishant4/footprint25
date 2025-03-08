import React, { useState, useEffect } from "react";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const pg = params.get("pg");

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest("#mobile-menu") && !event.target.closest("#menu-button")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="bg-gradient-to-r rounded-br-[30px] rounded-bl-[30px] from-blue-500 to-purple-600 text-white p-4 shadow-md flex justify-between items-center fixed top-0 left-0 w-full z-20">
      <h1 className="text-2xl font-bold tracking-wide">🔒 Anonymous Chat</h1>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-4">
        <a
          href="/"
          className={`transition-all duration-300 px-5 py-2 rounded-br-[30px] rounded-tl-[30px] rounded-bl-[30px] rounded-tr-[30px] font-bold ${
            pg == null
              ? "bg-white text-blue-600 border-2 border-white"
              : "hover:bg-white hover:text-blue-600"
          }`}
        >
          Home
        </a>
        <a
          href="/?pg=add"
          className={`transition-all duration-300 px-5 py-2 rounded-full font-bold ${
            pg == "add"
              ? "bg-white text-purple-600 border-2 border-white"
              : "hover:bg-white hover:text-purple-600"
          }`}
        >
          Add URL
        </a>
        <a
          href="/?pg=s"
          className={`transition-all duration-300 px-5 py-2 rounded-full font-bold ${
            pg == "s"
              ? "bg-white text-pink-600 border-2 border-white"
              : "hover:bg-white hover:text-pink-600"
          }`}
        >
          Secret Message
        </a>
      </nav>

      {/* Mobile Menu Button */}
      <button
        id="menu-button"
        className="md:hidden text-white text-2xl focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`absolute top-[64px] right-0 bg-white text-black w-48 shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <a
          href="/"
          className={`block px-5 py-3 font-bold border-b ${
            pg == null ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
          onClick={() => setIsOpen(false)}
        >
          Home
        </a>
        <a
          href="/?pg=add"
          className={`block px-5 py-3 font-bold border-b ${
            pg == "add" ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
          onClick={() => setIsOpen(false)}
        >
          Add URL
        </a>
        <a
          href="/?pg=s"
          className={`block px-5 py-3 font-bold ${
            pg == "s" ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
          onClick={() => setIsOpen(false)}
        >
          Secret Message
        </a>
      </div>
    </header>
  );
}

export default Header;
