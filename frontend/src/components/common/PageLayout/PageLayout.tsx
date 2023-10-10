import { ReactNode } from 'react';

import { IonPage, IonContent, IonHeader } from '@ionic/react';
import { Dialog } from '@mui/material';

import { useAppContext } from '../../../hooks/useAppContext';

type PageLayoutProps = {
  header?: ReactNode;
  children: ReactNode;
};

export function PageLayout({ children, header }: PageLayoutProps) {
  const {
    states: {
      components: { modal },
    },
    actions: { setModal },
  } = useAppContext();

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

          <Dialog
            open={!!modal}
            onClose={() => {
              setModal(null);
            }}
            sx={{
              '& .MuiPaper-root': {
                padding: '40px 20px',
                borderRadius: '20px',
                margin: '15px',
              },
            }}
          >
            {modal}
          </Dialog>
        </div>
      </IonContent>
    </IonPage>
  );
}
