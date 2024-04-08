import React from 'react';
import { FaEnvelope, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black z-10 text-white p-4 text-center fixed bottom-0 w-full">
      <div className="flex ml-[400px] mb-4">
        <a href="mailto:contact@example.com" className="mr-4">
          <FaEnvelope size={20} />
        </a>
        <a href="https://twitter.com/example" target="_blank" rel="noopener noreferrer" className="mr-4">
          <FaTwitter size={20} />
        </a>
        <a href="https://instagram.com/example" target="_blank" rel="noopener noreferrer">
          <FaInstagram size={20} />
        </a>
        <p className="text-sm ml-[400px]">All rights reserved @BP</p>
      </div>
      
    </footer>
  );
};

export default Footer;