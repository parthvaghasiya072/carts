import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import { addToCart, updateCartItem, removeFromCart } from '../redux/slices/cartSlice';
import { getImageUrl } from '../services/api';
import { ShoppingBag, Star, ArrowRight, Sparkles, Filter, Plus, Minus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Home = () => {
    const dispatch = useDispatch();
    const { items: products, loading, error } = useSelector((state) => state.products);
    const { items: cartItems } = useSelector((state) => state.cart);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const getCartItem = (productId) => {
        return cartItems.find(item => (item.product?._id || item.product) === productId);
    };

    const handleAddToCart = (product) => {
        dispatch(addToCart({ productId: product._id, quantity: 1 }));
    };

    const handleUpdateQuantity = (productId, quantity) => {
        if (quantity < 1) {
            dispatch(removeFromCart(productId));
        } else {
            dispatch(updateCartItem({ productId, quantity }));
        }
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-xl font-bold text-slate-800 animate-pulse">Curation incoming...</div>
        </div>
    );

    if (error) return (
        <div className="max-w-7xl mx-auto px-4 mt-20 text-center">
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl inline-block border border-red-100 shadow-sm">
                <p className="font-bold">Sync Error: {error}</p>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in overflow-hidden">
            {/* Hero Section */}
            <header className="relative bg-gradient-to-br from-indigo-50 via-white to-amber-50 py-16 md:py-24 border-b border-slate-100">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-4 relative flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md text-indigo-600 text-sm font-bold mb-8">
                        <Sparkles size={16} /> <span>THE FUTURE OF SHOPPING IS HERE</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-6 max-w-4xl tracking-tight">
                        Revolutionize Your <span className="title-gradient">Style</span> Narrative
                    </h1>

                    <p className="text-lg text-slate-600 mb-10 max-w-2xl leading-relaxed">
                        Discover a meticulously curated galaxy of premium essentials. Quality you can feel, design you can't ignore.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="btn btn-primary h-14 px-10 text-lg">
                            Explore Collection <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Product Section */}
            <main className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Latest <span className="title-gradient">Drops</span>
                        </h2>
                        <p className="text-slate-500 mt-2 font-medium">Elevate your daily rotation with our new arrivals.</p>
                    </div>
                </div>

                {products.length === 0 ? (
                    <div className="bg-white p-20 rounded-4xl border-2 border-dashed border-slate-200 text-center">
                        <ShoppingBag size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-lg text-slate-500 font-medium">The vault is currently empty. Check back shortly!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map(product => {
                            const cartItem = getCartItem(product._id);
                            return (
                                <div key={product._id} className="group glass rounded-3xl overflow-hidden flex flex-col h-full hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-2">
                                    <div className="relative aspect-square overflow-hidden bg-slate-50">
                                        <img
                                            src={getImageUrl(product.image)}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'; }}
                                        />
                                        <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-black shadow-sm">
                                            <Star size={12} className="text-amber-500 fill-amber-500" />
                                            <span>4.8</span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex-grow flex flex-col">
                                        <p className="text-[10px] font-black tracking-widest text-indigo-600 uppercase mb-2">{product.category}</p>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2 truncate">{product.name}</h3>
                                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-6 flex-grow">{product.description}</p>

                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="text-2xl font-black text-slate-900">${product.price}</div>

                                            {cartItem ? (
                                                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(product._id, cartItem.quantity - 1)}
                                                        className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-indigo-600 transition-colors"
                                                    >
                                                        {cartItem.quantity === 1 ? <Trash2 size={14} className="text-red-500" /> : <Minus size={14} />}
                                                    </button>
                                                    <span className="text-sm font-black w-4 text-center">{cartItem.quantity}</span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(product._id, cartItem.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-indigo-600 transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    className="h-12 w-12 flex items-center justify-center bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 hover:scale-110 transition-all duration-300 shadow-lg"
                                                >
                                                    <ShoppingBag size={20} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
