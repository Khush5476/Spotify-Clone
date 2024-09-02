"use client";

import { FaPlay } from "react-icons/fa";
import Button from "./Button";

interface PlayButtonProps {
    url: string; // Prop to accept the URL
}

const PlayButton: React.FC<PlayButtonProps> = ({ url }) => {
    const handleClick = () => {
        // Open the provided URL in a new tab
        window.open(url, '_blank');
    };

    return (
        <Button
            onClick={handleClick} // Add onClick handler
            className="transition opacity-0 rounded-full flex items-center bg-white p-4 drop-shadow-md translate translate-y-1/4 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-110"
        >
            <FaPlay className="text-black" />
        </Button>
    );
};

export default PlayButton;
