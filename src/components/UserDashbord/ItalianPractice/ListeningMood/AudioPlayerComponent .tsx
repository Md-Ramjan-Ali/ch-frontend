import React, { useRef, useState, useEffect } from 'react';
import { Headphones, SkipBack, SkipForward, Play, Pause, Volume2, VolumeX } from 'lucide-react';
// import imgmicrohead from "../../../../assets/Dashbord/microhead.svg"
interface AudioPlayerProps {
  src: string; // The audio file URL
}

export const AudioPlayerComponent: React.FC<AudioPlayerProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [title, setTitle] = useState("Audio Playback"); // Default title

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Event handlers
    const timeUpdateHandler = () => setCurrentTime(audio.currentTime);
    const loadedMetadataHandler = () => {
      setDuration(audio.duration);

      if (src.includes('/')) {
        setTitle(src.split('/').pop()?.split('.')[0] || "Audio Playback");
      }
    };
    const endedHandler = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', timeUpdateHandler);
    audio.addEventListener('loadedmetadata', loadedMetadataHandler);
    audio.addEventListener('ended', endedHandler);

    audio.volume = volume;
    audio.muted = isMuted;

    return () => {
      audio.removeEventListener('timeupdate', timeUpdateHandler);
      audio.removeEventListener('loadedmetadata', loadedMetadataHandler);
      audio.removeEventListener('ended', endedHandler);
    };
  }, [src]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => console.error("Error playing audio:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(Math.max(0, audio.currentTime + seconds), duration);
    setCurrentTime(audio.currentTime);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
      audio.muted = false;
    }
    if (newVolume === 0) {
      setIsMuted(true);
      audio.muted = true;
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const newMuteState = !isMuted;
    audio.muted = newMuteState;
    setIsMuted(newMuteState);
  };

  const handleSpeedChange = (increase: boolean) => {
    const audio = audioRef.current;
    if (!audio) return;
    let newSpeed = speed + (increase ? 0.25 : -0.25);
    newSpeed = Math.round(newSpeed * 100) / 100;
    if (newSpeed < 0.5) newSpeed = 0.5;
    if (newSpeed > 3) newSpeed = 3;
    audio.playbackRate = newSpeed;
    setSpeed(newSpeed);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePercent = (isMuted ? 0 : volume) * 100;

  return (
   <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mx-auto">
  <audio ref={audioRef} src={src} preload="metadata" />

  {/* Header */}
  <div className="flex items-center justify-between mb-2">
    <div className="flex items-center gap-2">
      <Headphones className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{title}</span>
    </div>
    <span className="text-xs text-gray-400 dark:text-gray-400">{formatTime(duration)}</span>
  </div>

  {/* Seek Bar */}
  <div className="mb-6">
    <input
      type="range"
      min={0}
      max={duration}
      value={currentTime}
      onChange={handleSeek}
      className="w-full h-2 rounded-lg appearance-none cursor-pointer range-slider-thumb-hidden"
      style={{
        background: `linear-gradient(to right, black 0%, black ${progressPercent}%, ${document.documentElement.classList.contains('dark') ? '#4B5563' : '#e5e7eb'} ${progressPercent}%, ${document.documentElement.classList.contains('dark') ? '#4B5563' : '#e5e7eb'} 100%)`,
      }}
    />
    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
      <span>{formatTime(currentTime)}</span>
      <span className="hidden"></span>
    </div>
  </div>

  {/* Controls */}
  <div className="flex items-center justify-center gap-4 mb-8">
    <button
      onClick={() => handleSkip(-5)}
      className="w-10 h-10 flex items-center justify-center border rounded-full text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      title="Skip Backward 5 seconds"
    >
      <SkipBack className="w-5 h-5" />
    </button>

    <button
      onClick={handlePlayPause}
      className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-md active:scale-95"
      style={{ backgroundImage: "linear-gradient(180deg, #667EEA 0%, #764BA2 100%)" }}
      title={isPlaying ? "Pause" : "Play"}
    >
      {isPlaying ? (
        <Pause className="w-6 h-6 text-white" />
      ) : (
        <Play className="w-6 h-6 text-white ml-1" />
      )}
    </button>

    <button
      onClick={() => handleSkip(5)}
      className="w-10 h-10 flex items-center justify-center border rounded-full text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      title="Skip Forward 5 seconds"
    >
      <SkipForward className="w-5 h-5" />
    </button>
  </div>

  {/* Speed & Volume */}
  <div className="flex items-center justify-between gap-4">
    {/* Speed */}
    <div className="flex flex-col items-start min-w-[120px]">
      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Speed</div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => handleSpeedChange(false)}
          className="w-8 h-8 flex items-center justify-center border rounded text-sm text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          disabled={speed <= 0.5}
        >
          <span className="mb-0.5">-</span>
        </button>
        <div className="w-10 h-8 flex items-center justify-center border rounded font-medium text-sm text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700">
          {speed}x
        </div>
        <button
          onClick={() => handleSpeedChange(true)}
          className="w-8 h-8 flex items-center justify-center border rounded text-sm text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          disabled={speed >= 3}
        >
          +
        </button>
      </div>
    </div>

    {/* Volume */}
    <div className="flex-1 min-w-[150px] mx-4">
      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Volume</div>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleMute}
          className="text-gray-600 dark:text-gray-300 cursor-pointer hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="flex-1 h-1 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, black 0%, black ${volumePercent}%, ${document.documentElement.classList.contains('dark') ? '#4B5563' : '#e5e7eb'} ${volumePercent}%, ${document.documentElement.classList.contains('dark') ? '#4B5563' : '#e5e7eb'} 100%)`,
          }}
        />
      </div>
    </div>

    {/* Transcript */}
    <button className="px-4 py-2 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors whitespace-nowrap min-w-[150px]">
      Show Transcript
    </button>
  </div>
</div>

  );
};
