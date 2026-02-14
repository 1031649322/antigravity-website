import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Product } from "@/lib/types";

export const revalidate = 60;

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: product } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

    if (!product) {
        notFound();
    }

    const p = product as Product;

    return (
        <main className="min-h-screen bg-black text-foreground">
            {/* Hero */}
            <section
                className="relative h-[70vh] flex items-end"
                style={
                    p.cover_image_url
                        ? {
                            backgroundImage: `url(${p.cover_image_url})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }
                        : {
                            background:
                                "radial-gradient(ellipse at 50% 30%, rgba(30, 58, 138, 0.2) 0%, rgba(0,0,0,1) 70%)",
                        }
                }
            >
                {p.cover_image_url && <div className="bg-overlay" />}
                <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-10 pb-16">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-foreground-muted hover:text-foreground transition-colors cursor-pointer mb-8"
                    >
                        <ArrowLeft size={16} />
                        返回首页
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-[0.06em] uppercase animate-fade-up">
                        {p.name}
                    </h1>
                    {p.description && (
                        <p className="text-lg md:text-xl font-light tracking-[0.08em] text-foreground-muted mt-4 max-w-2xl animate-fade-up-delay-1">
                            {p.description}
                        </p>
                    )}
                </div>
            </section>

            {/* Content */}
            <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-20">
                {/* Detail Content */}
                {p.detail_content && (
                    <div className="max-w-3xl">
                        <div className="prose prose-invert prose-lg">
                            {p.detail_content.split("\n").map((line, i) => (
                                <p key={i} className="text-foreground-muted leading-relaxed mb-4">
                                    {line}
                                </p>
                            ))}
                        </div>
                    </div>
                )}

                {/* Specs */}
                {p.specs && Object.keys(p.specs).length > 0 && (
                    <div className="mt-20">
                        <h2 className="text-2xl font-bold tracking-[0.1em] uppercase mb-10">
                            技术参数
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.entries(p.specs).map(([key, value]) => (
                                <div
                                    key={key}
                                    className="border border-white/10 p-6 rounded-lg"
                                >
                                    <div className="text-xs tracking-[0.15em] uppercase text-foreground-dim mb-2">
                                        {key}
                                    </div>
                                    <div className="text-lg font-semibold">{value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Gallery */}
                {p.gallery_urls && p.gallery_urls.length > 0 && (
                    <div className="mt-20">
                        <h2 className="text-2xl font-bold tracking-[0.1em] uppercase mb-10">
                            图片画廊
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {p.gallery_urls.map((url, i) => (
                                <div
                                    key={i}
                                    className="aspect-video overflow-hidden rounded-lg"
                                >
                                    <img
                                        src={url}
                                        alt={`${p.name} - ${i + 1}`}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Placeholder message if no content */}
                {!p.detail_content &&
                    (!p.specs || Object.keys(p.specs).length === 0) && (
                        <div className="text-center py-20">
                            <p className="text-foreground-dim tracking-[0.1em] text-lg">
                                产品详情即将发布，敬请期待
                            </p>
                        </div>
                    )}
            </section>
        </main>
    );
}
