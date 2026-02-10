import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../redux/slices/productSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Package, Image as ImageIcon, Tag, DollarSign, Text as TextIcon, Loader2, List, ShieldCheck } from 'lucide-react';

const Admin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { createStatus } = useSelector((state) => state.products);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            toast.error('Access denied. Administrator privileges required.');
            navigate('/');
        }
    }, [user, navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category', category);
        if (image) {
            formData.append('image', image);
        }

        try {
            await dispatch(createProduct(formData)).unwrap();
            toast.success('Inventory Updated Successfully');
            setName('');
            setDescription('');
            setPrice('');
            setCategory('');
            setImage(null);
            setPreview(null);
        } catch (err) {
            toast.error('Transmission Error: ' + (err.message || 'Unknown code'));
        }
    };

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-4">
                    <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl transform -rotate-2">
                        <LayoutDashboard size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 leading-none mb-2">Omni <span className="title-gradient">Control</span></h1>
                        <p className="text-slate-500 font-medium">Global store management & inventory.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 text-indigo-700 font-bold text-sm">
                    <ShieldCheck size={18} /> Verified Administrator Access
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Stats & Insights */}
                <aside className="lg:col-span-4 space-y-6">
                    <div className="glass p-8 rounded-[32px] border-indigo-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Package size={20} className="text-indigo-600" /> Catalog Standards
                        </h3>
                        <div className="space-y-4">
                            {[
                                "High-resolution 1:1 ratio visuals preferred.",
                                "Concise, benefit-driven item titles.",
                                "Detailed semantic descriptions for SEO.",
                                "Accurate categorical tagging for UX."
                            ].map((tip, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0"></div>
                                    <p className="text-sm text-slate-600 leading-relaxed font-medium">{tip}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass p-8 rounded-[32px] text-center border-slate-100 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-indigo-500/20">
                        <User size={32} className="mx-auto mb-4 opacity-75" />
                        <div className="text-[10px] uppercase tracking-[0.2em] font-black opacity-60 mb-1">Active Session</div>
                        <div className="text-xl font-bold">{user.name}</div>
                    </div>
                </aside>

                {/* Form Section */}
                <main className="lg:col-span-8">
                    <div className="glass p-8 md:p-12 rounded-[40px]">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                <PlusCircle size={28} className="text-emerald-500" /> New Entry
                            </h2>
                            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                                <List size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Product Title</label>
                                    <div className="relative group">
                                        <Tag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            className="form-input"
                                            placeholder="Aero Stealth Pro"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">MSRP (USD)</label>
                                    <div className="relative group">
                                        <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600" />
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            required
                                            className="form-input"
                                            placeholder="299.00"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Strategic Description</label>
                                <div className="relative group">
                                    <TextIcon size={18} className="absolute left-4 top-4 text-slate-300 group-focus-within:text-indigo-600" />
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                        className="form-input !pl-12 min-h-[140px] pt-4 resize-none"
                                        placeholder="Outline the core value proposition..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Global Category</label>
                                <div className="relative group">
                                    <LayoutDashboard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600" />
                                    <input
                                        type="text"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        required
                                        className="form-input"
                                        placeholder="Wearables, Tech, etc."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Media Assets</label>
                                <div className="relative group h-40">
                                    <div className="absolute inset-0 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 group-hover:bg-white group-hover:border-indigo-400 transition-all overflow-hidden">
                                        {preview ? (
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <ImageIcon size={32} className="text-slate-300 mb-2" />
                                                <span className="text-xs font-bold text-slate-400">Select Identity Visual</span>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-full h-16 text-lg tracking-widest uppercase font-black"
                                disabled={createStatus === 'loading'}
                            >
                                {createStatus === 'loading' ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-3">Publish To Grid <ArrowRight size={20} /></span>
                                )}
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Admin;
