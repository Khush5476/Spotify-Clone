import { Song } from "@/types";
import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";
import { useEffect, useState } from "react";
import useSound from "use-sound";
import { parseBlob } from 'music-metadata-browser';
import useLoadSongUrl from "@/hooks/useLoadSongUrl";

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
        <div className="grid grid-cols-2 md:grid-cols-3 h-full">
            <div className="flex justify-start text-[16px] md:text-lg min-h-[60px]">
                <div className="flex items-center gap-x-4">
                    <MediaItem data={song} />
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:justify-center items-center gap-y-2 md:gap-x-4 md:mb-3 mt-8 sm:mt-0 mr-20 sm:mr-0">
                <div className="flex items-center gap-x-2 md:gap-x-4">
                    <button onClick={handleSkipBackward} className="text-white hover:text-gray-400 text-sm md:text-base lg:text-lg">
                        <AiFillStepBackward className="w-5 h-5 md:w-6 md:h-6 lg:w-10 lg:h-10" />
                    </button>
                    <button onClick={onPlayPrevious} className="text-neutral-400 cursor-pointer transition hover:text-white text-sm md:text-base lg:text-lg">
                        <AiFillStepBackward className="w-5 h-5 md:w-6 md:h-6 lg:w-10 lg:h-10" />
                    </button>
                    
                    <div onClick={handlePlay} className="h-7 w-7 lg:h-10 lg:w-10 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-white text-black p-1 cursor-pointer">
                        <Icon className="w-5 h-5 md:w-6 md:h-6 lg:w-14 lg:h-14" />
                    </div>
                    
                    <button onClick={onPlayNext} className="text-neutral-400 hover:text-white cursor-pointer transition text-sm md:text-base lg:text-lg">
                        <AiFillStepForward className="w-5 h-5 md:w-6 md:h-6 lg:w-10 lg:h-10" />
                    </button>
                    <button onClick={handleSkipForward} className="text-white hover:text-gray-400 text-sm md:text-base lg:text-lg">
                        <AiFillStepForward className="w-5 h-5 md:w-6 md:h-6 lg:w-10 lg:h-10" />
                    </button>
                </div>
            </div>

            <div className=" md:flex md:col-span-1 w-full justify-end pr-4 items-center">
                <div className="flex items-center w-full max-w-4xl">
                    <div className="flex items-center flex-grow mr-10">
                        <span className="text-white">{formatTime(currentTime)}</span>
                        <div className="flex-grow mx-4">
                            <Slider 
                                value={progress}
                                onChange={handleSliderChange}
                                min={min}
                                max={max}
                                isProgressBar={true}
                            />
                        </div>
                        <span className="text-white">{formatTime(duration)}</span>
                    </div>
                    <div className="flex items-center gap-x-2 ml-4">
                        <VolumeIcon onClick={toggleMute} className="cursor-pointer" size={30} />
                        <Slider 
                            value={volume * 100}
                            onChange={(value) => setVolume(value / 100)}
                            min={0}
                            max={100}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerContent;
