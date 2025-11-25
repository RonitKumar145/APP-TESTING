import React, { useState, useRef } from 'react';
import { Image, BarChart2, FileText, Smile, X } from 'lucide-react';

const CreatePost = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [showPoll, setShowPoll] = useState(false);
    const [pollOptions, setPollOptions] = useState(['', '']);
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleAddOption = () => {
        if (pollOptions.length < 4) {
            setPollOptions([...pollOptions, '']);
        }
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...pollOptions];
        newOptions[index] = value;
        setPollOptions(newOptions);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleTweet = async () => {
        console.log('handleTweet called');
        const token = localStorage.getItem('token');
        console.log('Token:', token);
        if (!token) {
            alert('Please login first');
            return;
        }

        const formData = new FormData();
        formData.append('content', content);

        if (showPoll) {
            // Filter out empty options
            const validOptions = pollOptions.filter(opt => opt.trim() !== '');
            if (validOptions.length >= 2) {
                formData.append('pollOptions', JSON.stringify(validOptions));
            }
        }

        if (file) {
            formData.append('file', file);
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
                method: 'POST',
                headers: {
                    'x-auth-token': token
                },
                body: formData
            });

            if (response.ok) {
                setContent('');
                setPollOptions(['', '']);
                setShowPoll(false);
                setFile(null);
                if (onPostCreated) onPostCreated();
            } else {
                const data = await response.json();
                alert(data.message || 'Error creating post');
            }
        } catch (error) {
            console.error('Post Error:', error);
            alert('Error creating post');
        }
    };

    return (
        <div className="border-b border-gray-100 p-4">
            <div className="flex space-x-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                    <textarea
                        className="w-full border-none focus:ring-0 text-xl placeholder-gray-500 resize-none outline-none mt-2"
                        placeholder="What's happening?"
                        rows="2"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>

                    {file && (
                        <div className="mt-2 relative inline-block">
                            <div className="bg-gray-100 p-2 rounded-lg text-sm flex items-center">
                                <FileText size={16} className="mr-2" />
                                {file.name}
                                <button onClick={() => setFile(null)} className="ml-2 text-red-500 hover:text-red-700">
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {showPoll && (
                        <div className="mt-4 border border-gray-200 rounded-xl p-3">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-sm">Poll</span>
                                <button onClick={() => setShowPoll(false)} className="text-primary hover:bg-blue-50 p-1 rounded-full">
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {pollOptions.map((option, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        placeholder={`Option ${index + 1}`}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:border-primary outline-none"
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                    />
                                ))}
                            </div>
                            {pollOptions.length < 4 && (
                                <button
                                    onClick={handleAddOption}
                                    className="mt-2 text-primary text-sm font-bold hover:underline"
                                >
                                    + Add another option
                                </button>
                            )}
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-4">
                        <div className="flex space-x-4 text-primary">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <button
                                className="p-2 hover:bg-blue-50 rounded-full transition-colors"
                                title="Media"
                                onClick={() => fileInputRef.current.click()}
                            >
                                <Image size={20} />
                            </button>
                            <button
                                className="p-2 hover:bg-blue-50 rounded-full transition-colors"
                                title="Poll"
                                onClick={() => setShowPoll(!showPoll)}
                            >
                                <BarChart2 size={20} />
                            </button>
                            <button
                                className="p-2 hover:bg-blue-50 rounded-full transition-colors"
                                title="Document"
                                onClick={() => fileInputRef.current.click()}
                            >
                                <FileText size={20} />
                            </button>
                            <button className="p-2 hover:bg-blue-50 rounded-full transition-colors" title="Emoji">
                                <Smile size={20} />
                            </button>
                        </div>

                        <button
                            onClick={handleTweet}
                            className={`px-6 py-2 rounded-full font-bold text-white transition-all ${content.trim() || (showPoll && pollOptions[0]) || file ? 'bg-primary hover:bg-blue-500' : 'bg-blue-300 cursor-not-allowed'
                                }`}
                            disabled={!content.trim() && !(showPoll && pollOptions[0]) && !file}
                        >
                            Upload
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
