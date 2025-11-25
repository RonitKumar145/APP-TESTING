import React from 'react';
import { Home, Hash, Bell, Mail, Bookmark, List, User, MoreHorizontal, LogOut } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth');
    };

    const [usersToFollow, setUsersToFollow] = React.useState([]);
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    React.useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/users`);
                if (response.ok) {
                    const data = await response.json();
                    // Filter out current user and limit to 3-5
                    const filtered = data.filter(u => u.username !== currentUser.username).slice(0, 4);
                    setUsersToFollow(filtered);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, [currentUser.username]);

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto max-w-7xl flex">
                {/* Sidebar */}
                <div className="w-1/4 h-screen sticky top-0 p-4 flex flex-col justify-between border-r border-gray-100">
                    <div className="space-y-4">
                        <div className="p-3 w-min hover:bg-blue-50 rounded-full transition-colors cursor-pointer">
                            <h1 className="text-3xl font-black text-primary">UNI</h1>
                        </div>

                        <nav className="space-y-2">
                            <SidebarItem icon={<Home size={26} />} text="Home" to="/" active={location.pathname === '/'} />
                            <SidebarItem icon={<Hash size={26} />} text="Explore" to="/explore" active={location.pathname === '/explore'} />
                            <SidebarItem icon={<Bell size={26} />} text="Notifications" to="/notifications" active={location.pathname === '/notifications'} />
                            <SidebarItem icon={<Mail size={26} />} text="Messages" to="/messages" active={location.pathname === '/messages'} />
                            <SidebarItem icon={<Bookmark size={26} />} text="Bookmarks" to="/bookmarks" active={location.pathname === '/bookmarks'} />
                            <SidebarItem icon={<List size={26} />} text="Lists" to="/lists" active={location.pathname === '/lists'} />
                            <SidebarItem icon={<User size={26} />} text="Profile" to="/profile" active={location.pathname === '/profile'} />
                            <SidebarItem icon={<MoreHorizontal size={26} />} text="More" to="/more" active={location.pathname === '/more'} />
                        </nav>

                        <button className="bg-primary hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full w-full shadow-lg transition-all transform hover:scale-105">
                            Upload
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-full cursor-pointer transition-colors mt-auto">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                            <div className="hidden xl:block">
                                <p className="font-bold text-sm">User</p>
                                <p className="text-gray-500 text-sm">@user</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} title="Logout" className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-1/2 border-r border-gray-100 min-h-screen">
                    {children}
                </div>

                {/* Right Sidebar */}
                <div className="w-1/4 p-4 hidden lg:block sticky top-0 h-screen">
                    <div className="bg-gray-50 rounded-full p-3 mb-6 flex items-center space-x-3 focus-within:bg-white focus-within:ring-1 focus-within:ring-primary transition-all border border-transparent focus-within:border-primary">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search UNI GUYS"
                            className="bg-transparent outline-none w-full placeholder-gray-500"
                        />
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                        <h2 className="font-bold text-xl mb-4">What's happening</h2>
                        <TrendingItem category="University" topic="#Exams2024" tweets="12.5K" />
                        <TrendingItem category="Events" topic="Campus Fest" tweets="8.2K" />
                        <TrendingItem category="Technology" topic="#ReactJS" tweets="5.1K" />
                        <TrendingItem category="Sports" topic="Inter-College Cup" tweets="2.3K" />
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4">
                        <h2 className="font-bold text-xl mb-4">Who to follow</h2>
                        {usersToFollow.length > 0 ? (
                            usersToFollow.map(user => (
                                <FollowSuggestion key={user._id} name={user.username} username={`@${user.username}`} />
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No users to follow</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SidebarItem = ({ icon, text, to, active }) => (
    <Link to={to || '#'} className={`flex items-center space-x-4 p-3 rounded-full cursor-pointer transition-all ${active ? 'font-bold' : 'hover:bg-gray-100'}`}>
        <div className="text-secondary">{icon}</div>
        <span className={`text-xl hidden xl:block ${active ? 'text-secondary' : 'text-secondary'}`}>{text}</span>
    </Link>
);

const TrendingItem = ({ category, topic, tweets }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        // Navigate to explore with search query (placeholder for now)
        navigate('/explore');
    };

    return (
        <div onClick={handleClick} className="py-3 hover:bg-gray-100 px-2 -mx-2 rounded-lg cursor-pointer transition-colors">
            <p className="text-xs text-gray-500 flex justify-between">
                <span>{category}</span>
                <MoreHorizontal size={14} />
            </p>
            <p className="font-bold text-secondary mt-0.5">{topic}</p>
            <p className="text-xs text-gray-500 mt-0.5">{tweets} Tweets</p>
        </div>
    );
};

const FollowSuggestion = ({ name, username }) => {
    const [isFollowing, setIsFollowing] = React.useState(false);

    const handleFollow = (e) => {
        e.stopPropagation();
        setIsFollowing(!isFollowing);
    };

    return (
        <div className="flex items-center justify-between py-3 hover:bg-gray-100 px-2 -mx-2 rounded-lg cursor-pointer transition-colors">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                    <p className="font-bold text-sm hover:underline">{name}</p>
                    <p className="text-gray-500 text-sm">{username}</p>
                </div>
            </div>
            <button
                onClick={handleFollow}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${isFollowing
                    ? 'bg-white border border-gray-300 text-black hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                    : 'bg-black text-white hover:bg-gray-800'
                    }`}
            >
                {isFollowing ? 'Following' : 'Follow'}
            </button>
        </div>
    );
};

export default Layout;
