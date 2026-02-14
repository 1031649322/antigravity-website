"use client";

import { useRef, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { HeroSection as HeroSectionType } from "@/lib/types";

interface HeroSectionProps {
    section: HeroSectionType;
    isFirst?: boolean;
}

export default function HeroSection({ section, isFirst }: HeroSectionProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const backgroundStyle = section.background_url
        ? {
            backgroundImage: `url(${section.background_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        }
        : {};

    return (
        <section
            ref={sectionRef}
            className="snap-section"
            style={backgroundStyle}
        >
            {/* Default gradient background when no image */}
            {!section.background_url && (
                <div
                    className="absolute inset-0"
                    style={{
                        background: isFirst
                            ? "radial-gradient(ellipse at 50% 30%, rgba(30, 58, 138, 0.2) 0%, rgba(0,0,0,1) 70%)"
                            : "radial-gradient(ellipse at 50% 60%, rgba(15, 23, 42, 0.3) 0%, rgba(0,0,0,1) 70%)",
                    }}
                />
            )}

            {/* Video background */}
            {section.background_type === "video" && section.background_url && (
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src={section.background_url} type="video/mp4" />
                </video>
            )}

            {/* Overlay */}
            <div className="bg-overlay" />

            {/* Content */}
            <div
                className={`relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center ${isVisible ? "" : "opacity-0"
                    }`}
            >
                <h1
                    className={`text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-[0.08em] uppercase leading-tight mb-4 ${isVisible ? "animate-fade-up" : ""
                        }`}
                >
                    {section.title}
                </h1>

                {section.subtitle && (
                    <p
                        className={`text-base md:text-xl font-light tracking-[0.15em] uppercase text-foreground-muted mb-10 ${isVisible ? "animate-fade-up-delay-1" : ""
                            }`}
                    >
                        {section.subtitle}
                    </p>
                )}

                {section.cta_text && section.cta_link && (
                    <a
                        href={section.cta_link}
                        className={`cta-button ${isVisible ? "animate-fade-up-delay-2" : ""}`}
                    >
                        {section.cta_text}
                    </a>
                )}
            </div>

            {/* Scroll indicator - only on first section */}
            {isFirst && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 scroll-indicator">
                    <ChevronDown size={28} className="text-foreground-muted" />
                </div>
            )}
        </section>
    );
}
