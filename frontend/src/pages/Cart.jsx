import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateCartItem, fetchCart } from '../redux/slices/cartSlice';
import { createOrder, resetOrderState } from '../redux/slices/orderSlice';
import { getImageUrl } from '../services/api';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, ArrowLeft, ShoppingBag, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: cartItems, cartId, loading } = useSelector((state) => state.cart);
    const { loading: orderLoading, success: orderSuccess } = useSelector((state) => state.orders);

    const totalPrice = cartItems.reduce((acc, item) => acc + (item.product?.price * item.quantity || 0), 0);

    useEffect(() => {
        // Refresh cart data on mount to ensure synchronization
        dispatch(fetchCart());
    }, [dispatch]);

    useEffect(() => {
        if (orderSuccess) {
            toast.success('Order synchronized successfully!');
            dispatch(resetOrderState());
            // Small delay for UX
            setTimeout(() => navigate('/'), 2000);
        }
    }, [orderSuccess, navigate, dispatch]);

    const handleRemove = (productId) => {
        dispatch(removeFromCart(productId));
        toast.info('Item removed from selection');
    };

    const handleUpdateQuantity = (productId, quantity) => {
        if (quantity < 1) {
            handleRemove(productId);
        } else {
            dispatch(updateCartItem({ productId, quantity }));
        }
    };

    const handleCheckout = () => {
        if (!cartId) {
            toast.error('No inventory detected');
            return;
        }
        dispatch(createOrder(cartId));
    };

    if (orderSuccess) {
        return (
            <div className="flex flex-col justify-center items-center h-[70vh] gap-6 animate-fade-in">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 size={48} />
                </div>
                <div className="text-center">
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Transmission Complete</h2>
                    <p className="text-slate-500 font-medium tracking-wide uppercase text-xs">Your supply chain is now active</p>
                </div>
                <Link to="/" className="btn btn-secondary mt-4">Return to Storefront</Link>
            </div>
        );
    }

    if (loading && cartItems.length === 0) return (
        <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-lg font-black text-slate-800 animate-pulse tracking-widest uppercase">Calculating Value...</div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
            <header className="flex items-center gap-6 mb-16">
                <div className="bg-amber-500 text-white p-4 rounded-3xl shadow-xl shadow-amber-500/20 transform rotate-6">
                    <ShoppingCart size={32} />
                </div>
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-none">Your <span className="title-gradient !from-amber-500 !to-orange-600">Inventory</span></h1>
                    <p className="text-slate-500 font-bold mt-2 uppercase tracking-[0.2em] text-[10px]">{cartItems.length} Selection{cartItems.length !== 1 ? 's' : ''} Ready for Sync</p>
                </div>
            </header>

            {cartItems.length === 0 ? (
                <div className="glass p-16 md:p-24 rounded-[40px] text-center border-slate-100 flex flex-col items-center">
                    <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mb-8 border border-slate-100">
                        <ShoppingBag size={48} className="text-slate-200" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">The stream is calm.</h2>
                    <p className="text-slate-400 font-medium mb-10 max-w-sm">No items have been assigned to your inventory yet. Explore our latest drops to begin.</p>
                    <Link to="/" className="btn btn-primary h-14 px-10 gap-3 decoration-transparent">
                        <ArrowLeft size={20} /> <span className="uppercase tracking-widest font-black text-sm">Return to Store</span>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Items List */}
                    <div className="lg:col-span-8 space-y-6">
                        {cartItems.map((item) => (
                            <div key={item.product?._id} className="group glass p-6 rounded-[32px] flex flex-col sm:flex-row gap-8 items-center border-slate-200/50 hover:border-indigo-200 transition-colors">
                                <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                                    <img
                                        src={getImageUrl(item.product?.image)}
                                        alt={item.product?.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'; }}
                                    />
                                </div>
                                <div className="flex-grow text-center sm:text-left">
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">{item.product?.category}</p>
                                    <h3 className="text-xl font-bold text-slate-900 mb-1">{item.product?.name}</h3>
                                    <div className="text-2xl font-black text-slate-900">${item.product?.price}</div>
                                </div>
                                <div className="flex items-center gap-4 bg-slate-100 p-2 rounded-2xl border border-slate-200">
                                    <button
                                        onClick={() => handleUpdateQuantity(item.product?._id, item.quantity - 1)}
                                        className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-indigo-600 transition-colors"
                                    >
                                        {item.quantity === 1 ? <Trash2 size={18} className="text-red-500" /> : <Minus size={18} strokeWidth={3} />}
                                    </button>
                                    <span className="text-lg font-black w-8 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => handleUpdateQuantity(item.product?._id, item.quantity + 1)}
                                        className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-indigo-600 transition-colors"
                                    >
                                        <Plus size={18} strokeWidth={3} />
                                    </button>
                                </div>
                                <div className="hidden sm:block">
                                    <button
                                        onClick={() => handleRemove(item.product?._id)}
                                        className="p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                    >
                                        <Trash2 size={24} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Card */}
                    <div className="lg:col-span-4 sticky top-32">
                        <div className="glass p-8 md:p-10 rounded-[40px] border-slate-200">
                            <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                <CreditCard size={24} className="text-indigo-600" /> Summary
                            </h2>

                            <div className="space-y-6 pb-8 border-b border-slate-100 mb-8">
                                <div className="flex justify-between font-bold text-slate-500 uppercase tracking-widest text-xs">
                                    <span>Subtotal</span>
                                    <span className="text-slate-900">${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-slate-500 uppercase tracking-widest text-xs">
                                    <span>Logistic sync</span>
                                    <span className="text-emerald-500 font-black">Complementary</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-10">
                                <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Total Value</div>
                                <div className="text-4xl font-black text-slate-900 leading-none">${totalPrice.toFixed(2)}</div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={orderLoading || cartItems.length === 0}
                                className="btn btn-primary w-full h-16 text-lg uppercase font-black tracking-widest disabled:opacity-50"
                            >
                                {orderLoading ? <Loader2 className="animate-spin" /> : 'Complete Sync'}
                            </button>

                            <div className="mt-8 flex items-center gap-3 justify-center text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 py-3 rounded-xl border border-dashed border-slate-200">
                                <ShieldCheck size={14} className="text-emerald-500" /> Guaranteed Secure Transaction
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
