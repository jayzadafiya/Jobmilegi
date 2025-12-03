"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("navigation");

  const navItems = [
    { key: "home", href: "/" },
    { key: "jobs", href: "/jobs" },
    { key: "admitCard", href: "/jobs?type=admitCard" },
    { key: "results", href: "/jobs?type=result" },
    { key: "answerKey", href: "/jobs?type=answerKey" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-navy-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-accent-400 rounded-lg p-2">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
              </svg>
            </div>
            <div>
              <div className="text-xl font-bold text-white">JobMilegi.in</div>
              <div className="text-xs text-gray-300">सरकारी नौकरी</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="text-gray-200 hover:text-accent-400 transition-colors font-medium"
              >
                {t(item.key)}
              </Link>
            ))}
            <LanguageSwitcher />
            <Link
              href="/admin/login"
              className="bg-accent-400 hover:bg-accent-500 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {t("admin")}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-200 hover:text-white p-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-navy-800">
            <div className="py-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="block px-3 py-2 text-gray-200 hover:text-accent-400 hover:bg-navy-800 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(item.key)}
                </Link>
              ))}
              <Link
                href="/admin/login"
                className="block px-3 py-2 text-accent-400 hover:bg-navy-800 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("admin")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
