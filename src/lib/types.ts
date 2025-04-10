
export interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  cover: string;
  audioSrc: string;
  duration: number;
  genre?: string;  // Optional genre field for categorization
}
