import { styled } from 'styled-components';
import { IonBadge, IonIcon, IonItem } from '@ionic/react';
import { langInfo2String, subTags2LangInfo } from '../../common/langUtils';
import { downloadOutline } from 'ionicons/icons';
import { downloadFromUrl } from '../../common/utility';
import { match } from 'react-router';
import { TextyDocument } from '../../generated/graphql';

type TDocumentItemProps = {
  document: TextyDocument;
  match: match<{ nation_id: string; language_id: string; cluster_id: string }>;
};

const DocumentItemNS: React.FC<TDocumentItemProps> = ({
  document: d,
  match: {
    params: { language_id, nation_id, cluster_id },
  },
}: TDocumentItemProps) => {
  const langInfo = subTags2LangInfo({
    lang: d.language_code,
    dialect: d.dialect_code || undefined,
    region: d.geo_code || undefined,
  });

  const handleDownloadFile = (document: TextyDocument) => {
    downloadFromUrl(document.file_name, document.file_url);
  };
  const routerLink = `/${nation_id}/${language_id}/${cluster_id}/documents/${d.document_id}`;

  return (
    <StItem routerLink={routerLink}>
      <FileName>{d.file_name}</FileName>
      <IconRow>
        <IonBadge>{langInfo2String(langInfo)}</IonBadge>
        <DownloadIcon
          icon={downloadOutline}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDownloadFile(d);
          }}
          size="large"
          color="primary"
          className="clickable theme-icon"
        />
      </IconRow>
    </StItem>
  );
};

export const DocumentItem = styled(DocumentItemNS)(() => ({
  padding: '0px',
  marginTop: '20px',
  display: 'flex',
  alignItems: 'center',
  alignContent: 'space-between',
  float: 'left',
}));

export const StItem = styled(IonItem)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

const FileName = styled.div`
  display: flex;
  margin-right: 1em;
`;

const IconRow = styled.div`
  display: flex;
  align-items: center;
`;

const DownloadIcon = styled(IonIcon)`
  padding: 3px;
  margin: 2px;
  &:hover {
    box-shadow: 0px 0px 4px 1px gray;
    border-radius: 50%;
  }
`;
