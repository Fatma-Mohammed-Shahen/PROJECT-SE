// src/components/shared/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white text-center py-4 mt-auto">
      <div className="container mx-auto">
        <p>&copy; {new Date().getFullYear()} Online Event Ticketing System. All rights reserved.</p>
        <p className="mt-2">
          Contact us: <a href="mailto:support@eventtickets.com" className="underline">support@eventtickets.com</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
