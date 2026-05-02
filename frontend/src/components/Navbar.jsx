import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Search, Bell, User as UserIcon, LogOut, Menu, X, ShieldAlert } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { unreadCount } = useNotifications();
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?q=${searchQuery}`);
            setSearchQuery('');
        }
    };

    return (
        <nav style={{ 
            background: 'var(--glass)', 
            backdropFilter: 'blur(10px)', 
            borderBottom: '1px solid var(--border)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            padding: '0.75rem 0'
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-1px' }}>
                    Code<span style={{ color: 'var(--text-main)' }}>Query</span>
                </Link>

                <form onSubmit={handleSearch} style={{ flex: 1, margin: '0 2rem', position: 'relative', maxWidth: '500px' }} className="nav-search">
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                        type="text" 
                        placeholder="Search questions, tags..." 
                        style={{ paddingLeft: '2.5rem', width: '100%' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    {user ? (
                        <>
                            <Link to="/notifications" style={{ position: 'relative' }}>
                                <Bell size={22} color="var(--text-main)" />
                                {unreadCount > 0 && (
                                    <span style={{ 
                                        position: 'absolute', 
                                        top: '-5px', 
                                        right: '-5px', 
                                        background: 'var(--danger)', 
                                        color: 'white', 
                                        fontSize: '0.7rem', 
                                        borderRadius: '50%', 
                                        width: '18px', 
                                        height: '18px', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        fontWeight: 'bold'
                                    }}>
                                        {unreadCount}
                                    </span>
                                )}
                            </Link>

                            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                {user.profileImage ? (
                                    <img src={user.profileImage} alt="Profile" style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                    <UserIcon size={24} color="var(--text-main)" />
                                )}
                                
                                {isMenuOpen && (
                                    <div className="card" style={{ position: 'absolute', right: 0, top: '45px', width: '200px', padding: '0.5rem', zIndex: 101 }}>
                                        <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem' }}>
                                            <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{user.name}</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>@{user.username}</p>
                                        </div>
                                        <Link to="/profile" className="menu-item">Profile</Link>
                                        {user.role === 'admin' && <Link to="/admin" className="menu-item" style={{ color: 'var(--primary)' }}>Admin Dashboard</Link>}
                                        <button onClick={logout} className="menu-item" style={{ width: '100%', textAlign: 'left', background: 'none', color: 'var(--danger)' }}>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                            <Link to="/create-post" className="btn btn-primary" style={{ display: 'none' }}>Ask Question</Link>
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Link to="/login" style={{ fontWeight: 600 }}>Login</Link>
                            <Link to="/register" className="btn btn-primary">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                .menu-item {
                    display: block;
                    padding: 0.6rem 1rem;
                    border-radius: 0.4rem;
                    font-size: 0.9rem;
                    transition: background 0.2s;
                }
                .menu-item:hover {
                    background: var(--border);
                }
                @media (max-width: 768px) {
                    .nav-search { display: none; }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
