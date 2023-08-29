import ReactQuill from 'react-quill';
import { ConfirmButtons } from '../../common/ConfirmButtons';
import { usePostCreateMutation } from '../../../hooks/useCreatePostMutation';
import { useEffect, useState } from 'react';
import { ErrorType } from '../../../generated/graphql';
import { useIonToast } from '@ionic/react';
import { Container } from '../../site-text/NewSiteTextForm/styled';

interface NewPostFormParams {
  parent_id: string;
  parent: string;
  onCreated(): void;
  onCancel(): void;
}

export function NewPostForm({
  parent,
  parent_id,
  onCancel,
  onCreated,
}: NewPostFormParams) {
  const [createPost, { data, loading, error, called }] = usePostCreateMutation(
    parent_id,
    parent,
  );
  const [content, set_content] = useState('');
  const [present] = useIonToast();

  useEffect(() => {
    if (error) {
      return;
    }
    if (loading || !called) {
      return;
    }
    if (data) {
      if (data.postCreateResolver.error !== ErrorType.NoError) {
        return;
      }
      onCreated();
    }
  }, [called, data, error, loading, onCreated, present]);

  async function handle_submit() {
    await createPost({
      variables: {
        content: content,
        parentId: Number(parent_id),
        parentTable: parent,
      },
    });
  }
  const quill_update = (content: string) => {
    set_content(content);
  };
  const handle_cancel = () => {
    onCancel();
  };
  return (
    <Container>
      <ReactQuill
        theme="snow"
        value={content}
        onChange={(content) => quill_update(content)}
      />
      <ConfirmButtons onCancel={handle_cancel} onSave={handle_submit} />
    </Container>
  );
}
