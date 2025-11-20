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
    <footer className="bg-gray-900 text-gray-300 pt-12 px-6 md:px-16">
      {/* Main Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 border-b border-gray-800 pb-10">

        {/* Contact Section */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Contact Us</h3>

          <p className="flex items-center gap-3 text-gray-400 hover:text-gray-200 transition">
            <Phone className="text-blue-400" />
            <span>+91 xxxxxxxxxxxx</span>
          </p>

          <p className="flex items-center gap-3 mt-2 text-gray-400 hover:text-gray-200 transition">
            <Mail className="text-blue-400" />
            <span>abc@gmail.com</span>
          </p>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Follow Me</h3>

          <div className="flex gap-5">
            {[GitHub, LinkedIn, Twitter, Instagram, Facebook].map((Icon, i) => (
              <a
                key={i}
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-transform duration-300 hover:scale-110"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* About */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">About</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Providing high-quality web development and design solutions to help
            you build an impactful online presence.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center py-5">
        <p className="text-gray-500 text-sm">
          &copy; 2025 <span className="text-blue-400">Dipankar Mandal</span>. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
