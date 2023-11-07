import { Button, Stack, TextField, Typography } from '@mui/material';
import { PageLayout } from '../common/PageLayout';
import {
  LanguageInput,
  SubscriptionStatus,
  useGenerateDataMutation,
  useSubscribeToDataGenProgressSubscription,
} from '../../generated/graphql';
import { useCallback, useState } from 'react';
import { getLangsRegistry } from '../../../../utils';

export function DataGeneratorPage() {
  const [generateData] = useGenerateDataMutation();
  const [mapCount, setMapCount] = useState<number | null>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [toLanguageCount, setToLanguageCount] = useState(0);

  const { data } = useSubscribeToDataGenProgressSubscription();

  const handleGenerateData = useCallback(async () => {
    let toLanguages: [LanguageInput] | null = null;
    if (toLanguageCount > 0) {
      const { langs } = await getLangsRegistry();
      toLanguages = [{ language_code: langs[0].tag }];
      for (let i = 1; i < toLanguageCount; i++) {
        toLanguages.push({ language_code: langs[i].tag });
      }
    }
    await generateData({
      variables: { mapAmount: mapCount, mapsToLanguages: toLanguages },
    });
  }, [generateData, mapCount, toLanguageCount]);

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
        <Button
          onClick={handleGenerateData}
          disabled={
            data?.DataGenerationReport.overallStatus ===
            SubscriptionStatus.Progressing
          }
        >
          Generate Test Data
        </Button>
        <Typography>Status</Typography>
        <Stack direction="row">
          <Typography variant="body1">Map Generation: </Typography>
          <Typography variant="body1">
            {data?.DataGenerationReport.mapUploadStatus}
          </Typography>
        </Stack>
        <Stack direction="row">
          <Typography variant="body1">Map Translations: </Typography>
          <Typography variant="body1">
            {data?.DataGenerationReport.mapTranslationsStatus}
          </Typography>
        </Stack>
        <Stack direction="row">
          <Typography variant="body1">ReTranslate Maps: </Typography>
          <Typography variant="body1">
            {data?.DataGenerationReport.mapReTranslationsStatus}
          </Typography>
        </Stack>

        {/* <Button>Cancel</Button> */}
      </Stack>
    </PageLayout>
  );
}
