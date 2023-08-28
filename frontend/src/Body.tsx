import { useState, useRef, useMemo, useCallback } from 'react';
import { Redirect, Route } from 'react-router';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonPage,
  IonRouterOutlet,
  useIonRouter,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from '@ionic/react';
import { menu, moon, sunny, languageOutline } from 'ionicons/icons';
import { Subscription } from 'rxjs';

import './Body.css';

import { ErrorType, useLogoutMutation } from './generated/graphql';

import { globals } from './services/globals';
import { login_change } from './services/subscriptions';

import { apollo_client } from './main';

import {
  langInfo2String,
  subTags2LangInfo,
  langInfo2tag,
  tag2langInfo,
} from './common/langUtils';

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

import { WordListPage } from './components/dictionary/WordListPage';
import { WordDetailPage } from './components/dictionary/WordDetailPage';

import { PhraseListPage } from './components/phrase-book/PhraseListPage';
import { PhraseDetailPage } from './components/phrase-book/PhraseDetailPage';

import { TranslationPage } from './components/translation/TranslationPage';

import { useAppContext } from './hooks/useAppContext';
import { useTr } from './hooks/useTr';

import AppTypeahead from './components/common/LangSelector/TypeAhead';

const Body: React.FC = () => {
  const {
    states: {
      global: {
        langauges: { appLanguage },
        siteTexts: { languages, originalMap, translationMap },
      },
    },
    actions: { changeAppLanguage },
  } = useAppContext();

  const router = useIonRouter();
  const { tr } = useTr();

  const [show_menu, set_show_menu] = useState(false);
  const [is_logged_in, set_is_logged_in] = useState(false);
  const [show_dark_mode, set_show_dark_mode] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);

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
    router.push(`/US/${appLanguage.lang.tag}/1/profile`);
  };

  const click_register = () => {
    toggleMenu();
    router.push(`/US/${appLanguage.lang.tag}/1/register`);
  };

  const click_login = () => {
    toggleMenu();
    router.push(`/US/${appLanguage.lang.tag}/1/login`);
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

    router.push(`/US/${appLanguage.lang.tag}/1/home`);
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
    router.push(`/US/${appLanguage.lang.tag}/1/home`);
  };

  const handleChangeAppLanguage = useCallback(
    (value: string | undefined) => {
      if (value) {
        changeAppLanguage(tag2langInfo(value));
        router.push(`/US/${value}/1/home`);
      }

      modal.current?.dismiss();
    },
    [changeAppLanguage, router],
  );

  const languageList = useMemo(() => {
    return languages.map((language) => {
      const langInfo = subTags2LangInfo({
        lang: language.language_code,
        dialect: language.dialect_code as string | undefined,
        region: language.geo_code as string | undefined,
      });

      const langInfoStr = langInfo2String(langInfo);

      const originalCnt = Object.keys(originalMap).length;
      const translationCnt =
        langInfo.lang.tag !== 'en'
          ? Object.keys(translationMap[langInfoStr]).length
          : originalCnt;

      const percent =
        originalCnt > 0 ? (translationCnt / originalCnt) * 100 : 100;

      const badgeColor = percent === 100 ? 'green' : undefined;

      return {
        text: `${langInfo2String(langInfo)}`,
        value: langInfo2tag(langInfo) || '',
        endBadge: {
          value: `${Math.round(percent)}%`,
          color: badgeColor,
        },
      };
    });
  }, [languages, originalMap, translationMap]);

  return (
    <IonPage>
      <IonHeader>
        <div className="page">
          <div className="section">
            <div className="header-content">
              <div className="clickable brand" onClick={goHome}>
                <span className="rocks">{tr('crowdrocks')}</span>
              </div>
              <div style={{ display: 'flex', gap: '20px' }}>
                <IonIcon
                  id="open-language-modal"
                  icon={languageOutline}
                  className="clickable"
                />
                {show_dark_mode && (
                  <IonIcon
                    icon={sunny}
                    onClick={toggle_theme}
                    className="clickable theme-icon"
                  />
                )}
                {!show_dark_mode && (
                  <IonIcon
                    icon={moon}
                    onClick={toggle_theme}
                    className="clickable theme-icon"
                  />
                )}
                <IonIcon
                  icon={menu}
                  onClick={toggleMenu}
                  className="clickable"
                />
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
                        {tr('Logout')}
                      </div>
                    </div>
                  )}

                  {!is_logged_in && (
                    <div slot="content" className="header-menu-item-holder">
                      <div
                        className="clickable ion-text-end"
                        onClick={click_register}
                      >
                        {tr('Register')}
                      </div>

                      <div
                        className="clickable ion-text-end"
                        onClick={click_login}
                      >
                        {tr('Login')}
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
        <IonModal ref={modal} trigger="open-language-modal">
          <AppTypeahead
            title={tr('App Language')}
            items={languageList}
            selectedItem={langInfo2String(appLanguage)}
            onSelectionCancel={() => modal.current?.dismiss()}
            onSelectionChange={handleChangeAppLanguage}
          />
        </IonModal>
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
          <Route
            exact
            path="/:nation_id/:language_id/:cluster_id/dictionary-list"
            component={WordListPage}
          />
          <Route
            exact
            path="/:nation_id/:language_id/:cluster_id/dictionary-detail/:word_id"
            component={WordDetailPage}
          />
          <Route
            exact
            path="/:nation_id/:language_id/:cluster_id/phrase-book-list"
            component={PhraseListPage}
          />
          <Route
            exact
            path="/:nation_id/:language_id/:cluster_id/phrase-book-detail/:phrase_id"
            component={PhraseDetailPage}
          />
          <Route
            exact
            path="/:nation_id/:language_id/:cluster_id/translation"
            component={TranslationPage}
          />
          <Route exact path="/">
            <Redirect to={`/US/${appLanguage.lang.tag}/1/home`} />
          </Route>
        </IonRouterOutlet>
      </IonContent>
    </IonPage>
  );
};

export default Body;
