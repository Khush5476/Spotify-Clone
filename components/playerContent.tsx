"use client";

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

interface PlayerContentProps {
    song: Song;
    songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
    const player = usePlayer();
    const [volume, setVolume] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const Icon = isPlaying ? BsPauseFill : BsPlayFill;
    const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

    // Function to play the next song
    const onPlayNext = () => {
        if (player.ids.length === 0) {
            return;
        }

        const currentIndex = player.ids.findIndex((id) => id === player.activeId);
        const nextSong = player.ids[currentIndex + 1];

        if (!nextSong) {
            return player.setId(player.ids[0]);
        }

        player.setId(nextSong);
    };

    // Function to play the previous song
    const onPlayPrevious = () => {
        if (player.ids.length === 0) {
            return;
        }

        const currentIndex = player.ids.findIndex((id) => id === player.activeId);
        const previousSong = player.ids[currentIndex - 1];

        if (!previousSong) {
            return player.setId(player.ids[player.ids.length - 1]);
        }

        player.setId(previousSong);
    };

    const [play, { pause, sound }] = useSound(songUrl, {
        volume: volume,
        onplay: () => {
            setIsPlaying(true);
            setDuration(sound?.duration() || 0);
            setCurrentTime(sound.seek());
        },
        onend: () => {
            setIsPlaying(false);
            onPlayNext();
        },
        onpause: () => setIsPlaying(false),
        onload: () => {
            if (sound) {
                setDuration(sound.duration());
                setCurrentTime(sound.seek());
            }
        },
        format: ['mp3']
    });

    useEffect(() => {
        if (!sound) return;

        sound.play();

        const updateInterval = setInterval(() => {
            if (sound) {
                setCurrentTime(sound.seek());
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
        setVolume((prevVolume) => (prevVolume === 0 ? 1 : 0));
    };

    const handleSkipForward = () => {
        if (sound) {
            const skipAmount = 5; // seconds
            const newTime = Math.max(currentTime + skipAmount, 0);
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

    const progress = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 h-full">
            {/* Left Section */}
            <div className="flex w-full justify-start">
                <div className="flex items-center gap-x-4">
                    <MediaItem data={song} />
                    <LikeButton songId={song.id} />
                </div>
            </div>

            {/* Center Section for controls */}
            <div className="flex flex-col md:flex-row md:col-span-1 md:justify-center items-center gap-x-6">
                <div className="flex items-center gap-x-4">
                    <button onClick={handleSkipBackward} className="text-white hover:text-gray-400">
                        <AiFillStepBackward size={30} />
                    </button>
                    <button onClick={onPlayPrevious} className="text-neutral-400 cursor-pointer transition hover:text-white">
                        <AiFillStepBackward size={30} />
                    </button>
                    <div onClick={handlePlay} className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer">
                        <Icon size={30} className="text-black" />
                    </div>
                    <button onClick={onPlayNext} className="text-neutral-400 hover:text-white cursor-pointer transition">
                        <AiFillStepForward size={30} />
                    </button>
                    <button onClick={handleSkipForward} className="text-white hover:text-gray-400">
                        <AiFillStepForward size={30} />
                    </button>
                </div>
            </div>

            {/* Right Section for progress slider and volume control */}
            <div className="hidden md:flex md:col-span-1 w-full justify-end pr-4 items-center">
                <div className="flex items-center w-full max-w-4xl">
                    <div className="flex items-center flex-grow mr-10">
                        <span style={{ color: 'white' }}>{formatTime(currentTime)}</span>
                        <div className="flex-grow mx-4">
                            <Slider value={progress} onChange={handleSliderChange} min={0} max={100} />
                        </div>
                        <span style={{ color: 'white' }}>{formatTime(duration)}</span>
                    </div>
                    <div className="flex items-center gap-x-2 ml-4">
                        <VolumeIcon onClick={toggleMute} className="cursor-pointer" size={70} />
                        <Slider value={volume * 100} onChange={(value) => setVolume(value / 100)} min={0} max={100} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerContent;
