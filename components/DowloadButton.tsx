// components/DownloadButton.tsx
import React from 'react';
import { FiDownload } from 'react-icons/fi';

interface DownloadButtonProps {
    url: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ url }) => {
    const handleDownload = async () => {
        try {
            // Fetch the file from the URL
            const response = await fetch(url);
            const blob = await response.blob();
            
            // Create a link element
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = url.split('/').pop() || 'download'; // Suggest a filename for download
            
            // Append to the body and trigger click
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Error downloading the file:', error);
        }
    };

    return (
        <button
            onClick={handleDownload}
            className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-600"
            title="Download"
        >
            <FiDownload size={20} />
        </button>
    );
};

export default DownloadButton;
