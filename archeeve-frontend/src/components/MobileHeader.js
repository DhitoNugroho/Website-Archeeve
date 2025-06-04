// src/components/MobileHeader.js
import React from 'react';
import { Link } from 'react-router-dom';

const MobileHeader = ({ setSidebarOpen }) => {
  return (
    // Header ini hanya muncul di layar mobile/tablet (hidden md:block)
    <header className="bg-yellow-300 p-4 text-gray-800 flex justify-between items-center md:hidden shadow-md"> {/* KUNING TERANG & TEKS GELAP */}
      <button
        className="text-gray-800 text-2xl" /* TEKS GELAP */
        onClick={() => setSidebarOpen(true)} 
      >
        ☰ {/* Hamburger Icon */}
      </button>
      <Link to="/" className="text-xl font-bold text-gray-800">Archoose</Link> {/* TEKS GELAP */}
      <div className="w-8"></div> {/* Placeholder untuk menjaga keseimbangan layout */}
    </header>
  );
};

export default MobileHeader;