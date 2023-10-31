import { Button, Stack, TextField, Typography } from '@mui/material';
import { PageLayout } from '../common/PageLayout';
import {
  LanguageInput,
  useGenerateMapTranslationsMutation,
  useGenerateMapsMutation,
} from '../../generated/graphql';
import { useCallback, useEffect, useState } from 'react';
import { getLangsRegistry } from '../../../../utils/dist';

export function DataGeneratorPage() {
  const [generateMaps, { loading: mapLoading, data: mapData }] =
    useGenerateMapsMutation();
  const [
    generateMapTranslations,
    { loading: translationLoading, data: translationData },
  ] = useGenerateMapTranslationsMutation();
  const [mapCount, setMapCount] = useState<number | null>(null);
  const [mapUpdateStatus, setMapUpdateStatus] = useState('Not started yet');
  const [mapTranslationStatus, setMapTranslationStatus] =
    useState('Not started yet');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [toLanguageCount, setToLanguageCount] = useState(0);
  useEffect(() => {
    setMapUpdateStatus('Map Generation not Called yet');
    if (mapLoading) {
      setMapUpdateStatus('Maps Generating...');
    }
    if (mapData) {
      setMapUpdateStatus(`Done! Error: ${mapData.populateMaps.error}`);
    }
    if (translationLoading) {
      setMapTranslationStatus('Generating....');
    }
    if (translationData) {
      setMapTranslationStatus(
        `Done! Error: ${translationData.populateMapTranslations.error}`,
      );
    }
    return;
  }, [mapLoading, mapData, translationLoading, translationData]);

  const handleGenerateData = useCallback(async () => {
    await generateMaps({ variables: { map_amount: mapCount } });
    if (toLanguageCount > 0) {
      const { langs } = await getLangsRegistry();
      const toLanguages: [LanguageInput] = [{ language_code: langs[0].tag }];
      for (let i = 1; i < toLanguageCount; i++) {
        toLanguages.push({ language_code: langs[i].tag });
      }

      await generateMapTranslations({
        variables: { to_languages: toLanguages },
      });
    }
  }, [generateMapTranslations, generateMaps, mapCount, toLanguageCount]);

  return (
    <PageLayout>
      <Typography variant="h2">Load Test Data</Typography>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-evenly">
          <Typography variant="body1">
            Mock map originals. Leave blank for all maps in dataset repo
          </Typography>
          <TextField
            id="map-originals"
            label="Original Amount"
            type="number"
            variant="outlined"
            size="small"
            onChange={(e) => setMapCount(+e.target.value)}
          />
        </Stack>
        <Stack direction="row" justifyContent="space-evenly">
          <Typography variant="body1">
            # Languages to translate map word/phrases
          </Typography>
          <TextField
            id="map-language-translate-amouont"
            label="To Language Amount"
            type="number"
            variant="outlined"
            size="small"
            onChange={(e) => setToLanguageCount(+e.target.value)}
          />
        </Stack>
        {/* <Stack direction="row" justifyContent="space-evenly">
          <Typography variant="body1">Mock map duplications</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-evenly">
          <Typography variant="body1">Mock translations per map</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-evenly">
          <Typography variant="body1">Mock Words</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-evenly">
          <Typography variant="body1">Mock Phrases</Typography>
        </Stack> */}
        <Button onClick={handleGenerateData}>Generate Test Data</Button>
        <Typography>Status</Typography>
        <Stack direction="row">
          <Typography variant="body1">Map Generation: </Typography>
          <Typography variant="body1">{mapUpdateStatus}</Typography>
        </Stack>
        <Stack direction="row">
          <Typography variant="body1">Map Translation Generation: </Typography>
          <Typography variant="body1">{mapTranslationStatus}</Typography>
        </Stack>

        {/* <Button>Cancel</Button> */}
      </Stack>
    </PageLayout>
  );
}
