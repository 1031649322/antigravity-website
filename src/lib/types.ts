export interface SiteConfig {
    id: string;
    site_name: string;
    logo_url: string | null;
    nav_links: NavLink[];
    footer_text: string;
    contact_email: string | null;
    social_links: SocialLink[];
    created_at: string;
    updated_at: string;
}

export interface NavLink {
    label: string;
    href: string;
}

export interface SocialLink {
    platform: string;
    url: string;
    icon: string;
}

export interface HeroSection {
    id: string;
    title: string;
    subtitle: string | null;
    background_url: string | null;
    background_type: "image" | "video";
    cta_text: string | null;
    cta_link: string | null;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: string;
    name: string;
    description: string | null;
    detail_content: string | null;
    cover_image_url: string | null;
    gallery_urls: string[];
    specs: Record<string, string>;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
