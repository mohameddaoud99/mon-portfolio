import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-portfolio-dark-blue text-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand/Logo section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Portfolio</h3>
            <p className="text-gray-300">
              Crafting beautiful web experiences with modern technologies.
            </p>
            <p className="text-gray-300">Ariana, Tunisia</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <a
                href="#about"
                className="text-gray-300 hover:text-white transition-colors"
              >
                About
              </a>
              <a
                href="#education"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Education
              </a>
              <a
                href="#experience"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Experience
              </a>
              <a
                href="#certifications"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Certifications
              </a>
              <a
                href="#projects"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Projects
              </a>
              <a
                href="#contact"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Contact
              </a>
            </nav>
          </div>

          {/* Connect section */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Connect</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors p-2 border border-gray-700 rounded-full"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors p-2 border border-gray-700 rounded-full"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124-4.09-.193-7.715-2.157-10.141-5.126-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-13.995 0-.21 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors p-2 border border-gray-700 rounded-full"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667h-3.552v-11.452h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zm-15.11-13.019c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019h-3.564v-11.452h3.564v11.452z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors p-2 border border-gray-700 rounded-full"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
            <div className="mt-4">
              <p className="text-gray-300">
                Email: mohamed.tijani.daoud@gmail.com
              </p>
              <p className="text-gray-300">Phone: +(216) 54040502</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-300">
          <p>© {currentYear} Portfolio. All rights reserved.</p>
          <p className="mt-2 text-sm">
            <a href="#" className="hover:text-white underline">
              Privacy Policy
            </a>{" "}
            ·
            <a href="#" className="hover:text-white underline ml-4">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
