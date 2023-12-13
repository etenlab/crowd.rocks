import { Button, Stack, TextField, Typography } from '@mui/material';
import { PageLayout } from '../common/PageLayout';
import {
  DataGenProgress,
  LanguageInput,
  SubscriptionStatus,
  useGenerateDataMutation,
  useSubscribeToDataGenProgressSubscription,
} from '../../generated/graphql';
import { useCallback, useEffect, useState } from 'react';
import { getLangsRegistry } from '../../../../utils';

export function DataGeneratorPage() {
  const [generateData] = useGenerateDataMutation();
  // const [stopGenerate] = useStopDataGenerationMutation();
  const [mapCount, setMapCount] = useState<number | null>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [toLanguageCount, setToLanguageCount] = useState(0);
  const [mockUserCount, setMockUserCount] = useState(0);
  const [wordsCount, setWordsCount] = useState(0);
  const [phrasesCount, setPhrasesCount] = useState(0);
  const [docCount, setDocCount] = useState(0);
  const [postCount, setPostCount] = useState(0);

  const [progress, setProgress] = useState<DataGenProgress | null>(null);
  const { data } = useSubscribeToDataGenProgressSubscription();
  // console.log(data);

  useEffect(() => {
    if (data && data.DataGenerationReport) {
      const report = data.DataGenerationReport;
      setProgress(report);
    }
    return;
  }, [data, data?.DataGenerationReport]);

  const progressComp = progress ? (
    <>
      <Typography>Progress</Typography>
      <Stack direction="row">
        <Typography variant="body1">Output: </Typography>
        <Typography variant="body1"> {progress.output}</Typography>
      </Stack>
      <Stack direction="row">
        <Typography variant="body1">Status: </Typography>
        <Typography variant="body1"> {progress.overallStatus}</Typography>
      </Stack>
    </>
  ) : null;

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
      variables: {
        mapAmount: mapCount,
        mapsToLanguages: toLanguages,
        userAmount: mockUserCount,
        phraseAmount: phrasesCount,
        wordAmount: wordsCount,
        docAmount: docCount,
        postsPerUser: postCount,
      },
    });
  }, [
    docCount,
    generateData,
    mapCount,
    mockUserCount,
    phrasesCount,
    postCount,
    toLanguageCount,
    wordsCount,
  ]);

  // const handleStop = useCallback(async () => {
  //   await stopGenerate();
  // }, [stopGenerate]);

  return (
    <PageLayout>
      <Typography variant="h2">Load Test Data</Typography>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between">
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
        <Stack direction="row" justifyContent="space-between">
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
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="column">
            <Typography variant="body1"># Mock Users</Typography>
            <Typography variant="caption" maxWidth="400px">
              Each generated user will provide one translation to words and
              phrases for each language in language amount and will provide vote
              for maps/mapwords/mapphrases, words, phrases, and translations (if
              they exist)
            </Typography>
          </Stack>
          <TextField
            id="mock-user-amount"
            label="Mock User Amount"
            type="number"
            variant="outlined"
            size="small"
            onChange={(e) => setMockUserCount(+e.target.value)}
          />
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1">
            # Posts per User (will not be triggered unless user count is
            supplied)
          </Typography>
          <TextField
            id="mock-post-amount"
            label="Mock Post Amount"
            type="number"
            variant="outlined"
            size="small"
            onChange={(e) => setPostCount(+e.target.value)}
          />
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1"># Words</Typography>
          <TextField
            id="mock-words"
            label="Mock Word Amount"
            type="number"
            variant="outlined"
            size="small"
            onChange={(e) => setWordsCount(+e.target.value)}
          />
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1"># Phrases</Typography>
          <TextField
            id="mock-phrase-amount"
            label="Mock Phrase Amount"
            type="number"
            variant="outlined"
            size="small"
            onChange={(e) => setPhrasesCount(+e.target.value)}
          />
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1"># Documents</Typography>
          <TextField
            id="mock-doc-amount"
            label="Mock Document Amount"
            type="number"
            variant="outlined"
            size="small"
            onChange={(e) => setDocCount(+e.target.value)}
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
            progress?.overallStatus === SubscriptionStatus.Progressing &&
            progress.overallStatus !== undefined
          }
        >
          Generate Test Data
        </Button>
        {progressComp}
        {/* <Button onClick={handleStop}>Cancel</Button> */}
      </Stack>
    </PageLayout>
  );
}
