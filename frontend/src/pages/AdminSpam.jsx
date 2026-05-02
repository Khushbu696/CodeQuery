import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Trash2, CheckCircle, AlertOctagon } from 'lucide-react';

const AdminSpam = () => {
    const { user } = useAuth();
    const [flags, setFlags] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFlags = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/admin/flagged', config);
            setFlags(data);
        } catch (error) {
            console.error('Error fetching flags:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlags();
    }, [user.token]);

    const handleDelete = async (type, id) => {
        if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`http://localhost:5000/api/admin/content/${type.toLowerCase()}/${id}`, config);
            fetchFlags();
        } catch (error) {
            alert('Delete failed');
        }
    };

    if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>Loading flags...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Content Moderation</h1>
            {flags.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <CheckCircle size={40} color="var(--success)" style={{ marginBottom: '1rem' }} />
                    <p>No flagged content to review. The AI is doing its job!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {flags.map(log => (
                        <div key={log._id} className="card fade-in" style={{ borderLeft: '4px solid var(--warning)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <AlertOctagon color="var(--warning)" size={20} />
                                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{log.contentType} Flagged</span>
                                    <span className="badge badge-warning">{Math.round(log.confidence * 100)}% Confidence</span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button 
                                        onClick={() => handleDelete(log.contentType, log.contentId)}
                                        className="btn btn-danger" 
                                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                    >
                                        <Trash2 size={14} /> Delete Content
                                    </button>
                                </div>
                            </div>
                            
                            <div style={{ background: 'var(--bg-dark)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Content Snippet:</p>
                                <p>"{log.contentSnippet}"</p>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                                <div>
                                    <span style={{ color: 'var(--text-muted)' }}>Reason: </span>
                                    <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>{log.reason}</span>
                                </div>
                                <div style={{ color: 'var(--text-muted)' }}>
                                    Flagged for user <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{log.user?.username}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminSpam;
