import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  MutableRefObject,
} from 'react';
import { IonButton, IonIcon, IonLabel } from '@ionic/react';
import { pauseCircle, playCircle } from 'ionicons/icons';
import WaveSurfer from 'wavesurfer.js';

type AudioPlayerProps = {
  src: string;
  file_type?: string;
};

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// WaveSurfer hook
const useWavesurfer = (
  containerRef: MutableRefObject<HTMLDivElement | null>,
  url: string,
) => {
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);

  // Initialize wavesurfer when the container mounts
  // or any of the props change
  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
    });

    setWavesurfer(ws);

    const handleError = () => {
      containerRef.current!.innerHTML =
        '(There was a problem loading audio file)';
    };

    ws.load(url)
      .then()
      .catch(() => handleError());

    return () => {
      ws.destroy();
    };
  }, [containerRef, url]);

  return wavesurfer;
};

// Create a React component that will render wavesurfer.
// Props are wavesurfer options.
const WaveSurferPlayer = (url: string) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const wavesurfer = useWavesurfer(containerRef, url);

  // On play button click
  const onPlayClick = useCallback(() => {
    if (wavesurfer) {
      wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
    }
    return;
  }, [wavesurfer]);

  // Initialize wavesurfer when the container mounts
  // or any of the props change
  useEffect(() => {
    if (!wavesurfer) return;

    setCurrentTime(0);
    setIsPlaying(false);

    const subscriptions = [
      wavesurfer.on('play', () => setIsPlaying(true)),
      wavesurfer.on('pause', () => setIsPlaying(false)),
      wavesurfer.on('timeupdate', (currentTime) => setCurrentTime(currentTime)),
    ];

    return () => {
      subscriptions.forEach((unsub) => unsub());
    };
  }, [wavesurfer]);

  const playControlIcon = !isPlaying ? (
    <IonIcon icon={playCircle} size="large" />
  ) : (
    <IonIcon icon={pauseCircle} size="large" />
  );

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column-reverse',
        paddingLeft: '10px',
        paddingRight: '10px',
      }}
    >
      <div>
        <IonButton onClick={onPlayClick} fill="clear">
          {playControlIcon}
        </IonButton>
        <IonLabel style={{ paddingTop: '10px' }}>
          {formatTime(currentTime)}
        </IonLabel>{' '}
      </div>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function AudioPlayer({ src, file_type }: AudioPlayerProps) {
  return <div>{WaveSurferPlayer(src)}</div>;
}
