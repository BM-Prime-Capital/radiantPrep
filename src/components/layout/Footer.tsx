import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

interface FooterProps {
  isAuthenticated?: boolean;
}

export const Footer = ({ isAuthenticated }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "Linkedin", href: "#", icon: Linkedin },
    { name: "Instagram", href: "#", icon: Instagram },
  ];

  return (
    <footer className="bg-footer text-white">
      <div className="container mx-auto px-6 py-16 text-center flex flex-col items-center space-y-8">
        {/* Logo CompleMetrics */}
        {/* <img
          src="/logo-complemetrics.png"
          alt="CompleMetrics Logo"
          className="h-12 w-auto drop-shadow-sm"
        /> */}
        <img
  src="/logo-complemetrics.png"
  alt="CompleMetrics Logo"
  className="h-12 w-auto drop-shadow-lg brightness-110 hover:scale-105 transition-transform duration-300"
/>


        {/* "by Radiant Prep" avec logo */}
        <div className="flex items-center space-x-2">
          <span className="text-sm sm:text-base text-[#1E9B3B] tracking-wide drop-shadow-sm">
            by
          </span>
          <img
            src="/newlogo.png"
            alt="Radiant Prep Logo"
            className="h-8 sm:h-10 w-auto drop-shadow-md"
          />
          <span className="text-sm sm:text-base font-semibold text-[#1E9B3B] drop-shadow-sm">
            Radiant Prep
          </span>
        </div>

        {/* Contact Info */}
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-sm text-white/80">
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-accent" />
            <span>(929) 503-5398</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-accent" />
            <span>learn@radiantprep.com</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-accent" />
            <span>New York Metro Region</span>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex space-x-6 mt-4">
          {socialLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-white/60 hover:text-accent transition"
              aria-label={item.name}
            >
              <item.icon className="h-5 w-5" />
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-xs text-white/50 pt-6 border-t border-white/10 w-full">
          © {currentYear} Radiant Prep. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
