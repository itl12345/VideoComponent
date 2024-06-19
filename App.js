import './App.css';
import { useState, useRef } from 'react';
import Video from './Video.mp4'

function PlayButton( { onClick, isPlaying } ) {
  return (
    <div className="play-pause-button" onClick={onClick}>
      {
        isPlaying ? (
          <svg className="pause" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
          </svg>
        ) : (
          <svg className="play" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"></path>
          </svg>
        )
      }
    </div>
  )
}

const pins = [100,200,300,450,500];

function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState(0);
  const [formattedDuration, setFormattedDuration] = useState('0:00');
  const videoRef = useRef(null);
  const progressContainerRef = useRef(null);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    const currentProgress = (video.currentTime / video.duration) * 100;
    setCurrentTime(formatTime(video.currentTime));
    setProgress(currentProgress);
  };

  const loadMetadata = () => {
    const video = videoRef.current;
    setDuration(video.duration) 
    setFormattedDuration(formatTime(video.duration));
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressClick = (e) => {
    const progressBar = progressContainerRef.current;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.clientWidth;
    const clickPercentage = (clickPosition / progressBarWidth) * 100;

    const video = videoRef.current;
    const newTime = (clickPercentage * video.duration) / 100;
    video.currentTime = newTime;

    setCurrentTime(formatTime(newTime));
    setProgress(clickPercentage);
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="VideoPlayer">
      <video 
        ref={videoRef}
        width="100%"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={loadMetadata}
        onClick={togglePlayPause}
      >
        <source src={Video} type="video/mp4"/>
      </video>

      <div className="actionBar">
      <PlayButton  onClick={togglePlayPause} isPlaying={isPlaying} />
      <div className="progressWrapper">
        <div className="timeContainer">
          <p className="times">{currentTime}</p>
          <p className="times">{formattedDuration}</p>
        </div>

        <div className="clickExtention" onClick={handleProgressClick}>
        <div className="ProgressContainer"
          ref={progressContainerRef}
          >
          <div className="Progress" style={{ width: `${progress}%` }}></div>
          <div className="ProgressBall" style={{ left: `${progress-1.2}%` }}></div>

          <div className="pinContainer">
          {videoRef.current && pins.map((pin, index) => (
              <div
                key={index}
                className="Pin"
                style={{ left: `${((pin / duration) * 100)-1}%` }}
              >
                <svg width="10" viewBox="0 0 100 150">
                  <path d="M50 0 L75 75 L50 150 L25 75 Z" fill="gray" />
                </svg>
              </div>
          ))}
          </div>

        </div>
        </div>
      </div>
      </div>

    </div>
  );
}

function App() {
  return (
    <div className="App">
      <VideoPlayer/>
    </div>
  );
}

export default App;
