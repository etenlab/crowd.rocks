import { IonButton, IonIcon } from '@ionic/react';
import { playOutline } from 'ionicons/icons';
import { useRef } from 'react';

type VideoPlayerProps = {
  src: string;
  file_type?: string;
};

export function VideoPlayer({ src, file_type }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const attr = { width: '100px', height: '100px', borderRadius: '10px' };

  const switchFullScreen = () => {
    videoRef.current!.requestFullscreen();
  };

  return (
    <div
      style={{
        ...attr,
        display: 'flex',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <video
        width="100%"
        height="100%"
        style={{ borderRadius: '10px' }}
        ref={videoRef}
      >
        <source src={src} type={file_type} />
        Your browser does not support HTML video.
      </video>

      <div style={{ position: 'absolute' }}>
        <IonButton onClick={switchFullScreen} color="gray">
          <IonIcon icon={playOutline} />
        </IonButton>
      </div>
    </div>
  );
}
