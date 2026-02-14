import type { SiteConfig } from "@/lib/types";

interface FooterProps {
    config: SiteConfig;
}

export default function Footer({ config }: FooterProps) {
    return (
        <footer className="snap-section min-h-[auto] py-16 border-t border-white/5 bg-black flex items-center">
            <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand */}
                    <div>
                        <h3 className="text-sm font-bold tracking-[0.25em] uppercase mb-4">
                            {config.site_name}
                        </h3>
                        <p className="text-xs text-foreground-dim leading-relaxed tracking-wide">
                            {config.footer_text}
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-foreground-muted mb-4">
                            导航
                        </h4>
                        <div className="flex flex-col gap-3">
                            {config.nav_links.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="text-xs tracking-[0.1em] text-foreground-dim hover:text-foreground transition-colors cursor-pointer"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-foreground-muted mb-4">
                            联系我们
                        </h4>
                        {config.contact_email && (
                            <a
                                href={`mailto:${config.contact_email}`}
                                className="text-xs tracking-[0.1em] text-foreground-dim hover:text-foreground transition-colors cursor-pointer"
                            >
                                {config.contact_email}
                            </a>
                        )}

                        {config.social_links && config.social_links.length > 0 && (
                            <div className="flex gap-4 mt-4">
                                {config.social_links.map((social) => (
                                    <a
                                        key={social.platform}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs tracking-[0.1em] text-foreground-dim hover:text-foreground transition-colors cursor-pointer uppercase"
                                    >
                                        {social.platform}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/5 pt-8 text-center">
                    <p className="text-[0.65rem] tracking-[0.15em] text-foreground-dim uppercase">
                        {config.footer_text}
                    </p>
                </div>
            </div>
        </footer>
    );
}
