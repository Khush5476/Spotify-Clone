import { Song } from "@/types";
import MediaItem from "./MediaItem";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";
import { useEffect, useState } from "react";
import useSound from "use-sound";
import { parseBlob } from 'music-metadata-browser';
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import LikeButton from "./LikeButton";
import PDFButton from "./PDFButton";
import DownloadButton from "./DowloadButton";

interface PlayerContentProps {
    song: Song; 
    songUrl: string;
    min?: number;
    max?: number;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl, min = 0, max = 100 }) => {
    const player = usePlayer();
    const [volume, setVolume] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [songUrl1, setSongUrl1] = useState<string>('');

    const loadSongUrl = useLoadSongUrl(song);

    useEffect(() => {
        if (loadSongUrl) {
            setSongUrl1(loadSongUrl);
        }
    }, [loadSongUrl]);

    useEffect(() => {
        if (!songUrl) return;

        const fetchSongMetadata = async () => {
            try {
                const response = await fetch(songUrl);
                const blob = await response.blob();
                const metadata = await parseBlob(blob);

                if (metadata.format?.duration) {
                    setDuration(metadata.format.duration);
                } else {
                    console.error('Duration not found in metadata:', metadata);
                }
            } catch (error) {
                console.error('Error fetching song metadata:', error);
            }
        };

        fetchSongMetadata();
    }, [songUrl]);

    const [play, { pause, sound }] = useSound(songUrl, {
        volume,
        onplay: () => {
            setIsPlaying(true);
            if (sound) {
                setCurrentTime(sound.seek() || 0);
            }
        },
        onend: () => {
            setIsPlaying(false);
            onPlayNext();
        },
        onpause: () => setIsPlaying(false),
        format: ['mp3']
    });

    useEffect(() => {
        if (!sound) return;

        sound.play();

        const updateInterval = setInterval(() => {
            if (sound) {
                setCurrentTime(sound.seek() || 0);
            }
        }, 1000);

        return () => {
            clearInterval(updateInterval);
            sound.unload();
        };
    }, [sound]);

    const handlePlay = () => {
        if (!isPlaying) {
            play();
        } else {
            pause();
        }
    };

    const toggleMute = () => {
        setVolume(prevVolume => (prevVolume === 0 ? 1 : 0));
    };

    const handleSkipForward = () => {
        if (sound) {
            const skipAmount = 5; // seconds
            const newTime = Math.min(currentTime + skipAmount, duration);
            sound.seek(newTime);
            setCurrentTime(newTime);
        }
    };

    const handleSkipBackward = () => {
        if (sound) {
            const skipAmount = 5; // seconds
            const newTime = Math.max(currentTime - skipAmount, 0);
            sound.seek(newTime);
            setCurrentTime(newTime);
        }
    };

    const handleSliderChange = (value: number) => {
        if (sound && duration) {
            const newTime = (value / 100) * duration;
            sound.seek(newTime);
            setCurrentTime(newTime);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    const onPlayNext = () => {
        if (player.ids.length === 0) return;

        const currentIndex = player.ids.findIndex(id => id === player.activeId);
        const nextSong = player.ids[currentIndex + 1];

        if (!nextSong) return player.setId(player.ids[0]);

        player.setId(nextSong);
    };

    const onPlayPrevious = () => {
        if (player.ids.length === 0) return;

        const currentIndex = player.ids.findIndex(id => id === player.activeId);
        const previousSong = player.ids[currentIndex - 1];

        if (!previousSong) return player.setId(player.ids[player.ids.length - 1]);

        player.setId(previousSong);
    };

    const Icon = isPlaying ? BsPauseFill : BsPlayFill;
    const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

    return (
        <div className="flex flex-col md:flex-row h-full p-2 md:p-4">
            {/* Left Section */}
            <div className="flex flex-col md:w-1/3 justify-center items-center md:items-start p-2 md:p-4 h-full">
                <div className="flex items-center gap-2 md:gap-4">
                    <div className="flex-grow overflow-hidden text-ellipsis whitespace-nowrap text-xs md:text-base">
                        <MediaItem data={song} />
                    </div>
                    <LikeButton songId={song.id} />
                    {song.lyrics_path && (
                        <PDFButton url={`https://tztpwznenrpoajfsoyfm.supabase.co/storage/v1/object/public/lyrics/${song.lyrics_path}`} />
                    )}
                                        {songUrl1 && (
                        <DownloadButton url={songUrl1} />
                    )}
                    
                </div>
            </div>

            {/* Center Section for controls */}
            <div className="flex flex-col md:w-1/3 justify-center items-center p-2 md:p-4">
                <div className="flex items-center gap-2 md:gap-4 mb-2">
                    <button onClick={handleSkipBackward} className="text-white hover:text-gray-400 text-xs md:text-base">
                        <AiFillStepBackward className="w-4 h-4 md:w-6 md:h-6" />
                    </button>
                    <button onClick={onPlayPrevious} className="text-neutral-400 cursor-pointer transition hover:text-white text-xs md:text-base">
                        <AiFillStepBackward className="w-4 h-4 md:w-6 md:h-6" />
                    </button>
                    
                    <div onClick={handlePlay} className="h-8 w-8 md:h-11 md:w-11 flex items-center justify-center rounded-full bg-white text-black p-1 md:p-2 cursor-pointer">
                        <Icon className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                    
                    <button onClick={onPlayNext} className="text-neutral-400 hover:text-white cursor-pointer transition text-xs md:text-base">
                        <AiFillStepForward className="w-4 h-4 md:w-6 md:h-6" />
                    </button>
                    <button onClick={handleSkipForward} className="text-white hover:text-gray-400 text-xs md:text-base">
                        <AiFillStepForward className="w-4 h-4 md:w-6 md:h-6" />
                    </button>
                </div>
                <div className="flex items-center gap-2 md:gap-4 mx-2 w-full max-w-[500px]">
                    <span className="text-white text-xs md:text-base">{formatTime(currentTime)}</span>
                    <div className="flex-grow mx-2 md:mx-4">
                        <Slider 
                            value={progress}
                            onChange={handleSliderChange}
                            min={min}
                            max={max}
                        />
                    </div>
                    <span className="text-white text-xs md:text-base">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Right Section for volume control and Download button */}
            <div className="flex flex-col md:w-1/3 justify-center items-center p-2 md:p-4">
                <div className="flex items-center gap-2 md:gap-4 ml-auto w-full max-w-[300px] relative group">
                    <VolumeIcon onClick={toggleMute} className="cursor-pointer" size={40} />
                    <Slider 
                        value={volume * 100}
                        onChange={(value) => setVolume(value / 100)}
                        min={0}
                        max={100}
                    />
                    {/* Download button */}
                </div>
            </div>
        </div>
    );
};

export default PlayerContent;
