import { IonList, useIonRouter } from '@ionic/react';
import { MapItem } from './MapItem';
import { Caption } from '../../common/Caption/Caption';
import { MapTools } from './MapsTools';
import { useCallback, useEffect, useState } from 'react';
import { useMapTranslationTools } from '../hooks/useMapTranslationTools';

export const MapList = () => {
  const router = useIonRouter();
  const { sendMapFile } = useMapTranslationTools();

  const [mapList, setMapList] = useState<TMapsList>();
  const { getOriginalMaps } = useMapTranslationTools();

  const getMaps = useCallback(async () => {
    const mapsList = await getOriginalMaps(
      `some searchStr${Math.random() * 1000}`,
    );
    setMapList(mapsList);
  }, [getOriginalMaps]);

  useEffect(() => {
    getMaps();
  }, [getMaps]);

  const handleAddMap = useCallback(
    (file: File) => {
      if (!file) return;

      sendMapFile(
        file,
        async ({ id, fileName }) => {
          console.log(`uploaded id ${id} filename ${fileName}`);
          await getMaps();
        },
        (err) => {
          console.log(`upload error  ${err}`);
        },
      );
    },
    [getMaps, sendMapFile],
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
          mapList.map((m) => <MapItem mapItem={m} key={m.id}></MapItem>)
        ) : (
          <div> No maps found </div>
        )}
      </IonList>
    </>
  );
};
