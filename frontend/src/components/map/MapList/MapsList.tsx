import { IonList, useIonRouter } from '@ionic/react';
import { MapItem } from './MapItem';
import { Caption } from '../../common/Caption/Caption';
import { MapTools } from './MapsTools';
import { useCallback, useEffect } from 'react';
import { useMapTranslationTools } from '../hooks/useMapTranslationTools';
import { useGetAllMapsListLazyQuery } from '../../../generated/graphql';

export const MapList = () => {
  const router = useIonRouter();
  const { sendMapFile } = useMapTranslationTools();
  const [getAllMapsList, { data: allMapsQuery }] = useGetAllMapsListLazyQuery();

  useEffect(() => {
    getAllMapsList();
  }, [getAllMapsList]);

  const handleAddMap = useCallback(
    (file: File) => {
      if (!file) return;

      sendMapFile(
        file,
        async ({ id, fileName }) => {
          console.log(`uploaded id ${id} filename ${fileName}`);
          await getAllMapsList();
        },
        (err) => {
          console.log(`upload error  ${err}`);
        },
      );
    },
    [getAllMapsList, sendMapFile],
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
        {allMapsQuery?.getAllMapsList.allMapsList?.length ? (
          allMapsQuery?.getAllMapsList.allMapsList?.map((m, i) => (
            <MapItem mapItem={m} key={i}></MapItem>
          ))
        ) : (
          <div> No maps found </div>
        )}
      </IonList>
    </>
  );
};
