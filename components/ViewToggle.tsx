// components/ViewToggle.tsx

"use client";

import React from "react";
import { FaList, FaTh } from "react-icons/fa"; // Import icons for list and grid views

interface ViewToggleProps {
    viewMode: 'list' | 'tile';
    onToggle: (view: 'list' | 'tile') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onToggle }) => {
    return (
        <div className="flex space-x-2">
            <button
                onClick={() => onToggle('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-neutral-700 text-white' : 'bg-neutral-600 text-gray-300'}`}
                aria-label="List view"
            >
                <FaList size={20} />
            </button>
            <button
                onClick={() => onToggle('tile')}
                className={`p-2 ${viewMode === 'tile' ? 'bg-neutral-700 text-white' : 'bg-neutral-600 text-gray-300'}`}
                aria-label="Tile view"
            >
                <FaTh size={20} />
            </button>
        </div>
    );
};

export default ViewToggle;


