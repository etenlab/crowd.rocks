import { useState } from 'react';
import {
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonItem,
  IonLabel,
  IonText,
  useIonRouter,
  useIonViewWillEnter,
} from '@ionic/react';
import {
  bookOutline,
  chatbubbleEllipsesOutline,
  languageOutline,
  codeWorkingOutline,
  mapOutline,
  sendOutline,
} from 'ionicons/icons';
import { RouteComponentProps } from 'react-router';
import './Home.css';
import {
  CustomGroup,
  CustomIonCard,
  CustomIonLabel,
  StIonCardTitleContainer,
} from './styled';
import { useTr } from '../../hooks/useTr';
import { PageLayout } from '../common/PageLayout';
import { ISettings, globals } from '../../services/globals';

interface HomePageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
  }> {}

interface ISubMenu
  extends Array<{
    isShown: () => boolean;
    link: string;
    icon: string;
    title: string;
    description: string;
  }> {}

interface IMenu
  extends Array<{
    isShown: () => boolean;
    group: string;
    subMenu: ISubMenu;
  }> {}

const Home: React.FC<HomePageProps> = ({ match }: HomePageProps) => {
  const router = useIonRouter();
  const { tr } = useTr();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [show_legal_menu, set_show_legal_menu] = useState(false);

  const settings: ISettings = globals.get_settings();

  useIonViewWillEnter(() => {
    document.title = tr('Home');
  });

  const menu: IMenu = [
    {
      group: tr('Media'),
      isShown: () => true,
      subMenu: [
        {
          link: `/${match.params.nation_id}/${match.params.language_id}/1/maps`,
          icon: mapOutline,
          title: tr('Maps'),
          description: tr('Translate maps into any language'),
          isShown: () => true,
        },
      ],
    },
    {
      group: tr('Community'),
      isShown: () => true,
      subMenu: [
        {
          link: `/${match.params.nation_id}/${match.params.language_id}/1/forums`,
          icon: sendOutline,
          title: tr('Forums'),
          description: tr('Hold discussions with other members'),
          isShown: () => true,
        },
      ],
    },
    {
      group: tr('Language'),
      isShown: () => true,
      subMenu: [
        {
          link: `/${match.params.nation_id}/${match.params.language_id}/1/dictionary-list`,
          icon: bookOutline,
          title: tr('Dictionary'),
          description: tr('Manage the words and definitions in a language'),
          isShown: () => !!settings?.isBetaTools,
        },
        {
          link: `/${match.params.nation_id}/${match.params.language_id}/1/phrase-book-list`,
          icon: chatbubbleEllipsesOutline,
          title: tr('Phrase Book'),
          description: tr(
            'Manage the phrases and phrase definitions in a language',
          ),
          isShown: () => !!settings?.isBetaTools,
        },
        {
          link: `/${match.params.nation_id}/${match.params.language_id}/1/translation`,
          icon: languageOutline,
          title: tr('Translation'),
          description: tr('Translate words and phrases into any language'),
          isShown: () => !!settings?.isBetaTools,
        },
      ],
    },
    {
      group: tr('User Interface'),
      isShown: () => true,
      subMenu: [
        {
          link: `/${match.params.nation_id}/${match.params.language_id}/1/site-text-list`,
          icon: codeWorkingOutline,
          title: tr('Site Text Strings'),
          description: tr('Help us translate this app into more languages'),
          isShown: () => true,
        },
      ],
    },
  ];

  return (
    <PageLayout>
      {menu.map(
        (group) =>
          group.isShown() && (
            <CustomGroup key={group.group}>
              <CustomIonLabel>
                <IonLabel>{group.group}</IonLabel>
              </CustomIonLabel>
              <hr style={{ marginTop: '7px', marginBottom: '0px' }} />
              {group.subMenu.map(
                (item) =>
                  item.isShown() && (
                    <IonItem lines="none" key={item.title}>
                      <CustomIonCard
                        onClick={() => {
                          router.push(item.link);
                        }}
                        style={{ cursor: 'pointer', padding: '0px' }}
                      >
                        <IonCardHeader>
                          <StIonCardTitleContainer>
                            <IonCardTitle>
                              <div className="home-card-title">
                                <IonIcon icon={item.icon}></IonIcon>
                                <div className="home-card-title-text">
                                  <IonText>{item.title}</IonText>
                                </div>
                              </div>
                            </IonCardTitle>
                          </StIonCardTitleContainer>
                        </IonCardHeader>
                        <IonCardContent>
                          <IonCardSubtitle>{item.description}</IonCardSubtitle>
                        </IonCardContent>
                      </CustomIonCard>
                    </IonItem>
                  ),
              )}
            </CustomGroup>
          ),
      )}

      <div className="home-footer">
        <div className="ion-text-end">
          {/* <IonFab className="home-footer-create-button-wrap">
                  <IonFabButton
                    onClick={() => {
                      if (globals.get_user_id()) {
                        // old code was here
                      } else {
                        router.push(
                          `/${match.params.nation_id}/${match.params.language_id}/1/login`
                        );
                      }
                    }}
                  >
                    <IonIcon icon={add}></IonIcon>
                  </IonFabButton>
                </IonFab> */}
        </div>

        {show_legal_menu && (
          <div>
            <div>
              <a href="https://app.termly.io/document/terms-of-use-for-website/[todo]">
                {tr('Terms of Service')}
              </a>
            </div>

            <div>
              <a href="https://app.termly.io/document/cookie-policy/[todo]">
                {tr('Cookie Policy')}
              </a>
            </div>

            <div>
              <a href="https://app.termly.io/document/acceptable-use-policy/[todo]">
                {tr('Acceptable Use Policy')}
              </a>
            </div>

            <div>
              <a href="https://app.termly.io/document/disclaimer/[todo]">
                {tr('Disclaimer')}
              </a>
            </div>

            <div>
              <a href="https://app.termly.io/document/eula/[todo]">
                {tr('EULA')}
              </a>
            </div>

            <div>
              <a href="https://app.termly.io/document/privacy-policy/[todo]">
                {tr('Privacy Policy')}
              </a>
            </div>
            <div>
              <a href="https://app.termly.io/notify/[todo]">
                {tr('Do Not Sell or Share My Personal information')}
              </a>
            </div>
          </div>
        )}

        {/* <div
                className="home-footer-legal-button clickable"
                onClick={() => {
                  set_show_legal_menu((_show_legal_menu) => !_show_legal_menu);
                }}
              >
                {tr('Legal')}
              </div> */}
      </div>
    </PageLayout>
  );
};

export default Home;
