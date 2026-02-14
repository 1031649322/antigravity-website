export const dynamic = "force-dynamic";
"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { HeroSection } from "@/lib/types";
import { Plus, Trash2, Save, Loader2, Upload, GripVertical, Eye, EyeOff } from "lucide-react";

export default function HeroManagePage() {
    const [sections, setSections] = useState<HeroSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const supabase = createClient();

    useEffect(() => {
        loadSections();
    }, []);

    async function loadSections() {
        const { data } = await supabase
            .from("hero_sections")
            .select("*")
            .order("sort_order", { ascending: true });
        if (data) setSections(data as HeroSection[]);
        setLoading(false);
    }

    async function handleSave() {
        setSaving(true);
        setMessage("");

        for (const section of sections) {
            await supabase
                .from("hero_sections")
                .update({
                    title: section.title,
                    subtitle: section.subtitle,
                    background_url: section.background_url,
                    background_type: section.background_type,
                    cta_text: section.cta_text,
                    cta_link: section.cta_link,
                    sort_order: section.sort_order,
                    is_active: section.is_active,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", section.id);
        }

        setSaving(false);
        setMessage("保存成功！");
        setTimeout(() => setMessage(""), 3000);
    }

    async function addSection() {
        const { data, error } = await supabase
            .from("hero_sections")
            .insert({
                title: "新区块标题",
                subtitle: "副标题",
                sort_order: sections.length,
            })
            .select()
            .single();

        if (data) {
            setSections([...sections, data as HeroSection]);
        }
    }

    async function deleteSection(id: string) {
        if (!confirm("确定删除此区块？")) return;
        await supabase.from("hero_sections").delete().eq("id", id);
        setSections(sections.filter((s) => s.id !== id));
    }

    function updateSection(id: string, field: string, value: unknown) {
        setSections(
            sections.map((s) => (s.id === id ? { ...s, [field]: value } : s))
        );
    }

    async function handleImageUpload(sectionId: string, file: File) {
        const fileName = `hero/${sectionId}-${Date.now()}.${file.name.split(".").pop()}`;
        const { data, error } = await supabase.storage
            .from("website-assets")
            .upload(fileName, file);

        if (data) {
            const { data: urlData } = supabase.storage
                .from("website-assets")
                .getPublicUrl(fileName);

            updateSection(sectionId, "background_url", urlData.publicUrl);
            updateSection(sectionId, "background_type", "image");
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-foreground-muted" size={32} />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold tracking-[0.1em] uppercase">
                    Hero 区块管理
                </h2>
                <div className="flex gap-3">
                    <button onClick={addSection} className="admin-btn admin-btn-secondary flex items-center gap-2">
                        <Plus size={14} />
                        新增区块
                    </button>
                    <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary flex items-center gap-2">
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        保存全部
                    </button>
                </div>
            </div>

            {message && (
                <div className="mb-6 p-3 rounded-lg text-sm bg-green-500/10 text-green-400">
                    {message}
                </div>
            )}

            <div className="space-y-6">
                {sections.map((section, index) => (
                    <HeroCard
                        key={section.id}
                        section={section}
                        index={index}
                        onUpdate={updateSection}
                        onDelete={deleteSection}
                        onUpload={handleImageUpload}
                    />
                ))}

                {sections.length === 0 && (
                    <div className="admin-card text-center py-12">
                        <p className="text-foreground-dim mb-4">暂无 Hero 区块</p>
                        <button onClick={addSection} className="admin-btn admin-btn-primary">
                            添加第一个区块
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function HeroCard({
    section,
    index,
    onUpdate,
    onDelete,
    onUpload,
}: {
    section: HeroSection;
    index: number;
    onUpdate: (id: string, field: string, value: unknown) => void;
    onDelete: (id: string) => void;
    onUpload: (id: string, file: File) => void;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="admin-card">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <GripVertical size={16} className="text-foreground-dim" />
                    <span className="text-xs tracking-[0.1em] uppercase text-foreground-dim">
                        区块 #{index + 1}
                    </span>
                    <button
                        onClick={() => onUpdate(section.id, "is_active", !section.is_active)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs cursor-pointer transition-all ${section.is_active
                            ? "bg-green-500/10 text-green-400"
                            : "bg-white/5 text-foreground-dim"
                            }`}
                    >
                        {section.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                        {section.is_active ? "已启用" : "已禁用"}
                    </button>
                </div>
                <button
                    onClick={() => onDelete(section.id)}
                    className="admin-btn admin-btn-danger flex items-center gap-2"
                >
                    <Trash2 size={14} />
                    删除
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs tracking-[0.1em] uppercase text-foreground-dim mb-2">
                        主标题
                    </label>
                    <input
                        type="text"
                        value={section.title}
                        onChange={(e) => onUpdate(section.id, "title", e.target.value)}
                        className="admin-input"
                    />
                </div>
                <div>
                    <label className="block text-xs tracking-[0.1em] uppercase text-foreground-dim mb-2">
                        副标题
                    </label>
                    <input
                        type="text"
                        value={section.subtitle || ""}
                        onChange={(e) => onUpdate(section.id, "subtitle", e.target.value)}
                        className="admin-input"
                    />
                </div>
                <div>
                    <label className="block text-xs tracking-[0.1em] uppercase text-foreground-dim mb-2">
                        CTA 按钮文字
                    </label>
                    <input
                        type="text"
                        value={section.cta_text || ""}
                        onChange={(e) => onUpdate(section.id, "cta_text", e.target.value)}
                        className="admin-input"
                    />
                </div>
                <div>
                    <label className="block text-xs tracking-[0.1em] uppercase text-foreground-dim mb-2">
                        CTA 按钮链接
                    </label>
                    <input
                        type="text"
                        value={section.cta_link || ""}
                        onChange={(e) => onUpdate(section.id, "cta_link", e.target.value)}
                        className="admin-input"
                    />
                </div>
            </div>

            {/* Background Image */}
            <div className="mt-4">
                <label className="block text-xs tracking-[0.1em] uppercase text-foreground-dim mb-2">
                    背景图片
                </label>
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        value={section.background_url || ""}
                        onChange={(e) => onUpdate(section.id, "background_url", e.target.value)}
                        className="admin-input flex-1"
                        placeholder="图片 URL 或点击上传"
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onUpload(section.id, file);
                        }}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="admin-btn admin-btn-secondary flex items-center gap-2"
                    >
                        <Upload size={14} />
                        上传
                    </button>
                </div>
                {section.background_url && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-white/10">
                        <img
                            src={section.background_url}
                            alt="预览"
                            className="w-full h-32 object-cover"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
