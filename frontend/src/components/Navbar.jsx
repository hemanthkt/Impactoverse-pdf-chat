import React, { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between p-4">
      <div className="flex items-center">
        {/* Logo/Title */}
        <a href="/" className="text-2xl font-bold">
          Impactoverse
        </a>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-4">
  {/* Login Button */}
  <a 
    href="/login" 
    className="text-lg rounded-full bg-black text-white border p-2 px-3 hover:bg-gray-800 hover:text-gray-100 transition-colors duration-300"
  >
    Login
  </a>
  
  {/* Signup Button */}
  <a 
    href="/signup" 
    className="text-lg border p-2 rounded-full hover:bg-gray-100 hover:text-black transition-colors duration-300"
  >
    Signup
  </a>
</div>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} absolute top-16 left-0 w-full bg-white shadow-lg`}>
        <a href="/login" className="block p-4">Login</a>
        <a href="/signup" className="block p-4">Signup</a>
      </div>
      
    </nav>
  );
}

export default Navbar;
