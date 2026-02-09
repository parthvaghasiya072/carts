import React, { useState } from 'react';
import { createProduct } from '../services/api';
import { toast } from 'react-toastify';

const Admin = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
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
            await createProduct(formData);
            toast.success('Product added successfully');
            setName('');
            setDescription('');
            setPrice('');
            setCategory('');
            setImage(null);
            // Reset file input manually
            document.getElementById('fileInput').value = "";
        } catch (err) {
            console.error(err);
            toast.error('Error adding product: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Add New Product</h1>
            <div className="form-container">
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-group">
                        <label>Product Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Price</label>
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Product Image</label>
                        <input id="fileInput" type="file" onChange={handleImageChange} accept="image/*" />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
                    </div>
                    <button type="submit" className="submit-btn">Create Product</button>
                </form>
            </div>
        </div>
    );
};

export default Admin;
