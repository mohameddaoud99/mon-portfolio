import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 shadow-md backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        <a href="#" className="text-2xl font-bold text-portfolio-blue">
          Portfolio
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <a
            href="#about"
            className="text-portfolio-dark-gray hover:text-portfolio-blue transition-colors"
          >
            About
          </a>
          <a
            href="#education"
            className="text-portfolio-dark-gray hover:text-portfolio-blue transition-colors"
          >
            Education
          </a>
          <a
            href="#experience"
            className="text-portfolio-dark-gray hover:text-portfolio-blue transition-colors"
          >
            Experience
          </a>
          <a
            href="#certifications"
            className="text-portfolio-dark-gray hover:text-portfolio-blue transition-colors"
          >
            Certifications
          </a>
          <a
            href="#projects"
            className="text-portfolio-dark-gray hover:text-portfolio-blue transition-colors"
          >
            Projects
          </a>
          <a
            href="#contact"
            className="text-portfolio-dark-gray hover:text-portfolio-blue transition-colors"
          >
            Contact
          </a>
        </nav>

        {/* Admin Button */}
        <div className="hidden md:block">
          {/* <Button variant="outline" className="bg-transparent border-portfolio-blue text-portfolio-blue hover:bg-portfolio-blue hover:text-white">
            <a href="/admin">Admin</a>
          </Button> */}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-portfolio-dark-gray">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <a
                href="#about"
                onClick={closeMenu}
                className="text-portfolio-dark-gray hover:text-portfolio-blue transition-colors py-2"
              >
                About
              </a>
              <a
                href="#education"
                onClick={closeMenu}
                className="text-portfolio-dark-gray hover:text-portfolio-blue transition-colors py-2"
              >
                Education
              </a>
              <a
                href="#experience"
                onClick={closeMenu}
                className="text-portfolio-dark-gray hover:text-portfolio-blue transition-colors py-2"
              >
                Experience
              </a>
              <a
                href="#certifications"
                onClick={closeMenu}
                className="text-portfolio-dark-gray hover:text-portfolio-blue transition-colors py-2"
              >
                Certifications
              </a>
              <a
                href="#projects"
                onClick={closeMenu}
                className="text-portfolio-dark-gray hover:text-portfolio-blue transition-colors py-2"
              >
                Projects
              </a>
              <a
                href="#contact"
                onClick={closeMenu}
                className="text-portfolio-dark-gray hover:text-portfolio-blue transition-colors py-2"
              >
                Contact
              </a>
              <Button
                variant="outline"
                className="bg-transparent border-portfolio-blue text-portfolio-blue hover:bg-portfolio-blue hover:text-white w-full"
              >
                <a href="/admin">Admin</a>
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
