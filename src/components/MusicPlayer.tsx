
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Song } from "@/lib/types";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX 
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface MusicPlayerProps {
  currentSong: Song | null;
  songs: Song[];
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  onSongChange: (song: Song) => void;
}

const MusicPlayer = ({ 
  currentSong, 
  songs,
  isPlaying, 
  setIsPlaying,
  onSongChange 
}: MusicPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong, setIsPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handlePlayPause = () => {
    if (!currentSong) {
      toast.error("No song selected");
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSongEnd = () => {
    // Play next song when current ends
    if (currentSong && songs.length > 0) {
      const currentIndex = songs.findIndex(song => song.id === currentSong.id);
      const nextIndex = (currentIndex + 1) % songs.length;
      onSongChange(songs[nextIndex]);
    }
  };

  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handlePreviousSong = () => {
    if (currentSong && songs.length > 0) {
      const currentIndex = songs.findIndex(song => song.id === currentSong.id);
      const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
      onSongChange(songs[prevIndex]);
    }
  };

  const handleNextSong = () => {
    if (currentSong && songs.length > 0) {
      const currentIndex = songs.findIndex(song => song.id === currentSong.id);
      const nextIndex = (currentIndex + 1) % songs.length;
      onSongChange(songs[nextIndex]);
    }
  };

  // Calculate progress percentage
  const progress = currentSong ? (currentTime / currentSong.duration) * 100 : 0;

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-card border-t border-border p-4">
      <audio 
        ref={audioRef}
        src={currentSong?.audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleSongEnd}
      />
      
      {/* Progress Bar */}
      <div className="w-full h-1 bg-muted mb-3 rounded-full overflow-hidden">
        <div 
          className="progress-bar" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        {/* Left: Song info */}
        <div className="flex items-center">
          {currentSong ? (
            <>
              <img 
                src={currentSong.cover} 
                alt={currentSong.title} 
                className="w-10 h-10 rounded-md mr-3 object-cover" 
              />
              <div className="flex flex-col">
                <span className="font-medium text-sm">{currentSong.title}</span>
                <span className="text-xs text-muted-foreground">{currentSong.artist}</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col">
              <span className="font-medium text-sm">No song selected</span>
              <span className="text-xs text-muted-foreground">Select a song to play</span>
            </div>
          )}
        </div>

        {/* Center: Controls */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={handlePreviousSong}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            disabled={!currentSong}
          >
            <SkipBack size={18} className={cn("text-foreground", !currentSong && "opacity-50")} />
          </button>
          
          <button 
            onClick={handlePlayPause}
            className="p-3 rounded-full bg-music-primary hover:bg-music-secondary transition-colors"
            disabled={!currentSong}
          >
            {isPlaying ? (
              <Pause size={18} className="text-primary-foreground" />
            ) : (
              <Play size={18} className="text-primary-foreground" />
            )}
          </button>
          
          <button 
            onClick={handleNextSong}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            disabled={!currentSong}
          >
            <SkipForward size={18} className={cn("text-foreground", !currentSong && "opacity-50")} />
          </button>
        </div>

        {/* Right: Volume & Time */}
        <div className="flex items-center space-x-3">
          <div className="text-xs text-muted-foreground hidden sm:block">
            {formatTime(currentTime)} / {currentSong ? formatTime(currentSong.duration) : "0:00"}
          </div>
          
          <div className="flex items-center">
            <button 
              onClick={toggleMute}
              className="p-1 rounded-full hover:bg-muted transition-colors"
            >
              {isMuted ? (
                <VolumeX size={16} className="text-muted-foreground" />
              ) : (
                <Volume2 size={16} className={cn(
                  volume > 0.5 ? "text-foreground" : "text-muted-foreground"
                )} />
              )}
            </button>
            
            <div className="w-20 hidden sm:block">
              <Slider 
                value={[isMuted ? 0 : volume]} 
                max={1} 
                step={0.01} 
                onValueChange={handleVolumeChange} 
                className="h-1" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
