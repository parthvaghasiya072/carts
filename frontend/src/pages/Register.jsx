import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { UserPlus, Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const { name, email, password, confirmPassword } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        if (isSuccess || user) {
            navigate('/');
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
        } else {
            dispatch(register({ name, email, password }));
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 animate-fade-in relative py-12">
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-lg relative">
                <div className="glass p-8 md:p-12 rounded-[40px] shadow-2xl shadow-emerald-500/10">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl mb-6 transform -rotate-3">
                            <UserPlus size={32} />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Sync <span className="bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent">Identity</span></h1>
                        <p className="text-slate-500 font-medium">Begin your premium journey.</p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-5">
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                                <User size={20} />
                            </div>
                            <input
                                type="text"
                                name="name"
                                value={name}
                                placeholder="Full Designation (Name)"
                                onChange={onChange}
                                required
                                className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                                <Mail size={20} />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                placeholder="Quantum Address (Email)"
                                onChange={onChange}
                                required
                                className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                                <Lock size={20} />
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                placeholder="Create Access Key (Password)"
                                onChange={onChange}
                                required
                                className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                                <Lock size={20} />
                            </div>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                placeholder="Verify Access Key"
                                onChange={onChange}
                                required
                                className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn bg-gradient-to-br from-emerald-600 to-emerald-700 text-white w-full h-14 text-base tracking-wide shadow-lg shadow-emerald-500/30"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : (
                                <span className="flex items-center gap-2 font-extrabold uppercase tracking-widest">Connect Identity <ArrowRight size={18} /></span>
                            )}
                        </button>
                    </form>

                    <div className="text-center mt-10">
                        <p className="text-slate-500 font-medium">
                            Already authenticated? <Link to="/login" className="text-emerald-600 font-extrabold hover:underline decoration-transparent">Login Instead</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
