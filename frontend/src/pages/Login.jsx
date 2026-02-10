import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { LogIn, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;

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
        dispatch(login({ email, password }));
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 animate-fade-in relative">
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-md relative">
                <div className="glass p-8 md:p-12 rounded-[40px] shadow-2xl shadow-indigo-500/10">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl mb-6 transform rotate-3">
                            <LogIn size={32} />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Access <span className="title-gradient">Stream</span></h1>
                        <p className="text-slate-500 font-medium">Elevate your experience.</p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                <Mail size={20} />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                placeholder="Quantum Address (Email)"
                                onChange={onChange}
                                required
                                className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                <Lock size={20} />
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                placeholder="Access Key (Password)"
                                onChange={onChange}
                                required
                                className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full h-14 text-base tracking-wide"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : (
                                <span className="flex items-center gap-2">Initiate Login <ArrowRight size={18} /></span>
                            )}
                        </button>
                    </form>

                    <div className="text-center mt-10">
                        <p className="text-slate-500 font-medium">
                            New to the stream? <Link to="/register" className="text-indigo-600 font-extrabold hover:underline decoration-transparent">Create Identity</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
