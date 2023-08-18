import { useState } from 'react';
import {
  IonContent,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonPage,
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
} from 'ionicons/icons';
import { RouteComponentProps } from 'react-router';
import './Home.css';
import { CustomIonCard } from './styled';
import { useTr } from '../../hooks/useTr';

interface HomePageProps
  extends RouteComponentProps<{
    nation_id: string;
    language_id: string;
  }> {}

const Home: React.FC<HomePageProps> = ({ match }: HomePageProps) => {
  const router = useIonRouter();
  const { tr } = useTr();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [show_legal_menu, set_show_legal_menu] = useState(false);

  useIonViewWillEnter(() => {
    document.title = tr('Home');
  });

  const menu = [
    {
      group: tr('Media'),
      subMenu: [
        {
          link: `/${match.params.nation_id}/${match.params.language_id}/1/maps`,
          icon: mapOutline,
          title: tr('Maps'),
          description: tr('Translate maps into any language'),
        },
      ],
    },
    {
      group: tr('Language'),
      subMenu: [
        {
          link: `/${match.params.nation_id}/${match.params.language_id}/1/dictionary-list`,
          icon: bookOutline,
          title: tr('Dictionary'),
          description: tr('Manage the words and definitions in a language'),
        },
        {
          link: `/${match.params.nation_id}/${match.params.language_id}/1/phrase-book-list`,
          icon: chatbubbleEllipsesOutline,
          title: tr('Phrase Book'),
          description: tr(
            'Manage the phrases and phrase definitions in a language',
          ),
        },
        {
          link: `/${match.params.nation_id}/${match.params.language_id}/1/translation-list`,
          icon: languageOutline,
          title: tr('Translation'),
          description: tr('Translate words and phrases into any language'),
        },
      ],
    },
    {
      group: tr('User Interface'),
      subMenu: [
        {
          link: `/${match.params.nation_id}/${match.params.language_id}/1/site-text-list`,
          icon: codeWorkingOutline,
          title: tr('Site Text Strings'),
          description: tr('Help us translate this app into more languages'),
        },
      ],
    },
  ];

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <div className="section">
            {menu.map((group) => (
              <IonItemGroup key={group.group}>
                <IonItemDivider>
                  <IonLabel>{group.group}</IonLabel>
                </IonItemDivider>

                {group.subMenu.map((item) => (
                  <IonItem lines="none" key={item.title}>
                    <CustomIonCard
                      onClick={() => {
                        router.push(item.link);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="home-card-title">
                        <IonIcon icon={item.icon}></IonIcon>
                        <div className="home-card-title-text">
                          <IonText>{item.title}</IonText>
                        </div>
                      </div>
                      <div style={{ marginTop: '5px' }}>
                        <IonText>{item.description}</IonText>
                      </div>
                    </CustomIonCard>
                  </IonItem>
                ))}
              </IonItemGroup>
            ))}

            <br />
            <br />

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
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
