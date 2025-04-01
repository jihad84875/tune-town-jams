
import { Song } from "@/lib/types";
import SongCard from "./SongCard";

interface SongListProps {
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  onSongSelect: (song: Song) => void;
}

const SongList = ({ songs, currentSong, isPlaying, onSongSelect }: SongListProps) => {
  return (
    <div className="flex flex-col p-4 overflow-auto">
      <h2 className="text-xl font-bold mb-4">Popular Tracks</h2>
      <div>
        {songs.map((song) => (
          <SongCard 
            key={song.id}
            song={song}
            isPlaying={isPlaying}
            isActive={currentSong?.id === song.id}
            onPlay={() => onSongSelect(song)}
          />
        ))}
      </div>
    </div>
  );
};

export default SongList;
