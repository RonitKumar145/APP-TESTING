import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import CreatePost from '../components/CreatePost';
import Poll from '../components/Poll';
import { MessageCircle, Repeat, Heart, Share, FileText, Image as ImageIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Post = ({ post, onVote }) => {
    const { user, content, createdAt, likes, poll, imageUrl, fileUrl, fileName } = post;

    return (
        <div className="border-b border-gray-100 p-4 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex space-x-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                    <div className="flex items-center space-x-2">
                        <span className="font-bold text-secondary">{user?.username || 'Unknown User'}</span>
                        <span className="text-gray-500">@{user?.username || 'unknown'}</span>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-500">{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
                    </div>
                    <p className="text-secondary mt-1 mb-3 text-lg leading-snug">{content}</p>

                    {imageUrl && (
                        <div className="mt-3 mb-3 rounded-2xl overflow-hidden border border-gray-200">
                            <img src={imageUrl} alt="Post attachment" className="w-full h-auto max-h-96 object-cover" />
                        </div>
                    )}

                    {fileUrl && !imageUrl && (
                        <div className="mt-3 mb-3 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center">
                            <FileText className="text-primary mr-3" size={24} />
                            <div className="flex-1 overflow-hidden">
                                <p className="font-bold text-secondary truncate">{fileName || 'Attached Document'}</p>
                                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                    View Document
                                </a>
                            </div>
                        </div>
                    )}

                    {poll && (
                        <Poll
                            options={poll.options}
                            totalVotes={poll.voters.length}
                            onVote={(index) => onVote(post._id, index)}
                        />
                    )}

                    <div className="flex justify-between text-gray-500 max-w-md mt-3">
                        <button className="flex items-center space-x-2 hover:text-blue-500 group">
                            <div className="p-2 group-hover:bg-blue-50 rounded-full transition-colors">
                                <MessageCircle size={18} />
                            </div>
                            <span className="text-sm">0</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-green-500 group">
                            <div className="p-2 group-hover:bg-green-50 rounded-full transition-colors">
                                <Repeat size={18} />
                            </div>
                            <span className="text-sm">0</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-pink-500 group">
                            <div className="p-2 group-hover:bg-pink-50 rounded-full transition-colors">
                                <Heart size={18} />
                            </div>
                            <span className="text-sm">{likes?.length || 0}</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-blue-500 group">
                            <div className="p-2 group-hover:bg-blue-50 rounded-full transition-colors">
                                <Share size={18} />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        console.log('fetchPosts called');
        try {
            const token = localStorage.getItem('token');
            console.log('Token in Home:', token);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
                headers: {
                    'x-auth-token': token
                }
            });
            if (response.ok) {
                const data = await response.json();
                setPosts(data);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleVote = async (postId, optionIndex) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/posts/${postId}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ optionIndex })
            });

            if (response.ok) {
                fetchPosts(); // Refresh posts to show new vote count
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.error('Vote Error:', error);
        }
    };

    return (
        <Layout>
            <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-100 p-4">
                <h2 className="text-xl font-bold text-secondary">Home</h2>
            </div>

            <CreatePost onPostCreated={fetchPosts} />

            {loading ? (
                <div className="p-8 text-center text-gray-500">Loading tweets...</div>
            ) : (
                <div>
                    {posts.map(post => (
                        <Post
                            key={post._id}
                            post={post}
                            onVote={handleVote}
                        />
                    ))}
                    {posts.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No tweets yet. Be the first to post!
                        </div>
                    )}
                </div>
            )}
        </Layout>
    );
};

export default Home;
