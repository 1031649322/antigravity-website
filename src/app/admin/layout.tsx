import Link from "next/link";
import { LayoutDashboard, Image, Package, Settings, ArrowLeft } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const navItems = [
        { label: "仪表盘", href: "/admin", icon: LayoutDashboard },
        { label: "Hero 区块", href: "/admin/hero", icon: Image },
        { label: "产品管理", href: "/admin/products", icon: Package },
        { label: "站点配置", href: "/admin/site-config", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-black flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/8 flex flex-col shrink-0">
                <div className="p-6 border-b border-white/8">
                    <Link href="/" className="flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors cursor-pointer">
                        <ArrowLeft size={14} />
                        <span className="text-xs tracking-[0.15em] uppercase">返回网站</span>
                    </Link>
                    <h1 className="text-sm font-bold tracking-[0.2em] uppercase mt-4">
                        管理后台
                    </h1>
                </div>

                <nav className="flex-1 p-4">
                    <div className="flex flex-col gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground-muted hover:text-foreground hover:bg-white/5 transition-all cursor-pointer group"
                            >
                                <item.icon size={18} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                                <span className="text-sm tracking-wide">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-5xl mx-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
