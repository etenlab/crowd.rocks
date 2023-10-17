import { ReactNode, useRef, useEffect } from 'react';

import { IonPage, IonContent, IonHeader } from '@ionic/react';
import { Modal, FullModal } from '../modal';

import { useAppContext } from '../../../hooks/useAppContext';

type PageLayoutProps = {
  header?: ReactNode;
  children: ReactNode;
};

export function PageLayout({ children, header }: PageLayoutProps) {
  const {
    states: {
      components: { modals },
    },
    actions: { removeModal },
  } = useAppContext();
  const ref = useRef<HTMLElement | null>();

  useEffect(() => {
    ref.current = document.getElementById('crowd-rock-app');
  }, []);

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

          {modals.map((modal) =>
            modal.mode === 'standard' ? (
              <Modal
                key={modal.id}
                component={modal.component}
                onClose={() => removeModal(modal.id)}
                container={ref.current}
              />
            ) : (
              <FullModal
                key={modal.id}
                component={modal.component}
                onClose={() => removeModal(modal.id)}
                container={ref.current}
              />
            ),
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}
