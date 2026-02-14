export const dynamic = "force-dynamic";
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SiteConfig, NavLink } from "@/lib/types";
import { Save, Plus, Trash2, Loader2 } from "lucide-react";

export default function SiteConfigPage() {
    const [config, setConfig] = useState<SiteConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const supabase = createClient();

    useEffect(() => {
        loadConfig();
    }, []);

    async function loadConfig() {
        const { data } = await supabase
            .from("site_config")
            .select("*")
            .limit(1)
            .single();
        if (data) setConfig(data as SiteConfig);
        setLoading(false);
    }

    async function handleSave() {
        if (!config) return;
        setSaving(true);
        setMessage("");

        const { error } = await supabase
            .from("site_config")
            .update({
                site_name: config.site_name,
                logo_url: config.logo_url,
                nav_links: config.nav_links,
                footer_text: config.footer_text,
                contact_email: config.contact_email,
                social_links: config.social_links,
                updated_at: new Date().toISOString(),
            })
            .eq("id", config.id);

        setSaving(false);
        setMessage(error ? `保存失败: ${error.message}` : "保存成功！");
        setTimeout(() => setMessage(""), 3000);
    }

    function addNavLink() {
        if (!config) return;
        setConfig({
            ...config,
            nav_links: [...config.nav_links, { label: "", href: "" }],
        });
    }

    function updateNavLink(index: number, field: keyof NavLink, value: string) {
        if (!config) return;
        const links = [...config.nav_links];
        links[index] = { ...links[index], [field]: value };
        setConfig({ ...config, nav_links: links });
    }

    function removeNavLink(index: number) {
        if (!config) return;
        setConfig({
            ...config,
            nav_links: config.nav_links.filter((_, i) => i !== index),
        });
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-foreground-muted" size={32} />
            </div>
        );
    }

    if (!config) {
        return <div className="text-foreground-muted">未找到站点配置</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold tracking-[0.1em] uppercase">
                    站点配置
                </h2>
                <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary flex items-center gap-2">
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    保存
                </button>
            </div>

            {message && (
                <div className={`mb-6 p-3 rounded-lg text-sm ${message.includes("失败") ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"}`}>
                    {message}
                </div>
            )}

            <div className="space-y-8">
                {/* Basic Info */}
                <div className="admin-card">
                    <h3 className="text-sm font-semibold tracking-[0.1em] uppercase mb-6">
                        基本信息
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs tracking-[0.1em] uppercase text-foreground-dim mb-2">
                                网站名称
                            </label>
                            <input
                                type="text"
                                value={config.site_name}
                                onChange={(e) => setConfig({ ...config, site_name: e.target.value })}
                                className="admin-input"
                            />
                        </div>
                        <div>
                            <label className="block text-xs tracking-[0.1em] uppercase text-foreground-dim mb-2">
                                Logo URL
                            </label>
                            <input
                                type="text"
                                value={config.logo_url || ""}
                                onChange={(e) => setConfig({ ...config, logo_url: e.target.value })}
                                className="admin-input"
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs tracking-[0.1em] uppercase text-foreground-dim mb-2">
                                联系邮箱
                            </label>
                            <input
                                type="email"
                                value={config.contact_email || ""}
                                onChange={(e) => setConfig({ ...config, contact_email: e.target.value })}
                                className="admin-input"
                                placeholder="contact@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs tracking-[0.1em] uppercase text-foreground-dim mb-2">
                                页脚文字
                            </label>
                            <input
                                type="text"
                                value={config.footer_text}
                                onChange={(e) => setConfig({ ...config, footer_text: e.target.value })}
                                className="admin-input"
                            />
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="admin-card">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-semibold tracking-[0.1em] uppercase">
                            导航链接
                        </h3>
                        <button onClick={addNavLink} className="admin-btn admin-btn-secondary flex items-center gap-2">
                            <Plus size={14} />
                            添加
                        </button>
                    </div>
                    <div className="space-y-3">
                        {config.nav_links.map((link, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={link.label}
                                    onChange={(e) => updateNavLink(index, "label", e.target.value)}
                                    className="admin-input flex-1"
                                    placeholder="标签名称"
                                />
                                <input
                                    type="text"
                                    value={link.href}
                                    onChange={(e) => updateNavLink(index, "href", e.target.value)}
                                    className="admin-input flex-1"
                                    placeholder="链接地址"
                                />
                                <button
                                    onClick={() => removeNavLink(index)}
                                    className="p-2 text-red-400 hover:text-red-300 cursor-pointer transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        {config.nav_links.length === 0 && (
                            <p className="text-sm text-foreground-dim">暂无导航链接</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
