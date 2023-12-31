import {
  IonButton,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  useIonViewWillEnter,
} from '@ionic/react';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import {
  useAvatarUpdateMutation,
  useGetFileUploadUrlLazyQuery,
} from '../../generated/graphql';
import { globals } from '../../services/globals';
import './Profile.css';
import { imageOutline } from 'ionicons/icons';
import { CropperComp } from '../post/Cropper';

import { useTr } from '../../hooks/useTr';
import { useAppContext } from '../../hooks/useAppContext';
import { PageLayout } from '../common/PageLayout';
import { styled } from 'styled-components';

const Profile: React.FC = () => {
  const history = useHistory();
  const { tr } = useTr();

  const {
    states: {
      global: {
        langauges: { appLanguage },
      },
    },
  } = useAppContext();

  const [avatarUpdateMutation] = useAvatarUpdateMutation();

  const [show_update_avatar_form, set_show_update_avatar_form] =
    useState(false);
  const [new_avatar, set_new_avatar] = useState(globals.get_avatar());

  const fileInput = useRef(null);

  const [file_url, set_file_url] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [blob, set_blob] = useState<any>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [avatar_url, set_avatar_url] = useState<string | null>(null);

  const [show_image_update_form, set_show_image_update_form] = useState(false);

  const [image_form_key, set_image_form_key] = useState(1);

  const [getData] = useGetFileUploadUrlLazyQuery();

  useIonViewWillEnter(() => {
    document.title = tr('Profile');
  });

  useEffect(() => {
    if (globals.get_token() === null) {
      history.push(`/US/${appLanguage.lang.tag}/1/home`);
    }
  }, [appLanguage, history]);

  const show_avatar_form = () => {
    set_show_update_avatar_form(true);
  };

  async function update_avatar(event: FormEvent) {
    event.preventDefault();
    event.stopPropagation();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      globals.set_avatar(result?.data?.avatarUpdateResolver.user?.avatar!);
      set_show_update_avatar_form(false);
    }
  }

  const on_file_change = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && fileInput.current) {
      set_file_url(URL.createObjectURL(e.target.files[0]));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const update_avatar_image = async (blob: any) => {
    set_blob(blob);
  };

  const submit_new_avatar_image = async () => {
    if (globals.get_user_id() && blob) {
      const res = await getData({
        variables: {
          // eslint-disable-next-line @typescript-eslint/no-extra-non-null-assertion
          userId: globals.get_user_id()!!.toString(),
        },
      });

      if (res.data?.fileUploadUrlRequest.url) {
        const url = res.data?.fileUploadUrlRequest.url;
        const avatar_image_url =
          res.data?.fileUploadUrlRequest.avatar_image_url;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const click_reset_password = () => {
    history.push(`/US/${appLanguage.lang.tag}/1/reset-email-request`);
  };

  return (
    <PageLayout>
      <h1>{tr('Profile')}</h1>

      <IonItem>
        <IonLabel>{tr('User ID')}</IonLabel>
        {globals.get_user_id()}
      </IonItem>

      {!show_update_avatar_form && (
        <IonItem>
          <IonLabel>{tr('Username')}</IonLabel>
          <div className="clickable" onClick={show_avatar_form}>
            {globals.get_avatar()}
          </div>
        </IonItem>
      )}

      {show_update_avatar_form && (
        <div>
          <IonItem>
            <IonLabel position="floating">{tr('Username')}</IonLabel>
            <IonInput
              value={new_avatar}
              type="text"
              inputMode="text"
              onIonChange={(e) => set_new_avatar(e.detail.value!)}
              required
            />
          </IonItem>
          <div className="avatar-update-form-buttons">
            <IonButton type="submit" color="primary" onClick={update_avatar}>
              {tr('Submit')}
            </IonButton>
            <IonButton
              type="button"
              color="secondary"
              onClick={() => set_show_update_avatar_form(false)}
            >
              {tr('Cancel')}
            </IonButton>
          </div>
        </div>
      )}

      <IonItem>
        <IonLabel>{tr('Avatar Image')}</IonLabel>

        <form key={image_form_key}>
          <input
            ref={fileInput}
            hidden
            type="file"
            accept="image/*"
            onChange={on_file_change}
            onClick={(e) => {
              console.log(e);
            }}
          />
        </form>

        {globals.get_profile_url() && (
          <IonImg
            className="avatar-image clickable"
            // eslint-disable-next-line @typescript-eslint/no-extra-non-null-assertion
            src={globals.get_profile_url()!!}
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              fileInput?.current?.click();
              set_show_image_update_form(true);
              // setBackgroundOption(BackgroundOptionType.Gradient);
            }}
          >
            {tr('Add')}
            <IonIcon slot="end" icon={imageOutline} />
          </IonButton>
        )}
      </IonItem>

      {show_image_update_form && (
        <IonItem>
          <IonLabel>{tr('New Avatar Image')}</IonLabel>
          <div className="new-avatar-image-cropper">
            {file_url && (
              <CropperComp url={file_url} update_blob={update_avatar_image} />
            )}
          </div>
        </IonItem>
      )}

      {show_image_update_form && (
        <IonItem>
          <IonLabel>
            <IonButton onClick={submit_new_avatar_image}>
              {tr('Update Avatar Image')}
            </IonButton>
          </IonLabel>

          <IonButton
            color={'danger'}
            onClick={() => {
              set_show_image_update_form(false);
            }}
          >
            {tr('Cancel')}
          </IonButton>
        </IonItem>
      )}
      <StIonButton
        type="button"
        color="primary"
        fill="clear"
        onClick={click_reset_password}
      >
        {tr('Reset Password')}
      </StIonButton>
    </PageLayout>
  );
};

const StIonButton = styled(IonButton)(() => ({
  width: '200px',
}));

export default Profile;
