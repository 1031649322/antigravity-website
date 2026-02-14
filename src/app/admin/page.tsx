import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Image, Package, Settings } from "lucide-react";

export default async function AdminDashboard() {
    const supabase = await createClient();

    const [heroRes, productsRes] = await Promise.all([
        supabase.from("hero_sections").select("id", { count: "exact" }),
        supabase.from("products").select("id", { count: "exact" }),
    ]);

    const stats = [
        {
            label: "Hero 区块",
            count: heroRes.count || 0,
            href: "/admin/hero",
            icon: Image,
        },
        {
            label: "产品",
            count: productsRes.count || 0,
            href: "/admin/products",
            icon: Package,
        },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold tracking-[0.1em] uppercase mb-8">
                仪表盘
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {stats.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className="admin-card flex items-center gap-5 cursor-pointer group"
                    >
                        <div className="p-3 rounded-lg bg-white/5 group-hover:bg-accent/20 transition-colors">
                            <stat.icon size={24} className="text-foreground-muted group-hover:text-accent transition-colors" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold">{stat.count}</div>
                            <div className="text-xs tracking-[0.1em] uppercase text-foreground-dim">
                                {stat.label}
                            </div>
                        </div>
                    </Link>
                ))}

                <Link
                    href="/admin/site-config"
                    className="admin-card flex items-center gap-5 cursor-pointer group"
                >
                    <div className="p-3 rounded-lg bg-white/5 group-hover:bg-accent/20 transition-colors">
                        <Settings size={24} className="text-foreground-muted group-hover:text-accent transition-colors" />
                    </div>
                    <div>
                        <div className="text-sm font-semibold">站点配置</div>
                        <div className="text-xs tracking-[0.1em] text-foreground-dim mt-1">
                            编辑网站基本信息
                        </div>
                    </div>
                </Link>
            </div>

            <div className="admin-card">
                <h3 className="text-sm font-semibold tracking-[0.1em] uppercase mb-4">
                    快速指南
                </h3>
                <div className="space-y-3 text-sm text-foreground-muted">
                    <p>• 在 <strong>Hero 区块</strong> 中管理首页的全屏背景区块</p>
                    <p>• 在 <strong>产品管理</strong> 中添加、编辑或删除产品信息</p>
                    <p>• 在 <strong>站点配置</strong> 中修改网站名称、导航、联系信息</p>
                    <p>• 上传图片后，内容会在约 60 秒内在前台更新</p>
                </div>
            </div>
        </div>
    );
}
