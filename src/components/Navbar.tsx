"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { NavLink } from "@/lib/types";
import { Menu, X } from "lucide-react";

interface NavbarProps {
    siteName: string;
    logoUrl?: string | null;
    navLinks: NavLink[];
}

export default function Navbar({ siteName, logoUrl, navLinks }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                    ? "nav-blur bg-black/70 border-b border-white/5"
                    : "bg-transparent"
                }`}
        >
            <div className="mx-auto max-w-[1400px] px-6 md:px-10 flex items-center justify-between h-[72px]">
                {/* Logo / Site Name */}
                <Link
                    href="/"
                    className="flex items-center gap-3 cursor-pointer group"
                >
                    {logoUrl && (
                        <img
                            src={logoUrl}
                            alt={siteName}
                            className="h-8 w-auto"
                        />
                    )}
                    <span className="text-[0.95rem] font-bold tracking-[0.25em] uppercase text-foreground group-hover:text-foreground-muted transition-colors duration-300">
                        {siteName}
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-[0.75rem] font-semibold tracking-[0.2em] uppercase text-foreground-muted hover:text-foreground transition-colors duration-300 cursor-pointer"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-foreground cursor-pointer p-2"
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden nav-blur bg-black/90 border-t border-white/5">
                    <div className="px-6 py-6 flex flex-col gap-5">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className="text-[0.8rem] font-semibold tracking-[0.2em] uppercase text-foreground-muted hover:text-foreground transition-colors cursor-pointer"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
