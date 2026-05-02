import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Users, FileText, MessageSquare, AlertCircle, TrendingUp, ShieldX } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/stats`, config);
                setStats(data);
            } catch (error) {
                console.error('Error fetching admin stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user.token]);

    if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>Loading dashboard...</div>;

    const cards = [
        { label: 'Total Users', value: stats.totalUsers, icon: <Users />, color: '#6366f1', link: '/admin/users' },
        { label: 'Total Posts', value: stats.totalPosts, icon: <FileText />, color: '#8b5cf6', link: '/' },
        { label: 'Total Replies', value: stats.totalReplies, icon: <MessageSquare />, color: '#ec4899', link: '/' },
        { label: 'Flagged Content', value: stats.flaggedCount, icon: <AlertCircle />, color: '#f59e0b', link: '/admin/spam' },
        { label: 'Blocked Users', value: stats.blockedUsers, icon: <ShieldX />, color: '#ef4444', link: '/admin/users' },
    ];

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {cards.map(card => (
                    <Link to={card.link} key={card.label} className="card fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ background: `${card.color}20`, color: card.color, width: '40px', height: '40px', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {card.icon}
                        </div>
                        <div>
                            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{card.value}</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{card.label}</p>
                        </div>
                    </Link>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div className="card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}><TrendingUp size={20} /> Quick Actions</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/admin/users" className="btn btn-primary">Manage Users</Link>
                        <Link to="/admin/spam" className="btn" style={{ background: 'var(--border)' }}>Review Flags</Link>
                        <Link to="/admin/analytics" className="btn" style={{ background: 'var(--border)' }}>View Analytics</Link>
                    </div>
                </div>
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem' }}>System Health</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                            <span>AI Moderation</span>
                            <span style={{ color: 'var(--success)' }}>Active</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                            <span>Database</span>
                            <span style={{ color: 'var(--success)' }}>Connected</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
