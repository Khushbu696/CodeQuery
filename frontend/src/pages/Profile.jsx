import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, AlertTriangle, Clock } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ posts: 0, replies: 0 });

    // In a real app, we'd fetch user specific stats here
    
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="card fade-in" style={{ padding: '3rem', textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1.5rem' }}>
                    <img 
                        src={user.profileImage || 'https://via.placeholder.com/120'} 
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--primary)' }} 
                    />
                </div>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{user.name}</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>@{user.username}</p>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
                    <div>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{user.role === 'admin' ? 'Admin' : 'Developer'}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Role</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}><Mail size={20} /> Contact Info</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Email</p>
                    <p style={{ fontWeight: 600 }}>{user.email}</p>
                </div>
                <div className="card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}><Shield size={20} /> Account Security</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Abuse Strikes</p>
                    <p style={{ fontWeight: 600, color: user.abuse_count > 0 ? 'var(--warning)' : 'var(--success)' }}>
                        {user.abuse_count || 0} / 3
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
