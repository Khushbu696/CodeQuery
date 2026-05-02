import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Send, Image as ImageIcon, X, AlertTriangle } from 'lucide-react';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [images, setImages] = useState(['']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleAddImage = () => {
        if (images.length < 3) setImages([...images, '']);
    };

    const handleRemoveImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleImageChange = (index, value) => {
        const newImages = [...images];
        newImages[index] = value;
        setImages(newImages);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const postData = {
                title,
                description,
                tags: tags.split(',').map(t => t.trim()).filter(t => t),
                images: images.filter(img => img.trim())
            };

            await axios.post(`${import.meta.env.VITE_API_URL}/api/posts`, postData, config);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create post. It might have been flagged by AI.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem' }}>Ask a public question</h1>
            
            {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <AlertTriangle size={20} />
                    <div>
                        <p style={{ fontWeight: 'bold' }}>Error</p>
                        <p style={{ fontSize: '0.9rem' }}>{error}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="card">
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.25rem' }}>Title</label>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Be specific and imagine you’re asking a question to another person.</p>
                    <input 
                        type="text" 
                        placeholder="e.g. Is there an R function for finding the index of an element in a vector?" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.25rem' }}>Description</label>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Include all the information someone would need to answer your question.</p>
                    <textarea 
                        rows="10" 
                        placeholder="Explain your problem..." 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.25rem' }}>Tags</label>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Add up to 5 tags to describe what your question is about. (comma separated)</p>
                    <input 
                        type="text" 
                        placeholder="e.g. javascript, react, arrays" 
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Images (Max 3)</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {images.map((img, index) => (
                            <div key={index} style={{ display: 'flex', gap: '0.5rem' }}>
                                <input 
                                    type="text" 
                                    placeholder="Image URL" 
                                    value={img}
                                    onChange={(e) => handleImageChange(index, e.target.value)}
                                />
                                {index > 0 && (
                                    <button type="button" onClick={() => handleRemoveImage(index)} style={{ color: 'var(--danger)', background: 'none' }}>
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                        ))}
                        {images.length < 3 && (
                            <button type="button" onClick={handleAddImage} className="btn" style={{ background: 'var(--border)', fontSize: '0.8rem', alignSelf: 'flex-start' }}>
                                <ImageIcon size={16} /> Add Another Image
                            </button>
                        )}
                    </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    <Send size={18} /> {loading ? 'Posting...' : 'Post Your Question'}
                </button>
            </form>
        </div>
    );
};

export default CreatePost;
