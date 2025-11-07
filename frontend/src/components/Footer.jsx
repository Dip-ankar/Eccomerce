import React from "react";
import {
  Phone,
  Mail,
  GitHub,
  LinkedIn,
  Instagram,
  Facebook,
  Twitter,
} from "@mui/icons-material";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-6 md:px-16">
      {/* Main sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 border-b border-gray-700 pb-8">
        {/* Section 1 - Contact */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Contact Us</h3>
          <p className="flex items-center gap-2 mb-2">
            <Phone className="text-blue-400" />
            <span>Phone: +91 xxxxxxxxxxxx</span>
          </p>
          <p className="flex items-center gap-2">
            <Mail className="text-blue-400" />
            <span>Email: abc@gmail.com</span>
          </p>
        </div>

        {/* Section 2 - Social Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Follow Me</h3>
          <div className="flex gap-4">
            <a
              href="#"
              target="_blank"
              className="hover:text-blue-400 transition-colors duration-300"
            >
              <GitHub />
            </a>
            <a
              href="#"
              target="_blank"
              className="hover:text-blue-400 transition-colors duration-300"
            >
              <LinkedIn />
            </a>
            <a
              href="#"
              target="_blank"
              className="hover:text-blue-400 transition-colors duration-300"
            >
              <Twitter />
            </a>
            <a
              href="#"
              target="_blank"
              className="hover:text-blue-400 transition-colors duration-300"
            >
              <Instagram />
            </a>
            <a
              href="#"
              target="_blank"
              className="hover:text-blue-400 transition-colors duration-300"
            >
              <Facebook />
            </a>
          </div>
        </div>

        {/* Section 3 - About */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">About</h3>
          <p className="text-sm leading-relaxed">
            Providing high-quality web development and design solutions to help
            you build an impactful online presence.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="text-center text-sm text-gray-500 mt-6">
        <p>&copy; 2025 Dipankar Mandal. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
