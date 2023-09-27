import { MouseEventHandler, useRef } from 'react';
import { IonBadge, IonItem, IonIcon } from '@ionic/react';
import { downloadOutline, trashBin } from 'ionicons/icons';
import { styled } from 'styled-components';

import {
  MapDetailsInfo,
  useGetMapDetailsLazyQuery,
} from '../../../generated/graphql';

import { langInfo2String, subTags2LangInfo } from '../../../common/langUtils';
import { downloadFromUrl } from '../../../common/utility';
import { useAppContext } from '../../../hooks/useAppContext';
import { OrigBadge } from './styled';

export type TMapItemProps = React.HTMLAttributes<HTMLIonItemElement> & {
  mapItem: MapDetailsInfo;
  candidateForDeletionRef: React.MutableRefObject<MapDetailsInfo | undefined>;
  setIsMapDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showDelete: boolean;
};

const NotStyledMapItem = ({
  mapItem,
  setIsMapDeleteModalOpen,
  candidateForDeletionRef,
  showDelete,
  ...rest
}: TMapItemProps) => {
  const {
    states: {
      global: {
        langauges: { appLanguage },
      },
    },
  } = useAppContext();
  const downloadFlagRef = useRef<'original' | 'translated' | null>(null);

  const [getMapDetails, mapContent] = useGetMapDetailsLazyQuery();

  const routerLink = `/US/${appLanguage.lang.tag}/1/maps/details/${
    mapItem.is_original ? mapItem.original_map_id : mapItem.translated_map_id
  }?is_original=${!!mapItem.is_original}`;

  const langInfo = subTags2LangInfo({
    lang: mapItem.language.language_code,
    dialect: mapItem.language.dialect_code || undefined,
    region: mapItem.language.geo_code || undefined,
  });

  const handleDownloadSvg: MouseEventHandler<HTMLIonIconElement> = (e) => {
    downloadFlagRef.current = mapItem.is_original ? 'original' : 'translated';
    getMapDetails({
      variables: {
        is_original: mapItem.is_original,
        map_id: mapItem.is_original
          ? mapItem.original_map_id!
          : mapItem.translated_map_id!,
      },
    });

    e.preventDefault();
    e.stopPropagation();
  };

  if (
    mapContent.data &&
    !mapContent.error &&
    !mapContent.loading &&
    downloadFlagRef.current === 'original' &&
    mapContent.data.getMapDetails.mapFileInfo
  ) {
    downloadFromUrl(
      mapContent.data.getMapDetails.mapFileInfo.map_file_name,
      mapContent.data.getMapDetails.mapFileInfo.content_file_url,
    );
    downloadFlagRef.current = null;
  }

  if (
    mapContent.data &&
    !mapContent.error &&
    !mapContent.loading &&
    downloadFlagRef.current === 'translated' &&
    mapContent.data.getMapDetails.mapFileInfo
  ) {
    downloadFromUrl(
      mapContent.data.getMapDetails.mapFileInfo.map_file_name_with_langs,
      mapContent.data.getMapDetails.mapFileInfo.content_file_url,
    );
    downloadFlagRef.current = null;
  }

  return (
    <IonItem {...rest} routerLink={routerLink}>
      <StItem>
        <PreviewBlock>
          {mapItem.preview_file_url ? (
            <img src={mapItem.preview_file_url} />
          ) : null}
        </PreviewBlock>

        <FileName>
          {mapItem.is_original
            ? mapItem.map_file_name.replace('.cf.svg', '')
            : mapItem.map_file_name_with_langs.replace('.cf.svg', '')}
        </FileName>
        <IconRow>
          {mapItem.is_original ? (
            <OrigBadge>Original</OrigBadge>
          ) : (
            <IonBadge>
              {langInfo2String(langInfo) +
                (mapItem.translated_percent
                  ? ' ' + mapItem.translated_percent + '%'
                  : ' ? %')}
            </IonBadge>
          )}
          <DownloadIcon
            icon={downloadOutline}
            onClick={handleDownloadSvg}
            size="large"
            color="primary"
            className="clickable theme-icon"
          />
          {showDelete ? (
            <TrashIcon
              icon={trashBin}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                candidateForDeletionRef.current = mapItem;
                setIsMapDeleteModalOpen(true);
              }}
              size="large"
              color="danger"
              className="clickable theme-icon"
            />
          ) : null}
        </IconRow>
      </StItem>
    </IonItem>
  );
};

export const MapItem = styled(NotStyledMapItem)(() => ({
  padding: '0px',
  marginTop: '20px',
  display: 'flex',
  alignItems: 'center',
  float: 'left',
}));

const PreviewBlock = styled.div`
  display: flex;
  align-items: start;
`;

const FileName = styled.div``;

const StItem = styled.div``;

const IconRow = styled.div`
  display: flex;
  align-items: center;
`;

const TrashIcon = styled(IonIcon)`
  padding: 3px;
  margin: 2px;
  &:hover {
    box-shadow: 0px 0px 4px 1px gray;
    border-radius: 50%;
  }
`;
const DownloadIcon = styled(IonIcon)`
  padding: 3px;
  margin: 2px;
  &:hover {
    box-shadow: 0px 0px 4px 1px gray;
    border-radius: 50%;
  }
`;
