import { styled } from 'styled-components';
import { TextyDocumentOutput } from '../../generated/graphql';
import { IonBadge, IonIcon, IonItem } from '@ionic/react';
import { langInfo2String, subTags2LangInfo } from '../../common/langUtils';
import { downloadOutline } from 'ionicons/icons';
import { downloadFromUrl } from '../../common/utility';

type TDocumentItemProps = {
  document: TextyDocumentOutput;
};

const DocumentItemNS: React.FC<TDocumentItemProps> = ({
  document: d,
}: TDocumentItemProps) => {
  const langInfo = subTags2LangInfo({
    lang: d.language_code,
    dialect: d.dialect_code || undefined,
    region: d.geo_code || undefined,
  });

  const handleDownloadFile = (document: TextyDocumentOutput) => {
    downloadFromUrl(document.file_name, document.file_url);
  };

  return (
    <StItem>
      <FileName>{d.file_name}</FileName>
      <IconRow>
        <IonBadge>{langInfo2String(langInfo)}</IonBadge>
        <DownloadIcon
          icon={downloadOutline}
          onClick={() => handleDownloadFile(d)}
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
