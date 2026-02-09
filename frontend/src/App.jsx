import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { fetchCart } from './redux/slices/cartSlice';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Cart from './pages/Cart';
import './App.css';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <Router>
      <div className="app-content">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
