import React from 'react';
import { SchoolLogo } from './ui/SchoolLogo';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer id="contact" className="bg-primary-950 text-white border-t border-primary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <SchoolLogo className="w-10 h-10 bg-white rounded-lg" />
              <div>
                <h2 className="font-heading font-bold text-lg leading-tight text-white">
                  SHKSC Clubs
                </h2>
              </div>
            </div>
            <p className="text-primary-100/70 text-sm leading-relaxed mb-6">
              The official digital portal for SHKSC club admissions and management. Discover your passion and build your future with us.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-primary-100/70 hover:text-white transition-colors text-sm">Home</Link></li>
              <li><Link to="/clubs" className="text-primary-100/70 hover:text-white transition-colors text-sm">Clubs</Link></li>
              <li><a href="/#achievements" className="text-primary-100/70 hover:text-white transition-colors text-sm">Achievements</a></li>
              <li><Link to="/registration" className="text-primary-100/70 hover:text-white transition-colors text-sm">Registration</Link></li>
              <li><a href="/#about" className="text-primary-100/70 hover:text-white transition-colors text-sm">About</a></li>
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6">Useful Links</h3>
            <ul className="space-y-3">
              <li><Link to="/login" className="text-primary-100/70 hover:text-white transition-colors text-sm">Portal Login</Link></li>
              <li><a href="mailto:info.shksc@gmail.com" className="text-primary-100/70 hover:text-white transition-colors text-sm">Contact Us</a></li>
              <li><a href="https://shksc.edu.bd" target="_blank" rel="noopener noreferrer" className="text-primary-100/70 hover:text-white transition-colors text-sm">School Website</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6">Contact</h3>
            <address className="not-italic space-y-3 text-sm text-primary-100/70">
              <p>Shamsul Hoque Khan School & College,<br />Ward-65, DSCC, Matuail, Demra, Dhaka-1362</p>
              <p>
                <a href="mailto:info.shksc@gmail.com" className="hover:text-white transition-colors">info.shksc@gmail.com</a>
              </p>
              <p>
                EIIN: 107915 · School Code: 1155<br />College Code: 1062
              </p>
            </address>
          </div>

        </div>

        <div className="border-t border-primary-800 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-primary-100/50 text-sm flex flex-col sm:flex-row gap-2 sm:gap-8 items-center text-center sm:text-left">
            <p>&copy; {new Date().getFullYear()} SHKSC. All Rights Reserved.</p>
            <div className="flex items-center gap-2">
              <span className="opacity-70">Contact with developer:</span>
              <a 
                href="https://wa.me/8801518657869" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1.5 text-green-400 hover:text-green-300 transition-colors font-medium"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                01518657869
              </a>
            </div>
          </div>
          <a href="https://shksc.edu.bd" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary-100/70 hover:text-white transition-colors">
            shksc.edu.bd
          </a>
        </div>
      </div>
    </footer>
  );
}
