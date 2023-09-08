import { IonItem, IonToggle } from '@ionic/react';
import { PageLayout } from '../common/PageLayout';
import { useTr } from '../../hooks/useTr';
import { useCallback, useEffect, useRef } from 'react';
import { ISettings, globals } from '../../services/globals';

export const SettingsPage: React.FC = () => {
  const { tr } = useTr();
  const settings = useRef<ISettings>();

  useEffect(() => {
    settings.current = globals.get_settings();
  }, []);

  const toggleIsBetaTools = useCallback(() => {
    if (!settings.current) return;
    settings.current.isBetaTools = !settings.current.isBetaTools;
    globals.set_settings({
      ...settings.current,
      isBetaTools: settings.current!.isBetaTools,
    });
  }, []);

  const toggleIsOral = useCallback(() => {
    if (!settings.current) return;
    settings.current.isOral = !settings.current.isOral;
    globals.set_settings({
      ...settings.current,
      isOral: settings.current!.isOral,
    });
  }, []);

  const toggleIsSign = useCallback(() => {
    if (!settings.current) return;
    settings.current.isSign = !settings.current.isSign;
    globals.set_settings({
      ...settings.current,
      isSign: settings.current!.isSign,
    });
  }, []);

  return (
    <PageLayout>
      <h1>{tr('Settings')}</h1>

      <IonItem>
        <IonToggle
          checked={settings.current?.isBetaTools}
          onIonChange={() => toggleIsBetaTools()}
        >
          {tr('Beta Tools')}
        </IonToggle>
      </IonItem>
      <IonItem>
        <IonToggle
          checked={settings.current?.isOral}
          onIonChange={() => toggleIsOral()}
        >
          {tr('Oral')}
        </IonToggle>
      </IonItem>
      <IonItem>
        <IonToggle
          checked={settings.current?.isSign}
          onIonChange={() => toggleIsSign()}
        >
          {tr('Sign')}
        </IonToggle>
      </IonItem>
    </PageLayout>
  );
};
