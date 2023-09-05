import { MouseEventHandler, useRef } from 'react';
import { IonBadge, IonItem, IonIcon } from '@ionic/react';
import { downloadOutline, trashBin } from 'ionicons/icons';
import { styled } from 'styled-components';

import {
  MapFileOutput,
  useGetOrigMapContentLazyQuery,
  useGetTranslatedMapContentLazyQuery,
  useMapDeleteMutation,
} from '../../../generated/graphql';

import { langInfo2String, subTags2LangInfo } from '../../../common/langUtils';
import { downloadFromSrc } from '../../../common/utility';
import { useAppContext } from '../../../hooks/useAppContext';

export type TMapItemProps = React.HTMLAttributes<HTMLIonItemElement> & {
  mapItem: MapFileOutput;
};

const NotStyledMapItem = ({ mapItem, ...rest }: TMapItemProps) => {
  const {
    states: {
      global: {
        langauges: { appLanguage },
      },
    },
  } = useAppContext();
  const downloadFlagRef = useRef<'original' | 'translated' | null>(null);

  const [getOrigMapContent, origMapContent] = useGetOrigMapContentLazyQuery({
    fetchPolicy: 'no-cache',
  });
  const [getTranslatedMapContent, translatedMapContent] =
    useGetTranslatedMapContentLazyQuery({ fetchPolicy: 'no-cache' });

  const [mapDelete] = useMapDeleteMutation();

  const routerLink =
    mapItem.is_original || !mapItem.translated_map_id
      ? `/US/${appLanguage.lang.tag}/1/maps/details-original/${mapItem.original_map_id}`
      : `/US/${appLanguage.lang.tag}/1/maps/details-translated/${mapItem.translated_map_id}`;

  const langInfo = subTags2LangInfo({
    lang: mapItem.language.language_code,
    dialect: mapItem.language.dialect_code || undefined,
    region: mapItem.language.geo_code || undefined,
  });

  const handleDownloadSvg: MouseEventHandler<HTMLIonIconElement> = (e) => {
    if (mapItem.is_original || !mapItem.translated_map_id) {
      downloadFlagRef.current = 'original';
      getOrigMapContent({
        variables: {
          id: mapItem.original_map_id,
        },
      });
    } else {
      downloadFlagRef.current = 'translated';
      getTranslatedMapContent({
        variables: {
          id: mapItem.translated_map_id,
        },
      });
    }

    e.preventDefault();
    e.stopPropagation();
  };

  const handleDeleteMap: MouseEventHandler<HTMLIonIconElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      !confirm(
        `Delete map ${
          mapItem.is_original
            ? mapItem.map_file_name
            : mapItem.map_file_name_with_langs
        }? It is ${
          mapItem.is_original
            ? 'original map. All related data (translated maps) will be also deleted permanently.'
            : 'translated map. It will be re-created on any translation action performend by sombody with original map.'
        }`,
      )
    ) {
      return;
    }
    const mapId = mapItem.is_original
      ? mapItem.original_map_id
      : mapItem.translated_map_id;
    if (!mapId) {
      console.error(
        `Error: original_map_id or translated_map_id isn't specified`,
      );
      return;
    }

    mapDelete({
      variables: {
        mapId,
        is_original: mapItem.is_original,
      },
      refetchQueries: ['GetAllMapsList'],
    });
  };

  if (
    origMapContent.data &&
    !origMapContent.error &&
    !origMapContent.loading &&
    downloadFlagRef.current === 'original'
  ) {
    downloadFromSrc(
      origMapContent.data.getOrigMapContent.map_file_name,
      `data:image/svg+xml;utf8,${encodeURIComponent(
        origMapContent.data.getOrigMapContent.content,
      )}`,
    );
    downloadFlagRef.current = null;
  }

  if (
    translatedMapContent.data &&
    !translatedMapContent.error &&
    !translatedMapContent.loading &&
    downloadFlagRef.current === 'translated'
  ) {
    downloadFromSrc(
      translatedMapContent.data.getTranslatedMapContent
        .map_file_name_with_langs,
      `data:image/svg+xml;utf8,${encodeURIComponent(
        translatedMapContent.data.getTranslatedMapContent.content,
      )}`,
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
          <TrashIcon
            icon={trashBin}
            onClick={handleDeleteMap}
            size="large"
            color="danger"
            className="clickable theme-icon"
          />
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
                ` [${mapItem.translated_percent || ''}%]`}
            </IonBadge>
          )}
          <DownloadIcon
            icon={downloadOutline}
            onClick={handleDownloadSvg}
            size="large"
            color="primary"
            className="clickable theme-icon"
          />
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

const OrigBadge = styled(IonBadge)(() => ({
  background: 'purple',
}));

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
