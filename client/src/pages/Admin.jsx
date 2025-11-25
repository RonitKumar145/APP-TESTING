import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { RefreshCw, Check, X, Clock } from 'lucide-react';

const Admin = () => {
    const [inviteCode, setInviteCode] = useState('');
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (user.username !== 'admin') {
            navigate('/');
            return;
        }
        fetchRequests();
    }, [navigate, user.username]);

    const fetchRequests = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/invite-requests`);
            const data = await response.json();
            setRequests(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching requests:', error);
            setLoading(false);
        }
    };

    const generateInvite = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/generate-invite`, {
                method: 'POST'
            });
            const data = await response.json();
            setInviteCode(data.code);
        } catch (error) {
            console.error('Error generating invite:', error);
        }
    };

    return (
        <Layout>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

                {/* Generate Invite Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                    <h2 className="text-xl font-bold mb-4">Generate Invite Code</h2>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={generateInvite}
                            className="bg-primary hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full flex items-center transition-colors"
                        >
                            <RefreshCw size={20} className="mr-2" />
                            Generate New Code
                        </button>
                        {inviteCode && (
                            <div className="bg-green-50 text-green-700 px-6 py-2 rounded-full font-mono text-xl font-bold border border-green-200">
                                {inviteCode}
                            </div>
                        )}
                    </div>
                </div>

                {/* Invite Requests Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold">Invite Requests</h2>
                    </div>

                    {loading ? (
                        <div className="p-6 text-center text-gray-500">Loading requests...</div>
                    ) : requests.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">No pending requests</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {requests.map((req) => (
                                <div key={req._id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center mb-2">
                                                <span className="font-bold text-lg mr-3">{req.email}</span>
                                                <span className={`text-xs px-2 py-1 rounded-full ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    req.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {req.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mb-2">{req.reason}</p>
                                            <div className="flex items-center text-xs text-gray-400">
                                                <Clock size={12} className="mr-1" />
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        {/* Actions could be added here later */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Admin;
