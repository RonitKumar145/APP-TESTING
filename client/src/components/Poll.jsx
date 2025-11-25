import React, { useState } from 'react';

const Poll = ({ options, totalVotes }) => {
    const [votedOption, setVotedOption] = useState(null);

    const handleVote = (index) => {
        if (votedOption === null) {
            setVotedOption(index);
        }
    };

    return (
        <div className="mt-3 space-y-2 max-w-md">
            {options.map((option, index) => {
                const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                const isVoted = votedOption === index;

                return (
                    <div
                        key={index}
                        className="relative h-10 rounded-md overflow-hidden cursor-pointer group"
                        onClick={() => handleVote(index)}
                    >
                        {/* Background Bar */}
                        <div className="absolute inset-0 bg-gray-100 group-hover:bg-gray-200 transition-colors"></div>

                        {/* Progress Bar */}
                        {votedOption !== null && (
                            <div
                                className={`absolute inset-0 ${isVoted ? 'bg-primary/20' : 'bg-gray-300/50'} transition-all duration-500`}
                                style={{ width: `${percentage}%` }}
                            ></div>
                        )}

                        {/* Content */}
                        <div className="absolute inset-0 flex items-center justify-between px-4">
                            <span className={`font-medium ${isVoted ? 'text-primary' : 'text-secondary'}`}>
                                {option.text}
                                {isVoted && <span className="ml-2">✓</span>}
                            </span>
                            {votedOption !== null && (
                                <span className="text-sm font-bold">{percentage}%</span>
                            )}
                        </div>
                    </div>
                );
            })}
            <div className="text-gray-500 text-sm mt-2">
                {totalVotes + (votedOption !== null ? 1 : 0)} votes · Final results
            </div>
        </div>
    );
};

export default Poll;
