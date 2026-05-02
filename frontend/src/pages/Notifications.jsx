import React, { useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Bell, MessageSquare, ShieldAlert, CheckCircle, Info } from 'lucide-react';

const Notifications = () => {
    const { notifications, markAsRead, fetchNotifications } = useNotifications();
    const { user } = useAuth();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'reply': return <MessageSquare size={18} color="var(--primary)" />;
            case 'abuse_warning': return <ShieldAlert size={18} color="var(--warning)" />;
            case 'account_blocked': return <ShieldAlert size={18} color="var(--danger)" />;
            case 'account_unblocked': return <CheckCircle size={18} color="var(--success)" />;
            default: return <Info size={18} />;
        }
    };

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Bell /> Notifications
                </h1>
            </div>

            {notifications.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: 'var(--text-muted)' }}>You have no notifications.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {notifications.map(n => (
                        <div 
                            key={n._id} 
                            className="card fade-in" 
                            style={{ 
                                padding: '1.25rem', 
                                borderLeft: n.isRead ? '1px solid var(--border)' : '4px solid var(--primary)',
                                display: 'flex',
                                gap: '1rem',
                                alignItems: 'flex-start',
                                opacity: n.isRead ? 0.7 : 1
                            }}
                            onClick={() => !n.isRead && markAsRead(n._id)}
                        >
                            <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                                {getIcon(n.type)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{n.message}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    <span>{new Date(n.createdAt).toLocaleString()}</span>
                                    {n.relatedPost && (
                                        <Link to={`/post/${n.relatedPost}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>View Post</Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
