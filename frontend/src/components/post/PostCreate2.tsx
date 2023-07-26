import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPopover,
  IonRadio,
  IonRadioGroup,
  useIonToast,
  useIonViewDidEnter,
  useIonViewWillLeave,
} from '@ionic/react';
import {
  FormEvent,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react';
import { globals } from '../../services/globals';
import {
  ErrorType,
  PartCreateDto,
  Post,
  namedOperations,
  usePostCreateMutation,
  useVersionCreateMutation,
} from '../../generated/graphql';
import 'react-quill/dist/quill.snow.css';
import './PostCreate2.css';
import { licenses } from './licenses';
import { Lexitor } from './Lexitor';
import PartTextCreate2 from './PartTextCreate';

type PostCreateProps = {
  readonly parent_election: number;
  readonly create_success: (post_id: number) => void;
  readonly default_value: string | null;
  readonly part_id: string | null;
  readonly post: Post;
};

const PostCreate2: React.FC<PropsWithChildren<PostCreateProps>> = (props) => {
  const [postCreateMutation, { data, loading, error }] =
    usePostCreateMutation();

  const [
    versionCreateMutation,
    { data: data2, loading: loading2, error: error2 },
  ] = useVersionCreateMutation();

  const [is_unknown_error, set_is_unknown_error] = useState(false);

  const [parts_arr, set_parts_arr] = useState<Array<PartCreateDto>>(
    props.post
      ? props.post.parts!.map((part, index, arr) => {
          return {
            part_id: +part!.part_id,
            content_type: part!.content_type,
            position: +part!.position,
            value: part!.current_version.content,
          };
        })
      : [
          {
            part_id: props.part_id ? +props.part_id : null,
            content_type: 'lexical-text',
            position: 1,
            value: props.default_value,
          },
        ],
  );

  async function handle_submit(event: FormEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (globals.get_token() === null) return;

    let result;
    let error;
    let post_id: number | null = null;

    try {
      const newVersionContent = parts_arr.find(
        (part) => part.part_id == props.part_id,
      )?.value;

      if (props.default_value && props.part_id && newVersionContent) {
        console.log('version create');
        result = await versionCreateMutation({
          variables: {
            partId: props.part_id,
            content: {
              part_id: +props.part_id,
              content_type: 'lexical-text',
              position: 1,
              value: newVersionContent,
            },
            license_title: '© All Rights Reserved',
          },
        });
        error = result?.data?.versionCreateResolver.error;
      } else {
        console.log('post create');
        result = await postCreateMutation({
          variables: {
            parentElection: props.parent_election,
            parts: JSON.stringify(parts_arr),
          },
        });
        error = result?.data?.postCreateResolver.error;
        post_id = result?.data?.postCreateResolver.post?.post_id
          ? +result.data.postCreateResolver.post.post_id
          : null;
      }
    } catch (e) {
      console.error('error', e);
    }

    if (error === ErrorType.NoError) {
      if (post_id) props.create_success(post_id);
      // presentToast('bottom')
      return;
    } else if (error === ErrorType.UnknownError) {
      set_is_unknown_error(true);
    } else {
      set_is_unknown_error(true);
      console.error(error);
    }
  }

  const update_content = (position: number, state: string) => {
    const new_arr = parts_arr;
    const part = new_arr.find((part) => part.position == position);

    if (part) {
      part.value = state;
    }

    set_parts_arr([...new_arr]);
  };

  return (
    <div className="post-create2-wrap">
      <div>
        {parts_arr.map((value) => {
          switch (value.content_type) {
            case 'lexical-text':
              return (
                <PartTextCreate2
                  key={value.position}
                  default_value={
                    value.value ? JSON.stringify(value.value) : null
                  }
                  update_content={(state) =>
                    update_content(value.position, state)
                  }
                />
              );
            case 'image-url':
          }
        })}
      </div>
      <div>
        <IonButton
          onClick={() => {
            set_parts_arr([
              ...parts_arr,
              {
                part_id: null,
                content_type: 'lexical-text',
                position: parts_arr.length + 1,
                value: null,
              },
            ]);
          }}
        >
          Add Text Part
        </IonButton>

        <IonButton
          onClick={() => {
            set_parts_arr([
              ...parts_arr,
              {
                part_id: null,
                content_type: 'image-url',
                position: parts_arr.length + 1,
                value: null,
              },
            ]);
          }}
        >
          Add Image Part
        </IonButton>
      </div>

      <div>
        <IonButton onClick={handle_submit}>
          {props.post ? 'Update' : 'Create'}
        </IonButton>
      </div>
    </div>
  );
};

export default PostCreate2;
