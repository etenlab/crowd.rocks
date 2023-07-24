import { IonList, useIonRouter } from '@ionic/react';
import { MapItem } from './MapItem';
import { Caption } from '../../common/Caption/Caption';
import { MapTools } from './MapsTools';
import { useCallback } from 'react';
import { useMapTranslationTools } from '../hooks/useMapTranslationTools';

export type TMapListProps = {
  mapList: TMapsList | undefined;
  onSelectMapId: (id: number) => void;
};

export const MapList = ({ mapList, onSelectMapId }: TMapListProps) => {
  const router = useIonRouter();
  const { sendMapFile } = useMapTranslationTools();

  const handleAddMap = useCallback(
    (file: File) => {
      if (!file) return;

      sendMapFile(
        file,
        ({ id, fileName }) => {
          console.log(`uploaded id ${id} filename ${fileName}`);
        },
        (err) => {
          console.log(`upload error  ${err}`);
        },
      );
    },
    [sendMapFile],
  );

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
        onAddClick={handleAddMap}
      />
      <IonList lines="none">
        {mapList?.length && mapList?.length > 0 ? (
          mapList.map((m) => (
            <MapItem
              mapItem={m}
              key={m.id}
              onClick={() => onSelectMapId(m.id)}
            ></MapItem>
          ))
        ) : (
          <div> No maps found </div>
        )}
      </IonList>
    </>
  );
};
