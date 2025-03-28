
import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Phone, MessageSquare, WhatsApp } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-pizza-dark text-white pt-12 pb-6">
      <div className="pizza-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 font-display">Pizzalicious</h3>
            <p className="mb-4 text-gray-300">
              Serving the most delicious pizzas in town since 2010. Made with love and the finest ingredients.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-white hover:text-pizza-secondary transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" className="text-white hover:text-pizza-secondary transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://wa.me/1234567890" className="text-white hover:text-pizza-secondary transition-colors" aria-label="WhatsApp">
                <WhatsApp size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 font-display">Opening Hours</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex justify-between">
                <span>Monday - Friday</span>
                <span>11:00 - 22:00</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>11:00 - 23:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>12:00 - 22:00</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 font-display">Contact Us</h3>
            <address className="not-italic text-gray-300 space-y-2">
              <p>123 Pizza Street</p>
              <p>New York, NY 10001</p>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <a href="tel:+1234567890" className="hover:text-pizza-secondary transition-colors">
                  (123) 456-7890
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare size={16} />
                <a href="mailto:info@pizzalicious.com" className="hover:text-pizza-secondary transition-colors">
                  info@pizzalicious.com
                </a>
              </div>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© {currentYear} Pizzalicious. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
