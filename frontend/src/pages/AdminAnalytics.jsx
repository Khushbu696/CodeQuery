import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BarChart3, LineChart, PieChart, Activity } from 'lucide-react';

const AdminAnalytics = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/admin/stats', config);
                setStats(data);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user.token]);

    if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>Loading analytics...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Platform Analytics</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div className="card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}><Activity size={20} color="var(--primary)" /> Posts Over Time</h3>
                    <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '0.5rem', paddingBottom: '1rem' }}>
                        {stats.postsOverTime.length > 0 ? stats.postsOverTime.map(d => (
                            <div key={d._id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ 
                                    width: '100%', 
                                    height: `${(d.count / Math.max(...stats.postsOverTime.map(x => x.count))) * 150}px`, 
                                    background: 'var(--primary)', 
                                    borderRadius: '0.25rem 0.25rem 0 0',
                                    transition: 'height 1s ease'
                                }}></div>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', transform: 'rotate(-45deg)', marginTop: '0.5rem' }}>{d._id.split('-').slice(1).join('/')}</span>
                            </div>
                        )) : <p style={{ color: 'var(--text-muted)', width: '100%', textAlign: 'center' }}>No data yet</p>}
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '2rem' }}>Community Health</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <span>Abuse Rate</span>
                                <span style={{ fontWeight: 'bold' }}>{((stats.flaggedCount / (stats.totalPosts + stats.totalReplies || 1)) * 100).toFixed(1)}%</span>
                            </div>
                            <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${(stats.flaggedCount / (stats.totalPosts + stats.totalReplies || 1)) * 100}%`, height: '100%', background: 'var(--warning)' }}></div>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <span>Engagement (Replies/Post)</span>
                                <span style={{ fontWeight: 'bold' }}>{(stats.totalReplies / (stats.totalPosts || 1)).toFixed(1)}</span>
                            </div>
                            <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${Math.min((stats.totalReplies / (stats.totalPosts || 1)) * 20, 100)}%`, height: '100%', background: 'var(--success)' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '1.5rem' }}>Summary Table</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' }}>
                    <div style={{ padding: '1rem', borderRight: '1px solid var(--border)' }}>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalUsers}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Users</p>
                    </div>
                    <div style={{ padding: '1rem', borderRight: '1px solid var(--border)' }}>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalPosts}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Posts</p>
                    </div>
                    <div style={{ padding: '1rem', borderRight: '1px solid var(--border)' }}>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalReplies}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Replies</p>
                    </div>
                    <div style={{ padding: '1rem' }}>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.blockedUsers}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Banned</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
