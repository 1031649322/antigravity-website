"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/lib/types";
import { Plus, Trash2, Save, Loader2, Upload, Eye, EyeOff, Edit3, X } from "lucide-react";

export default function ProductsManagePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [message, setMessage] = useState("");

    const supabase = createClient();

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        const { data } = await supabase
            .from("products")
            .select("*")
            .order("sort_order", { ascending: true });
        if (data) setProducts(data as Product[]);
        setLoading(false);
    }

    async function addProduct() {
        const { data } = await supabase
            .from("products")
            .insert({
                name: "新产品",
                description: "产品描述",
                sort_order: products.length,
            })
            .select()
            .single();

        if (data) {
            setProducts([...products, data as Product]);
            setEditingId(data.id);
        }
    }

    async function deleteProduct(id: string) {
        if (!confirm("确定删除此产品？")) return;
        await supabase.from("products").delete().eq("id", id);
        setProducts(products.filter((p) => p.id !== id));
    }

    async function saveProduct(product: Product) {
        const { error } = await supabase
            .from("products")
            .update({
                name: product.name,
                description: product.description,
                detail_content: product.detail_content,
                cover_image_url: product.cover_image_url,
                gallery_urls: product.gallery_urls,
                specs: product.specs,
                sort_order: product.sort_order,
                is_active: product.is_active,
                updated_at: new Date().toISOString(),
            })
            .eq("id", product.id);

        setMessage(error ? `保存失败: ${error.message}` : "保存成功！");
        setTimeout(() => setMessage(""), 3000);
        setEditingId(null);
    }

    function updateProduct(id: string, field: string, value: unknown) {
        setProducts(
            products.map((p) => (p.id === id ? { ...p, [field]: value } : p))
        );
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
                    产品管理
                </h2>
                <button onClick={addProduct} className="admin-btn admin-btn-primary flex items-center gap-2">
                    <Plus size={14} />
                    添加产品
                </button>
            </div>

            {message && (
                <div className={`mb-6 p-3 rounded-lg text-sm ${message.includes("失败") ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"}`}>
                    {message}
                </div>
            )}

            <div className="space-y-4">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        isEditing={editingId === product.id}
                        onEdit={() => setEditingId(product.id)}
                        onCancel={() => setEditingId(null)}
                        onSave={() => saveProduct(product)}
                        onUpdate={updateProduct}
                        onDelete={() => deleteProduct(product.id)}
                        supabase={supabase}
                    />
                ))}

                {products.length === 0 && (
                    <div className="admin-card text-center py-12">
                        <p className="text-foreground-dim mb-4">暂无产品</p>
                        <button onClick={addProduct} className="admin-btn admin-btn-primary">
                            添加第一个产品
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function ProductCard({
    product,
    isEditing,
    onEdit,
    onCancel,
    onSave,
    onUpdate,
    onDelete,
    supabase,
}: {
    product: Product;
    isEditing: boolean;
    onEdit: () => void;
    onCancel: () => void;
    onSave: () => void;
    onUpdate: (id: string, field: string, value: unknown) => void;
    onDelete: () => void;
    supabase: ReturnType<typeof createClient>;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [saving, setSaving] = useState(false);
    const [specsText, setSpecsText] = useState(
        JSON.stringify(product.specs || {}, null, 2)
    );

    async function handleImageUpload(file: File) {
        const fileName = `products/${product.id}-${Date.now()}.${file.name.split(".").pop()}`;
        const { data } = await supabase.storage
            .from("website-assets")
            .upload(fileName, file);

        if (data) {
            const { data: urlData } = supabase.storage
                .from("website-assets")
                .getPublicUrl(fileName);
            onUpdate(product.id, "cover_image_url", urlData.publicUrl);
        }
    }

    async function handleSave() {
        setSaving(true);
        try {
            const parsedSpecs = JSON.parse(specsText);
            onUpdate(product.id, "specs", parsedSpecs);
        } catch {
            // keep existing specs if JSON is invalid
        }
        await onSave();
        setSaving(false);
    }

    if (!isEditing) {
        return (
            <div className="admin-card flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {product.cover_image_url ? (
                        <img
                            src={product.cover_image_url}
                            alt={product.name}
                            className="w-16 h-16 rounded-lg object-cover"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center">
                            <span className="text-foreground-dim text-xl font-bold">
                                {product.name.charAt(0)}
                            </span>
                        </div>
                    )}
                    <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-foreground-dim">{product.description}</p>
                    </div>
                    <span
                        className={`ml-4 px-3 py-1 rounded-full text-xs ${product.is_active
                            ? "bg-green-500/10 text-green-400"
                            : "bg-white/5 text-foreground-dim"
                            }`}
                    >
                        {product.is_active ? "已启用" : "已禁用"}
                    </span>
                </div>
                <div className="flex gap-2">
                    <button onClick={onEdit} className="admin-btn admin-btn-secondary flex items-center gap-2">
                        <Edit3 size={14} />
                        编辑
                    </button>
                    <button onClick={onDelete} className="admin-btn admin-btn-danger flex items-center gap-2">
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-card border-accent/30">
            <div className="flex items-center justify-between mb-6">
                <span className="text-xs tracking-[0.1em] uppercase text-accent font-semibold">
                    编辑产品
                </span>
                <div className="flex gap-2">
                    <button onClick={onCancel} className="admin-btn admin-btn-secondary flex items-center gap-2">
                        <X size={14} />
                        取消
                    </button>
                    <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary flex items-center gap-2">
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        保存
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs tracking-[0.1em] uppercase text-foreground-dim mb-2">
                        产品名称
                    </label>
                    <input
                        type="text"
                        value={product.name}
                        onChange={(e) => onUpdate(product.id, "name", e.target.value)}
                        className="admin-input"
                    />
                </div>
                <div className="flex items-end gap-4">
                    <div className="flex-1">
                        <label className="block text-xs tracking-[0.1em] uppercase text-foreground-dim mb-2">
                            排序顺序
                        </label>
                        <input
                            type="number"
                            value={product.sort_order}
                            onChange={(e) => onUpdate(product.id, "sort_order", parseInt(e.target.value) || 0)}
                            className="admin-input"
                        />
                    </div>
                    <button
                        onClick={() => onUpdate(product.id, "is_active", !product.is_active)}
                        className={`admin-btn flex items-center gap-2 ${product.is_active ? "admin-btn-secondary" : "admin-btn-primary"
                            }`}
                    >
                        {product.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                        {product.is_active ? "禁用" : "启用"}
                    </button>
                </div>
            </div>

            <div className="mt-4">
                <label className="block text-xs tracking-[0.1em] uppercase text-foreground-dim mb-2">
                    产品简介
                </label>
                <input
                    type="text"
                    value={product.description || ""}
                    onChange={(e) => onUpdate(product.id, "description", e.target.value)}
                    className="admin-input"
                />
            </div>

            <div className="mt-4">
                <label className="block text-xs tracking-[0.1em] uppercase text-foreground-dim mb-2">
                    详细内容
                </label>
                <textarea
                    value={product.detail_content || ""}
                    onChange={(e) => onUpdate(product.id, "detail_content", e.target.value)}
                    className="admin-input min-h-[120px] resize-y"
                    placeholder="支持多行文本描述..."
                />
            </div>

            {/* Cover Image */}
            <div className="mt-4">
                <label className="block text-xs tracking-[0.1em] uppercase text-foreground-dim mb-2">
                    封面图片
                </label>
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        value={product.cover_image_url || ""}
                        onChange={(e) => onUpdate(product.id, "cover_image_url", e.target.value)}
                        className="admin-input flex-1"
                        placeholder="图片 URL 或点击上传"
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
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
                {product.cover_image_url && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-white/10">
                        <img
                            src={product.cover_image_url}
                            alt="封面预览"
                            className="w-full h-40 object-cover"
                        />
                    </div>
                )}
            </div>

            {/* Specs */}
            <div className="mt-4">
                <label className="block text-xs tracking-[0.1em] uppercase text-foreground-dim mb-2">
                    技术参数 (JSON 格式)
                </label>
                <textarea
                    value={specsText}
                    onChange={(e) => setSpecsText(e.target.value)}
                    className="admin-input min-h-[100px] resize-y font-mono text-xs"
                    placeholder='{"参数名": "参数值", "尺寸": "100x200mm"}'
                />
            </div>
        </div>
    );
}
