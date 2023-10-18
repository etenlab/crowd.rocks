import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Redirect, Route } from 'react-router';
import {
  IonMenu,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonRouterOutlet,
  useIonRouter,
  useIonViewWillEnter,
  useIonViewWillLeave,
  IonList,
  IonItem,
  IonToggle,
  IonLabel,
} from '@ionic/react';
import { languageOutline } from 'ionicons/icons';
import { Subscription } from 'rxjs';

import { AutocompleteModal } from './components/common/forms/Autocomplete/AutocompleteModal';
import { OptionItem } from './components/common/forms/Autocomplete';
import { Tag } from './components/common/chips/Tag';

import './Body.css';

import {
  ErrorType,
  useListNotificationsLazyQuery,
  useLogoutMutation,
} from './generated/graphql';

import { globals } from './services/globals';
import { login_change } from './services/subscriptions';

import { apollo_client } from './main';

import {
  langInfo2String,
  subTags2LangInfo,
  langInfo2tag,
  tag2langInfo,
} from '../../utils/dist';

import { useAppContext } from './hooks/useAppContext';

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
import { AIControllerPage } from './components/translation/AIControllerPage';
import { FastTranslationPage } from './components/translation/FastTranslationPage';

import { DiscussionPage } from './components/Discussion/DiscussionPage';
import { ForumListPage } from './components/forums/ForumListPage/ForumListPage';
import { ForumDetailPage } from './components/forums/ForumDetailPage/ForumDetailPage';
import { NotificationPage } from './components/notifications/NotificationPage';
import { SettingsPage } from './components/settings/SettingsPage';

import { DocumentsPage } from './components/documents/DocumentsPage/DocumentsPage';
import { DocumentViewerPage } from './components/documents/DocumentViewerPage/DocumentViewerPage';

import { QADocumentListPage } from './components/qa/QADocumentListPage';
import { QADocumentViewerPage } from './components/qa/QADocumentViewerPage';

import { PericopeDocumentListPage } from './components/pericopies/PericopeDocumentListPage';
import { PericopeDocumentViewerPage } from './components/pericopies/PericopeDocumentViewerPage';

import { Icons } from './components/demo/Icons';
import { Forms } from './components/demo/Forms';

import { Header } from './components/common/Header';

import { useColorModeContext } from './theme';
import { useTr } from './hooks/useTr';

interface ToggleChangeEventDetail<T = unknown> {
  value: T;
  checked: boolean;
}

interface ToggleCustomEvent<T = unknown> extends CustomEvent {
  detail: ToggleChangeEventDetail<T>;
  target: HTMLIonToggleElement;
}

