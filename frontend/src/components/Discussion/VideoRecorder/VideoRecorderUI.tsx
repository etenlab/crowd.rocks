import React, { useRef, useState, useEffect, useCallback } from 'react';
import { RecorderStatus } from '../AudioRecorder/AudioRecorderUI';
import { IonAlert, IonButton, IonIcon } from '@ionic/react';
import {
  checkmarkCircleOutline,
  closeCircleOutline,
  pauseCircleOutline,
  playCircleOutline,
  videocam,
} from 'ionicons/icons';

type VideoRecorderProps = {
  onSave(blobs: Blob[]): void;
  onCancel(): void;
};

export function VideoRecorderUI({ onSave, onCancel }: VideoRecorderProps) {
  const [recorderStatus, setRecorderStatus] = useState<RecorderStatus>('new');
  const [savedLastChunk, setSavedLastChunk] = useState<boolean>(true);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>(
    'environment',
  );
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const getVideoStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        facingMode,
      },
    });

    if (videoRef.current !== null) {
      videoRef.current.srcObject = stream;
    }

    streamRef.current = stream;
  }, [facingMode]);

  const refreshRecorder = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;
    recordedChunksRef.current = [];
    setRecorderStatus('new');
    getVideoStream();
  }, [getVideoStream]);

  useEffect(() => {
    refreshRecorder();

    return () => {
      if (streamRef.current !== null) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [refreshRecorder]);

  useEffect(() => {
    if (recorderStatus !== 'ended') {
      return;
    }
    if (!savedLastChunk) {
      return;
    }

    if (recordedChunksRef.current.length > 0) {
      onSave(recordedChunksRef.current);
    } else {
      alert('There is no data to save');
    }
    refreshRecorder();
  }, [recorderStatus, savedLastChunk, refreshRecorder, onSave]);

  const handleClickStart = async () => {
    if (streamRef.current === null) {
      alert('Cannot found media stream!');
      return;
    }

    const options = { mimeType: 'video/webm' };
    const mediaRecorder = new MediaRecorder(streamRef.current, options);

    mediaRecorder.addEventListener('dataavailable', function (e) {
      if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      setSavedLastChunk(true);
    });

    mediaRecorder.addEventListener('stop', function () {
      streamRef.current!.getTracks().forEach((track) => track.stop());
    });

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorderRef.current.start(1000);
    setRecorderStatus('recording');
  };

  const pauseRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;

    if (mediaRecorder === null || mediaRecorder.state !== 'recording') {
      alert('cannot pause because mediaRecorder not exist or not recording!');
      return;
    }

    mediaRecorder.pause();
    setRecorderStatus('paused');
  };

  const resumeRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;

    if (mediaRecorder === null || mediaRecorder.state !== 'paused') {
      alert('cannot resume because mediaRecorder not exist!');
      return;
    }

    mediaRecorder.resume();
    setRecorderStatus('recording');
  };

  const handleClickPause = () => {
    if (recorderStatus === 'recording') {
      pauseRecording();
    } else if (recorderStatus === 'paused') {
      resumeRecording();
    }
  };

  const handleClickCancel = () => {
    if (recorderStatus === 'paused') {
      setShowConfirmCancel(true);
    } else {
      onCancel();
    }
  };

  const handleClickSave = () => {
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current?.stop();
    }
    setRecorderStatus('ended');
    setSavedLastChunk(false);
  };

  // implement later.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const switchFacingMode = () => {
    setFacingMode((mode) => (mode === 'user' ? 'environment' : 'user'));
  };

  // TODO: cleanup - put controlButtonStyle into a utility for both video and audio recorder ui can use
  const controlButtonStyle = {
    fontSize: '40px',
    padding: '10px',
    backgroundColor: 'red',
    color: 'white',
    borderRadius: '50%',
  };

  const disabledCancel =
    recorderStatus === 'recording' || recorderStatus === 'ended' ? true : false;
  const disabledSave =
    recorderStatus === 'new' || recorderStatus === 'ended' ? true : false;
  const disabledControl = recorderStatus === 'ended' ? true : false;

  const controlButton =
    recorderStatus === 'new' ? (
      <IonButton
        onClick={handleClickStart}
        disabled={disabledControl}
        fill="clear"
        style={{ height: '100%' }}
      >
        <IonIcon icon={videocam} style={{ ...controlButtonStyle }} />
      </IonButton>
    ) : recorderStatus === 'recording' ? (
      <IonButton
        onClick={handleClickPause}
        disabled={disabledControl}
        fill="clear"
        style={{ height: '100%' }}
      >
        <IonIcon
          icon={pauseCircleOutline}
          style={{
            ...controlButtonStyle,
            backgroundColor: 'primary',
          }}
        />
      </IonButton>
    ) : (
      <IonButton
        onClick={handleClickPause}
        disabled={disabledControl}
        fill="clear"
        style={{ height: '100%' }}
      >
        <IonIcon
          icon={playCircleOutline}
          style={{
            ...controlButtonStyle,
            backgroundColor: 'primary',
          }}
        />
      </IonButton>
    );

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <video height="50%" width="50%" ref={videoRef} autoPlay muted />
        <div>
          <IonButton
            fill="clear"
            onClick={handleClickCancel}
            disabled={disabledCancel}
          >
            <IonIcon icon={closeCircleOutline} style={{ color: 'gray' }} />
          </IonButton>

          {controlButton}
          {/* todo later... <IonButton onClick={switchFacingMode} fill="clear">
          <IonIcon icon={syncCircle} />
        </IonButton> */}
          <IonButton
            onClick={handleClickSave}
            fill="clear"
            style={{ color: 'green' }}
            disabled={disabledSave}
          >
            <IonIcon icon={checkmarkCircleOutline} />
          </IonButton>
        </div>
      </div>

      <IonAlert
        header="Are you sure?"
        subHeader="Deleting what you have recorded cannot be undone."
        isOpen={showConfirmCancel}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {},
          },
          {
            text: 'OK',
            role: 'confirm',
            handler: () => {
              refreshRecorder();
            },
          },
        ]}
      ></IonAlert>
    </>
  );
}
