
import { useState } from "react";
import { songs } from "@/data/songs";
import { Song } from "@/lib/types";
import SongList from "@/components/SongList";
import MusicPlayer from "@/components/MusicPlayer";

const Index = () => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSongSelect = (song: Song) => {
    if (currentSong?.id === song.id) {
      // Toggle play/pause if selecting the same song
      setIsPlaying(!isPlaying);
    } else {
      // Play the new song
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-music-primary">
          TuneTown <span className="text-foreground">Jams</span>
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow overflow-auto">
        <div className="max-w-3xl mx-auto">
          <SongList 
            songs={songs} 
            currentSong={currentSong} 
            isPlaying={isPlaying}
            onSongSelect={handleSongSelect}
          />
        </div>
      </main>

      {/* Player at bottom */}
      <footer className="w-full">
        <MusicPlayer 
          currentSong={currentSong}
          songs={songs}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          onSongChange={setCurrentSong}
        />
      </footer>
    </div>
  );
};

export default Index;
