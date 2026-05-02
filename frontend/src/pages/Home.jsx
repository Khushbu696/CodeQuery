import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import { MessageSquare, Eye, Clock, TrendingUp, Tag, Plus } from 'lucide-react';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [sort, setSort] = useState('latest');
    
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('q');

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const url = query 
                ? `http://localhost:5000/api/search?q=${query}&page=${page}`
                : `http://localhost:5000/api/posts?page=${page}&sort=${sort}`;
            
            const { data } = await axios.get(url);
            setPosts(data.posts);
            setPages(data.pages);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [page, sort, query]);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }} className="home-layout">
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem' }}>
                        {query ? `Search results for "${query}"` : 'Top Questions'}
                    </h1>
                    <Link to="/create-post" className="btn btn-primary">
                        <Plus size={20} /> Ask Question
                    </Link>
                </div>

                {!query && (
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                        <button onClick={() => setSort('latest')} style={{ background: 'none', color: sort === 'latest' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600 }}>Latest</button>
                        <button onClick={() => setSort('mostViewed')} style={{ background: 'none', color: sort === 'mostViewed' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600 }}>Most Viewed</button>
                        <button onClick={() => setSort('mostReplied')} style={{ background: 'none', color: sort === 'mostReplied' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600 }}>Most Replied</button>
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>Loading posts...</div>
                ) : posts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>No questions found.</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {posts.map(post => (
                            <div key={post._id} className="card fade-in" style={{ padding: '1.25rem' }}>
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', minWidth: '80px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <p style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{post.replyCount}</p>
                                            <p>replies</p>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <p style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{post.viewCount}</p>
                                            <p>views</p>
                                        </div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <Link to={`/post/${post._id}`}>
                                            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--primary)', lineHeight: 1.3 }}>{post.title}</h2>
                                        </Link>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {post.description}
                                        </p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {post.tags.map(tag => (
                                                    <span key={tag} className="badge badge-primary">{tag}</span>
                                                ))}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                <img src={post.author?.profileImage || 'https://via.placeholder.com/30'} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                                                <span>{post.author?.username}</span>
                                                <span>• {new Date(post.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                    {Array.from({ length: pages }, (_, i) => (
                        <button 
                            key={i + 1} 
                            onClick={() => setPage(i + 1)} 
                            className={`btn ${page === i + 1 ? 'btn-primary' : ''}`}
                            style={{ padding: '0.4rem 0.8rem' }}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>

            <aside className="sidebar">
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><TrendingUp size={18} /> Stats</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Total Posts</span>
                            <span style={{ fontWeight: 'bold' }}>{posts.length}+</span>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><Tag size={18} /> Popular Tags</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {['javascript', 'react', 'nodejs', 'mongodb', 'python', 'html', 'css'].map(tag => (
                            <Link key={tag} to={`/?q=${tag}`} className="badge badge-primary">{tag}</Link>
                        ))}
                    </div>
                </div>
            </aside>
            <style>{`
                @media (max-width: 992px) {
                    .home-layout { grid-template-columns: 1fr; }
                    .sidebar { display: none; }
                }
            `}</style>
        </div>
    );
};

export default Home;
