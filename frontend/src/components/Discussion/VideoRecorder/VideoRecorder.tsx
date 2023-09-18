import React, { useState, useEffect } from 'react';

import { VideoRecorderUI } from './VideoRecorderUI';
import { globals } from '../../../services/globals';
import { useIonToast } from '@ionic/react';
import { useTr } from '../../../hooks/useTr';
import { ErrorType, useUploadFileMutation } from '../../../generated/graphql';
import { usePostCreateMutation } from '../../../hooks/useCreatePostMutation';

const maxFileSize = 1024 * 1024 * 50;

// TODO cleanup: rename to MediaRecorderProps for here and audio
type VideoRecorderProps = {
  onCancel(): void;
  onCreated(): void;
  parent: string;
  parent_id: string;
};

export function VideoRecorder({
  onCancel,
  onCreated,
  parent,
  parent_id,
}: VideoRecorderProps) {
  const [status, setStatus] = useState<
    'init' | 'save' | 'uploading' | 'uploaded'
  >('init');

  const user_id = globals.get_user_id();
  const [present] = useIonToast();
  const { tr } = useTr();

  const [uploadFile, { loading, error, data }] = useUploadFileMutation();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [createPost, { data: cdata, loading: cloading, error: cerror }] =
    usePostCreateMutation({
      parent_id: parent_id,
      parent_name: parent,
    });

  useEffect(() => {
    if (!loading && status === 'save') {
      return;
    }
    if (loading && status === 'save') {
      setStatus('uploading');
    }
    if (loading && status === 'uploading') {
      return;
    }
    if (!loading && status === 'uploading') {
      setStatus('uploaded');
    }
  }, [loading, status]);

  useEffect(() => {
    if (status === 'uploaded') {
      if (
        data &&
        data.uploadFile.file &&
        data.uploadFile.error === ErrorType.NoError
      ) {
        createPost({
          variables: {
            content: '<h2>Video</h2>',
            parentId: Number(parent_id),
            parentTable: parent,
            file_id: data.uploadFile.file.id + '',
          },
        });
      }
      if (!data || data.uploadFile.error !== ErrorType.NoError || error) {
        console.error(error);
        console.error(data?.uploadFile.error);
        present({
          message: `${tr('Failed at uploading file!')} [${
            data?.uploadFile.error || error
          }]`,
          duration: 1500,
          position: 'top',
          color: 'danger',
        });
      }
      setStatus('init');
      onCreated();
    }
  }, [
    createPost,
    data,
    error,
    onCreated,
    parent,
    parent_id,
    present,
    status,
    tr,
  ]);

  const handleSave = (blobsOrFile: Blob[] | File) => {
    let file = null;
    if (blobsOrFile instanceof File) {
      file = blobsOrFile;
    } else {
      file = new File(blobsOrFile, `record_${user_id}.webm`);
    }

    if (file.size > maxFileSize) {
      present({
        message: `${tr('Exceeded max file size')} [${maxFileSize}]`,
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
      return;
    }

    uploadFile({
      variables: { file, file_size: file.size, file_type: 'video/webm' },
    });

    setStatus('save');
  };

  const handleCancel = () => {
    onCancel();
  };

  return <VideoRecorderUI onSave={handleSave} onCancel={handleCancel} />;
}
