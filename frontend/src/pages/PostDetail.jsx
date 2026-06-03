import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Eye, Clock, Share2, CornerDownRight, AlertTriangle, Trash2 } from 'lucide-react';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [replies, setReplies] = useState([]);
    const [replyContent, setReplyContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [replyLoading, setReplyLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            const postRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/${id}`);
            const repliesRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/${id}/replies`);
            setPost(postRes.data);
            setReplies(repliesRes.data);
        } catch (error) {
            console.error('Error fetching post data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleReply = async (e) => {
        e.preventDefault();
        if (!user) return alert('Please login to reply');
        
        setReplyLoading(true);
        setError('');
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${import.meta.env.VITE_API_URL}/api/posts/${id}/replies`, { content: replyContent }, config);
            setReplyContent('');
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to post reply. It might have been flagged.');
        } finally {
            setReplyLoading(false);
        }
    };

    const handleDeletePost = async () => {
        if (!window.confirm('Are you sure you want to delete this question?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${id}`, config);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete the question.');
        }
    };

    const handleDeleteReply = async (replyId) => {
        if (!window.confirm('Are you sure you want to delete this answer?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/replies/${replyId}`, config);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete the answer.');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Loading question...</div>;
    if (!post) return <div style={{ textAlign: 'center', padding: '5rem' }}>Question not found.</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                    <h1 style={{ fontSize: '2.25rem', marginBottom: '1rem', lineHeight: 1.2 }}>{post.title}</h1>
                    <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={16} /> Asked {new Date(post.createdAt).toLocaleDateString()}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Eye size={16} /> Viewed {post.viewCount} times</span>
                    </div>
                </div>
                {user && (post.author?._id === user._id || user.role === 'admin') && (
                    <button 
                        onClick={handleDeletePost} 
                        className="btn btn-danger" 
                        style={{ padding: '0.6rem 1.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap', marginTop: '0.5rem' }}
                    >
                        <Trash2 size={16} /> Delete Question
                    </button>
                )}
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                <div className="card" style={{ background: 'transparent', border: 'none', padding: 0 }}>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <div style={{ minWidth: '50px', textAlign: 'center' }}>
                            <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--border)', margin: '0 auto' }}>
                                <img src={post.author?.profileImage || 'https://via.placeholder.com/45'} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '1.1rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: '1.5rem' }}>
                                {post.description}
                            </div>
                            
                            {post.images && post.images.length > 0 && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                                    {post.images.map((img, i) => (
                                        <img key={i} src={img} alt="Post attachment" style={{ width: '100%', borderRadius: '0.5rem', border: '1px solid var(--border)' }} />
                                    ))}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                {post.tags.map(tag => (
                                    <span key={tag} className="badge badge-primary">{tag}</span>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', fontSize: '0.9rem' }}>
                                <div className="badge badge-primary" style={{ padding: '0.5rem 1rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Asked by </span>
                                    <span style={{ fontWeight: 'bold' }}>{post.author?.username}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                        {replies.length} {replies.length === 1 ? 'Answer' : 'Answers'}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {replies.map(reply => (
                            <div key={reply._id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{ minWidth: '40px' }}>
                                        <img src={reply.author?.profileImage || 'https://via.placeholder.com/40'} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '1rem', lineHeight: 1.5, marginBottom: '1rem' }}>{reply.content}</div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            <span>Answered {new Date(reply.createdAt).toLocaleString()}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                {user && (reply.author?._id === user._id || user.role === 'admin') && (
                                                    <button 
                                                        onClick={() => handleDeleteReply(reply._id)} 
                                                        className="btn btn-danger" 
                                                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)' }}
                                                    >
                                                        <Trash2 size={12} /> Delete
                                                    </button>
                                                )}
                                                <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{reply.author?.username}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: '3rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Your Answer</h3>
                    {error && (
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                            <AlertTriangle size={18} /> {error}
                        </div>
                    )}
                    <form onSubmit={handleReply}>
                        <textarea 
                            rows="8" 
                            placeholder="Type your answer here..." 
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            required
                            style={{ marginBottom: '1rem' }}
                        />
                        <button type="submit" className="btn btn-primary" disabled={replyLoading || !user}>
                            {replyLoading ? 'Posting...' : 'Post Your Answer'}
                        </button>
                        {!user && <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Please login to answer.</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
