
import { Song } from "@/lib/types";
import SongCard from "./SongCard";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface SongListProps {
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  onSongSelect: (song: Song) => void;
}

const SongList = ({ songs, currentSong, isPlaying, onSongSelect }: SongListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const songsPerPage = 8;
  
  // Calculate total pages
  const totalPages = Math.ceil(songs.length / songsPerPage);
  
  // Get current songs
  const indexOfLastSong = currentPage * songsPerPage;
  const indexOfFirstSong = indexOfLastSong - songsPerPage;
  const currentSongs = songs.slice(indexOfFirstSong, indexOfLastSong);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col p-4 overflow-auto">
      <h2 className="text-xl font-bold mb-4">Popular Tracks</h2>
      <div className="mb-4">
        {currentSongs.map((song) => (
          <SongCard 
            key={song.id}
            song={song}
            isPlaying={isPlaying}
            isActive={currentSong?.id === song.id}
            onPlay={() => onSongSelect(song)}
          />
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Logic for showing a subset of pages when there are many pages
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else {
                if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
              }
              
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => paginate(pageNum)}
                    isActive={currentPage === pageNum}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default SongList;
