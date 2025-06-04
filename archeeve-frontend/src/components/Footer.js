// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 p-6 text-white text-center mt-auto shadow-inner">
      <div className="container mx-auto">
        &copy; {new Date().getFullYear()} Archaeve CMS. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;