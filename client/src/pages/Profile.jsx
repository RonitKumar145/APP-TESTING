import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Poll from '../components/Poll';
import { MessageCircle, Repeat, Heart, Share, FileText, Calendar, MapPin, Link as LinkIcon, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

const Post = ({ post, onVote, onLike, onComment, onShare, currentUser }) => {
    const { user, content, createdAt, likes, poll, imageUrl, fileUrl, fileName, comments } = post;
    const isLiked = likes && currentUser ? likes.includes(currentUser._id) : false;
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        onComment(post._id, commentText);
        setCommentText('');
    };

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
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); }}
                            className="flex items-center space-x-2 hover:text-blue-500 group"
                        >
                            <div className="p-2 group-hover:bg-blue-50 rounded-full transition-colors">
                                <MessageCircle size={18} />
                            </div>
                            <span className="text-sm">{comments?.length || 0}</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-green-500 group">
                            <div className="p-2 group-hover:bg-green-50 rounded-full transition-colors">
                                <Repeat size={18} />
                            </div>
                            <span className="text-sm">0</span>
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onLike(post._id); }}
                            className={`flex items-center space-x-2 group ${isLiked ? 'text-pink-600' : 'hover:text-pink-500'}`}
                        >
                            <div className={`p-2 rounded-full transition-colors ${isLiked ? 'bg-pink-50' : 'group-hover:bg-pink-50'}`}>
                                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                            </div>
                            <span className="text-sm">{likes?.length || 0}</span>
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onShare(post._id); }}
                            className="flex items-center space-x-2 hover:text-blue-500 group"
                        >
                            <div className="p-2 group-hover:bg-blue-50 rounded-full transition-colors">
                                <Share size={18} />
                            </div>
                        </button>
                    </div>

                    {/* Comments Section */}
                    {showComments && (
                        <div className="mt-4 pt-4 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                            <form onSubmit={handleCommentSubmit} className="flex space-x-2 mb-4">
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Post your reply"
                                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-primary/50"
                                />
                                <button
                                    type="submit"
                                    disabled={!commentText.trim()}
                                    className="bg-primary text-white px-4 py-2 rounded-full font-bold disabled:opacity-50"
                                >
                                    Reply
                                </button>
                            </form>

                            <div className="space-y-4">
                                {comments && comments.map((comment, index) => (
                                    <div key={index} className="flex space-x-3">
                                        <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <span className="font-bold text-sm">{comment.user?.username || 'Unknown'}</span>
                                                <span className="text-gray-500 text-xs">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                                            </div>
                                            <p className="text-gray-800 text-sm">{comment.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Profile = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    // Redirect if not logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/auth');
        }
    }, [navigate]);

    const fetchUserPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token || !currentUser.id) return;

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/user/${currentUser.id}`, {
                headers: {
                    'x-auth-token': token
                }
            });
            if (response.ok) {
                const data = await response.json();
                setPosts(data);
            }
        } catch (error) {
            console.error('Error fetching user posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserPosts();
    }, []);

    const handleVote = async (postId, optionIndex) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ optionIndex })
            });

            if (response.ok) {
                fetchUserPosts();
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.error('Vote Error:', error);
        }
    };

    const handleLike = async (postId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/like`, {
                method: 'PUT',
                headers: {
                    'x-auth-token': token
                }
            });

            if (response.ok) {
                fetchUserPosts();
            }
        } catch (error) {
            console.error('Like Error:', error);
        }
    };

    const handleComment = async (postId, text) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ text })
            });

            if (response.ok) {
                fetchUserPosts();
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to post comment');
            }
        } catch (error) {
            console.error('Comment Error:', error);
            alert('Failed to post comment. Please check your connection or try again.');
        }
    };

    const handleShare = (postId) => {
        navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
        alert("Link copied to clipboard!");
    };

    return (
        <Layout>
            {/* Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-4 py-2 flex items-center space-x-4 border-b border-gray-100">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-xl font-bold text-secondary">{currentUser.username || 'Profile'}</h2>
                    <p className="text-sm text-gray-500">{posts.length} Posts</p>
                </div>
            </div>

            {/* Banner */}
            <div className="h-48 bg-blue-200"></div>

            {/* Profile Info */}
            <div className="px-4 pb-4 border-b border-gray-100">
                <div className="flex justify-between items-end -mt-16 mb-4">
                    <div className="w-32 h-32 bg-gray-300 rounded-full border-4 border-white"></div>
                    <button className="border border-gray-300 font-bold px-4 py-2 rounded-full hover:bg-gray-50 transition-colors">
                        Edit profile
                    </button>
                </div>

                <div className="mb-4">
                    <h1 className="text-xl font-black text-secondary">{currentUser.username || 'User'}</h1>
                    <p className="text-gray-500">@{currentUser.username || 'user'}</p>
                </div>

                <div className="mb-4">
                    <p className="text-gray-700">Student at University • Coding Enthusiast • Building cool stuff 🚀</p>
                </div>

                <div className="flex flex-wrap gap-4 text-gray-500 text-sm mb-4">
                    <div className="flex items-center space-x-1">
                        <MapPin size={16} />
                        <span>Campus</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <LinkIcon size={16} />
                        <a href="#" className="text-primary hover:underline">github.com/{currentUser.username}</a>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Calendar size={16} />
                        <span>Joined November 2025</span>
                    </div>
                </div>

                <div className="flex space-x-4 text-sm">
                    <div className="flex space-x-1">
                        <span className="font-bold text-secondary">142</span>
                        <span className="text-gray-500">Following</span>
                    </div>
                    <div className="flex space-x-1">
                        <span className="font-bold text-secondary">8.5K</span>
                        <span className="text-gray-500">Followers</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100">
                <button className="flex-1 py-4 font-bold text-secondary border-b-4 border-primary hover:bg-gray-50 transition-colors">
                    Posts
                </button>
                <button className="flex-1 py-4 font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                    Replies
                </button>
                <button className="flex-1 py-4 font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                    Highlights
                </button>
                <button className="flex-1 py-4 font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                    Media
                </button>
                <button className="flex-1 py-4 font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                    Likes
                </button>
            </div>

            {/* Posts Feed */}
            {loading ? (
                <div className="p-8 text-center text-gray-500">Loading posts...</div>
            ) : (
                <div>
                    {posts.map(post => (
                        <Post
                            key={post._id}
                            post={post}
                            onVote={handleVote}
                            onLike={handleLike}
                            onComment={handleComment}
                            onShare={handleShare}
                            currentUser={currentUser}
                        />
                    ))}
                    {posts.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No posts yet.
                        </div>
                    )}
                </div>
            )}
        </Layout>
    );
};

export default Profile;
