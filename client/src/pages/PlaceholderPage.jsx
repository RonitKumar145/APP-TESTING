import React from 'react';
import Layout from '../components/Layout';
import { Construction } from 'lucide-react';

const PlaceholderPage = ({ title }) => {
    return (
        <Layout>
            <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center p-8">
                <div className="bg-blue-50 p-6 rounded-full mb-6">
                    <Construction size={64} className="text-primary" />
                </div>
                <h1 className="text-3xl font-black text-secondary mb-2">{title}</h1>
                <p className="text-gray-500 text-lg max-w-md">
                    This feature is currently under construction. Check back soon for updates!
                </p>
            </div>
        </Layout>
    );
};

export default PlaceholderPage;
