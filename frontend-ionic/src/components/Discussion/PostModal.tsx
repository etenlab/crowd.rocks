import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  isPlatform,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from '@ionic/react';
import { AudioRecorder } from './AudioRecorder/AudioRecorder';
import { NewPostForm } from './NewPostForm/NewPostForm';
import { VideoRecorder } from './VideoRecorder';
import { useTr } from '../../hooks/useTr';
import { useMemo, useState } from 'react';
import { ISettings, globals } from '../../services/globals';

export type PostModalProps = {
  parent: string;
  parentId: string;
  onClose: () => void;
};
type PostKind = 'video' | 'audio' | 'text';

export function PostModal({ parent, parentId, onClose }: PostModalProps) {
  const { tr } = useTr();
  const [postKind, setPostKind] = useState<PostKind>();
  const settings: ISettings = globals.get_settings();
  const addPostMenuComp = useMemo(() => {
    if (settings.isSign) {
      setPostKind('video');
    }
    return (
      !settings.isSign && (
        <IonSegment>
          {!settings.isOral && (
            <IonSegmentButton onClick={() => setPostKind('text')} value="text">
              <IonLabel>Text</IonLabel>
            </IonSegmentButton>
          )}
          <IonSegmentButton onClick={() => setPostKind('video')} value="video">
            <IonLabel>Video</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton onClick={() => setPostKind('audio')} value="audio">
            <IonLabel>Audio</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      )
    );
  }, [settings.isOral, settings.isSign]);

  const handleClose = () => {
    onClose();
    setPostKind(settings.isSign ? 'video' : undefined);
  };
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{tr('Add New Post')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div style={{ paddingTop: '10px' }}>{addPostMenuComp}</div>

        {postKind === 'text' && (
          <NewPostForm
            parent={parent}
            parent_id={parentId}
            onCancel={() => handleClose()}
            onCreated={() => handleClose()}
          />
        )}
        {postKind === 'video' &&
          (isPlatform('mobileweb') ||
            isPlatform('pwa') ||
            isPlatform('desktop')) && (
            <VideoRecorder
              onCancel={() => handleClose()}
              onCreated={() => handleClose()}
              parent={parent}
              parent_id={parentId}
            />
          )}
        {postKind === 'audio' &&
          (isPlatform('mobileweb') ||
            isPlatform('pwa') ||
            isPlatform('desktop')) && (
            <AudioRecorder
              onCancel={() => handleClose()}
              onCreated={() => handleClose()}
              parent={parent}
              parent_id={parentId}
            />
          )}
        {!postKind && (
          <p style={{ textAlign: 'center' }}>Please select a post type</p>
        )}
      </IonContent>
    </>
  );
}
