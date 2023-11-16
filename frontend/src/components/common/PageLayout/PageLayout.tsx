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
    actions: { removeModal, setIonContentScrollElement },
  } = useAppContext();
  const ref = useRef<HTMLElement | null>();
  const contentRef = useRef<HTMLIonContentElement>(null);

  useEffect(() => {
    ref.current = document.getElementById('crowd-rock-app');
    contentRef.current
      ?.getScrollElement()
      .then((value) => setIonContentScrollElement(value));
  }, [setIonContentScrollElement]);

  return (
    <IonPage>
      {header ? (
        <IonHeader>
          <div className="page">
            <div className="section">{header}</div>
          </div>
        </IonHeader>
      ) : null}

      <IonContent ref={contentRef}>
        <div className="page">
          <div className="section">{children}</div>

          {modals.map((modal) => {
            switch (modal.mode) {
              case 'standard': {
                return (
                  <Modal
                    key={modal.id}
                    component={modal.component}
                    onClose={() => removeModal(modal.id)}
                    container={ref.current}
                  />
                );
              }
              case 'full': {
                return (
                  <FullModal
                    key={modal.id}
                    component={modal.component}
                    onClose={() => removeModal(modal.id)}
                    container={ref.current}
                  />
                );
              }
              default: {
                return (
                  <Modal
                    key={modal.id}
                    component={modal.component}
                    onClose={() => removeModal(modal.id)}
                    container={ref.current}
                  />
                );
              }
            }
          })}
        </div>
      </IonContent>
    </IonPage>
  );
}
