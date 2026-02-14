import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";
import type { SiteConfig, HeroSection as HeroSectionType, Product } from "@/lib/types";

export const revalidate = 60; // ISR - 每60秒重新验证

export default async function HomePage() {
  const supabase = await createClient();

  // 并行获取数据
  const [configRes, heroRes, productsRes] = await Promise.all([
    supabase.from("site_config").select("*").limit(1).single(),
    supabase
      .from("hero_sections")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
  ]);

  const config = configRes.data as SiteConfig;
  const heroSections = (heroRes.data || []) as HeroSectionType[];
  const products = (productsRes.data || []) as Product[];

  return (
    <main>
      {/* Navigation */}
      <Navbar
        siteName={config?.site_name || "ANTIGRAVITY"}
        logoUrl={config?.logo_url}
        navLinks={config?.nav_links || []}
      />

      {/* Hero Sections */}
      {heroSections.map((section, index) => (
        <HeroSection
          key={section.id}
          section={section}
          isFirst={index === 0}
        />
      ))}

      {/* Products */}
      <div id="products">
        {products.map((product, index) => (
          <ProductSection
            key={product.id}
            product={product}
            index={index}
          />
        ))}
      </div>

      {/* Footer */}
      {config && <Footer config={config} />}
    </main>
  );
}
