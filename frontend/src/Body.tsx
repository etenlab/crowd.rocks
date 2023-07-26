import { useState } from 'react';
import { Redirect, Route } from 'react-router';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonRouterOutlet,
  useIonRouter,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from '@ionic/react';
import { menu, moon, sunny } from 'ionicons/icons';
import { Subscription } from 'rxjs';

import './Body.css';

import { ErrorType, useLogoutMutation } from './generated/graphql';

import { globals } from './services/globals';
import { login_change } from './services/subscriptions';

import { apollo_client } from './main';

import Home from './components/home/Home';
import Login from './components/authentication/Login';
import Profile from './components/user/Profile';
import Register from './components/authentication/Register';
import EmailResponsePage from './components/email/EmailResponse';
import ResetEmailRequestPage from './components/authentication/ResetEmailRequest';
import PasswordResetFormPage from './components/authentication/PasswordResetForm';
import { MapsPage } from './components/map/MapsPage';
import { SiteTextListPage } from './components/site-text/SiteTextListPage';
import { SiteTextDetailPage } from './components/site-text/SiteTextDetailPage';

const Body: React.FC = () => {
  const router = useIonRouter();

  const [show_menu, set_show_menu] = useState(false);
  const [is_logged_in, set_is_logged_in] = useState(false);
  const [show_dark_mode, set_show_dark_mode] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [logoutMutation, { data, loading, error }] = useLogoutMutation();

  let sub: Subscription;

  useIonViewWillEnter(() => {
    const theme_storage = localStorage.getItem('theme');
    switch (theme_storage) {
      case null:
        set_show_dark_mode(false);
        localStorage.setItem('theme', 'light');
        set_theme_classes(false);
        break;
      case 'light':
        set_show_dark_mode(false);
        set_theme_classes(false);
        break;
      case 'dark':
        set_show_dark_mode(true);
        set_theme_classes(true);
        break;
      default:
        set_show_dark_mode(false);
        set_theme_classes(false);
    }

    set_is_logged_in(globals.get_token() !== null);
    sub = login_change.subscribe({
      next: () => {
        set_is_logged_in(globals.get_token() !== null);
      },
    });
  });

  useIonViewWillLeave(() => {
    sub.unsubscribe();
  });

  const toggleMenu = () => {
    set_show_menu(!show_menu);
  };

  const click_profile = () => {
    toggleMenu();
    router.push('/US/eng/1/profile');
  };

  const click_register = () => {
    toggleMenu();
    router.push('/US/eng/1/register');
  };

  const click_login = () => {
    toggleMenu();
    router.push('/US/eng/1/login');
  };

  const click_logout = async () => {
    toggleMenu();

    const token = globals.get_token();

    if (token !== null) {
      const result = await logoutMutation({
        variables: {
          token: token,
        },
        errorPolicy: 'all',
      });

      if (result.data?.logout.error !== ErrorType.NoError) {
        console.error(result.data?.logout.error);
      }
    }

    globals.clear();
    login_change.next(false);

    await apollo_client.clearStore();
    await apollo_client.resetStore();

    router.push('/US/eng/1/home');
  };

  const toggle_theme = () => {
    set_show_dark_mode(!show_dark_mode);
    if (show_dark_mode) {
      localStorage.setItem('theme', 'light');
    } else {
      localStorage.setItem('theme', 'dark');
    }
    set_theme_classes(!show_dark_mode);
  };

  const set_theme_classes = (is_dark: boolean) => {
    document.documentElement.classList.toggle('dark', is_dark);
    document.documentElement.classList.toggle('light', !is_dark);
  };

  const goHome = () => {
    router.push('/US/eng/1/home');
  };

  return (
    <IonPage>
      <IonHeader>
        <div className="page">
          <div className="section">
            <div className="header-content">
              <div className="clickable brand" onClick={goHome}>
                <span className="crowd">crowd</span>
                <span className="rocks">rocks</span>
              </div>
              <div>
                {show_dark_mode && (
                  <IonIcon
                    icon={sunny}
                    onClick={toggle_theme}
                    className="clickable theme-icon"
                  ></IonIcon>
                )}
                {!show_dark_mode && (
                  <IonIcon
                    icon={moon}
                    onClick={toggle_theme}
                    className="clickable theme-icon"
                  ></IonIcon>
                )}
                <IonIcon
                  icon={menu}
                  onClick={toggleMenu}
                  className="clickable"
                ></IonIcon>
              </div>
            </div>
            <div className="header-menu">
              {show_menu && (
                <div className="accordion-group">
                  {is_logged_in && (
                    <div slot="content" className="header-menu-item-holder">
                      <div
                        className="clickable ion-text-end"
                        onClick={click_profile}
                      >
                        {globals.get_avatar()}
                      </div>

                      <div
                        className="clickable ion-text-end"
                        onClick={click_logout}
                      >
                        Logout
                      </div>
                    </div>
                  )}

                  {!is_logged_in && (
                    <div slot="content" className="header-menu-item-holder">
                      <div
                        className="clickable ion-text-end"
                        onClick={click_register}
                      >
                        Register
                      </div>

                      <div
                        className="clickable ion-text-end"
                        onClick={click_login}
                      >
                        Login
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </IonHeader>
      <IonContent>
        <IonRouterOutlet>
          <Route
            path="/:nation_id/:language_id/:cluster_id/profile"
            component={Profile}
          />
          <Route
            path="/:nation_id/:language_id/:cluster_id/register"
            component={Register}
          />
          <Route
            path="/:nation_id/:language_id/:cluster_id/login"
            component={Login}
          />
          <Route
            path="/:nation_id/:language_id/:cluster_id/home"
            component={Home}
          />
          <Route
            path="/:nation_id/:language_id/:cluster_id/email/:token"
            component={EmailResponsePage}
          />
          <Route
            path="/:nation_id/:language_id/:cluster_id/reset-email-request"
            component={ResetEmailRequestPage}
          />
          <Route
            path="/:nation_id/:language_id/:cluster_id/password-reset-form/:token"
            component={PasswordResetFormPage}
          />
          <Route
            path="/:nation_id/:language_id/:cluster_id/maps"
            component={MapsPage}
          />
          <Route
            path="/:nation_id/:language_id/:cluster_id/site-text-list"
            component={SiteTextListPage}
          />
          <Route
            exact
            path="/:nation_id/:language_id/:cluster_id/site-text-detail/:definition_type/:site_text_id"
            component={SiteTextDetailPage}
          />

          <Route exact path="/">
            <Redirect to="/US/eng/1/home" />
          </Route>
        </IonRouterOutlet>
      </IonContent>
    </IonPage>
  );
};

export default Body;
