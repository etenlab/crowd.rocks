import { useState } from 'react';
import {
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
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

  const [show_legal_menu, set_show_legal_menu] = useState(false);

  useIonViewWillEnter(() => {
    document.title = tr('Home');
  });

  return (
    <IonPage>
      <IonContent>
        <div className="page">
          <div className="section">
            <IonItemGroup>
              <IonItemDivider>
                <IonLabel>{tr('Media')}</IonLabel>
              </IonItemDivider>

              <IonItem lines="none">
                <CustomIonCard
                  onClick={() => {
                    router.push(
                      `/${match.params.nation_id}/${match.params.language_id}/1/maps`,
                    );
                  }}
                >
                  <IonCardHeader>
                    <IonCardTitle>
                      <IonIcon icon={mapOutline}></IonIcon>
                      <IonText>{tr('Maps')}</IonText>
                    </IonCardTitle>
                    <IonCardSubtitle>
                      {tr(
                        'Upload .svg files and translate all their text into another language',
                      )}
                    </IonCardSubtitle>
                  </IonCardHeader>
                </CustomIonCard>
              </IonItem>
            </IonItemGroup>

            <IonItemGroup>
              <IonItemDivider>
                <IonLabel>{tr('Language')}</IonLabel>
              </IonItemDivider>

              <IonItem lines="none">
                <CustomIonCard
                  onClick={() => {
                    router.push(
                      `/${match.params.nation_id}/${match.params.language_id}/1/dictionary-list`,
                    );
                  }}
                >
                  <IonCardHeader>
                    <IonCardTitle>
                      <IonIcon icon={bookOutline}></IonIcon>
                      <IonText>{tr('Dictionary')}</IonText>
                    </IonCardTitle>
                    <IonCardSubtitle>
                      {tr('Manage the words and definitions in a language')}
                    </IonCardSubtitle>
                  </IonCardHeader>
                </CustomIonCard>
              </IonItem>

              <IonItem lines="none">
                <CustomIonCard
                  onClick={() => {
                    router.push(
                      `/${match.params.nation_id}/${match.params.language_id}/1/phrase-book-list`,
                    );
                  }}
                  style={{ width: '100%' }}
                >
                  <IonCardHeader>
                    <IonCardTitle>
                      <IonIcon icon={chatbubbleEllipsesOutline}></IonIcon>
                      <IonText>{tr('Phrase Book')}</IonText>
                    </IonCardTitle>
                    <IonCardSubtitle>
                      {tr('Helpful phrases in a lanuage')}
                    </IonCardSubtitle>
                  </IonCardHeader>
                </CustomIonCard>
              </IonItem>
            </IonItemGroup>

            <IonItemGroup>
              <IonItemDivider>
                <IonLabel>{tr('User Interface')}</IonLabel>
              </IonItemDivider>

              <IonItem lines="none">
                <CustomIonCard
                  onClick={() => {
                    router.push(
                      `/${match.params.nation_id}/${match.params.language_id}/1/site-text-list`,
                    );
                  }}
                >
                  <IonCardHeader>
                    <IonCardTitle>
                      <IonIcon icon={codeWorkingOutline}></IonIcon>
                      <IonText>{tr('Site Text Strings')}</IonText>
                    </IonCardTitle>
                    <IonCardSubtitle>
                      {tr('Help us translate this app into more languages')}
                    </IonCardSubtitle>
                  </IonCardHeader>
                </CustomIonCard>
              </IonItem>
            </IonItemGroup>

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

              <div
                className="home-footer-legal-button clickable"
                onClick={() => {
                  set_show_legal_menu(!show_legal_menu);
                }}
              >
                {tr('Legal')}
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
