import { useEffect, useRef } from 'react';

interface AudioPlayerProps {
  audio_url: string;
  title: string;
  escapedTitle: string;
}

export default function AudioPlayer({ audio_url, title, escapedTitle }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [audio_url]);

  return (
    <audio
      ref={audioRef}
      controls
      preload="metadata"
      className="w-full"
      title={title}
      aria-label={`Podcast episode player: ${escapedTitle}`}
    >
      <source src={audio_url} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
}
