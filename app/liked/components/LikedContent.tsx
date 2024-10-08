"use client";

import MediaItem from "@/components/MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import { useUser } from "@/hooks/UseUser";
import { Song } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LikeButton from "@/components/LikeButton";
import PDFButton from "@/components/PDFButton";
import DownloadButton from "@/components/DowloadButton";

interface LikedContentProps {
    songs: Song[];
}

const LikedContent: React.FC<LikedContentProps> = ({ songs }) => {
    const onPlay = useOnPlay(songs);
    const router = useRouter();
    const { isLoading, user } = useUser();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace('/');
        }
    }, [isLoading, user, router]);

    if (songs.length === 0) {
        return (
            <div className="flex flex-col gap-y-2 px-6 w-full text-neutral-400">
                No Liked Songs
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-y-2 p-6 w-full">
            {songs.map((song) => {
                const lyricsURL = song.lyrics_path 
                    ? `https://tztpwznenrpoajfsoyfm.supabase.co/storage/v1/object/public/lyrics/${song.lyrics_path}` 
                    : '';

                const downloadURL = song.song_path
                    ? `https://tztpwznenrpoajfsoyfm.supabase.co/storage/v1/object/public/songs/${song.song_path}`
                    : '';

                return (
                    <div key={song.id} className="flex items-center gap-x-4 w-full relative group">
                        <div className="flex-1 overflow-hidden">
                            <div className="text-ellipsis whitespace-nowrap overflow-hidden">
                                <MediaItem onClick={(id: string) => onPlay(id)} data={song} />
                            </div>
                        </div>

                        <div className="flex items-center gap-x-2">
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
                                />
                            )}

                            {/* Like Button */}
                            <LikeButton 
                                songId={song.id} 
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default LikedContent;
