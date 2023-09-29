import { useParams } from 'react-router';
import { IonBadge } from '@ionic/react';
import { downloadOutline } from 'ionicons/icons';

import { langInfo2String, subTags2LangInfo } from '../../../common/langUtils';
import { downloadFromUrl } from '../../../common/utility';

import { TextyDocument } from '../../../generated/graphql';

import { StItem, FileName, IconRow, DownloadIcon } from './styled';

type DocumentItemProps = {
  document: TextyDocument;
};

export function DocumentItem({ document }: DocumentItemProps) {
  const { nation_id, language_id, cluster_id } = useParams<{
    nation_id: string;
    language_id: string;
    cluster_id: string;
  }>();

  const langInfo = subTags2LangInfo({
    lang: document.language_code,
    dialect: document.dialect_code || undefined,
    region: document.geo_code || undefined,
  });

  const handleDownloadFile = () => {
    downloadFromUrl(document.file_name, document.file_url);
  };

  const routerLink = `/${nation_id}/${language_id}/${cluster_id}/documents/${document.document_id}`;

  return (
    <StItem routerLink={routerLink}>
      <FileName>{document.file_name}</FileName>
      <IconRow slot="end">
        <IonBadge>{langInfo2String(langInfo)}</IonBadge>
        <DownloadIcon
          icon={downloadOutline}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDownloadFile();
          }}
          size="large"
          color="primary"
          className="clickable theme-icon"
        />
      </IconRow>
    </StItem>
  );
}
