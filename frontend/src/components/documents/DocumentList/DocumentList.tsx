import { useMemo } from 'react';
import { IonList } from '@ionic/react';

import { useTr } from '../../../hooks/useTr';
import { useAppContext } from '../../../hooks/useAppContext';

import { useGetAllDocumentsQuery } from '../../../generated/graphql';

import { DocumentItem } from './DocumentItem';

export function DocumentList() {
  const { tr } = useTr();
  const {
    states: {
      global: {
        langauges: { sourceLang },
      },
    },
  } = useAppContext();

  const { data, error } = useGetAllDocumentsQuery({
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
    if (error || !data || !data.getAllDocuments.documents) {
      return [];
    }

    return data.getAllDocuments.documents
      .sort((d1, d2) => d1.file_name.localeCompare(d2.file_name))
      .map((d) => <DocumentItem document={d} key={d.document_id} />);
  }, [data, error]);

  if (documentItems.length === 0) {
    return <div> {tr('No documents yet...')} </div>;
  }

  return <IonList lines="full">{documentItems}</IonList>;
}
