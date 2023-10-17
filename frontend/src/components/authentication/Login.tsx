import { FormEvent, useEffect, useState } from 'react';
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonSpinner,
  useIonViewWillEnter,
} from '@ionic/react';
import { useHistory } from 'react-router';

import { PageLayout } from '../common/PageLayout';

import { apollo_client } from '../../main';
import {
  ErrorType,
  useLoginMutation,
  useIsAdminLoggedInLazyQuery,
} from '../../generated/graphql';
import { globals } from '../../services/globals';
import { login_change } from '../../services/subscriptions';
import './Login.css';

import { useTr } from '../../hooks/useTr';
import { useAppContext } from '../../hooks/useAppContext';
import { styled } from 'styled-components';

const Login: React.FC = () => {
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
    document.title = tr('Login');
  });

  const [email, set_email] = useState('');
  const [password, set_password] = useState('');
  const [login_disable, set_login_disable] = useState(false);
  const [is_spinning, set_spinning] = useState(false);

  const [is_email_too_long, set_is_email_too_long] = useState(false);
  const [is_email_too_short, set_is_email_too_short] = useState(false);
  const [is_email_invalid, set_is_email_invalid] = useState(false);
  const [is_password_too_long, set_is_password_too_long] = useState(false);
  const [is_password_too_short, set_is_password_too_short] = useState(false);
  const [is_invalid_email_or_password, set_is_invalid_email_or_password] =
    useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [is_unknown_error, set_is_unknown_error] = useState(false);

  const [loginMutation] = useLoginMutation();
  const [isAdmin, { data: isAdminRes }] = useIsAdminLoggedInLazyQuery();

  useEffect(() => {
    if (isAdminRes && isAdminRes.loggedInIsAdmin.isAdmin) {
      globals.set_admin_user();
    }
  }, [isAdminRes]);

  async function handle_submit(event: FormEvent) {
    event.preventDefault();
    event.stopPropagation();
    set_login_disable(true);

    let result;
    try {
      result = await loginMutation({
        variables: {
          email,
          password,
        },
        errorPolicy: 'all',
      });
    } catch (e) {
      console.log(e);
    }

    const error = result?.data?.login.error;

    set_is_email_too_long(false);
    set_is_email_too_short(false);
    set_is_email_invalid(false);
    set_is_password_too_long(false);
    set_is_password_too_short(false);
    set_is_invalid_email_or_password(false);

    if (error === ErrorType.NoError) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      const session = result?.data?.login.session!;
      set_spinning(true);
      globals.set_token(session.token);
      globals.set_user_id(+session.user_id);
      globals.set_avatar(session.avatar);
      if (session.avatar_url) {
        globals.set_profile_url(session.avatar_url);
      }

      isAdmin({ variables: { input: { user_id: session.user_id } } });

      login_change.next(true);

      const redirect = localStorage.getItem('login-redirect');

      await apollo_client.clearStore();
      await apollo_client.resetStore();

      set_email('');
      set_password('');

      if (redirect === 'back') {
        set_login_disable(false);
        set_spinning(false);
        localStorage.removeItem('login-redirect');
        history.goBack();
      } else {
        history.push(`/US/${appLanguage.lang.tag}/1/home`);
        set_login_disable(false);
        set_spinning(false);
      }
      return;
    } else if (error === ErrorType.EmailTooLong) {
      set_is_email_too_long(true);
    } else if (error === ErrorType.EmailTooShort) {
      set_is_email_too_short(true);
    } else if (error === ErrorType.EmailInvalid) {
      set_is_email_invalid(true);
    } else if (error === ErrorType.PasswordTooLong) {
      set_is_password_too_long(true);
    } else if (error === ErrorType.PasswordTooShort) {
      set_is_password_too_short(true);
    } else if (error === ErrorType.InvalidEmailOrPassword) {
      set_is_invalid_email_or_password(true);
    } else if (error === ErrorType.UnknownError) {
      set_is_unknown_error(true);
    } else {
      set_is_unknown_error(true);
      console.error(error);
    }

    set_login_disable(false);
  }

  const click_forgot_password = () => {
    history.push(`/US/${appLanguage.lang.tag}/1/reset-email-request`);
  };

  const click_register = () => {
    history.push(`/US/${appLanguage.lang.tag}/1/register`);
  };

  return (
    <PageLayout>
      <h1>{tr('Login')}</h1>

      <form onSubmit={(event) => handle_submit(event)}>
        <IonItem>
          <IonLabel position="floating">{tr('Email')}</IonLabel>
          <IonInput
            value={email}
            inputmode="email"
            className="login-email"
            minlength={4}
            maxlength={255}
            onIonInput={(e) => set_email(e.detail.value!)}
            required
          />
        </IonItem>

        {is_email_too_long && <div>{tr('Email too long')}</div>}
        {is_email_too_short && <div>{tr('Email too short')}</div>}
        {is_email_invalid && <div>{tr('Email Invalid')}</div>}

        <IonItem>
          <IonLabel position="floating">{tr('Password')}</IonLabel>
          <IonInput
            value={password}
            type="password"
            id="login-password"
            inputmode="text"
            onIonInput={(e) => set_password(e.detail.value!)}
            required
          />
        </IonItem>

        {is_password_too_long && <div>{tr('Password too long')}</div>}
        {is_password_too_short && <div>{tr('Password too short')}</div>}

        <IonButton
          id="login-login"
          type="submit"
          color="primary"
          disabled={login_disable}
        >
          {tr('Login')}
          {is_spinning && <StIonSpinner />}
        </IonButton>

        <IonButton
          type="button"
          color="primary"
          fill="clear"
          onClick={click_forgot_password}
        >
          {tr('Forgot Password')}
        </IonButton>

        <IonButton
          type="button"
          id="login-register"
          color="primary"
          fill="clear"
          onClick={click_register}
        >
          {tr('Register')}
        </IonButton>

        {is_invalid_email_or_password && (
          <Invalid>{tr('Invalid email or password')}</Invalid>
        )}
      </form>
    </PageLayout>
  );
};

const Invalid = styled.div`
  color: var(--ion-color-danger);
`;

const StIonSpinner = styled(IonSpinner)(() => ({
  width: '15px',
  height: '15px',
  marginLeft: '2px',
}));

export default Login;
