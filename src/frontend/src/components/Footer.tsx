import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type React from "react";
import { SiFacebook, SiInstagram, SiX, SiYoutube } from "react-icons/si";

const FooterLink = ({ children }: { children: React.ReactNode }) => (
  <span className="cursor-pointer hover:text-white transition-colors">
    {children}
  </span>
);

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold mb-4">About</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <FooterLink>About ShopMart</FooterLink>
              </li>
              <li>
                <FooterLink>Careers</FooterLink>
              </li>
              <li>
                <FooterLink>Press</FooterLink>
              </li>
              <li>
                <FooterLink>Investors</FooterLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Help</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <FooterLink>Payments</FooterLink>
              </li>
              <li>
                <FooterLink>Shipping</FooterLink>
              </li>
              <li>
                <FooterLink>Returns</FooterLink>
              </li>
              <li>
                <FooterLink>FAQ</FooterLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Policy</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <FooterLink>Privacy Policy</FooterLink>
              </li>
              <li>
                <FooterLink>Terms of Use</FooterLink>
              </li>
              <li>
                <FooterLink>Return Policy</FooterLink>
              </li>
              <li>
                <FooterLink>Security</FooterLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Social</h3>
            <div className="flex gap-3 mb-4">
              <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <SiFacebook className="h-5 w-5" />
              </span>
              <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <SiInstagram className="h-5 w-5" />
              </span>
              <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <SiX className="h-5 w-5" />
              </span>
              <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <SiYoutube className="h-5 w-5" />
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">We accept</p>
              <div className="flex gap-2 flex-wrap">
                {["Visa", "Mastercard", "UPI", "NetBanking"].map((p) => (
                  <span
                    key={p}
                    className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-sm text-gray-500">
            © {year} ShopMart. All rights reserved.
          </p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
          >
            Built with <Heart className="h-3 w-3 text-red-400" /> using
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
