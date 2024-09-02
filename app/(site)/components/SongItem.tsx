"use client";

import React from "react";
import useLoadImage from "@/hooks/useLoadImage";
import { Song } from "@/types";
import Image from "next/image";
import LikeButton from "@/components/LikeButton";
import PDFButton from "@/app/liked/components/PDFButton";
interface SongItemProps {
    data: Song;
    onClick: (id: string) => void;
    viewMode: 'list' | 'tile';
    lyrics_path: string;
}

const SongItem: React.FC<SongItemProps> = ({
    data,
    onClick,
    viewMode,
    lyrics_path
}) => {
    const imagePath = useLoadImage(data);

    // Construct the URL for the lyrics based on the song data
    const lyricsURL = data.lyrics_path ? `https://tztpwznenrpoajfsoyfm.supabase.co/storage/v1/object/public/lyrics/${data.lyrics_path}` : '';

    const handleClick = () => {
        // Call the onClick handler for any other actions (e.g., navigating or playing)
        onClick(data.id);
    };

    return (
        <div
            onClick={handleClick}
            className={`relative cursor-pointer transition-all duration-300 ease-in-out ${
                viewMode === 'list'
                    ? 'flex items-center p-4 rounded-lg shadow-sm hover:bg-neutral-800 hover:scale-102'
                    : 'group flex flex-col items-center justify-center rounded-md overflow-hidden gap-x-4 bg-neutral-400/5 hover:bg-neutral-400/10 transition p-3'
            }`}
        >
            <div
                className={`relative ${viewMode === 'list' ? 'w-16 h-16' : 'aspect-square w-full h-full'} ${
                    viewMode === 'list' ? 'flex-shrink-0 mr-4' : ''
                }`}
            >
                <Image
                    className={`object-cover ${viewMode === 'tile' ? 'rounded-md' : 'rounded-lg'}`}
                    src={imagePath || '/images/liked.png'}
                    fill
                    alt="Song Image"
                />
            </div>
            <div
                className={`flex-grow ${viewMode === 'tile' ? 'flex flex-col items-start pt-4 gap-y-1 w-full' : ''}`}
            >
                <p
                    className={`text-white font-semibold ${viewMode === 'list' ? 'text-[15px] md:text-[17px] lg:text-[23px] truncate max-w-[200px] md:max-w-[1000px] sm:whitespace-nowrap sm:overflow-ellipsis' : ''}`}
                >
                    {data.title}
                </p>
                <p
                    className={`text-neutral-400 text-sm truncate ${viewMode === 'tile' ? 'pb-4 w-full' : ''}`}
                >
                    By {data.author}
                </p>
            </div>
            <div className={`absolute ${viewMode === 'tile' ? 'bottom-4 right-4' : 'ml-4'}`}>

            </div>
            
            {viewMode === 'tile' && (
                <div className="absolute bottom-4 right-4 flex gap-2">
                    {lyricsURL && (
                        <PDFButton url={lyricsURL} />
                    )}
                    <LikeButton songId={data.id} />
                </div>
            )}
            {viewMode === 'list' && (
                <div className="flex-shrink-0 ml-4 flex gap-2">
                    {lyricsURL && (
                        <PDFButton url={lyricsURL} />
                    )}
                    <LikeButton songId={data.id} />
                </div>
            )}
        </div>
    );
};

export default SongItem;