const Body: React.FC = () => {
  const { tr } = useTr();
  const {
    states: {
      global: {
        langauges: { appLanguage },
        siteTexts: { languages, originalMap },
      },
    },
    actions: { changeAppLanguage, createModal },
  } = useAppContext();
  const { setColorMode } = useColorModeContext();
  const { openModal, closeModal } = createModal();

  const router = useIonRouter();

  const [show_menu, set_show_menu] = useState(false);
  const [is_logged_in, set_is_logged_in] = useState(false);
  const [show_dark_mode, set_show_dark_mode] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);
  const menuRef = useRef<HTMLIonMenuElement>(null);

  const [logoutMutation] = useLogoutMutation();

  const [getNotifications, { data: nData }] = useListNotificationsLazyQuery();
  const [unreadNotificationCount, setUnreadCount] = useState<
    number | undefined
  >(undefined);

  useEffect(() => {
    const handleError = () => {
      setUnreadCount(undefined);
    };
    getNotifications()
      .then()
      .catch(() => handleError);
    let count = undefined;
    if (nData && nData.notifications.error === ErrorType.NoError) {
      count = nData.notifications.notifications.filter(
        (n) => !n.isNotified,
      ).length;
    }
    setUnreadCount(count);
  }, [getNotifications, nData]);

  let sub: Subscription;

  useIonViewWillEnter(() => {
    const theme_storage = localStorage.getItem('theme');
    switch (theme_storage) {
      case null:
        set_show_dark_mode(false);
        localStorage.setItem('theme', 'light');
        setColorMode('light');
        set_theme_classes(false);
        break;
      case 'light':
        set_show_dark_mode(false);
        set_theme_classes(false);
        setColorMode('light');
        break;
      case 'dark':
        set_show_dark_mode(true);
        set_theme_classes(true);
        setColorMode('dark');
        break;
      default:
        set_show_dark_mode(false);
        set_theme_classes(false);
        setColorMode('light');
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
    menuRef.current?.toggle();
  };

  const click_profile = () => {
    toggleMenu();
    router.push(`/US/${appLanguage.lang.tag}/1/profile`);
  };

  const click_settings = () => {
    toggleMenu();
    router.push(`/US/${appLanguage.lang.tag}/1/settings`);
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

  const click_notifications = () => {
    router.push(`/US/${appLanguage.lang.tag}/1/notifications`);
  };

  const toggle_theme = (event: ToggleCustomEvent) => {
    set_show_dark_mode(event.detail.checked);
    if (!event.detail.checked) {
      localStorage.setItem('theme', 'light');
      setColorMode('light');
    } else {
      localStorage.setItem('theme', 'dark');
      setColorMode('dark');
    }
    set_theme_classes(event.detail.checked);
  };

  const set_theme_classes = (is_dark: boolean) => {
    document.documentElement.classList.toggle('dark', is_dark);
    document.documentElement.classList.toggle('light', !is_dark);
  };

  const goHome = () => {
    router.push(`/US/${appLanguage.lang.tag}/1/home`);
  };

  const handleChangeAppLanguage = useCallback(
    (value: OptionItem | null) => {
      if (value) {
        changeAppLanguage(tag2langInfo(value.value as string));
        router.push(`/US/${value.value}/1/home`);
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

      const originalCnt = Object.keys(originalMap).length;
      const translationCnt =
        langInfo.lang.tag !== 'en' ? language.translated_count : originalCnt;

      const percent =
        originalCnt > 0 ? (translationCnt / originalCnt) * 100 : 100;

      const badgeColor = percent === 100 ? 'green' : 'blue';

      return {
        label: `${langInfo2String(langInfo)}`,
        value: langInfo2tag(langInfo) || '',
        endBadge: (
          <Tag
            sx={{ minWidth: '40px' }}
            label={`${Math.round(percent)}%`}
            color={badgeColor}
          />
        ),
      };
    });
  }, [languages, originalMap]);

  const handleOpenLangSelector = () => {
    menuRef.current?.toggle();
    openModal(
      <AutocompleteModal
        label={tr('Select app language')}
        onClose={closeModal}
        options={languageList}
        value={{
          label: langInfo2String(appLanguage),
          value: langInfo2tag(appLanguage),
        }}
        onChange={handleChangeAppLanguage}
      />,
      'full',
    );
  };

  return (
    <>
      <IonMenu contentId="crowd-rock-app" ref={menuRef}>
        <IonHeader>
          <Header
            onClickAppName={() => {
              menuRef.current?.toggle();
              goHome();
            }}
            onClickMenu={toggleMenu}
            onClickDiscussion={() => {}}
            onClickNotification={click_notifications}
            notificationCount={unreadNotificationCount || 0}
            isMenuHeader={true}
          />
        </IonHeader>

        <IonContent className="ion-padding">
          <IonList>
            <IonItem>
              <IonToggle checked={show_dark_mode} onIonChange={toggle_theme}>
                Turn on dark mode
              </IonToggle>
            </IonItem>
            <IonItem onClick={handleOpenLangSelector}>
              <IonIcon aria-hidden="true" icon={languageOutline} slot="end" />
              <IonLabel>Change App Language</IonLabel>
            </IonItem>
            <IonItem onClick={click_settings}>
              <IonLabel>Settings</IonLabel>
            </IonItem>

            {is_logged_in && (
              <>
                <IonItem onClick={click_profile}>
                  <IonLabel>{globals.get_avatar()}</IonLabel>
                </IonItem>
                <IonItem onClick={click_logout} id="app-logout-button">
                  <IonLabel>Logout</IonLabel>
                </IonItem>
              </>
            )}

            {!is_logged_in && (
              <>
                <IonItem onClick={click_register}>
                  <IonLabel>Register</IonLabel>
                </IonItem>
                <IonItem onClick={click_login}>
                  <IonLabel>Login</IonLabel>
                </IonItem>
              </>
            )}
          </IonList>
        </IonContent>
      </IonMenu>
      <IonPage id="crowd-rock-app">
        <IonHeader>
          <Header
            onClickAppName={goHome}
            onClickMenu={toggleMenu}
            onClickDiscussion={() => {}}
            onClickNotification={click_notifications}
            notificationCount={unreadNotificationCount || 0}
          />
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
              exact
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
              path="/:nation_id/:language_id/:cluster_id/discussion/:parent/:parent_id"
              component={DiscussionPage}
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
            <Route
              exact
              path="/:nation_id/:language_id/:cluster_id/fast-translation"
              component={FastTranslationPage}
            />
            <Route
              exact
              path="/:nation_id/:language_id/:cluster_id/forums"
              component={ForumListPage}
            />
            <Route
              exact
              path="/:nation_id/:language_id/:cluster_id/forums/:forum_id/:forum_name"
              component={ForumDetailPage}
            />
            <Route
              exact
              path="/:nation_id/:language_id/:cluster_id/notifications"
              component={NotificationPage}
            />
            <Route
              exact
              path="/:nation_id/:language_id/:cluster_id/ai-controller"
              component={AIControllerPage}
            />
            <Route
              exact
              path="/:nation_id/:language_id/:cluster_id/settings"
              component={SettingsPage}
            />
            <Route
              exact
              path="/:nation_id/:language_id/:cluster_id/documents"
              component={DocumentsPage}
            />
            <Route
              exact
              path="/:nation_id/:language_id/:cluster_id/documents/:document_id"
              component={DocumentViewerPage}
            />
            <Route
              exact
              path="/:nation_id/:language_id/:cluster_id/qa"
              component={QADocumentListPage}
            />
            <Route
              exact
              path="/:nation_id/:language_id/:cluster_id/qa/documents/:document_id"
              component={QADocumentViewerPage}
            />
            <Route
              exact
              path="/:nation_id/:language_id/:cluster_id/pericopies"
              component={PericopeDocumentListPage}
            />
            <Route
              exact
              path="/:nation_id/:language_id/:cluster_id/pericopies/documents/:document_id"
              component={PericopeDocumentViewerPage}
            />
            <Route exact path="/demos/icons" component={Icons} />
            <Route exact path="/demos/forms" component={Forms} />
            <Route exact path="/">
              <Redirect to={`/US/${appLanguage.lang.tag}/1/home`} />
            </Route>
          </IonRouterOutlet>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Body;
