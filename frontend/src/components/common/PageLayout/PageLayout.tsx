import { ReactNode } from 'react';

import { IonPage, IonContent, IonHeader } from '@ionic/react';

type PageLayoutProps = {
  header?: ReactNode;
  children: ReactNode;
};

export function PageLayout({ children, header }: PageLayoutProps) {
  return (
    <IonPage>
      {header ? (
        <IonHeader>
          <div className="page">
            <div className="section">{header}</div>
          </div>
        </IonHeader>
      ) : null}

      <IonContent>
        <div className="page">
          <div className="section">{children}</div>
        </div>
      </IonContent>
    </IonPage>
  );
}
