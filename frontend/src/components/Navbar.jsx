import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { ShoppingCart, User, LogOut, LayoutDashboard, Store } from 'lucide-react';

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const cartCount = useSelector((state) => state.cart.count);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <nav className="glass sticky top-0 z-[1000] py-4">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 group decoration-transparent">
                    <div className="bg-indigo-600 p-2 rounded-lg text-white group-hover:rotate-12 transition-transform">
                        <Store size={24} />
                    </div>
                    <span className="title-gradient text-xl">ShopStream</span>
                </Link>

                <div className="flex items-center gap-4 md:gap-8">
                    <Link to="/" className="hidden md:flex font-medium text-slate-600 hover:text-indigo-600 transition-colors decoration-transparent">
                        Shop
                    </Link>

                    <Link to="/cart" className="relative p-2 hover:bg-slate-100 rounded-full transition-colors decoration-transparent">
                        <ShoppingCart size={24} className="text-slate-700" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center ring-2 ring-white">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-3">
                            {user.role === 'admin' && (
                                <Link to="/admin" className="hidden sm:flex items-center gap-2 text-slate-700 font-medium hover:text-indigo-600 transition-colors decoration-transparent">
                                    <LayoutDashboard size={20} />
                                    <span>Dashboard</span>
                                </Link>
                            )}
                            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                                <User size={18} className="text-indigo-600" />
                                <span className="text-sm font-bold text-slate-800 hidden xs:block">{user.name}</span>
                                <button
                                    onClick={onLogout}
                                    className="p-1 hover:text-red-500 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Link to="/login" className="btn btn-secondary px-4 py-2 text-sm decoration-transparent">Login</Link>
                            <Link to="/register" className="btn btn-primary px-4 py-2 text-sm decoration-transparent">Join</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
