"use client"

import useLoadImage from "@/hooks/useLoadImage";
import usePlayer from "@/hooks/usePlayer";
import { Song } from "@/types";
import Image from "next/image";

interface MediaItemProps {
    data: Song;
    onClick?: (id: string) => void;
}

const MediaItem: React.FC<MediaItemProps> = ({
    data,
    onClick
}) => {
    const imageUrl = useLoadImage(data);
    const player = usePlayer()

    const handleClick = () => {
        if (onClick) {
            return onClick(data.id);

        }

    }
    return (
        <div  onClick={handleClick} className="flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-3 rounded-md">
            <div className="relative rounded-md  min-h-[40px]  min-w-[40px]   sm:min-h-[48px] sm:min-w-[48px] overflow-hidden">
                <Image fill src={imageUrl || '/images/liked.png'} alt="Media Item" className="object-cover"/>
            </div>
            <div className="flex flex-col gap-y-1 overflow-hidden text-[11px] md:text-[18px]">
                <p className="text-white truncate">
                    {data.title}
                </p>
                <p className="text-neutral-400 text-[13px] truncate">
                    {data.author}
                    
                    
                </p>
            </div>
        </div>
    )
}

export default MediaItem;