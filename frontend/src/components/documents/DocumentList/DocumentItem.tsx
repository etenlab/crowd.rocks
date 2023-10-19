import { IonBadge } from '@ionic/react';
import { downloadOutline } from 'ionicons/icons';

import { langInfo2String, subTags2LangInfo } from '../../../../../utils';
import { downloadFromUrl } from '../../../common/utility';

import { TextyDocument } from '../../../generated/graphql';

import { StItem, FileName, IconRow, DownloadIcon } from './styled';

type DocumentItemProps = {
  document: TextyDocument;
  onClickItem(documentId: string): void;
};

export function DocumentItem({ document, onClickItem }: DocumentItemProps) {
  const langInfo = subTags2LangInfo({
    lang: document.language_code,
    dialect: document.dialect_code || undefined,
    region: document.geo_code || undefined,
  });

  const handleDownloadFile = () => {
    downloadFromUrl(document.file_name, document.file_url);
  };

  return (
    <StItem
      onClick={() => {
        onClickItem(document.document_id);
      }}
    >
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
