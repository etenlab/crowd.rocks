import { useMemo } from 'react';
import { IonList, useIonToast } from '@ionic/react';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

import { useGetAllDocumentsQuery } from '../../../generated/graphql';

import { DocumentItem } from './DocumentItem';

type DocumentListProps = {
  onClickItem(documentId: string): void;
};

export function DocumentList({ onClickItem }: DocumentListProps) {
  const { tr } = useTr();
  const [presentToast] = useIonToast();
  const {
    states: {
      global: {
        langauges: { sourceLang },
      },
    },
  } = useAppContext();

  const { data, error, loading } = useGetAllDocumentsQuery({
    variables: {
      languageInput: sourceLang
        ? {
            language_code: sourceLang?.lang.tag,
            dialect_code: sourceLang?.dialect?.tag,
            geo_code: sourceLang?.region?.tag,
          }
        : undefined,
    },
  });

  const documentItems = useMemo(() => {
    if (error) {
      presentToast({
        message: tr('Failed at fetching document list!'),
        duration: 1500,
        position: 'top',
        color: 'danger',
      });
    }

    if (error || !data || !data.getAllDocuments.documents) {
      return [];
    }

    return [...data.getAllDocuments.documents]
      .sort((d1, d2) => d1.file_name.localeCompare(d2.file_name))
      .map((d) => (
        <DocumentItem
          document={d}
          key={d.document_id}
          onClickItem={onClickItem}
        />
      ));
  }, [data, error, onClickItem, presentToast, tr]);

  if (documentItems.length === 0 && !loading) {
    return <div>{`${tr('No documents yet')}...`} </div>;
  }

  return <IonList lines="inset">{documentItems}</IonList>;
}
