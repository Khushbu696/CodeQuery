import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Shield, ShieldOff, AlertTriangle, User } from 'lucide-react';

const AdminUsers = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/admin/users', config);
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [user.token]);

    const toggleBlock = async (userId, isBlocked) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const endpoint = isBlocked ? 'unblock' : 'block';
            await axios.patch(`http://localhost:5000/api/admin/users/${userId}/${endpoint}`, {}, config);
            fetchUsers();
        } catch (error) {
            alert('Failed to update user status');
        }
    };

    if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>Loading users...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>User Management</h1>
            <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1rem' }}>User</th>
                            <th style={{ padding: '1rem' }}>Email</th>
                            <th style={{ padding: '1rem' }}>Role</th>
                            <th style={{ padding: '1rem' }}>Abuse Count</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <img src={u.profileImage || 'https://via.placeholder.com/30'} style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                                    <div>
                                        <p style={{ fontWeight: 'bold' }}>{u.name}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>@{u.username}</p>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{u.email}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span className={`badge ${u.role === 'admin' ? 'badge-primary' : ''}`} style={{ background: u.role === 'admin' ? 'var(--primary)' : 'var(--border)', color: 'white' }}>
                                        {u.role}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ color: u.abuse_count > 0 ? 'var(--warning)' : 'inherit', fontWeight: 'bold' }}>{u.abuse_count}</span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {u.is_blocked ? (
                                        <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                                            <AlertTriangle size={14} /> Blocked
                                        </span>
                                    ) : (
                                        <span style={{ color: 'var(--success)', fontSize: '0.9rem' }}>Active</span>
                                    )}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {u._id !== user._id && (
                                        <button 
                                            onClick={() => toggleBlock(u._id, u.is_blocked)}
                                            style={{ 
                                                padding: '0.4rem 0.8rem', 
                                                borderRadius: '0.4rem', 
                                                background: u.is_blocked ? 'var(--success)' : 'var(--danger)',
                                                color: 'white',
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.4rem'
                                            }}
                                        >
                                            {u.is_blocked ? <><Shield size={14} /> Unblock</> : <><ShieldOff size={14} /> Block</>}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;
