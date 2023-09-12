import { IonList } from '@ionic/react';
import { TextyDocumentOutput } from '../../generated/graphql';
import { useTr } from '../../hooks/useTr';
import { DocumentItem } from './DocumentItem';
import { match } from 'react-router';

type TDocumentListProps = {
  allDocuments?: TextyDocumentOutput[];
  match: match<{ nation_id: string; language_id: string; cluster_id: string }>;
};

export const DocumentsList: React.FC<TDocumentListProps> = ({
  allDocuments,
  match,
}: TDocumentListProps) => {
  const { tr } = useTr();

  if (!allDocuments) {
    return <div> {tr('No documents yet...')} </div>;
  }

  return (
    <IonList lines="inset">
      {allDocuments?.length > 0 &&
        [...allDocuments]
          .sort((d1, d2) => d1.file_name.localeCompare(d2.file_name))
          .map((d) => (
            <DocumentItem document={d} key={d.document_id} match={match} />
          ))}
    </IonList>
  );
};
