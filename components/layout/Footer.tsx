import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Linkedin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#1a1a1a] text-slate-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left Column - Logo and Tagline */}
          <div className="space-y-4">
            <Image
              src="https://startguides.net/wp-content/uploads/2023/07/cropped-StartGuides_Logo_whiteType-1.png"
              alt="StartGuides Logo"
              width={220}
              height={26}
              className="h-8 w-auto"
            />
            <p className="text-sm leading-relaxed max-w-xs">
              A user&apos;s approach to information and training.
              <br />
              Cut out the noise and get started fast.
            </p>
          </div>

          {/* Middle Column - Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-white text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3 text-base">
              <li>
                <a
                  href="https://startguides.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-600 transition-colors"
                >
                  Company
                </a>
              </li>
              <li>
                <a
                  href="https://startguides.net/approach"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-600 transition-colors"
                >
                  Approach
                </a>
              </li>
              <li>
                <a
                  href="https://startguides.net/products"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-600 transition-colors"
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  href="https://startguides.net/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-600 transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <Link href="/" className="hover:text-orange-600 transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Column - Let's Connect */}
          <div>
            <h3 className="font-heading font-semibold text-white text-lg mb-6">Let&apos;s Connect!</h3>
            <a
              href="https://www.linkedin.com/company/startguides"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-600 hover:bg-orange-700 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6 text-white" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Copyright */}
      <div className="border-t border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-sm text-slate-400">
            Copyright © {currentYear} StartGuides, LLC
          </p>
        </div>
      </div>
    </footer>
  );
}
