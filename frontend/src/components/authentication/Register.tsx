// import { useEffect } from 'react';
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  useIonViewWillEnter,
} from '@ionic/react';
import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router';
import {
  ErrorType,
  useRegisterMutation,
  // useIsAdminLoggedInLazyQuery,
} from '../../generated/graphql';
import { globals } from '../../services/globals';
import { login_change } from '../../services/subscriptions';
import './Register.css';

import { useTr } from '../../hooks/useTr';
import { useAppContext } from '../../hooks/useAppContext';
import { PageLayout } from '../common/PageLayout';

const Register: React.FC = () => {
  const history = useHistory();
  const { tr } = useTr();
  const {
    states: {
      global: {
        langauges: { appLanguage },
      },
    },
  } = useAppContext();

  useIonViewWillEnter(() => {
    document.title = tr('Register');
  });

  const [email, set_email] = useState('');
  const [avatar, set_avatar] = useState('');
  const [password, set_password] = useState('');

  const [is_email_too_long, set_is_email_too_long] = useState(false);
  const [is_email_too_short, set_is_email_too_short] = useState(false);
  const [is_email_invalid, set_is_email_invalid] = useState(false);
  const [is_avatar_too_long, set_is_avatar_too_long] = useState(false);
  const [is_avatar_too_short, set_is_avatar_too_short] = useState(false);
  const [is_avatar_unavailable, set_is_avatar_unavailable] = useState(false);
  const [is_password_too_long, set_is_password_too_long] = useState(false);
  const [is_password_too_short, set_is_password_too_short] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [is_unknown_error, set_is_unknown_error] = useState(false);

  const [registerMutation] = useRegisterMutation();
  // const [isAdmin, { data: isAdminRes }] = useIsAdminLoggedInLazyQuery();

  // useEffect(() => {
  //   if (isAdminRes && isAdminRes.loggedInIsAdmin.isAdmin) {
  //     globals.set_admin_user();
  //   }
  // }, [isAdminRes]);

  async function handle_submit(event: FormEvent) {
    event.preventDefault();
    event.stopPropagation();

    let result;
    try {
      result = await registerMutation({
        variables: {
          email,
          password,
          avatar,
        },
        errorPolicy: 'all',
      });
    } catch (e) {
      console.log(e);
    }

    const error = result?.data?.register.error;

    set_is_email_too_long(false);
    set_is_email_too_short(false);
    set_is_email_invalid(false);
    set_is_avatar_too_long(false);
    set_is_avatar_too_short(false);
    set_is_avatar_unavailable(false);
    set_is_password_too_long(false);
    set_is_password_too_short(false);

    if (error === ErrorType.NoError) {
      set_avatar('');
      set_email('');
      set_password('');
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      const session = result?.data?.register.session!;
      globals.set_token(session.token);
      globals.set_user_id(+session.user_id);
      globals.set_avatar(session.avatar);
      if (session.avatar_url) {
        globals.set_profile_url(session.avatar_url);
      }

      // isAdmin({ variables: { input: { user_id: session.user_id } } });

      login_change.next(true);
      history.push(`/US/${appLanguage.lang.tag}/1/home`);
      return;
    } else if (error === ErrorType.EmailTooLong) {
      set_is_email_too_long(true);
    } else if (error === ErrorType.EmailTooShort) {
      set_is_email_too_short(true);
    } else if (error === ErrorType.EmailInvalid) {
      set_is_email_invalid(true);
    } else if (error === ErrorType.AvatarTooLong) {
      set_is_avatar_too_long(true);
    } else if (error === ErrorType.AvatarTooShort) {
      set_is_avatar_too_short(true);
    } else if (error === ErrorType.AvatarUnavailable) {
      set_is_avatar_unavailable(true);
    } else if (error === ErrorType.PasswordTooLong) {
      set_is_password_too_long(true);
    } else if (error === ErrorType.PasswordTooShort) {
      set_is_password_too_short(true);
    } else if (error === ErrorType.UnknownError) {
      set_is_unknown_error(true);
    } else {
      set_is_unknown_error(true);
      console.error(error);
    }
  }

  const click_login = () => {
    history.push(`/US/${appLanguage.lang.tag}/1/login`);
  };

  return (
    <PageLayout>
      <h1>{tr('Register')}</h1>
      <form onSubmit={(event) => handle_submit(event)}>
        <IonItem>
          <IonLabel position="floating">{tr('Email')}</IonLabel>
          <IonInput
            value={email}
            inputmode="email"
            id="register-email"
            minlength={4}
            maxlength={255}
            onIonChange={(e) => set_email(e.detail.value!)}
            required
          />
        </IonItem>

        {is_email_too_long && <div>{tr('Email too long')}</div>}
        {is_email_too_short && <div>{tr('Email too short')}</div>}
        {is_email_invalid && <div>{tr('Email Invalid')}</div>}

        <IonItem counter={true}>
          <IonLabel position="floating">{tr('Username')}</IonLabel>
          <IonInput
            value={avatar}
            inputmode="text"
            id="register-avatar"
            minlength={1}
            maxlength={64}
            onIonChange={(e) => set_avatar(e.detail.value!)}
            required
          />
        </IonItem>

        {is_avatar_too_long && <div>{tr('Username too long')}</div>}
        {is_avatar_too_short && <div>{tr('Username too short')}</div>}
        {is_avatar_unavailable && <div>{tr('Username Unavailable')}</div>}
        <IonItem counter={true}>
          <IonLabel position="floating">{tr('Password')}</IonLabel>
          <IonInput
            value={password}
            type="password"
            id="register-password"
            minlength={8}
            maxlength={128}
            onIonInput={(e) => set_password(e.detail.value!)}
            required
          />
        </IonItem>

        {is_password_too_long && <div>{tr('Password too long')}</div>}
        {is_password_too_short && <div>{tr('Password too short')}</div>}

        <IonButton type="submit" id="register-register" color="primary">
          {tr('Register')}
        </IonButton>
      </form>

      <IonButton
        type="button"
        color="primary"
        fill="clear"
        onClick={click_login}
        id="register-login"
      >
        {tr('Login')}
      </IonButton>
    </PageLayout>
  );
};

export default Register;
