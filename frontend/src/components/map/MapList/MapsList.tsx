import { IonList, useIonRouter } from '@ionic/react';
import { MapItem } from './MapItem';
import { Caption } from '../../common/Caption/Caption';
import { MapTools } from './MapsTools';

export type TMapListProps = {
  mapList: TMapList | undefined;
  onSelectMapId: (id: number) => void;
};

export const MapList = ({ mapList, onSelectMapId }: TMapListProps) => {
  const router = useIonRouter();

  if (!mapList?.length || mapList?.length < 1) {
    return <div> No maps found </div>;
  }

  return (
    <>
      <Caption>Maps</Caption>
      <MapTools
        onFilterClick={() => {
          alert('click on filter mock');
        }}
        onTranslationsClick={() => {
          router.push(`/US/eng/1/maps/translation`);
        }}
        onAddClick={() => {
          alert('click on add mock');
        }}
      />
      <IonList lines="none">
        {mapList &&
          mapList.map((m) => (
            <MapItem
              mapItem={m}
              key={m.id}
              onClick={() => onSelectMapId(m.id)}
            ></MapItem>
          ))}
      </IonList>
    </>
  );
};
