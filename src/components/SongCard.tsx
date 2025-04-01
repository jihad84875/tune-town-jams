
import { Song } from "@/lib/types";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface SongCardProps {
  song: Song;
  isPlaying: boolean;
  isActive: boolean;
  onPlay: () => void;
}

const SongCard = ({ song, isPlaying, isActive, onPlay }: SongCardProps) => {
  return (
    <div 
      className={cn(
        "flex items-center p-3 rounded-lg mb-2 hover:bg-muted cursor-pointer transition-colors group",
        isActive && "bg-muted"
      )}
      onClick={onPlay}
    >
      <div className="relative min-w-[50px] w-[50px] h-[50px] mr-3">
        <img 
          src={song.cover} 
          alt={`${song.album} cover`} 
          className={cn(
            "w-full h-full object-cover rounded-md",
            isActive && isPlaying && "animate-pulse-slow"
          )} 
        />
        <div className={cn(
          "absolute inset-0 bg-black bg-opacity-40 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
          isActive && isPlaying && "opacity-100"
        )}>
          <Play size={20} className="text-white" />
        </div>
      </div>
      <div className="flex flex-col flex-grow overflow-hidden">
        <span className={cn(
          "font-medium text-sm truncate",
          isActive && "text-music-primary"
        )}>
          {song.title}
        </span>
        <span className="text-xs text-muted-foreground truncate">{song.artist}</span>
      </div>
      <div className="text-xs text-muted-foreground ml-2">
        {formatDuration(song.duration)}
      </div>
    </div>
  );
};

// Helper function to format duration in MM:SS
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default SongCard;
