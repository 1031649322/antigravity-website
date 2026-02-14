"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/types";

interface ProductSectionProps {
    product: Product;
    index: number;
}

export default function ProductSection({ product, index }: ProductSectionProps) {
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

    const isEven = index % 2 === 0;

    const backgroundStyle = product.cover_image_url
        ? {
            backgroundImage: `url(${product.cover_image_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        }
        : {};

    return (
        <section
            ref={sectionRef}
            id={`product-${product.id}`}
            className="snap-section"
            style={backgroundStyle}
        >
            {/* Default gradient background */}
            {!product.cover_image_url && (
                <div
                    className="absolute inset-0"
                    style={{
                        background: isEven
                            ? "radial-gradient(ellipse at 30% 50%, rgba(30, 64, 100, 0.15) 0%, rgba(0,0,0,1) 65%)"
                            : "radial-gradient(ellipse at 70% 50%, rgba(55, 30, 80, 0.15) 0%, rgba(0,0,0,1) 65%)",
                    }}
                />
            )}

            {/* Overlay */}
            {product.cover_image_url && <div className="bg-overlay" />}

            {/* Content */}
            <div
                className={`relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-10 flex flex-col ${isEven ? "items-center text-center" : "items-center text-center"
                    } ${isVisible ? "" : "opacity-0"}`}
            >
                <h2
                    className={`text-4xl md:text-6xl lg:text-7xl font-bold tracking-[0.06em] uppercase mb-4 ${isVisible ? "animate-fade-up" : ""
                        }`}
                >
                    {product.name}
                </h2>

                {product.description && (
                    <p
                        className={`text-sm md:text-lg font-light tracking-[0.1em] text-foreground-muted max-w-xl mb-10 ${isVisible ? "animate-fade-up-delay-1" : ""
                            }`}
                    >
                        {product.description}
                    </p>
                )}

                <div
                    className={`flex gap-4 flex-wrap justify-center ${isVisible ? "animate-fade-up-delay-2" : ""
                        }`}
                >
                    <Link
                        href={`/products/${product.id}`}
                        className="cta-button-primary cta-button"
                    >
                        了解更多
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
