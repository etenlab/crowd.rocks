import {
  IonButton,
  IonContent,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  useIonViewWillEnter,
} from '@ionic/react';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';

import {
  useAvatarUpdateMutation,
  useGetFileUploadUrlLazyQuery,
} from '../../generated/graphql';
import { globals } from '../../services/globals';
import './Profile.css';
import { imageOutline } from 'ionicons/icons';
import { CropperComp } from '../post/Cropper';

const Profile: React.FC = () => {
  const [avatarUpdateMutation] = useAvatarUpdateMutation();

  const [show_update_avatar_form, set_show_update_avatar_form] =
    useState(false);
  const [new_avatar, set_new_avatar] = useState(globals.get_avatar());

  const fileInput = useRef(null);

  const [file_url, set_file_url] = useState('');

  const [blob, set_blob] = useState<any>();

  const [avatar_url, set_avatar_url] = useState<string | null>(null);

  const [show_image_update_form, set_show_image_update_form] = useState(false);

  const [image_form_key, set_image_form_key] = useState(1);

  const [getData, { loading: loading2, error: error2, data: data2 }] =
    useGetFileUploadUrlLazyQuery();

  useIonViewWillEnter(() => {
    document.title = 'Profile';
  });

  useEffect(() => {
    if (globals.get_token() === null) {
      history.push('/US/eng/1/home');
    }
  }, []);

  const show_avatar_form = () => {
    set_show_update_avatar_form(true);
  };

  async function update_avatar(event: FormEvent) {
    event.preventDefault();
    event.stopPropagation();

    const token = globals.get_token();

    if (new_avatar === null) return;

    let result;
    try {
      result = await avatarUpdateMutation({
        variables: {
          avatar: new_avatar,
        },
      });
    } catch (e) {
      console.error('error', e);
    }

    const error = result?.data?.avatarUpdateResolver.error;

    if (error == 'NoError') {
      globals.set_avatar(result?.data?.avatarUpdateResolver.user?.avatar!);
      set_show_update_avatar_form(false);
    }
  }

  const on_file_change = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && fileInput.current) {
      set_file_url(URL.createObjectURL(e.target.files[0]));
    }
  };

  const update_avatar_image = async (blob: any) => {
    set_blob(blob);
  };

  const submit_new_avatar_image = async () => {
    if (globals.get_user_id() && blob) {
      const res = await getData({
        variables: {
          userId: globals.get_user_id()!!.toString(),
        },
      });

      if (res.data?.fileUploadUrlRequest.url) {
        const url = res.data?.fileUploadUrlRequest.url;
        const avatar_image_url =
          res.data?.fileUploadUrlRequest.avatar_image_url;

        const put = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'image/png',
          },
          body: blob,
          mode: 'cors',
        });

        globals.set_profile_url(avatar_image_url);
        set_avatar_url(avatar_image_url);
        set_show_image_update_form(false);
        set_image_form_key(image_form_key + 1);
        location.reload();
      }
    }
  };

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <div className="section">
            <h1>Profile</h1>

            <IonItem>
              <IonLabel>User ID</IonLabel>
              {globals.get_user_id()}
            </IonItem>

            {!show_update_avatar_form && (
              <IonItem>
                <IonLabel>Avatar</IonLabel>
                <div className="clickable" onClick={show_avatar_form}>
                  {globals.get_avatar()}
                </div>
              </IonItem>
            )}

            {show_update_avatar_form && (
              <div>
                <IonItem>
                  <IonLabel position="floating">Avatar</IonLabel>
                  <IonInput
                    value={new_avatar}
                    type="text"
                    inputMode="text"
                    onIonChange={(e) => set_new_avatar(e.detail.value!)}
                    required
                  ></IonInput>
                </IonItem>
                <div className="avatar-update-form-buttons">
                  <IonButton
                    type="submit"
                    color="primary"
                    onClick={update_avatar}
                  >
                    Submit
                  </IonButton>
                  <IonButton
                    type="button"
                    color="secondary"
                    onClick={() => set_show_update_avatar_form(false)}
                  >
                    Cancel
                  </IonButton>
                </div>
              </div>
            )}

            <IonItem>
              <IonLabel>Avatar Image</IonLabel>

              <form key={image_form_key}>
                <input
                  ref={fileInput}
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={on_file_change}
                  onClick={(e) => {
                    // console.log("form input onClick");
                  }}
                />
              </form>

              {globals.get_profile_url() && (
                <IonImg
                  className="avatar-image clickable"
                  src={globals.get_profile_url()!!}
                  onClick={() => {
                    // @ts-ignore
                    fileInput?.current?.click();
                    set_show_image_update_form(true);
                  }}
                />
              )}

              {!globals.get_profile_url() && (
                <IonButton
                  color="primary"
                  onClick={() => {
                    // @ts-ignore
                    fileInput?.current?.click();
                    set_show_image_update_form(true);
                    // setBackgroundOption(BackgroundOptionType.Gradient);
                  }}
                >
                  Add
                  <IonIcon slot="end" icon={imageOutline} />
                </IonButton>
              )}
            </IonItem>

            {show_image_update_form && (
              <IonItem>
                <IonLabel>New Avatar Image</IonLabel>
                <div className="new-avatar-image-cropper">
                  {file_url && (
                    <CropperComp
                      url={file_url}
                      update_blob={update_avatar_image}
                    ></CropperComp>
                  )}
                </div>
              </IonItem>
            )}

            {show_image_update_form && (
              <IonItem>
                <IonLabel>
                  <IonButton onClick={submit_new_avatar_image}>
                    Update Avatar Image
                  </IonButton>
                </IonLabel>

                <IonButton
                  color={'danger'}
                  onClick={() => {
                    set_show_image_update_form(false);
                  }}
                >
                  Cancel
                </IonButton>
              </IonItem>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
