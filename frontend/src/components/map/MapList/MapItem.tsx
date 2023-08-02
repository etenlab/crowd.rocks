import { IonBadge, IonItem } from '@ionic/react';
import { styled } from 'styled-components';
import { MapFileOutput } from '../../../generated/graphql';
import Tag from 'language-tags/Tag';
import {
  langInfo2String,
  langInfo2tag,
  subTags2LangInfo,
} from '../../../common/langUtils';

export type TMapItemProps = React.HTMLAttributes<HTMLIonItemElement> & {
  mapItem: MapFileOutput;
};

const NotStyledMapItem = ({ mapItem, ...rest }: TMapItemProps) => {
  const routerLink =
    mapItem.is_original || !mapItem.translated_map_id
      ? `/US/eng/1/maps/details-original/${mapItem.original_map_id}`
      : `/US/eng/1/maps/details-translated/${mapItem.translated_map_id}`;

  const langInfo = subTags2LangInfo({
    lang: mapItem.language.language_code,
    dialect: mapItem.language.dialect_code || undefined,
    region: mapItem.language.geo_code || undefined,
  });

  return (
    <IonItem {...rest} routerLink={routerLink}>
      {!mapItem.is_original ? (
        <IonBadge>translated - {langInfo2String(langInfo)}</IonBadge>
      ) : (
        <></>
      )}
      {mapItem.map_file_name}
    </IonItem>
  );
};

export const MapItem = styled(NotStyledMapItem)(() => ({
  border: 'solid 1px #cfcfcf',
  marginTop: '20px',
}));
