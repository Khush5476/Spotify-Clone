import { useState } from "react";
import { Song } from "@/types";
import SongItem from "./SongItem";
import ViewToggle from "@/components/ViewToggle";
import useOnPlay from "@/hooks/useOnPlay";

interface PageContentProps {
    songs: Song[];
}

const PageContent: React.FC<PageContentProps> = ({ songs }) => {
    const onPlay = useOnPlay(songs);
    const [viewMode, setViewMode] = useState<'list' | 'tile'>('list');

    const handleToggle = (view: 'list' | 'tile') => {
        setViewMode(view);
    };

    return (
        <div className="relative">
            <ViewToggle viewMode={viewMode} onToggle={handleToggle} />
            <div className={`mt-4 ${
                viewMode === 'list'
                    ? 'lg:grid lg:grid-cols-1'
                    : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
            }`}>
                {songs.length === 0 ? (
                    <div className="mt-4 text-neutral-400">No songs available</div>
                ) : (
                    songs.map((item) => (
                        <SongItem
                            key={item.id}
                            data={item}
                            onClick={(id: string) => onPlay(id)}
                            viewMode={viewMode}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default PageContent;
