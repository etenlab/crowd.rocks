import { useState, useEffect } from 'react';

import { AudioRecorderUI } from './AudioRecorderUI';
import { globals } from '../../../services/globals';
import { useIonToast } from '@ionic/react';
import { useTr } from '../../../hooks/useTr';
import { ErrorType, useUploadFileMutation } from '../../../generated/graphql';
import { usePostCreateMutation } from '../../../hooks/useCreatePostMutation';

const maxFileSize = 1024 * 1024 * 50;

type AudioRecorderProps = {
  onCancel(): void;
  onCreated(): void;
  parent: string;
  parent_id: string;
};

export function AudioRecorder({
  onCancel,
  onCreated,
  parent,
  parent_id,
}: AudioRecorderProps) {
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
    if (status === 'save') {
      setStatus('uploading');
    }
    if (status === 'uploading') {
      return;
    }
  }, [loading, status]);

  useEffect(() => {
    if (status === 'uploaded') {
      console.log('uploaded');
      if (
        data &&
        data.uploadFile.file &&
        data.uploadFile.error === ErrorType.NoError
      ) {
        console.log('calling on save');
        createPost({
          variables: {
            content: '<h2>Audio</h2>',
            parentId: Number(parent_id),
            parentTable: parent,
            file_id: data.uploadFile.file.id + '',
          },
        });
      }

      console.log('after on save');
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
    }
  }, [
    status,
    data,
    onCreated,
    present,
    tr,
    error,
    createPost,
    parent_id,
    parent,
  ]);

  const handleSave = (blobs: Blob[]) => {
    const file = new File(blobs, `record_${user_id}.wav`);
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
      variables: { file, file_size: file.size, file_type: 'audio/x-wav' },
    });

    setStatus('save');
  };

  const handleCancel = () => {
    onCancel();
  };

  return <AudioRecorderUI onSave={handleSave} onCancel={handleCancel} />;
}
