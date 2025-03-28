
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { items } = useCart();
  const itemCount = items.length;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="pizza-container py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-pizza-primary font-bold text-2xl font-display">Pizzalicious</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLinks />
          </div>

          {/* Order Button & Cart */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/order">
              <Button className="bg-pizza-primary hover:bg-pizza-primary/90">Order Now</Button>
            </Link>
            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="text-pizza-dark" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-pizza-secondary text-white h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full">
                  {itemCount}
                </Badge>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="text-pizza-dark" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-pizza-secondary text-white h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full">
                  {itemCount}
                </Badge>
              )}
            </Link>
            <button onClick={toggleMenu} className="text-pizza-dark p-2">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t animate-fade-in">
            <div className="flex flex-col space-y-4">
              <NavLinks mobile onClick={() => setIsMenuOpen(false)} />
              <Link to="/order" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-pizza-primary hover:bg-pizza-primary/90">Order Now</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

interface NavLinksProps {
  mobile?: boolean;
  onClick?: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ mobile, onClick }) => {
  const links = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Promotions", path: "/promotions" },
    { name: "Feedback", path: "/feedback" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.name}
          to={link.path}
          className={`${
            mobile
              ? "block py-2 text-pizza-dark hover:text-pizza-primary"
              : "px-3 py-2 text-pizza-dark hover:text-pizza-primary"
          } font-medium transition-colors`}
          onClick={onClick}
        >
          {link.name}
        </Link>
      ))}
    </>
  );
};

export default Navbar;
