"use client";

import LikeButton from "@/components/LikeButton";
import MediaItem from "@/components/MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import { Song } from "@/types";
import PDFButton from "./PDFButton"; // Ensure this component exists and is properly implemented
import DownloadButton from "@/components/DowloadButton";// Ensure this component exists and is properly implemented

interface SearchContentProps {
    songs: Song[];
}

const SearchContent: React.FC<SearchContentProps> = ({ songs }) => {
    const onPlay = useOnPlay(songs);

    if (songs.length === 0) {
        return (
            <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">
                No Songs Found
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-y-2 w-full px-6">
            {songs.map((song) => {
                const lyricsURL = song.lyrics_path 
                    ? `https://tztpwznenrpoajfsoyfm.supabase.co/storage/v1/object/public/lyrics/${song.lyrics_path}`
                    : '';
                
                const downloadURL = song.song_path
                    ? `https://tztpwznenrpoajfsoyfm.supabase.co/storage/v1/object/public/songs/${song.song_path}`
                    : '';

                return (
                    <div key={song.id} className="flex items-center gap-x-4 w-full relative group">
                        <div className="flex-1">
                            <MediaItem onClick={(id: string) => onPlay(id)} data={song} />
                        </div>

                        {/* Download Button */}
                        {downloadURL && (
                            <DownloadButton
                                url={downloadURL}
                            />
                        )}

                        {/* PDF Button */}
                        {lyricsURL && (
                            <PDFButton
                                url={lyricsURL}
                             // Adjust spacing if needed
                            />
                        )}
                        
                        {/* Like Button */}
                        <LikeButton songId={song.id} /> {/* Adjust spacing if needed */}
                    </div>
                );
            })}
        </div>
    );
}

export default SearchContent;
